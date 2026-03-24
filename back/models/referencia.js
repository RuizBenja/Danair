var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReferenciaSchema = Schema({
  titulo: { type: String, required: true, trim: true },
  industria_categoria: { type: Schema.Types.ObjectId, ref: 'categoria_referencia', default: null },
  producto_categoria: { type: Schema.Types.ObjectId, ref: 'categoria_referencia', default: null },
  comuna: { type: String, default: '' },
  region: { type: String, default: '' },
  anio: { type: Number, default: null },
  marca: { type: String, default: '' },
  modelo: { type: String, default: '' },
  potencia: { type: String, default: '' },
  caudal: { type: String, default: '' },
  presion: { type: String, default: '' },
  descripcion: { type: String, default: '' },
  imagen: { type: String, default: '' },
  orden: { type: Number, default: 1 },
  estado: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('referencia', ReferenciaSchema);
