const slugify = require('slugify');
const MarcaProducto = require('../models/marcaProducto');

const create = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  try {
    const nombre = (req.body.nombre || '').trim();
    if (!nombre) return res.status(400).send({ message: 'Nombre requerido' });

    const slug = slugify(nombre, { lower: true, strict: true, locale: 'es' });
    const exists = await MarcaProducto.findOne({ $or: [{ nombre }, { slug }] });
    if (exists) return res.status(400).send({ message: 'La marca de producto ya existe' });

    const doc = await MarcaProducto.create({
      nombre,
      slug,
      estado: req.body.estado !== undefined ? !!req.body.estado : true
    });
    return res.status(200).send(doc);
  } catch (_e) {
    return res.status(500).send({ message: 'Error al crear marca de producto' });
  }
};

const list = async (_req, res) => {
  const items = await MarcaProducto.find().sort({ nombre: 1 });
  return res.status(200).send(items);
};

const get = async (req, res) => {
  const doc = await MarcaProducto.findById(req.params.id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  return res.status(200).send(doc);
};

const update = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  try {
    const id = req.params.id;
    const doc = await MarcaProducto.findById(id);
    if (!doc) return res.status(404).send({ message: 'No encontrado' });

    const nombre = (req.body.nombre || '').trim();
    if (!nombre) return res.status(400).send({ message: 'Nombre requerido' });

    const slug = slugify(nombre, { lower: true, strict: true, locale: 'es' });
    const exists = await MarcaProducto.findOne({
      _id: { $ne: id },
      $or: [{ nombre }, { slug }]
    });
    if (exists) return res.status(400).send({ message: 'La marca de producto ya existe' });

    const updated = await MarcaProducto.findByIdAndUpdate(id, {
      nombre,
      slug,
      estado: req.body.estado !== undefined ? !!req.body.estado : true
    }, { new: true });

    return res.status(200).send(updated);
  } catch (_e) {
    return res.status(500).send({ message: 'Error al actualizar marca de producto' });
  }
};

const remove = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const doc = await MarcaProducto.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  return res.status(200).send({ ok: true });
};

module.exports = { create, list, get, update, remove };
