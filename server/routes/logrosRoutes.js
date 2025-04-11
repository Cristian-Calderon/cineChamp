const express = require('express');
const router = express.Router();
const {
  obtenerLogrosPorUsuario,
  asignarLogroSiNoExiste
} = require('../controllers/logrosController');

// Obtener logros desbloqueados
router.get('/usuario/:username/logros', obtenerLogrosPorUsuario);

// Desbloquear un logro
router.post('/usuario/:username/logros', asignarLogroSiNoExiste);




module.exports = router;
