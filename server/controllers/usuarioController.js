const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');
const db = require('../models/db.js');

async function registrar(req, res) {
  try {
    const { nick, email, contraseña, avatar } = req.body;
    const hashed = await bcrypt.hash(contraseña, 10);
    const id = await Usuario.crearUsuario(nick, email, hashed, avatar);
    res.status(201).json({ message: 'Usuario creado', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, contraseña } = req.body;
    const user = await Usuario.obtenerUsuarioPorEmail(email);
    if (!user || !(await bcrypt.compare(contraseña, user.contraseña))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// Obtener usuario por ID
async function obtenerUsuario(req, res) {
  try {
    const { id } = req.params;
    const usuario = await Usuario.obtenerUsuarioPorId(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Actualizar usuario
async function actualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nick, email, avatar } = req.body;
    const actualizado = await Usuario.actualizarUsuario(id, nick, email, avatar);
    if (actualizado === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Eliminar usuario
async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.eliminarUsuario(id);
    if (eliminado === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener todos los usuarios (solo nick y email)
async function obtenerTodosLosUsuarios() {
  const [rows] = await db.query('SELECT nick, email FROM usuario');
  return rows;
}


module.exports = { registrar, login, eliminarUsuario,actualizarUsuario,obtenerUsuario,obtenerTodosLosUsuarios };
