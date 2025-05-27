// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const upload = require("../utils/multerConfig");




router.post('/registro', upload.single('avatar'), UsuarioController.registrar);
router.post('/register', upload.single('avatar'), UsuarioController.registrar);
router.post('/login', UsuarioController.login);

// CRUD de usuarios
router.get('/nick/:nick', UsuarioController.obtenerUsuarioPorNick);
router.get('/buscar', UsuarioController.buscarUsuariosPorNick);
router.get('/:id', UsuarioController.obtenerUsuarioPorId);

// Actualización (con avatar opcional)
router.put('/:id', upload.single('avatar'), UsuarioController.actualizarUsuario);

// Contadores y calificaciones
router.get('/contador-calificaciones/:id', UsuarioController.contarCalificaciones);
router.get('/usuarios/:id_usuario/calificaciones', require('../controllers/contenidoController').obtenerCalificacionesDelUsuario);

module.exports = router;
