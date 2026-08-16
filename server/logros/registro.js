const db = require('../models/db');

const logrosPorPosicion = [
  { id: 1, max: 10 },
  { id: 3, max: 100 },
  { id: 4, max: 250 },
  { id: 5, max: 600 },
  { id: 6, max: 1000 },
];

const evaluarLogrosRegistro = async (usuarioId) => {
  const [usuarios] = await db.query(`
    SELECT id
    FROM usuario
    ORDER BY created_at ASC
    LIMIT 1000
  `);

  const posicion = usuarios.findIndex(
    (usuario) => usuario.id === usuarioId
  );

  if (posicion === -1) {
    console.warn(
      `⚠️ Usuario ${usuarioId} no encontrado en el orden de registro`
    );
    return;
  }

  console.log(
    `📌 Usuario ${usuarioId} ocupa la posición ${posicion + 1}`
  );

  for (const logro of logrosPorPosicion) {
    if (posicion < logro.max) {
      const [yaTiene] = await db.query(
        `SELECT 1
         FROM usuario_logros
         WHERE usuario_id = ?
           AND logro_id = ?`,
        [usuarioId, logro.id]
      );

      if (yaTiene.length === 0) {
        await db.query(
          `INSERT INTO usuario_logros
           (usuario_id, logro_id)
           VALUES (?, ?)`,
          [usuarioId, logro.id]
        );

        console.log(
          `🏆 Logro desbloqueado: ID ${logro.id}`
        );
      }

      break;
    }
  }
};

module.exports = evaluarLogrosRegistro;