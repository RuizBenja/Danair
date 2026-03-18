var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServicioTecnicoSchema = Schema({
  titulo: { type: String, required: true, trim: true },
  extracto: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, default: '' },
  estado: { type: Boolean, default: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('servicio_tecnico', ServicioTecnicoSchema);
