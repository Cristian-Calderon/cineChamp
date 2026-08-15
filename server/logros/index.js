const favoritos = require('./favoritos');
const evaluarLogrosHistorial = require('./historial');

const todosLosLogros = [
  ...favoritos,
];

const verificarLogros = async (usuarioId) => {
  // Logros basados en favoritos
  for (const logro of todosLosLogros) {
    await logro.evaluar(usuarioId);
  }

  // Logros basados en películas vistas
  await evaluarLogrosHistorial(usuarioId);
};

module.exports = {
  verificarLogros
};