var express = require('express');
var proveedorController = require('../controllers/proveedorController.js');
var authenticate = require('../middlewares/authenticate.js');

var api = express.Router();

api.post('/registro_proveedor_admin', authenticate.decodeToken, proveedorController.registro_proveedor_admin);
api.get('/listar_proveedores_admin', authenticate.decodeToken, proveedorController.listar_proveedores_admin);
api.get('/listar_activos_proveedores_admin', authenticate.decodeToken, proveedorController.listar_activos_proveedores_admin);
api.get('/obtener_proveedor_admin/:id', authenticate.decodeToken, proveedorController.obtener_proveedor_admin);
api.put('/actualizar_proveedor_admin/:id', authenticate.decodeToken, proveedorController.actualizar_proveedor_admin);
api.put('/cambiar_estado_proveedor_admin/:id', authenticate.decodeToken, proveedorController.cambiar_estado_proveedor_admin);
api.delete('/eliminar_proveedor_admin/:id', authenticate.decodeToken, proveedorController.eliminar_proveedor_admin);

module.exports = api;
