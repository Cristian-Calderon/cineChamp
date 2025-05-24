// controllers/usuarioController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');
const db = require('../models/db');
require('dotenv').config();
const { asignarLogro } = require('./logrosController'); // ajusta ruta si está en otra carpeta


async function registrar(req, res) {
  try {
    const { nick, email, contraseña } = req.body;
    const hashed = await bcrypt.hash(contraseña, 10);

    // Si hay imagen, guarda la ruta; si no, deja null o string vacío
    const avatar = req.file ? "/uploads/" + req.file.filename : null;

    const id = await Usuario.crearUsuario(nick, email, hashed, avatar);

    await asignarLogro(id, 21); // ejemplo: logro por registrarse

    res.status(201).json({ message: "Usuario creado", id });
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
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    // Enviamos el toker y enviamos el id
    res.json({
      token,
      nick: user.nick,
      id: user.id,
      avatar: user.avatar || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nick } = req.body;

    // avatar puede venir como nuevo archivo o como URL del frontend
    const avatar = req.file ? "/uploads/" + req.file.filename : req.body.avatar || null;

    const actualizado = await Usuario.actualizarUsuario(id, nick, avatar);

    if (actualizado === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function obtenerUsuarioPorId(req, res) {
  try {
    const { id } = req.params;
    const usuario = await Usuario.obtenerUsuarioPorId(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// parte de buscdor de usuarios




/**async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.eliminarUsuario(id);
    if (eliminado === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}*/


// usuarioController.js
async function obtenerUsuarioPorNick(req, res) {
  try {
    const { nick } = req.params;
    const user = await Usuario.obtenerUsuarioPorNick(nick);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function buscarUsuariosPorNick(req, res) {
  const { nick, userId } = req.query;
  if (!nick) return res.status(400).json({ error: "Falta el nick" });

  try {
    const [rows] = await db.query(
      'SELECT id, nick, avatar FROM usuario WHERE nick LIKE ? AND id != ?',
      [`%${nick}%`, userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Cantidad de calificaciones:
async function contarCalificaciones(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM calificacion WHERE id_usuario = ?",
      [id]
    );
    res.json({ total: rows[0].total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  registrar,
  login,
  buscarUsuariosPorNick,
  actualizarUsuario,
  obtenerUsuarioPorNick,
  obtenerUsuarioPorId,
  contarCalificaciones,
  
};