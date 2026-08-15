const db = require('../models/db');

const logrosPorPeliculas = [
  { id: 8, minimo: 10 },
  { id: 9, minimo: 25 },
  { id: 10, minimo: 55 },
  { id: 11, minimo: 70 },
  { id: 12, minimo: 80 },
  { id: 16, minimo: 300 },
  { id: 17, minimo: 400 },
  { id: 18, minimo: 500 },
  { id: 19, minimo: 600 },
  { id: 20, minimo: 700 },
];

const evaluarLogrosHistorial = async (usuarioId) => {
  const [resultado] = await db.query(
    `SELECT COUNT(*) AS total
     FROM contenido_guardado
     WHERE id_usuario = ?
       AND tipo = 'pelicula'`,
    [usuarioId]
  );

  const peliculas = resultado[0].total;

  console.log(
    `🎬 Usuario ${usuarioId} tiene ${peliculas} películas en historial`
  );

  for (const logro of logrosPorPeliculas) {
    if (peliculas < logro.minimo) {
      continue;
    }

    const [yaTiene] = await db.query(
      `SELECT 1
       FROM usuario_logros
       WHERE usuario_id = ?
         AND logro_id = ?`,
      [usuarioId, logro.id]
    );

    if (yaTiene.length > 0) {
      continue;
    }

    await db.query(
      `INSERT INTO usuario_logros
       (usuario_id, logro_id)
       VALUES (?, ?)`,
      [usuarioId, logro.id]
    );

    console.log(
      `🏆 Logro desbloqueado: ID ${logro.id} (${peliculas} películas)`
    );
  }
};

module.exports = evaluarLogrosHistorial;