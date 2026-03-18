const { preference, payment } = require('../helpers/mercadopago');

const FRONTEND_URL = 'http://localhost:8080'; // tu front

// controllers/MercadoPagoController.js
const crear_preferencia = async function (req, res) {
  try {
    const { items, direccion_id } = req.body;

    if (!items || !items.length) {
      return res.status(400).send({ message: 'No hay items en la preferencia' });
    }

    if (!direccion_id) {
      return res.status(400).send({ message: 'direccion_id requerido' });
    }

    const preferenceData = {
      items,
      back_urls: {
        success: `${FRONTEND_URL}/verificacion/success?direccion_id=${direccion_id}`,
        pending: `${FRONTEND_URL}/verificacion/pending`,
        failure: `${FRONTEND_URL}/verificacion/failure`,
      },
       metadata: {
        direccion_id,
      },
       //auto_return: 'approved',   
    };

    console.log('>>>> PREFERENCE DATA ENVIADO A MP:');
    console.log(JSON.stringify(preferenceData, null, 2));

    const response = await preference.create({ body: preferenceData });

    // response YA es la preferencia creada
    console.log('>>>> PREFERENCE CREADA EN MP:');
    console.log(JSON.stringify(response, null, 2));

    // Solo devolvemos lo que realmente usamos en el front
    return res.status(200).send({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });
  } catch (error) {
    console.log('❌ Error al crear preferencia MP ❌');
    console.log('message:', error.message);
    console.log('status:', error.status);
    console.log('response:', error.response);
    console.log('cause:', error.cause);

    return res.status(500).send({
      message: 'Error al crear preferencia',
      error,
    });
  }
};


const verificar_pago = async function (req, res) {
  try {
    const payment_id = req.params.payment_id;

    if (!payment_id) {
      return res.status(400).send({ message: 'payment_id requerido' });
    }

    const response = await payment.get({ id: payment_id });

    // 👇 Adaptamos lo que le vamos a mandar al frontend
    const pago = {
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
      transaction_amount: response.transaction_amount,
      date_approved: response.date_approved,
      payment_method_id: response.payment_method_id,
      // aquí viene lo importante: la dirección desde metadata
      direccion_id:
        response.metadata && response.metadata.direccion_id
          ? response.metadata.direccion_id
          : null,
    };

    return res.status(200).send(pago);
  } catch (error) {
    console.log('❌ ERROR REAL DE MP AL VERIFICAR PAGO ❌');
    console.log('message:', error.message);
    console.log('status:', error.status);
    console.log('response:', error.response);
    console.log('cause:', error.cause);

    return res.status(500).send({
      message: 'Error al verificar pago',
      error,
    });
  }
};


module.exports = {
  crear_preferencia,
  verificar_pago,
};
