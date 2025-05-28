const db = require("../models/db");


const XP_POR_ACCION = {
  contenido: 30,
  favorito: 15,
  comentario: 40,
};

function calcularNivelPorXP(xp) {
  if (xp >= 1200) return 6;
  if (xp >= 800) return 5;
  if (xp >= 500) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
}

function getProgresoXP(xp) {
  const niveles = [
    { nivel: 1, xp: 0 },
    { nivel: 2, xp: 50 },
    { nivel: 3, xp: 100 },
    { nivel: 4, xp: 140 },
    { nivel: 5, xp: 150 },
    { nivel: 6, xp: 200 },
  ];
  const actual = niveles.findLast(n => xp >= n.xp);
  const siguiente = niveles.find(n => n.xp > xp);
  if (!siguiente) return 100;
  return Math.round(((xp - actual.xp) / (siguiente.xp - actual.xp)) * 100);
}

async function otorgarXP(id_usuario, tipoAccion) {
  const xp = XP_POR_ACCION[tipoAccion];
  if (!xp) return;

  await db.query(
    "UPDATE usuario SET experiencia = experiencia + ? WHERE id = ?",
    [xp, id_usuario]
  );
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
