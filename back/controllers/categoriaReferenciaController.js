const CategoriaReferencia = require('../models/categoriaReferencia');

function normalizeCategoriaName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function sanitizeCategoriaData(data) {
  return {
    nombre: (data.nombre || '').trim(),
    tipo: data.tipo === 'producto' ? 'producto' : 'industria',
    estado: data.estado === true || data.estado === 'true',
    orden: Number(data.orden || 1)
  };
}

function validateCategoriaData(data) {
  if (!data.nombre) return 'Ingresa el nombre.';
  if (!['industria', 'producto'].includes(data.tipo)) return 'Selecciona un tipo valido.';
  return null;
}

async function findDuplicateCategoria(data, excludeId = null) {
  const items = await CategoriaReferencia.find({
    tipo: data.tipo,
    ...(excludeId ? { _id: { $ne: excludeId } } : {})
  }).select('nombre tipo');

  const targetName = normalizeCategoriaName(data.nombre);
  return items.find((item) => normalizeCategoriaName(item.nombre) === targetName) || null;
}

const normalizeOrders = async () => {
  const items = await CategoriaReferencia.find().sort({ tipo: 1, orden: 1, createdAt: 1 });
  let changed = false;
  const typeCounters = {};

  for (let index = 0; index < items.length; index += 1) {
    const type = items[index].tipo;
    typeCounters[type] = (typeCounters[type] || 0) + 1;
    const nextOrder = typeCounters[type];
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
    const data = sanitizeCategoriaData(req.body);
    const validationError = validateCategoriaData(data);
    if (validationError) return res.status(400).send({ message: validationError });

    const duplicate = await findDuplicateCategoria(data);
    if (duplicate) return res.status(400).send({ message: 'Ya existe una categoría con ese nombre para este tipo.' });

    const last = await CategoriaReferencia.findOne({ tipo: data.tipo }).sort({ orden: -1 });
    data.orden = last ? (last.orden || 0) + 1 : 1;

    const doc = await CategoriaReferencia.create(data);
    return res.status(200).send(doc);
  } catch (e) {
    return res.status(500).send({ message: 'Error al crear categoria de referencia' });
  }
};

const list = async (_req, res) => {
  const items = await normalizeOrders();
  return res.status(200).send(items);
};

const get = async (req, res) => {
  const doc = await CategoriaReferencia.findById(req.params.id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  return res.status(200).send(doc);
};

const update = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const id = req.params.id;
  let doc = await CategoriaReferencia.findById(id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });

  const previousType = doc.tipo;
  const data = sanitizeCategoriaData({ ...doc.toObject(), ...req.body });
  const validationError = validateCategoriaData(data);
  if (validationError) return res.status(400).send({ message: validationError });

  const duplicate = await findDuplicateCategoria(data, id);
  if (duplicate) return res.status(400).send({ message: 'Ya existe una categoría con ese nombre para este tipo.' });

  if (data.tipo !== previousType) {
    const last = await CategoriaReferencia.findOne({ tipo: data.tipo }).sort({ orden: -1 });
    data.orden = last ? (last.orden || 0) + 1 : 1;
  } else {
    data.orden = doc.orden || 1;
  }

  doc = await CategoriaReferencia.findByIdAndUpdate(id, data, { new: true });
  await normalizeOrders();
  return res.status(200).send(doc);
};

const reorder = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const id = req.params.id;
  const direction = req.body.direction;
  if (!['up', 'down'].includes(direction)) return res.status(400).send({ message: 'Direccion invalida' });

  await normalizeOrders();

  const current = await CategoriaReferencia.findById(id);
  if (!current) return res.status(404).send({ message: 'No encontrado' });

  const targetOrder = direction === 'up' ? current.orden - 1 : current.orden + 1;
  const swap = await CategoriaReferencia.findOne({ tipo: current.tipo, orden: targetOrder });
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
  const doc = await CategoriaReferencia.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  await normalizeOrders();
  return res.status(200).send({ ok: true });
};

module.exports = { create, list, get, update, reorder, remove };
