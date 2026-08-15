const db = require("../models/db");


const XP_POR_ACCION = {
  contenido: 30,
  favorito: 15,
  comentario: 40,
};

function calcularNivelPorXP(xp) {
  if (xp >= 1500) {
    return 7 + Math.floor((xp - 1500) / 500);
  }

  if (xp >= 1200) return 6;
  if (xp >= 700) return 5;
  if (xp >= 600) return 4;
  if (xp >= 450) return 3;
  if (xp >= 300) return 2;

  return 1;
}

function getProgresoXP(xp) {
  // Niveles iniciales
  if (xp < 1500) {
    const niveles = [
      { nivel: 1, xp: 0 },
      { nivel: 2, xp: 300 },
      { nivel: 3, xp: 450 },
      { nivel: 4, xp: 600 },
      { nivel: 5, xp: 700 },
      { nivel: 6, xp: 1200 },
      { nivel: 7, xp: 1500 }
    ];

    const actual = niveles.findLast(n => xp >= n.xp);
    const siguiente = niveles.find(n => n.xp > xp);

    if (!siguiente) return 100;

    return Math.round(
      ((xp - actual.xp) / (siguiente.xp - actual.xp)) * 100
    );
  }

  // Desde nivel 7 en adelante
  const nivel = calcularNivelPorXP(xp);

  const xpNivelActual = 1500 + (nivel - 7) * 500;
  const xpSiguienteNivel = xpNivelActual + 500;

  return Math.round(
    ((xp - xpNivelActual) /
      (xpSiguienteNivel - xpNivelActual)) * 100
  );
}

async function otorgarXP(id_usuario, tipoAccion, id_api, tipoContenido) {
  const xp = XP_POR_ACCION[tipoAccion];

  if (!xp || !id_usuario || !id_api || !tipoContenido) {
    return false;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT IGNORE INTO xp_recompensas
       (id_usuario, tipo_accion, id_api, tipo_contenido, xp)
       VALUES (?, ?, ?, ?, ?)`,
      [id_usuario, tipoAccion, id_api, tipoContenido, xp]
    );

    // Ya existía la recompensa: no damos XP otra vez.
    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.query(
      "UPDATE usuario SET experiencia = experiencia + ? WHERE id = ?",
      [xp, id_usuario]
    );

    await connection.commit();

    return true;
  } catch (error) {
    await connection.rollback();
    console.error("Error al otorgar XP:", error);
    throw error;
  } finally {
    connection.release();
  }
}
async function obtenerNivelUsuario(req, res) {
  const { id_usuario } = req.params;
  try {
    const [[usuario]] = await db.query(
      "SELECT experiencia FROM usuario WHERE id = ?",
      [id_usuario]
    );
    const experiencia = usuario?.experiencia || 0;
    const nivel = calcularNivelPorXP(experiencia);
    const progreso = getProgresoXP(experiencia);
    res.json({ experiencia, nivel, progreso });
  } catch (err) {
    console.error("Error al obtener nivel:", err);
    res.status(500).json({ error: "Error interno" });
  }
}

module.exports = {
  otorgarXP,
  obtenerNivelUsuario,
};
