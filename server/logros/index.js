const favoritos = require('./favoritos');
// const historial = require('./historial');
// const marvel = require('./marvel');
// ...otros archivos de logros

const todosLosLogros = [
  ...favoritos,
  // ...historial,
  // ...marvel,
];

const verificarLogros = async (usuarioId) => {
  for (const logro of todosLosLogros) {
    await logro.evaluar(usuarioId);
  }
};

module.exports = {
  verificarLogros
};