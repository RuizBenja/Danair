'use strict';

const nodemailer = require('nodemailer');
console.log('DEBUG SMTP_USER:', process.env.SMTP_USER);
console.log('DEBUG SMTP_PASS length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);


const ContactoController = {};

// Transporter de Brevo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,   // smtp-relay.brevo.com
  port: process.env.SMTP_PORT,   // 587
  secure: false,                 // con 587 va en false
  auth: {
    user: process.env.SMTP_USER, // 99933a001@smtp-brevo.com
    pass: process.env.SMTP_PASS, // tu clave SMTP
  },
});

// opcional: verificar conexión al iniciar el servidor
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error verificando transporter de Brevo:', error);
  } else {
    console.log('Servidor SMTP de Brevo listo para enviar correos');
  }
});

ContactoController.enviarContacto = async function (req, res) {
  try {
    const { nombres, apellidos, email, mensaje } = req.body;

    // Validaciones básicas
    if (!nombres || !apellidos || !email || !mensaje) {
      return res.status(400).send({ message: 'Faltan datos' });
    }

    const mailOptions = {
  // REMITENTE: tu correo verificado en Brevo
  from: `"Tienda" <${process.env.CONTACT_FROM}>`,

  // DESTINATARIO: tu Gmail donde quieres recibir el mensaje
  to: process.env.CONTACT_TO,

  subject: 'Nueva consulta desde la tienda',
  replyTo: email,
  html: `
    <h3>Nueva consulta de contacto</h3>
    <p><b>Nombre:</b> ${nombres} ${apellidos}</p>
    <p><b>Correo:</b> ${email}</p>
    <p><b>Mensaje:</b></p>
    <p>${mensaje}</p>
  `,
};

    console.log('Voy a enviar correo con:', mailOptions);

    const info = await transporter.sendMail(mailOptions);

    console.log('Correo enviado. Respuesta de Brevo:', info);

    return res.status(200).send({ message: 'Consulta enviada correctamente' });
  } catch (err) {
    console.error('Error al enviar correo de contacto:', err);
    return res
      .status(500)
      .send({ message: 'Error en el servidor al enviar el correo' });
  }
};

module.exports = ContactoController;
