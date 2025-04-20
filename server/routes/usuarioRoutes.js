// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

// Registro y login
router.post('/register', UsuarioController.registrar);
router.post('/login', UsuarioController.login);

// CRUD de usuarios

router.get('/nick/:nick', UsuarioController.obtenerUsuarioPorNick);

router.put('/:id', UsuarioController.actualizarUsuario);
router.get("/usuarios/buscar", UsuarioController.buscarUsuariosPorNick);

module.exports = router;