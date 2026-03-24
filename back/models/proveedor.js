var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProveedorSchema = Schema({
  nombre: { type: String, required: true },
  contacto: { type: String, default: '' },
  email: { type: String, default: '' },
  telefono: { type: String, default: '' },
  telefono_alt: { type: String, default: '' },
  direccion: { type: String, default: '' },
  sitio: { type: String, default: '' },
  notas: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('proveedor', ProveedorSchema);
