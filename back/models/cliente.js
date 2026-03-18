var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClienteSchema = new Schema({
  nombres: { type: String, required: true },
  apellidos: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  estado: { type: Boolean, default: true },

  pais: { type: String, require: false },
  region: { type: String, require: false },
  ciudad: { type: String, require: false },
  recovery: { type: String, require: false },
  genero: { type: String, require: false },

  celular: { type: String, require: false },
  foto: { type: String, require: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("cliente", ClienteSchema);
