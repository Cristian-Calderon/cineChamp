// Importa una conexion a la base de datos desde un modulo db.
const db = require('./db');


// Funcion asincrona para crear un nuevo usuario en la base de datos.
async function crearUsuario(nick, email, passwordHash, avatar) {
  const [result] = await db.query(
    'INSERT INTO usuario (nick, email, contraseña, avatar) VALUES (?, ?, ?, ?)',
    [nick, email, passwordHash, avatar]
  );
  return result.insertId;
}

// Funcion para buscar un usuario por email.
async function obtenerUsuarioPorEmail(email) {
  const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
  return rows[0];
}

// Obtener usuario por ID
async function obtenerUsuarioPorId(id) {
  const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
  return rows[0];
}

async function eliminarUsuario(id) {
  const [result] = await db.query('DELETE FROM usuario WHERE id = ?', [id]);
  return result.affectedRows;
}

// Actualizar usuario
async function actualizarUsuario(id, nick, email, avatar) {
  const [result] = await db.query(
    'UPDATE usuario SET nick = ?, email = ?, avatar = ? WHERE id = ?',
    [nick, email, avatar, id]
  );
  return result.affectedRows;
}

// Obtener todos los usuarios (solo nick y email)
async function obtenerTodosLosUsuarios() {
  const [rows] = await db.query('SELECT nick, email FROM usuario');
  return rows;
}


module.exports = { crearUsuario, obtenerUsuarioPorEmail,actualizarUsuario,eliminarUsuario,obtenerUsuarioPorId };
