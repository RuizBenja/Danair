const express = require('express');
const controller = require('../controllers/referenciaController');
const authenticate = require('../middlewares/authenticate.js');
const multipart = require('connect-multiparty');
const { ensureDir } = require('../controllers/mediaUtils');

const dir = './uploads/referencias';
ensureDir(dir);
const pathUpload = multipart({ uploadDir: dir });

const api = express.Router();

api.post('/referencia', [authenticate.decodeToken, pathUpload], controller.create);
api.get('/referencia', controller.list);
api.get('/referencia/:id', controller.get);
api.put('/referencia/:id', [authenticate.decodeToken, pathUpload], controller.update);
api.put('/referencia/:id/reorder', authenticate.decodeToken, controller.reorder);
api.delete('/referencia/:id', authenticate.decodeToken, controller.remove);
api.get('/referencia/imagen/:img', controller.obtener_imagen);

module.exports = api;
