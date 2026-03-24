var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProyectoSchema = Schema({
  titulo: { type: String, required: true, trim: true },
  extracto: { type: String, required: true },
  descripcion: { type: String, required: false, default: '' },
  imagen: { type: String, default: '' },
  orden: { type: Number, default: 1 },
  seo_title: { type: String, default: '' },
  seo_description: { type: String, default: '' },
  destacado: { type: Boolean, default: true },
  estado: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('proyecto', ProyectoSchema);
