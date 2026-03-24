var Producto = require('../models/producto');
var Categoria = require("../models/categoria");
var Subcategoria = require("../models/subcategoria");
var Galeria = require('../models/galeria');

const obtener_nuevos_productos = async function (req,res) {
    var productos =  await Producto.find({estado:true}).sort({createdAt:-1}).limit(4);
    res.status(200).send(productos);
}

const obtener_productos_recomendados = async function (req,res) {
    var productos =  await Producto.find({estado:true}).limit(8);
    res.status(200).send(productos);
}

const obtener_productos_shop = async function (req,res) {
    var productos =  await Producto.find({estado:true}).sort({createdAt:-1});
    res.status(200).send(productos);
}

const listar_categorias_public = async function (req,res) {
  try {
    const regs = await Categoria.find({estado:true}).sort({ titulo: 1 });
    const categorias = [];

    for (const item of regs) {
      const subcategorias = await Subcategoria.find({ categoria: item._id }).sort({ titulo: 1 });
      const productos = await Producto.find({ categoria: item.titulo, estado: true });

      categorias.push({
        categoria: item,
        subcategorias,
        nproductos: productos.length
      });
    }

    return res.status(200).send(categorias);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: 'Error en el servidor' });
  }
};

const obtener_producto_slug = async function (req,res) {
  var slug = req.params['slug'];
  var producto = await Producto.findOne({slug: slug});
  if (!producto) return res.status(404).send({ message: 'Producto no encontrado' });
  var galeria = await Galeria.find({producto: producto._id});
  res.status(200).send({producto,galeria});
};

const obtener_productos_relacionados_categoria = async function (req,res) {
  var categoria = req.params['categoria'];
  var productos = await Producto.find({categoria: categoria, estado: true}).limit(6);
  res.status(200).send({productos});
};

module.exports = {
    obtener_nuevos_productos,
    obtener_productos_recomendados,
    obtener_productos_shop,
    listar_categorias_public,
    obtener_producto_slug,
    obtener_productos_relacionados_categoria
}
