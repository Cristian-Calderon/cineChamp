// routes/contenidoRoutes.js
const express = require('express');
const router = express.Router();
const {
  verificarConexionAPI,
  buscarPeliculasController,
  buscarSeriesController,
  favoritoContenidoController,
  agregarContenidoController,
  buscarAPI
} = require('../controllers/contenidoController');

// Verificación de conexión
router.get('/check-api', verificarConexionAPI);

// Búsquedas
router.get('/buscar-peliculas', buscarPeliculasController);
router.get('/buscar-series', buscarSeriesController);
router.get('/buscar', buscarAPI); 

// Agregar y marcar como favorito
router.post('/agregar', agregarContenidoController);
router.post('/favorito', favoritoContenidoController);

module.exports = router;