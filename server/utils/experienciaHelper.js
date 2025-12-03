const db = require('../models/db');

/**
 * Agrega experiencia a un usuario
 * @param {number} idUsuario - ID del usuario
 * @param {number} cantidad - Cantidad de XP a agregar
 * @returns {Promise<number>} - Nueva cantidad de XP total
 */
async function agregarExperiencia(idUsuario, cantidad) {
  try {
    // Obtener XP actual
    const [rows] = await db.query(
      'SELECT experiencia FROM usuario WHERE id = ?',
      [idUsuario]
    );

    if (rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const xpActual = rows[0].experiencia || 0;
    const nuevoXP = xpActual + cantidad;

    // Actualizar XP
    await db.query(
      'UPDATE usuario SET experiencia = ? WHERE id = ?',
      [nuevoXP, idUsuario]
    );

    console.log(`✨ Usuario ${idUsuario}: +${cantidad} XP (Total: ${nuevoXP})`);
    return nuevoXP;
  } catch (error) {
    console.error('Error al agregar experiencia:', error);
    throw error;
  }
}

/**
 * Recompensas de XP por acción
 */
const RECOMPENSAS_XP = {
  CALIFICAR_CONTENIDO: 10,
  AGREGAR_HISTORIAL: 5,
  AGREGAR_FAVORITO: 3,
  COMPLETAR_LOGRO: 20,
  TEMPORADA_VISTA: 15,
};

module.exports = {
  agregarExperiencia,
  RECOMPENSAS_XP
};
