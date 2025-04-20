
const db = require('./db');

const crearUsuario = async (nick, email, contraseña, avatar) => {
  const [result] = await db.query(
    'INSERT INTO usuario (nick, email, contraseña, avatar) VALUES (?, ?, ?, ?)',
    [nick, email, contraseña, avatar]
  );
  return result.insertId;
};

const obtenerUsuarioPorEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM usuario WHERE email = ?',
    [email]
  );
  return rows[0];
};

const obtenerUsuarioPorId = async (id) => {
  const [rows] = await db.query(
    'SELECT id, nick, email, avatar FROM usuario WHERE id = ?',
    [id]
  );
  return rows[0];
};

const actualizarUsuario = async (id, nick, avatar) => {
  const campos = [];
  const valores = [];

  if (nick !== undefined && nick !== "") {
    campos.push("nick = ?");
    valores.push(nick);
  }

  if (avatar !== undefined && avatar !== "") {
    campos.push("avatar = ?");
    valores.push(avatar);
  }

  if (campos.length === 0) {
    // Nada que actualizar
    return 0;
  }

  const query = `UPDATE usuario SET ${campos.join(", ")} WHERE id = ?`;
  valores.push(id); // Agrega el ID al final

  const [result] = await db.query(query, valores);
  return result.affectedRows;
};
const eliminarUsuario = async (id) => {
  const [result] = await db.query('DELETE FROM usuario WHERE id = ?', [id]);
  return result.affectedRows;
};

const obtenerUsuarioPorNick = async (nick) => {
  const [rows] = await db.query(
    'SELECT id, nick, email, avatar FROM usuario WHERE nick = ?',
    [nick]
  );
  return rows[0];
};

module.exports = {
  crearUsuario,
  obtenerUsuarioPorEmail,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorNick
};