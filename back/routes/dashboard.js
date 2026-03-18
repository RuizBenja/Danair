// routes/dashboard.js
var express = require('express');
var api = express.Router();
var auth = require('../middlewares/authenticate');
var dashboardController = require('../controllers/dashboardController');

api.get('/dashboard_kpis', auth.decodeToken, dashboardController.dashboard_kpis);

module.exports = api;
