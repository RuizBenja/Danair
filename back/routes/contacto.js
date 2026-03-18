'use strict';

const express = require('express');
const ContactoController = require('../controllers/ContactoController');

const api = express.Router();

api.post('/enviar_contacto', ContactoController.enviarContacto);

module.exports = api;
