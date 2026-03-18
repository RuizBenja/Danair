const express = require('express');
const controller = require('../controllers/marcaController');
const authenticate = require('../middlewares/authenticate.js');
const multipart = require('connect-multiparty');
const { ensureDir } = require('../controllers/mediaUtils');

const dir = './uploads/marcas';
ensureDir(dir);
const pathUpload = multipart({ uploadDir: dir });

const api = express.Router();

api.post('/marca', [authenticate.decodeToken, pathUpload], controller.create);
api.get('/marca', controller.list);
api.get('/marca/:id', controller.get);
api.put('/marca/:id', [authenticate.decodeToken, pathUpload], controller.update);
api.put('/marca/:id/reorder', authenticate.decodeToken, controller.reorder);
api.delete('/marca/:id', authenticate.decodeToken, controller.remove);
api.get('/marca/logo/:img', controller.obtener_logo);

module.exports = api;
