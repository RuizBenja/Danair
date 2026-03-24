var express = require('express');
var productoController = require('../controllers/productoController.js');
var authenticate = require('../middlewares/authenticate.js');
var multipart = require('connect-multiparty');
var fs = require('fs');
var path = require('path');

const uploadsDir = path.resolve(__dirname, '..', 'uploads');
const dirProductos = path.join(uploadsDir, 'productos');
const dirGaleria = path.join(uploadsDir, 'galeria');
const dirFichas = path.join(uploadsDir, 'fichas');
[uploadsDir, dirProductos, dirGaleria, dirFichas].forEach((d)=>{
  if(!fs.existsSync(d)){
    fs.mkdirSync(d, { recursive: true });
  }
});

var multipartProductos = multipart({uploadDir: dirProductos});
var multipartGaleria = multipart({uploadDir: dirGaleria});
var api = express.Router();

api.post('/registro_producto_admin',[authenticate.decodeToken,multipartProductos],productoController.registro_producto_admin);
api.get('/listar_productos_admin/:Filtro?',authenticate.decodeToken,productoController.listar_productos_admin);
api.get('/listar_activos_productos_admin',authenticate.decodeToken,productoController.listar_activos_productos_admin);

api.get('/obtener_portada_producto/:img',productoController.obtener_portada_producto);
api.get('/obtener_ficha_pdf_producto/:doc', productoController.obtener_ficha_pdf_producto);
api.get('/obtener_producto_admin/:id',authenticate.decodeToken,productoController.obtener_producto_admin);
api.put('/actualizar_producto_admin/:id',[authenticate.decodeToken,multipartProductos],productoController.actualizar_producto_admin);

// Galeria
api.post('/subir_imagen_producto_admin',[authenticate.decodeToken,multipartGaleria],productoController.subir_imagen_producto_admin);
api.get('/obtener_galeria_producto/:img',productoController.obtener_galeria_producto);
api.get('/obtener_galeria_producto_admin/:id',authenticate.decodeToken,productoController.obtener_galeria_producto_admin);
api.delete('/eliminar_galeria_producto_admin/:id',authenticate.decodeToken,productoController.eliminar_galeria_producto_admin);

// Categorias
api.post('/crear_categoria_admin', authenticate.decodeToken,productoController.crear_categoria_admin);
api.get('/listar_categorias_admin', authenticate.decodeToken,productoController.listar_categorias_admin);
api.post('/crear_subcategoria_admin', authenticate.decodeToken,productoController.crear_subcategoria_admin);
api.delete('/eliminar_subcategoria_admin/:id', authenticate.decodeToken,productoController.eliminar_subcategoria_admin);
api.put('/cambiar_estado_categoria_admin/:id', authenticate.decodeToken,productoController.cambiar_estado_categoria_admin);
api.delete('/eliminar_categoria_admin/:id', authenticate.decodeToken, productoController.eliminar_categoria_admin);

api.delete('/eliminar_producto_admin/:id', authenticate.decodeToken, productoController.eliminar_producto_admin);

module.exports =  api;
