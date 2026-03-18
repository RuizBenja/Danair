// controllers/dashboardController.js
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Venta = require('../models/venta');
const moment = require('moment');

const dashboard_kpis = async function (req, res) {
  if (!req.user) {
    return res.status(500).send({ data: undefined, message: 'ErrorToken' });
  }

  try {
    // HOY
    const inicioHoy = moment().startOf('day').toDate();
    const finHoy = moment().endOf('day').toDate();

    // Productos
    const productosTotal = await Producto.countDocuments();
    const productosHoy = await Producto.countDocuments({
      createdAt: { $gte: inicioHoy, $lte: finHoy }
    });

    // Categorías
    const categoriasTotal = await Categoria.countDocuments();

    // Ventas de hoy
    const ventasHoy = await Venta.find({
      createdAt: { $gte: inicioHoy, $lte: finHoy }
    });

    const ventasHoyCantidad = ventasHoy.length;
    const ventasHoyMonto = ventasHoy.reduce((acc, v) => acc + v.total, 0);

    // Ventas últimos 7 días
    const hace7 = moment().subtract(6, 'days').startOf('day').toDate();
    const ventas7 = await Venta.aggregate([
      {
        $match: {
          createdAt: { $gte: hace7 }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          total: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).send({
      productosTotal,
      productosHoy,
      categoriasTotal,
      ventasHoyCantidad,
      ventasHoyMonto,
      ventasUltimos7Dias: ventas7   // [{ _id: '2025-03-01', total: 123 }, ...]
    });

  } catch (e) {
    console.log(e);
    res.status(500).send({ data: undefined, message: 'Error al obtener KPIs' });
  }
};

module.exports = { dashboard_kpis };
