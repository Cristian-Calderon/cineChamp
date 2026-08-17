const express = require('express');
const router = express.Router();

const amigosController = require('../controllers/socialController');
const authMiddleware = require('../middleware/authMiddleware');


// =====================================================
// AMISTADES
// =====================================================

// Enviar solicitud
router.post(
  '/solicitud',
  authMiddleware,
  amigosController.enviarSolicitud
);

// Solicitudes pendientes del usuario autenticado
router.get(
  '/solicitudes/:id',
  authMiddleware,
  amigosController.obtenerSolicitudesPendientes
);

// Aceptar solicitud
router.post(
  '/solicitud/:id/aceptar',
  authMiddleware,
  amigosController.aceptarSolicitud
);

// Rechazar solicitud
router.post(
  '/solicitud/:id/rechazar',
  authMiddleware,
  amigosController.rechazarSolicitud
);

// Lista de amigos
router.get(
  '/lista/:id',
  authMiddleware,
  amigosController.obtenerAmigos
);

// Estado de relación
router.get(
  '/estado',
  authMiddleware,
  amigosController.estadoRelacion
);

// Contador de amigos
router.get(
  '/contador/:id',
  authMiddleware,
  amigosController.contarAmigos
);

// Eliminar amistad
router.post(
  '/eliminar',
  authMiddleware,
  amigosController.eliminarAmistad
);


module.exports = router;