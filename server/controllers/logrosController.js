const db = require('../models/db'); // O el path correcto a tu conexión

const obtenerLogrosPorUsuario = async (req, res) => {
  const { username } = req.params; // probablemente deberías llamarlo 'nick'

  const [userRows] = await db.query("SELECT id FROM usuario WHERE nick = ?", [username]);
  if (userRows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

  const userId = userRows[0].id;

  const [rows] = await db.query(`
    SELECT l.*
    FROM usuario_logros ul
    JOIN logros l ON l.id = ul.logro_id
    WHERE ul.usuario_id = ?
  `, [userId]);

  res.json(rows);
};

const asignarLogroSiNoExiste = async (req, res) => {
  const { username } = req.params;
  const { logroId } = req.body;

  const [[user]] = await db.query("SELECT id FROM usuario WHERE username = ?", [username]);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const [existe] = await db.query(
    "SELECT * FROM usuario_logros WHERE usuario_id = ? AND logro_id = ?",
    [user.id, logroId]
  );

  if (existe.length > 0) {
    return res.status(200).json({ message: "Ya tenía el logro" });
  }

  await db.query(
    "INSERT INTO usuario_logros (usuario_id, logro_id) VALUES (?, ?)",
    [user.id, logroId]
  );

  res.status(201).json({ message: "¡Logro desbloqueado!" });
};

const verificarLogros = async (id_usuario) => {
  try {
    // ---------- 1. Logros por ORDEN DE REGISTRO ----------
    const [usuarios] = await db.query(`
      SELECT id FROM usuario ORDER BY created_at ASC LIMIT 1000
    `);

    const posicion = usuarios.findIndex(u => u.id === id_usuario);

    if (posicion !== -1) {
      if (posicion < 10) await asignarLogro(id_usuario, 1);    // Fundadores
      else if (posicion < 100) await asignarLogro(id_usuario, 3); // Soñadores
      else if (posicion < 250) await asignarLogro(id_usuario, 4); // Creadores
      else if (posicion < 600) await asignarLogro(id_usuario, 5); // Suertudos
      else if (posicion < 1000) await asignarLogro(id_usuario, 6); // Unicos
    }

    // ---------- 2. Logros por PELÍCULAS VISTAS ----------
    const [vistasResult] = await db.query(
      "SELECT COUNT(*) AS total FROM contenido_guardado WHERE id_usuario = ? AND tipo = 'pelicula'",
      [id_usuario]
    );

    const vistas = vistasResult[0].total;
    console.log(`🎞️ Películas vistas por el usuario ${id_usuario}: ${vistas}`);
    const logrosPorVistas = [
      { id: 9, minimo: 25 },   // Entendido
      { id: 10, minimo: 55 }, // El Bicho
      { id: 11, minimo: 150 }, // Soldado Oscuro
      { id: 12, minimo: 200 }, // Me gusta el cine
      { id: 16, minimo: 300 }, // No puedo parar
      { id: 17, minimo: 400 }, // No veo la luz
      { id: 18, minimo: 500 }, // Necesito ver más
      { id: 19, minimo: 600 }, // Indomable
      { id: 20, minimo: 700 }, // Freak
    ];

    for (const logro of logrosPorVistas) {
      if (vistas >= logro.minimo) {
        await asignarLogro(id_usuario, logro.id);
      }
    }
    console.log(`🎞️ Películas vistas por el usuario ${id_usuario}: ${vistas}`);
  } catch (error) {
    console.error("Error al verificar logros:", error);
  }
};

// Función auxiliar para asignar logro si no lo tiene
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
    console.log(`🏆 Logro asignado [logro_id=${logroId}] al usuario [id=${usuarioId}]`);
  }
};


module.exports = {
  obtenerLogrosPorUsuario,
  asignarLogroSiNoExiste,
  verificarLogros,
  asignarLogro
};
