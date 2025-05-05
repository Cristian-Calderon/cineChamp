const db = require('../models/db');

const logroPrimerFavorito = {
  id: 1,
  async evaluar(usuarioId) {
    const [yaTiene] = await db.query(
      'SELECT * FROM usuario_logros WHERE usuario_id = ? AND logro_id = ?',
      [usuarioId, this.id]
    );
    if (yaTiene.length > 0) return;

    const [count] = await db.query(
      'SELECT COUNT(*) AS total FROM favoritos WHERE id_usuario = ?',
      [usuarioId]
    );
    if (count[0].total >= 1) {
      await db.query(
        'INSERT INTO usuario_logros (usuario_id, logro_id) VALUES (?, ?)',
        [usuarioId, this.id]
      );
      console.log('🏆 Logro desbloqueado: Primer Favorito');
    }
  }
};

const logro5Favoritos = {
  id: 21,
  async evaluar(usuarioId) {
    const [yaTiene] = await db.query(
      'SELECT * FROM usuario_logros WHERE usuario_id = ? AND logro_id = ?',
      [usuarioId, this.id]
    );
    if (yaTiene.length > 0) return;

    const [count] = await db.query(
      'SELECT COUNT(*) AS total FROM favoritos WHERE id_usuario = ?',
      [usuarioId]
    );
    if (count[0].total >= 5) {
      await db.query(
        'INSERT INTO usuario_logros (usuario_id, logro_id) VALUES (?, ?)',
        [usuarioId, this.id]
      );
      console.log('🏆 Logro desbloqueado: 5 Favoritos');
    }
  }
};

module.exports = [logroPrimerFavorito, logro5Favoritos];
