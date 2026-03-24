var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaReferenciaSchema = Schema({
  nombre: { type: String, required: true, trim: true },
  tipo: { type: String, required: true, enum: ['industria', 'producto'] },
  estado: { type: Boolean, default: true },
  orden: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('categoria_referencia', CategoriaReferenciaSchema);
