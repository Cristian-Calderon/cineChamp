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

module.exports = { crearUsuario, obtenerUsuarioPorEmail };
