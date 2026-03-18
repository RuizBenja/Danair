var Carrito = require("../models/carrito");
var Variedad = require("../models/variedad");
var Direccion = require("../models/direccion");
var Venta = require("../models/venta");
var Venta_detalle = require("../models/venta_detalle");
var Review = require("../models/review");

const crear_producto_carrito = async function (req, res) {
  if (req.user) {
    let data = req.body;

    var variedad = await Variedad.findById({ _id: data.variedad }).populate(
      "producto"
    );

    if (data.cantidad <= variedad.stock) {
      if (variedad.producto.precio >= 1) {
        let carrito = await Carrito.create(data);
        res.status(200).send(carrito);
      } else {
        res.status(200).send({
          data: undefined,
          message: "El producto tiene un precio en 0",
        });
      }
    } else {
      res.status(200).send({
        data: undefined,
        message: "Se superó el stock del producto",
      });
    }
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

const obtener_carrito_cliente = async function (req, res) {
  if (req.user) {
    let carrito = await Carrito.find({ cliente: req.user.sub })
      .populate("producto")
      .populate("variedad")
      .sort({ createdAt: -1 })
      .limit(5);

    let carrito_general = await Carrito.find({ cliente: req.user.sub })
      .populate("producto")
      .populate("variedad")
      .sort({ createdAt: -1 });

    res.status(200).send({ carrito, carrito_general });
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

const eliminar_producto_carrito = async function (req, res) {
  if (req.user) {
    let id = req.params["id"];
    let reg = await Carrito.findByIdAndRemove({ _id: id });
    res.status(200).send(reg);
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

const crear_direccion_cliente = async function (req, res) {
  if (req.user) {
    let data = req.body;
    data.cliente = req.user.sub;
    let direccion = await Direccion.create(data);
    res.status(200).send(direccion);
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

const obtener_direccion_cliente = async function (req, res) {
  if (req.user) {
    let direcciones = await Direccion.find({ cliente: req.user.sub });
    res.status(200).send(direcciones);
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

const eliminar_direccion_cliente = async function (req, res) {
  if (req.user) {
    let id = req.params["id"];
    let direccion = await Direccion.findByIdAndRemove({ _id: id });
    res.status(200).send(direccion);
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

const validar_payment_id_venta = async function (req, res) {
  if (req.user) {
    let payment_id = req.params["payment_id"];
    let ventas = await Venta.find({ transaccion: payment_id });
    res.status(200).send(ventas);
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

const crear_venta_cliente = async function (req, res) {
  if (!req.user) {
    return res.status(500).send({ data: undefined, message: "ErrorToken" });
  }

  let data = req.body;

  // La venta siempre es del usuario logueado
  data.cliente = req.user.sub;

  // Por si acaso algún día te llega direccion_id en el body
  if (!data.direccion && data.direccion_id) {
    data.direccion = data.direccion_id;
  }

  // ⚠️ VALIDACIÓN CRÍTICA: no dejar pasar ventas sin dirección
  if (!data.direccion) {
    return res.status(400).send({
      data: undefined,
      message: "Debe enviar una dirección (campo 'direccion' o 'direccion_id')",
    });
  }

  const now = new Date();
  data.year = now.getFullYear();
  data.month = now.getMonth() + 1;
  data.day = now.getDate();
  data.estado = "Pagado";

  // Serie correlativa
  let ventas = await Venta.find().sort({ createdAt: -1 });
  data.serie = ventas.length === 0 ? 1 : ventas[0].serie + 1;

  try {
    // 👉 Aquí ya sabemos que data.direccion existe, así que Mongoose no revienta
    let venta = await Venta.create(data);

    // Crear detalles de venta
    for (const item of data.detalles) {
      item.year = now.getFullYear();
      item.month = now.getMonth() + 1;
      item.day = now.getDate();
      item.venta = venta._id;

      await Venta_detalle.create(item);
    }

    // Vaciar carrito del cliente
    await Carrito.deleteMany({ cliente: data.cliente });

    return res.status(200).send(venta);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ data: undefined, message: "Error al crear la venta", error });
  }
};


const obtener_informacion_venta = async function (req, res) {
  if (req.user) {
    try {
      const id = req.params["id"];

      // 1) Validar ID
      if (!id || id === "undefined") {
        return res
          .status(400)
          .send({ data: undefined, message: "ID de venta inválido" });
      }

      // 2) Usar findById(id), NO findById({ _id: id })
      const venta = await Venta.findById(id)
        .populate("cliente")
        .populate("direccion");
        console.log('VENTA DESDE obtener_informacion_venta:', JSON.stringify(venta, null, 2)); // 👈 AGREGA ESTO


      if (!venta) {
        return res
          .status(404)
          .send({ data: undefined, message: "Venta no encontrada" });
      }

      // 3) Validar que la venta pertenezca al usuario logueado
      if (!venta.cliente || venta.cliente._id.toString() !== req.user.sub.toString()) {
        return res.status(200).send({
          data: undefined,
          message: "No tienes acceso a esta venta",
        });
      }

      // 4) Buscar detalles
      const regs = await Venta_detalle.find({ venta: id })
        .populate("producto")
        .populate("variedad");

      const detalles = [];

      for (const item of regs) {
        const reviews = await Review.find({
          cliente: req.user.sub,
          producto: item.producto._id,
        });

        detalles.push({
          detalle: item,
          reviews,
        });
      }

      return res.status(200).send({ venta, detalles });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ data: undefined, message: "Error en el servidor", error });
    }
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

const obtener_ventas_cliente = async function (req, res) {
  if (req.user) {
    let ventas = await Venta.find({ cliente: req.user.sub })
      .populate("cliente")
      .populate("direccion");
    res.status(200).send({ ventas });
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

const registrar_review_cliente = async function (req, res) {
  if (req.user) {
    let data = req.body;
    data.cliente = req.user.sub;
    let regs = await Review.find({
      cliente: data.cliente,
      producto: data.producto,
    });

    if (regs.length == 0) {
      let review = await Review.create(data);
      res.status(200).send(review);
    } else {
      res.status(200).send({
        data: undefined,
        message: "Usted ya generó un comentario para el producto",
      });
    }
  } else {
    res.status(500).send({ data: undefined, message: "ErrorToken" });
  }
};

module.exports = {
  crear_producto_carrito,
  obtener_carrito_cliente,
  eliminar_producto_carrito,
  crear_direccion_cliente,
  obtener_direccion_cliente,
  eliminar_direccion_cliente,
  validar_payment_id_venta,
  crear_venta_cliente,
  obtener_informacion_venta,
  obtener_ventas_cliente,
  registrar_review_cliente,
};
