const express = require('express');
const router = express.Router();
const {
  obtenerLogrosPorUsuario,
  asignarLogroSiNoExiste
} = require('../controllers/logrosController');

router.get('/:username', obtenerLogrosPorUsuario);
router.post('/:username', asignarLogroSiNoExiste);

module.exports = router;
