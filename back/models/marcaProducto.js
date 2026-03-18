var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarcaProductoSchema = Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  estado: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('marca_producto', MarcaProductoSchema);
