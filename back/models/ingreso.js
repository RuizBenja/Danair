var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var IngresoSchema = {
  proveedor: { type: String, required: true }, //F
  ncomprobante: { type: String, required: true }, //F
  documento: { type: String, required: true }, //F
  monto_total: { type: String, required: true }, //F
  serie: { type: Number, required: false }, //NF INTERNO NO ES ENVIADO A TRAVEZ DE F(FORMULARIO)
  monto_resultante: { type: String, required: true }, //NF INTERNO NO ES ENVIADO A TRAVEZ DEL F(FORMULARIO)
  usuario: { type: Schema.ObjectId, ref: "usuario", required: true }, //NF INTERNO NO ES ENVIADO A TRAVEZ DEL F(FORMULARIO)
  createdAt: { type: Date, default: Date.now },
};

module.exports = mongoose.model("ingreso", IngresoSchema);
