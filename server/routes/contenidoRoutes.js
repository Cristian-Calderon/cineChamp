// routes/contenidoRoutes.js
const express = require('express');
const router = express.Router();
const { buscarAPI, verificarConexionAPI } = require('../controllers/contenidoController');

router.get('/buscar', buscarAPI);
router.get('/check-api', verificarConexionAPI);

module.exports = router;