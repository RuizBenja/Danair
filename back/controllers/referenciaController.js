const Referencia = require('../models/referencia');
const CategoriaReferencia = require('../models/categoriaReferencia');
const path = require('path');
const { ensureDir, validateWebp, deleteFileIfExists } = require('./mediaUtils');

const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');
const REFERENCIAS_DIR = path.join(UPLOADS_DIR, 'referencias');
ensureDir(UPLOADS_DIR);
ensureDir(REFERENCIAS_DIR);

function sanitizeReferenciaData(data) {
  return {
    titulo: (data.titulo || '').trim(),
    industria_categoria: data.industria_categoria || null,
    producto_categoria: data.producto_categoria || null,
    comuna: (data.comuna || '').trim(),
    region: (data.region || '').trim(),
    anio: data.anio === '' || data.anio === null || data.anio === undefined ? null : Number(data.anio),
    marca: (data.marca || '').trim(),
    modelo: (data.modelo || '').trim(),
    potencia: (data.potencia || '').trim(),
    caudal: (data.caudal || '').trim(),
    presion: (data.presion || '').trim(),
    descripcion: (data.descripcion || '').trim(),
    imagen: data.imagen || '',
    orden: Number(data.orden || 1),
    estado: data.estado === true || data.estado === 'true'
  };
}

async function validateCategoria(id, tipo) {
  if (!id) return null;
  const categoria = await CategoriaReferencia.findById(id);
  if (!categoria) return `La categoría de ${tipo} seleccionada no existe.`;
  if (categoria.tipo !== tipo) return `La categoría seleccionada no corresponde a ${tipo}.`;
  return null;
}

async function validateReferenciaData(data, requireImage = false) {
  if (!data.titulo) return 'Ingresa el título.';
  if (!data.industria_categoria && !data.producto_categoria) {
    return 'Debes seleccionar al menos una categoría: industria o producto.';
  }

  const industriaError = await validateCategoria(data.industria_categoria, 'industria');
  if (industriaError) return industriaError;

  const productoError = await validateCategoria(data.producto_categoria, 'producto');
  if (productoError) return productoError;

  if (!data.comuna) return 'Ingresa la comuna.';
  if (!data.region) return 'Ingresa la región.';
  if (!data.anio || Number.isNaN(data.anio)) return 'Ingresa un año válido.';
  if (!data.marca) return 'Ingresa la marca.';
  if (!data.modelo) return 'Ingresa el modelo.';
  if (requireImage && !data.imagen) return 'Debes subir una imagen WebP.';
  return null;
}

const normalizeOrders = async () => {
  const items = await Referencia.find().sort({ orden: 1, createdAt: 1 });
  let changed = false;

  for (let index = 0; index < items.length; index += 1) {
    const nextOrder = index + 1;
    if (items[index].orden !== nextOrder) {
      items[index].orden = nextOrder;
      changed = true;
    }
  }

  if (changed) {
    await Promise.all(items.map((item) => item.save()));
  }

  return items;
};

const populateQuery = (query) => query
  .populate('industria_categoria')
  .populate('producto_categoria');

const create = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  try {
    const data = sanitizeReferenciaData(req.body);
    const last = await Referencia.findOne().sort({ orden: -1 });
    data.orden = last ? (last.orden || 0) + 1 : 1;

    if (req.files && req.files.imagen) {
      const file = req.files.imagen;
      const err = validateWebp(file);
      if (err) {
        deleteFileIfExists(file.path);
        return res.status(400).send({ message: err });
      }
      data.imagen = path.basename(file.path);
    }

    const validationError = await validateReferenciaData(data, true);
    if (validationError) return res.status(400).send({ message: validationError });

    const doc = await Referencia.create(data);
    const populated = await populateQuery(Referencia.findById(doc._id));
    return res.status(200).send(populated);
  } catch (_e) {
    return res.status(500).send({ message: 'Error al crear referencia' });
  }
};

const list = async (_req, res) => {
  await normalizeOrders();
  const items = await populateQuery(
    Referencia.find().sort({ orden: 1, createdAt: 1 })
  );
  return res.status(200).send(items);
};

const get = async (req, res) => {
  const doc = await populateQuery(Referencia.findById(req.params.id));
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  return res.status(200).send(doc);
};

const update = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const id = req.params.id;
  let doc = await Referencia.findById(id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });

  const data = sanitizeReferenciaData({ ...doc.toObject(), ...req.body });

  if (req.files && req.files.imagen) {
    const file = req.files.imagen;
    const err = validateWebp(file);
    if (err) {
      deleteFileIfExists(file.path);
      return res.status(400).send({ message: err });
    }
    if (doc.imagen) deleteFileIfExists(path.join(REFERENCIAS_DIR, doc.imagen));
    data.imagen = path.basename(file.path);
  } else {
    data.imagen = doc.imagen || '';
  }

  data.orden = doc.orden || 1;

  const validationError = await validateReferenciaData(data, false);
  if (validationError) return res.status(400).send({ message: validationError });

  doc = await populateQuery(Referencia.findByIdAndUpdate(id, data, { new: true }));
  await normalizeOrders();
  return res.status(200).send(doc);
};

const reorder = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const id = req.params.id;
  const direction = req.body.direction;
  if (!['up', 'down'].includes(direction)) return res.status(400).send({ message: 'Direccion invalida' });

  await normalizeOrders();

  const current = await Referencia.findById(id);
  if (!current) return res.status(404).send({ message: 'No encontrado' });

  const targetOrder = direction === 'up' ? current.orden - 1 : current.orden + 1;
  const swap = await Referencia.findOne({ orden: targetOrder });
  if (!swap) return res.status(200).send({ ok: true });

  const currentOrder = current.orden;
  current.orden = swap.orden;
  swap.orden = currentOrder;

  await current.save();
  await swap.save();

  return res.status(200).send({ ok: true });
};

const remove = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const id = req.params.id;
  const doc = await Referencia.findByIdAndDelete(id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  if (doc.imagen) deleteFileIfExists(path.join(REFERENCIAS_DIR, doc.imagen));
  await normalizeOrders();
  return res.status(200).send({ ok: true });
};

const obtener_imagen = async function(req, res) {
  const img = req.params.img;
  if (!img) return res.status(400).send({ message: 'Imagen requerida' });
  const imgPath = path.join(REFERENCIAS_DIR, img);
  return res.sendFile(path.resolve(imgPath));
};

module.exports = { create, list, get, update, reorder, remove, obtener_imagen };
