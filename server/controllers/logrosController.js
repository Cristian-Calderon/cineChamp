const db = require('../models/db');

const obtenerUsuarioPorNick = async (nick) => {
  const [[user]] = await db.query(
    "SELECT id FROM usuario WHERE nick = ?",
    [nick]
  );

  return user || null;
};

const asignarLogro = async (usuarioId, logroId) => {
  const [existe] = await db.query(
    `SELECT 1
     FROM usuario_logros
     WHERE usuario_id = ?
       AND logro_id = ?`,
    [usuarioId, logroId]
  );

  if (existe.length === 0) {
    await db.query(
      `INSERT INTO usuario_logros
       (usuario_id, logro_id)
       VALUES (?, ?)`,
      [usuarioId, logroId]
    );

    console.log(
      `🏆 [LOGRO ASIGNADO] Usuario ${usuarioId} → Logro ${logroId}`
    );
  } else {
    console.log(
      `🔁 Usuario ${usuarioId} ya tiene el logro ${logroId}`
    );
  }
};

const obtenerLogrosPorUsuario = async (req, res) => {
  try {
    const { username } = req.params;

    console.log(`🔍 Buscando logros del usuario: ${username}`);

    const user = await obtenerUsuarioPorNick(username);

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    const [rows] = await db.query(`
      SELECT l.*
      FROM usuario_logros ul
      JOIN logros l ON l.id = ul.logro_id
      WHERE ul.usuario_id = ?
      ORDER BY l.id
    `, [user.id]);

    console.log(
      `✅ Logros encontrados: ${rows.length} para el usuario ID ${user.id}`
    );

    res.json(rows);

  } catch (error) {
    console.error("❌ Error al obtener logros:", error);

    res.status(500).json({
      error: "Error interno al obtener los logros"
    });
  }
};

const asignarLogroSiNoExiste = async (req, res) => {
  try {
    const { username } = req.params;
    const { logroId } = req.body;

    const user = await obtenerUsuarioPorNick(username);

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    await asignarLogro(user.id, logroId);

    res.status(201).json({
      message: "¡Logro desbloqueado!"
    });

  } catch (error) {
    console.error("❌ Error al asignar logro:", error);

    res.status(500).json({
      error: "Error interno al asignar el logro"
    });
  }
};

module.exports = {
  obtenerLogrosPorUsuario,
  asignarLogroSiNoExiste,
  asignarLogro
};