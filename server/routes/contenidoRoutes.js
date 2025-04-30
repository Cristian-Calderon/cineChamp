// routes/contenidoRoutes.js
const express = require('express');
const router = express.Router();
const {
  verificarConexionAPI,
  buscarContenidoController,
  favoritoContenidoController,
  agregarContenidoController,
  buscarAPI,
  obtenerHistorialPorUsuario,
  obtenerFavoritosPorUsuario,

} = require('../controllers/contenidoController');

// Verificación de conexión
router.get('/check-api', verificarConexionAPI);

// Búsquedas
router.get('/bContenido', buscarContenidoController);
router.get('/buscar', buscarAPI); 



// Agregar y marcar como favorito
router.post('/agregar', agregarContenidoController);
router.post('/favorito', favoritoContenidoController);
router.get('/favoritos/:id_usuario', obtenerFavoritosPorUsuario);
router.get('/historial/:id_usuario', obtenerHistorialPorUsuario);


module.exports = router;