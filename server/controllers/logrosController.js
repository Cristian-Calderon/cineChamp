const db = require('../models/db'); // Asegúrate de que la ruta sea correcta

const obtenerLogrosPorUsuario = async (req, res) => {
  const { username } = req.params;
  console.log(`🔍 Buscando logros del usuario: ${username}`);

  const [userRows] = await db.query("SELECT id FROM usuario WHERE nick = ?", [username]);
  if (userRows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

  const userId = userRows[0].id;

  const [rows] = await db.query(`
    SELECT l.*
    FROM usuario_logros ul
    JOIN logros l ON l.id = ul.logro_id
    WHERE ul.usuario_id = ?
  `, [userId]);

  console.log(`✅ Logros encontrados: ${rows.length} para el usuario ID ${userId}`);
  res.json(rows);
};

const asignarLogroSiNoExiste = async (req, res) => {
  const { username } = req.params;
  const { logroId } = req.body;

  const [[user]] = await db.query("SELECT id FROM usuario WHERE nick = ?", [username]);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const [existe] = await db.query(
    "SELECT * FROM usuario_logros WHERE usuario_id = ? AND logro_id = ?",
    [user.id, logroId]
  );

  if (existe.length > 0) {
    console.log(`ℹ️ Usuario ${user.id} ya tenía el logro ${logroId}`);
    return res.status(200).json({ message: "Ya tenía el logro" });
  }

  await db.query(
    "INSERT INTO usuario_logros (usuario_id, logro_id) VALUES (?, ?)",
    [user.id, logroId]
  );

  console.log(`🏅 Logro ${logroId} asignado al usuario ${user.id}`);
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

    if (posicion !== -1) {
      if (posicion < 10) await asignarLogro(id_usuario, 1);    // Fundadores
      else if (posicion < 100) await asignarLogro(id_usuario, 3); // Soñadores
      else if (posicion < 250) await asignarLogro(id_usuario, 4); // Creadores
      else if (posicion < 600) await asignarLogro(id_usuario, 5); // Suertudos
      else if (posicion < 1000) await asignarLogro(id_usuario, 6); // Unicos
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

    for (const logro of logrosPorVistas) {
      console.log(`📊 Evaluando logro ID ${logro.id} (mínimo ${logro.minimo})`);
      if (vistas >= logro.minimo) {
        await asignarLogro(id_usuario, logro.id);
      }
    }

    console.log(`✅ Verificación de logros completada para el usuario ${id_usuario}`);
  } catch (error) {
    console.error("❌ Error al verificar logros:", error);
  }
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


module.exports = {
  obtenerLogrosPorUsuario,
  asignarLogroSiNoExiste,
  verificarLogros,
  asignarLogro
};
