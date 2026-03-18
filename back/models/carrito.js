var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CarritoSchema = new Schema({
  cliente: { type: Schema.Types.ObjectId, ref: "cliente", required: true }, // nombre del modelo de cliente
  producto: { type: Schema.Types.ObjectId, ref: "producto", required: true }, // nombre del modelo de producto
  variedad: { type: Schema.Types.ObjectId, ref: "variedad", required: true }, // nombre del modelo de variedad
  cantidad: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("carrito", CarritoSchema);
