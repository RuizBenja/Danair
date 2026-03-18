// back/helpers/mercadopago.js
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago'); 

// 👇 LOG SOLO PARA DEBUG, PARA VER QUÉ TOKEN ESTÁ LLEGANDO
console.log(
  'MP_ACCESS_TOKEN EN HELPER:',
  (process.env.MP_ACCESS_TOKEN || 'NO DEFINIDO').slice(0, 40) + '...'
);

// Crear el cliente de Mercado Pago con tu access token
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Crear una instancia de Preferencia (para crear preferencias de pago)
const preference = new Preference(client);
const payment = new Payment(client);

module.exports = {
  preference,
  payment,  
};
