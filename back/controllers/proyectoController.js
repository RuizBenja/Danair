const Proyecto = require('../models/proyecto');
const path = require('path');
const { ensureDir, validateWebp, deleteFileIfExists } = require('./mediaUtils');

const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');
const PROYECTOS_DIR = path.join(UPLOADS_DIR, 'proyectos');
ensureDir(UPLOADS_DIR);
ensureDir(PROYECTOS_DIR);

function sanitizeProyectoData(data) {
  return {
    titulo: (data.titulo || '').trim(),
    extracto: (data.extracto || '').trim(),
    descripcion: (data.descripcion || '').trim(),
    imagen: data.imagen || '',
    orden: Number(data.orden || 1),
    seo_title: (data.seo_title || '').trim(),
    seo_description: (data.seo_description || '').trim(),
    destacado: data.destacado === true || data.destacado === 'true',
    estado: data.estado === true || data.estado === 'true'
  };
}

function validateProyectoData(data, requireImage = false) {
  if (!data.titulo) return 'Ingresa el titulo.';
  if (!data.extracto) return 'Ingresa el extracto.';
  if (!data.descripcion) return 'Ingresa la descripcion.';
  if (requireImage && !data.imagen) return 'Debes subir una imagen WebP.';
  return null;
}

const normalizeOrders = async () => {
  const items = await Proyecto.find().sort({ orden: 1, createdAt: 1 });
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

const create = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  try {
    const data = sanitizeProyectoData(req.body);
    const last = await Proyecto.findOne().sort({ orden: -1 });
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

    const validationError = validateProyectoData(data, true);
    if (validationError) return res.status(400).send({ message: validationError });

    const doc = await Proyecto.create(data);
    return res.status(200).send(doc);
  } catch (e) {
    return res.status(500).send({ message: 'Error al crear proyecto' });
  }
};

const list = async (_req, res) => {
  const items = await normalizeOrders();
  return res.status(200).send(items);
};

const get = async (req, res) => {
  const doc = await Proyecto.findById(req.params.id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  return res.status(200).send(doc);
};

const update = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const id = req.params.id;
  let doc = await Proyecto.findById(id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });

  const data = sanitizeProyectoData({ ...doc.toObject(), ...req.body });

  if (req.files && req.files.imagen) {
    const file = req.files.imagen;
    const err = validateWebp(file);
    if (err) {
      deleteFileIfExists(file.path);
      return res.status(400).send({ message: err });
    }
    if (doc.imagen) deleteFileIfExists(path.join(PROYECTOS_DIR, doc.imagen));
    data.imagen = path.basename(file.path);
  } else {
    data.imagen = doc.imagen || '';
  }

  const validationError = validateProyectoData(data, false);
  if (validationError) return res.status(400).send({ message: validationError });

  doc = await Proyecto.findByIdAndUpdate(id, data, { new: true });
  return res.status(200).send(doc);
};

const reorder = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const id = req.params.id;
  const direction = req.body.direction;
  if (!['up', 'down'].includes(direction)) {
    return res.status(400).send({ message: 'Direccion invalida' });
  }

  await normalizeOrders();

  const current = await Proyecto.findById(id);
  if (!current) return res.status(404).send({ message: 'No encontrado' });

  const targetOrder = direction === 'up' ? current.orden - 1 : current.orden + 1;
  const swap = await Proyecto.findOne({ orden: targetOrder });
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
  const doc = await Proyecto.findByIdAndDelete(id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  if (doc.imagen) deleteFileIfExists(path.join(PROYECTOS_DIR, doc.imagen));
  return res.status(200).send({ ok: true });
};

const obtener_imagen = async function(req,res){
  const img = req.params.img;
  if (!img) return res.status(400).send({ message: 'Imagen requerida' });
  const imgPath = path.join(PROYECTOS_DIR, img);
  return res.sendFile(path.resolve(imgPath));
};

module.exports = { create, list, get, update, reorder, remove, obtener_imagen };
