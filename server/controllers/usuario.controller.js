const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

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

module.exports = { registrar, login };
