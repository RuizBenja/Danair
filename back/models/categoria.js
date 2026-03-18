var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    titulo : {type: String, required: true},
    slug : {type: String, required: true, unique: true},
    estado : {type: Boolean, default: true, required: true},
    usuario: { type: Schema.ObjectId, ref: 'usuario', required: false },
    createdAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('categoria', CategoriaSchema);
