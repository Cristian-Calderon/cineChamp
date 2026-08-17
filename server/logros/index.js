const favoritos = require('./favoritos');
const evaluarLogrosHistorial = require('./historial');
const evaluarLogrosRegistro = require('./registro');

const todosLosLogros = [
  ...favoritos,
];

const verificarLogros = async (usuarioId) => {
  // ❤️ Logros de favoritos
  for (const logro of todosLosLogros) {
    await logro.evaluar(usuarioId);
  }

  // 🎬 Logros de películas vistas
  await evaluarLogrosHistorial(usuarioId);  

  // 👤 Logros según posición de registro
  await evaluarLogrosRegistro(usuarioId);
};

module.exports = {
  verificarLogros
};