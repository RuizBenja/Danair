var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarcaSchema = Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  descripcion: { type: String, default: '' },
  logo: { type: String, default: '' },
  orden: { type: Number, default: 0 },
  estado: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('marca', MarcaSchema);
