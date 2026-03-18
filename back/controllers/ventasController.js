var Venta = require('../models/venta');
var Venta_Detalle = require('../models/venta_detalle');


const obtener_ventas_admin = async function (req,res) {
  try {
    if(req.user){
        let inicio = req.params['inicio'];
        let hasta = req.params['hasta'];

        var ventas = await Venta.find({
          createdAt: {
            $gte: new Date(inicio + 'T00:00:00'),
            $lte: new Date(hasta + 'T23:59:59.999') // para incluir todo el día
          }
        }).sort({ createdAt: -1 }).populate('cliente');

        res.status(200).send(ventas);
    }else{
      res.status(500).send({data: undefined, message: 'ErrorToken'});
    }
  } catch (e) {
    console.error('obtener_ventas_admin error:', e);
    res.status(500).send({ data: undefined, message: 'Error inesperado', error: e?.message || String(e) });
  }
}

const obtener_detalles_venta_admin = async function (req,res) {
  try {
    if(req.user){
        let id = req.params['id'];

        // 👉 Agregamos .populate('direccion') igual que en la tienda
        var venta = await Venta.findById({_id:id})
          .populate('cliente')
          .populate('direccion'); 

        var detalles = await Venta_Detalle.find({venta:id})
          .populate('producto')
          .populate('variedad');

        res.status(200).send({venta, detalles});
    }else{
      res.status(500).send({data: undefined, message: 'ErrorToken'});
    }
  } catch (e) {
    console.error('obtener_detalles_venta_admin error:', e);
    res.status(500).send({ data: undefined, message: 'Error inesperado', error: e?.message || String(e) });
  }
}
const obtener_ventas_admin_por_numero = async function (req, res) {
  try {
    if (req.user) {

      let numero = req.params['numero']; // viene desde la URL
      let orConditions = [];

      // 1) Buscar por transaccion (string)
      orConditions.push({ transaccion: numero });

      // 2) Si el parámetro es numérico, también buscamos por serie (Number)
      const numeroInt = parseInt(numero, 10);
      if (!isNaN(numeroInt)) {
        orConditions.push({ serie: numeroInt });
      }

      const ventas = await Venta.find({
        $or: orConditions
      })
        .sort({ createdAt: -1 })
        .populate('cliente');

      return res.status(200).send(ventas);

    } else {
      return res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
  } catch (e) {
    console.error('obtener_ventas_admin_por_numero error:', e);
    res.status(500).send({
      data: undefined,
      message: 'Error inesperado',
      error: e?.message || String(e)
    });
  }
};



module.exports = {
obtener_ventas_admin,
obtener_detalles_venta_admin,
obtener_ventas_admin_por_numero   

}