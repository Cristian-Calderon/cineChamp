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

const { obtenerNivelUsuario } = require('../controllers/nivelController');

const authMiddleware = require('../middleware/authMiddleware');
const sameUserMiddleware = require('../middleware/sameUserMiddleware');


// =====================================================
// RUTAS PÚBLICAS
// =====================================================

// Verificación de conexión con TMDB
router.get('/check-api', verificarConexionAPI);

// Búsquedas
router.get('/bContenido', buscarContenidoController);
router.get('/buscar', buscarAPI);

// Detalles de contenido
router.get('/detalles/:tipo/:id', obtenerDetallesCompletos);

// Estructura de series
router.get(
  '/series/:id_api/tmdb/estructura-simple',
  obtenerDatosSeries
);

// Comentarios/reseñas públicas
router.get(
  '/comentarios/:id_api',
  obtenerResenasPorContenido
);


// =====================================================
// RUTAS PROTEGIDAS
// =====================================================

// Agregar contenido al historial
router.post(
  '/agregar',
  authMiddleware,
  sameUserMiddleware,
  agregarContenidoController
);

// Añadir a favoritos
router.post(
  '/favorito',
  authMiddleware,
  sameUserMiddleware,
  favoritoContenidoController
);

// Eliminar de favoritos
router.delete(
  '/favorito',
  authMiddleware,
  eliminarFavoritoController
);

// Obtener favoritos
router.get(
  '/favoritos/:id_usuario',
  authMiddleware,
  obtenerFavoritosPorUsuario
);

// Obtener historial
router.get(
  '/historial/:id_usuario',
  authMiddleware,
  obtenerHistorialPorUsuario
);


// =====================================================
// CALIFICACIONES
// =====================================================

// Crear o modificar una calificación
router.post(
  '/calificar',
  authMiddleware,
  sameUserMiddleware,
  calificarContenido
);

// Obtener calificaciones de un usuario
router.get(
  '/usuarios/:id_usuario/calificaciones',
  obtenerCalificacionesDelUsuario
);


// =====================================================
// TEMPORADAS
// =====================================================

// Marcar temporada como vista
router.post(
  '/temporada/vista',
  authMiddleware,
  sameUserMiddleware,
  marcarTemporadaVista
);

// Desmarcar temporada como vista
router.delete(
  '/temporada/vista',
  authMiddleware,
  sameUserMiddleware,
  desmarcarTemporadaVista
);

// Obtener temporadas vistas
router.get(
  '/temporadas-vistas/:id_usuario/:id_serie',
  authMiddleware,
  sameUserMiddleware,
  obtenerTemporadasVistas
);


// =====================================================
// EXPERIENCIA / NIVEL
// =====================================================

router.get(
  '/xp/:id_usuario',
  authMiddleware,
  obtenerNivelUsuario
);


// =====================================================
// ELIMINAR CONTENIDO
// =====================================================

router.delete(
  '/eliminar',
  authMiddleware,
  sameUserMiddleware,
  eliminarContenidoController
);


module.exports = router;