var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SeasonImageSchema = Schema({
  estacion: { type: String, required: true, unique: true, lowercase: true }, // primavera, verano, otono, invierno
  men: { type: String, default: '' },
  women: { type: String, default: '' },
  acc: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('season_image', SeasonImageSchema);
