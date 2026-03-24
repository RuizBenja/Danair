const express = require('express');
const controller = require('../controllers/servicioTecnicoController');
const authenticate = require('../middlewares/authenticate.js');
const multipart = require('connect-multiparty');
const { ensureDir } = require('../controllers/mediaUtils');

const dir = './uploads/serviciotecnico';
ensureDir(dir);
const pathUpload = multipart({ uploadDir: dir });

const api = express.Router();

api.post('/servicio_tecnico', [authenticate.decodeToken, pathUpload], controller.create);
api.get('/servicio_tecnico', controller.list);
api.get('/servicio_tecnico/:id', controller.get);
api.put('/servicio_tecnico/:id', [authenticate.decodeToken, pathUpload], controller.update);
api.put('/servicio_tecnico/:id/reorder', authenticate.decodeToken, controller.reorder);
api.delete('/servicio_tecnico/:id', authenticate.decodeToken, controller.remove);
api.get('/servicio_tecnico/imagen/:img', controller.obtener_imagen);

module.exports = api;
