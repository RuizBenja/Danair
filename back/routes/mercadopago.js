var express = require('express');
var MercadoPagoController = require('../controllers/MercadoPagoController');
var cauthenticate = require('../middlewares/cauthenticate');

var api = express.Router();

api.post('/crear_preferencia', cauthenticate.decodeToken, MercadoPagoController.crear_preferencia);
api.get('/verificar_pago/:payment_id', cauthenticate.decodeToken, MercadoPagoController.verificar_pago);

module.exports = api;
