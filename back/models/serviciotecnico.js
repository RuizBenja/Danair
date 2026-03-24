var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServicioTecnicoSchema = Schema({
  titulo: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  extracto: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, default: '' },
  orden: { type: Number, default: 1 },
  seo_title: { type: String, default: '' },
  seo_description: { type: String, default: '' },
  estado: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('servicio_tecnico', ServicioTecnicoSchema);
