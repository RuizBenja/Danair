var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReferenciaSchema = Schema({
  titulo: { type: String, required: true }, // ej. Industria Construcción
  industria: { type: String, required: true },
  familia: { type: String, required: true }, // categoría del equipo
  comuna: { type: String, default: '' },
  region: { type: String, default: '' },
  anio: { type: Number, default: null },
  marca: { type: String, default: '' },
  modelo: { type: String, default: '' },
  potencia: { type: String, default: '' },
  presion: { type: String, default: '' },
  imagen: { type: String, default: '' },
  estado: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('referencia', ReferenciaSchema);
