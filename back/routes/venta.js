var express = require('express');
var VentasController = require('../controllers/ventasController.js')
var authenticate = require('../middlewares/authenticate.js');

var api = express.Router();

api.get('/obtener_ventas_admin/:inicio/:hasta',authenticate.decodeToken,VentasController.obtener_ventas_admin);
api.get('/obtener_detalles_venta_admin/:id',authenticate.decodeToken,VentasController.obtener_detalles_venta_admin);
api.get('/obtener_ventas_admin_por_numero/:numero',authenticate.decodeToken,VentasController.obtener_ventas_admin_por_numero);

module.exports =  api
