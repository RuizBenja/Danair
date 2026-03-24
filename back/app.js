require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var port = process.env.PORT || 4301;
const { createServer } = require("http");
const { Server } = require("socket.io");

var app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors:{origin: '*'}
 });

io.on("connection", () => {});

var usuario_route = require('./routes/usuario.js');
var producto_route = require('./routes/producto.js');
var public_route = require('./routes/public.js');
var contacto_route = require('./routes/contacto.js');
var proveedor_route = require('./routes/proveedor.js');
var servicio_route = require('./routes/servicio.js');
var serviciotecnico_route = require('./routes/serviciotecnico.js');
var proyecto_route = require('./routes/proyecto.js');
var marca_route = require('./routes/marca.js');
var marca_producto_route = require('./routes/marcaProducto.js');
var referencia_route = require('./routes/referencia.js');
var categoria_referencia_route = require('./routes/categoriaReferencia.js');



app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));

async function startServer() {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/compresores');
      console.log('Conectado a MongoDB (compresores)');
      httpServer.listen(port, () => {
      console.log('Servidor escuchando en puerto ' + port);
      });  
    } catch (err) {
      console.error('Error al conectar a MongoDB', err);
    }
  }
  
  startServer();

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',usuario_route);
app.use('/api',producto_route);
app.use('/api',public_route);
app.use('/api', contacto_route);
app.use('/api', proveedor_route);
app.use('/api', servicio_route);
app.use('/api', serviciotecnico_route);
app.use('/api', proyecto_route);
app.use('/api', marca_route);
app.use('/api', marca_producto_route);
app.use('/api', referencia_route);
app.use('/api', categoria_referencia_route);



module.exports = app;


