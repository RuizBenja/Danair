const express = require('express');
const path = require('path');
const servicioController = require('../controllers/servicioController');
const authenticate = require('../middlewares/authenticate.js');
const multipart = require('connect-multiparty');
const { ensureDir } = require('../controllers/mediaUtils');

const uploadsDir = path.resolve(__dirname, '..', 'uploads');
const dir = path.join(uploadsDir, 'servicios');
ensureDir(uploadsDir);
ensureDir(dir);
const pathUpload = multipart({ uploadDir: dir });

const api = express.Router();

api.post('/servicio', [authenticate.decodeToken, pathUpload], servicioController.create);
api.get('/servicio', servicioController.list);
api.get('/servicio/:id', servicioController.get);
api.put('/servicio/:id', [authenticate.decodeToken, pathUpload], servicioController.update);
api.put('/servicio/:id/reorder', authenticate.decodeToken, servicioController.reorder);
api.delete('/servicio/:id', authenticate.decodeToken, servicioController.remove);
api.get('/servicio/imagen/:img', servicioController.obtener_imagen);

module.exports = api;
