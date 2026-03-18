var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DireccionSchema = Schema({
    nombres : {type: String, required: true},
    apellidos : {type: String, required: true},
    rut : {type: String, required: true},
    celular : {type: String, required: true},
    region : {type: String, required: true},
    ciudad : {type: String, required: true},
    codigopostal : {type: String, required: true},
    direccion : {type: String, required: true},
    cliente : {type: Schema.ObjectId, ref: 'cliente', required: true},
    createdAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('direccion', DireccionSchema);