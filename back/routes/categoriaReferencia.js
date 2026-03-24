const express = require('express');
const controller = require('../controllers/categoriaReferenciaController');
const authenticate = require('../middlewares/authenticate.js');

const api = express.Router();

api.post('/referencia-categoria', authenticate.decodeToken, controller.create);
api.get('/referencia-categoria', controller.list);
api.get('/referencia-categoria/:id', controller.get);
api.put('/referencia-categoria/:id', authenticate.decodeToken, controller.update);
api.put('/referencia-categoria/:id/reorder', authenticate.decodeToken, controller.reorder);
api.delete('/referencia-categoria/:id', authenticate.decodeToken, controller.remove);

module.exports = api;
