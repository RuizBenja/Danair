const express = require('express');
const controller = require('../controllers/marcaProductoController');
const authenticate = require('../middlewares/authenticate.js');

const api = express.Router();

api.post('/marca-producto', authenticate.decodeToken, controller.create);
api.get('/marca-producto', controller.list);
api.get('/marca-producto/:id', controller.get);
api.put('/marca-producto/:id', authenticate.decodeToken, controller.update);
api.delete('/marca-producto/:id', authenticate.decodeToken, controller.remove);

module.exports = api;
