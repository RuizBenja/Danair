const express = require('express');
const controller = require('../controllers/proyectoController');
const authenticate = require('../middlewares/authenticate.js');
const multipart = require('connect-multiparty');
const { ensureDir } = require('../controllers/mediaUtils');

const dir = './uploads/proyectos';
ensureDir(dir);
const pathUpload = multipart({ uploadDir: dir });

const api = express.Router();

api.post('/proyecto', [authenticate.decodeToken, pathUpload], controller.create);
api.get('/proyecto', controller.list);
api.get('/proyecto/:id', controller.get);
api.put('/proyecto/:id', [authenticate.decodeToken, pathUpload], controller.update);
api.put('/proyecto/:id/reorder', authenticate.decodeToken, controller.reorder);
api.delete('/proyecto/:id', authenticate.decodeToken, controller.remove);
api.get('/proyecto/imagen/:img', controller.obtener_imagen);

module.exports = api;
