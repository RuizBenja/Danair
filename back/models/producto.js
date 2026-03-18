var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    titulo : {type: String, required: true},
    slug : {type: String, required: true, unique: true},
    categoria : {type: String, required: true},
    subcategoria : {type: String, default: ''},
    marca : {type: String, default: ''},
    serie : {type: String, default: ''},
    modelo : {type: String, default: ''},
    extracto : {type: String, required: true},
    descripcion : {type: String, default: ''},
    portada : {type: String, required: true},
    ficha_tecnica : {type: String, default: ''},
    ficha_pdf : {type: String, default: ''},
    tecnologia : {type: String, default: ''},
    potencia : {type: String, default: ''},
    presion : {type: String, default: ''},
    caudal : {type: String, default: ''},
    aplicacion : {type: String, default: ''},
    industria : {type: String, default: ''},
    orientacion : {type: String, default: ''},
    material : {type: String, default: ''},
    volumen : {type: String, default: ''},
    pureza : {type: String, default: ''},
    str_variedad : {type: String, default: ''},
    arriendo : {type: Boolean, default: false},
    estado : {type: Boolean, default: true},
    updatedAt: {type: Date,required:false},
    createdAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('producto',ProductoSchema);
