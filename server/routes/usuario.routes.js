const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');

router.post('/register', UsuarioController.registrar);
router.post('/login', UsuarioController.login);

module.exports = router;
