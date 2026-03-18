const Marca = require('../models/marca');
const path = require('path');
const { validateWebp, deleteFileIfExists } = require('./mediaUtils');

function validateMarcaData(data, requireLogo = false) {
  if (!data.nombre || !String(data.nombre).trim()) return 'Ingresa el nombre.';
  if (!data.descripcion || !String(data.descripcion).trim()) return 'Ingresa el extracto.';
  if (requireLogo && !data.logo) return 'Debes subir el logo WebP.';
  return null;
}

const normalizeOrders = async () => {
  const items = await Marca.find().sort({ orden: 1, createdAt: 1 });
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
    const data = req.body;
    const last = await Marca.findOne().sort({ orden: -1 });
    data.orden = last ? (last.orden || 0) + 1 : 1;
    if (req.files && req.files.logo) {
      const file = req.files.logo;
      const err = validateWebp(file);
      if (err) {
        deleteFileIfExists(file.path);
        return res.status(400).send({ message: err });
      }
      data.logo = path.basename(file.path);
    }
    const validationError = validateMarcaData(data, true);
    if (validationError) return res.status(400).send({ message: validationError });
    const doc = await Marca.create(data);
    return res.status(200).send(doc);
  } catch (e) {
    return res.status(500).send({ message: 'Error al crear marca' });
  }
};

const list = async (_req, res) => {
  const items = await normalizeOrders();
  return res.status(200).send(items);
};

const get = async (req, res) => {
  const doc = await Marca.findById(req.params.id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  return res.status(200).send(doc);
};

const update = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const id = req.params.id;
  let doc = await Marca.findById(id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  const data = req.body;
  if (req.files && req.files.logo) {
    const file = req.files.logo;
    const err = validateWebp(file);
    if (err) {
      deleteFileIfExists(file.path);
      return res.status(400).send({ message: err });
    }
    if (doc.logo) deleteFileIfExists(path.join('./uploads/marcas/', doc.logo));
    data.logo = path.basename(file.path);
  }
  const validationError = validateMarcaData({ ...doc.toObject(), ...data, logo: data.logo || doc.logo }, false);
  if (validationError) return res.status(400).send({ message: validationError });
  doc = await Marca.findByIdAndUpdate(id, data, { new: true });
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

  const current = await Marca.findById(id);
  if (!current) return res.status(404).send({ message: 'No encontrado' });

  const targetOrder = direction === 'up' ? current.orden - 1 : current.orden + 1;
  const swap = await Marca.findOne({ orden: targetOrder });
  if (!swap) return res.status(200).send({ ok: true });

  const currentOrden = current.orden;
  current.orden = swap.orden;
  swap.orden = currentOrden;

  await current.save();
  await swap.save();

  return res.status(200).send({ ok: true });
};

const remove = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const id = req.params.id;
  const doc = await Marca.findByIdAndDelete(id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  if (doc.logo) deleteFileIfExists(path.join('./uploads/marcas/', doc.logo));
  return res.status(200).send({ ok: true });
};

const obtener_logo = async function(req,res){
  const img = req.params['img'];
  if(!img) return res.status(400).send({message:'Logo requerido'});
  const img_path = path.join('./uploads/marcas/', img);
  return res.sendFile(path.resolve(img_path));
};

module.exports = { create, list, get, update, remove, obtener_logo, reorder };
