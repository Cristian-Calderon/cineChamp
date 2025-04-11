// controllers/logroController.js

const obtenerLogrosPorUsuario = async (req, res) => {
    const { username } = req.params;
  
    const [userRows] = await db.query("SELECT id FROM usuario WHERE username = ?", [username]);
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

// Asignar logro a un usuario si aún no lo tiene
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
  
  //------Nuevo ---//
  const verificarLogros = async (id_usuario) => {
    try {
      // Verificar si el usuario ya tiene el logro "Primer Favorito" (ej: ID 1)
      const [logrosActuales] = await db.query(
        'SELECT logro_id FROM usuario_logros WHERE usuario_id = ? AND logro_id = 1',
        [id_usuario]
      );
  
      // Si ya tiene el logro, no hacemos nada
      if (logrosActuales.length > 0) return;
  
      // Contar cuántos favoritos tiene
      const [favoritos] = await db.query(
        'SELECT COUNT(*) AS total FROM favoritos WHERE id_usuario = ?',
        [id_usuario]
      );
  
      const totalFavoritos = favoritos[0].total;
  
      // Si tiene al menos 1 favorito, desbloqueamos el logro
      if (totalFavoritos >= 1) {
        await db.query(
          'INSERT INTO usuario_logros (usuario_id, logro_id) VALUES (?, ?)',
          [id_usuario, 1] // 1 = ID del logro "Primer Favorito"
        );
        console.log(`🏆 Logro desbloqueado para usuario ${id_usuario}: Primer Favorito`);
      }
    } catch (error) {
      console.error("Error al verificar logros:", error);
    }
  };
  




  module.exports = {
    obtenerLogrosPorUsuario,
    asignarLogroSiNoExiste,
    verificarLogros
  };