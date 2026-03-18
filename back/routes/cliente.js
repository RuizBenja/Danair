var express = require('express');
var clienteController = require('../controllers/clienteController.js')

// middleware de CLIENTE
var cauth = require('../middlewares/cauthenticate');
// para subir archivos
var multiparty = require('connect-multiparty');
var path_upload_cliente = multiparty({ uploadDir: './uploads/clientes' });

var api = express.Router();


api.post('/registro_cliente_ecommerce',clienteController.registro_cliente_ecommerce);
api.post('/login_cliente',clienteController.login_cliente);

api.put('/actualizar_perfil_cliente',cauth.decodeToken, clienteController.actualizar_perfil_cliente);
api.put('/actualizar_foto_cliente',[cauth.decodeToken, path_upload_cliente],clienteController.actualizar_foto_cliente);
api.put('/eliminar_foto_cliente',cauth.decodeToken,clienteController.eliminar_foto_cliente);
api.get('/obtener_portada_cliente/:img',clienteController.obtener_portada_cliente);



module.exports =  api