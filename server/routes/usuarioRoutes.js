// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

// Registro y login
router.post('/register', UsuarioController.registrar);
router.post('/login', UsuarioController.login);

// CRUD de usuarios
router.get('/', UsuarioController.obtenerTodosLosUsuarios);
router.get('/:id', UsuarioController.obtenerUsuario);
router.put('/:id', UsuarioController.actualizarUsuario);
router.delete('/:id', UsuarioController.eliminarUsuario);

module.exports = router;
