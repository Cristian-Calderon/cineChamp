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
  calificarContenido,
  obtenerCalificacionesDelUsuario,
  obtenerDetallesCompletos,
  obtenerResenasPorContenido,
  eliminarContenidoController,
  marcarTemporadaVista,
  desmarcarTemporadaVista,
  obtenerDatosSeries,
  obtenerTemporadasVistas,
  eliminarFavoritoController
} = require('../controllers/contenidoController');




// Verificación de conexión
router.get('/check-api', verificarConexionAPI);

// Búsquedas
router.get('/bContenido', buscarContenidoController);
router.get('/buscar', buscarAPI); 



// Agregar y marcar como favorito
router.post('/agregar', agregarContenidoController);
router.post('/favorito', favoritoContenidoController);
router.delete('/favorito', eliminarFavoritoController);

router.get('/favoritos/:id_usuario', obtenerFavoritosPorUsuario);
router.get('/historial/:id_usuario', obtenerHistorialPorUsuario);


//para la calificacion y comentario
router.post('/calificar', calificarContenido);
router.get('/usuarios/:id_usuario/calificaciones', obtenerCalificacionesDelUsuario);


router.get("/detalles/:tipo/:id", obtenerDetallesCompletos);

router.get('/series/:id_api/tmdb/estructura-simple', obtenerDatosSeries);
router.post("/temporada/vista", marcarTemporadaVista);
router.delete("/temporada/vista", desmarcarTemporadaVista);
router.get('/temporadas-vistas/:id_usuario/:id_serie', obtenerTemporadasVistas);



router.get("/comentarios/:id_api", obtenerResenasPorContenido);

router.delete("/eliminar", eliminarContenidoController);


module.exports = router;