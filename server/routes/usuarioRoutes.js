const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');


// Registro y login
router.post('/register', UsuarioController.registrar);
router.post('/login', UsuarioController.login);

// GET /usuarios/
router.get('/', async (req, res) => {
    try {
      const usuarios = await UsuarioController.obtenerTodosLosUsuarios();
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  });

// Operaciones CRUD, 
router.get('/:id', UsuarioController.obtenerUsuario);
router.put('/:id', UsuarioController.actualizarUsuario);
router.delete('/:id', UsuarioController.eliminarUsuario);

module.exports = router;
