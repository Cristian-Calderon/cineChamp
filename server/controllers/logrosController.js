const db = require('../models/db'); 

const obtenerUsuarioPorNick = async (nick) => {
  const [[user]] = await db.query("SELECT id FROM usuario WHERE nick = ?", [nick]);
  return user || null;
};

const asignarLogro = async (usuarioId, logroId) => {
  const [existe] = await db.query(
    'SELECT 1 FROM usuario_logros WHERE usuario_id = ? AND logro_id = ?',
    [usuarioId, logroId]
  );
  if (existe.length === 0) {
    await db.query(
      'INSERT INTO usuario_logros (usuario_id, logro_id) VALUES (?, ?)',
      [usuarioId, logroId]
    );
    console.log(`🏆 [LOGRO ASIGNADO] Usuario ${usuarioId} → Logro ${logroId}`);
  } else {
    console.log(`🔁 Usuario ${usuarioId} ya tiene el logro ${logroId}, no se vuelve a asignar.`);
  }
};

const asignarLogrosPorMinimo = async (usuarioId, cantidad, reglas) => {
  for (const { id, minimo } of reglas) {
    if (cantidad >= minimo) {
      await asignarLogro(usuarioId, id);
    }
  }
};

const obtenerLogrosPorUsuario = async (req, res) => {
  const { username } = req.params;
  console.log(`🔍 Buscando logros del usuario: ${username}`);

  const user = await obtenerUsuarioPorNick(username);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const [rows] = await db.query(`
    SELECT l.*
    FROM usuario_logros ul
    JOIN logros l ON l.id = ul.logro_id
    WHERE ul.usuario_id = ?
  `, [user.id]);

  console.log(`✅ Logros encontrados: ${rows.length} para el usuario ID ${user.id}`);
  res.json(rows);
};

const asignarLogroSiNoExiste = async (req, res) => {
  const { username } = req.params;
  const { logroId } = req.body;

  const user = await obtenerUsuarioPorNick(username);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  await asignarLogro(user.id, logroId);
  res.status(201).json({ message: "¡Logro desbloqueado!" });
};

const verificarLogros = async (id_usuario) => {
  console.log(`🚀 Iniciando verificación de logros para el usuario ${id_usuario}`);
  try {
    const [usuarios] = await db.query(`
      SELECT id FROM usuario ORDER BY created_at ASC LIMIT 1000
    `);

    const posicion = usuarios.findIndex(u => u.id === id_usuario);
    console.log(`📌 Posición en orden de registro: ${posicion}`);

    const logrosPorPosicion = [
      { id: 1, max: 10 },
      { id: 3, max: 100 },
      { id: 4, max: 250 },
      { id: 5, max: 600 },
      { id: 6, max: 1000 },
    ];

    for (const logro of logrosPorPosicion) {
      if (posicion < logro.max) {
        await asignarLogro(id_usuario, logro.id);
        break;
      }
    }

    const [vistasResult] = await db.query(
      "SELECT COUNT(*) AS total FROM contenido_guardado WHERE id_usuario = ? AND tipo = 'pelicula'",
      [id_usuario]
    );

    const vistas = vistasResult[0].total;
    console.log(`🎞️ Películas vistas por el usuario ${id_usuario}: ${vistas}`);

    const logrosPorVistas = [
      { id: 9, minimo: 25 },
      { id: 10, minimo: 55 },
      { id: 11, minimo: 70 },
      { id: 12, minimo: 80 },
      { id: 16, minimo: 90 },
      { id: 17, minimo: 400 },
      { id: 18, minimo: 500 },
      { id: 19, minimo: 600 },
      { id: 20, minimo: 700 },
    ];

    await asignarLogrosPorMinimo(id_usuario, vistas, logrosPorVistas);

    console.log(`✅ Verificación de logros completada para el usuario ${id_usuario}`);
  } catch (error) {
    console.error("❌ Error al verificar logros:", error);
  }
};

module.exports = {
  obtenerLogrosPorUsuario,
  asignarLogroSiNoExiste,
  verificarLogros,
  asignarLogro
};
