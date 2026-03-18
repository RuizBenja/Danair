var express = require('express');
var usuarioController = require('../controllers/usuarioController.js');
var authenticate = require('../middlewares/authenticate.js');
var multipart = require('connect-multiparty');
var pathLib = require('path');

var path = multipart({ uploadDir: pathLib.join(__dirname, '..', 'uploads', 'usuarios') });

var api = express.Router();

api.post('/registro_usuario_admin', [authenticate.decodeToken, path], usuarioController.registro_usuario_admin);
api.post('/login_usuario', usuarioController.login_usuario);
api.get('/listar_usuario_admin/:Filtro?', authenticate.decodeToken, usuarioController.listar_usuario_admin);
api.get('/obtener_usuario_admin/:id', authenticate.decodeToken, usuarioController.obtener_usuario_admin);
api.put('/actualizar_usuario_admin/:id', [authenticate.decodeToken, path], usuarioController.actualizar_usuario_admin);
api.put('/cambiar_estado_usuario/:id', authenticate.decodeToken, usuarioController.cambiar_estado_usuario);
api.put('/reset_password_admin/:id', authenticate.decodeToken, usuarioController.reset_password_admin);
api.get('/obtener_avatar_usuario/:img', usuarioController.obtener_avatar_usuario);

module.exports = api;
