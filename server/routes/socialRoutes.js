// routes/amigosRoutes.js
const express = require('express');
const router = express.Router();
const amigosController = require('../controllers/socialController');

router.post('/solicitud', amigosController.enviarSolicitud);
router.get('/solicitudes/:id', amigosController.obtenerSolicitudesPendientes);
router.post('/solicitud/:id/aceptar', amigosController.aceptarSolicitud);
router.post('/solicitud/:id/rechazar', amigosController.rechazarSolicitud);
router.get('/lista/:id', amigosController.obtenerAmigos);
router.get('/estado', amigosController.estadoRelacion);

router.post('/eliminar', amigosController.eliminarAmistad);


module.exports = router;
