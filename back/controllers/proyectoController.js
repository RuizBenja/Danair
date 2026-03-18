const Proyecto = require('../models/proyecto');
const path = require('path');
const { validateWebp, deleteFileIfExists } = require('./mediaUtils');

const create = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  try {
    const data = req.body;
    if (req.files && req.files.imagen) {
      const file = req.files.imagen;
      const err = validateWebp(file);
      if (err) {
        deleteFileIfExists(file.path);
        return res.status(400).send({ message: err });
      }
      data.imagen = path.basename(file.path);
    }
    const doc = await Proyecto.create(data);
    return res.status(200).send(doc);
  } catch (e) {
    return res.status(500).send({ message: 'Error al crear proyecto' });
  }
};

const list = async (_req, res) => {
  const items = await Proyecto.find().sort({ createdAt: -1 });
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
  const data = req.body;
  if (req.files && req.files.imagen) {
    const file = req.files.imagen;
    const err = validateWebp(file);
    if (err) {
      deleteFileIfExists(file.path);
      return res.status(400).send({ message: err });
    }
    if (doc.imagen) deleteFileIfExists(path.join('./uploads/proyectos/', doc.imagen));
    data.imagen = path.basename(file.path);
  }
  doc = await Proyecto.findByIdAndUpdate(id, data, { new: true });
  return res.status(200).send(doc);
};

const remove = async (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });
  const id = req.params.id;
  const doc = await Proyecto.findByIdAndDelete(id);
  if (!doc) return res.status(404).send({ message: 'No encontrado' });
  if (doc.imagen) deleteFileIfExists(path.join('./uploads/proyectos/', doc.imagen));
  return res.status(200).send({ ok: true });
};

const obtener_imagen = async function(req,res){
  const img = req.params['img'];
  if(!img) return res.status(400).send({message:'Imagen requerida'});
  const img_path = path.join('./uploads/proyectos/', img);
  return res.sendFile(path.resolve(img_path));
};

module.exports = { create, list, get, update, remove, obtener_imagen };
