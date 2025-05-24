// controllers/amigosController.js
const Amigos = require('../models/socialModel');

async function enviarSolicitud(req, res) {
  const { usuarioId, amigoId } = req.body;
  try {
    const id = await Amigos.enviarSolicitud(usuarioId, amigoId);
    res.status(201).json({ message: 'Solicitud enviada', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerSolicitudesPendientes(req, res) {
  const { id } = req.params;
  try {
    const solicitudes = await Amigos.obtenerSolicitudesPendientes(id);
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function aceptarSolicitud(req, res) {
  const { id } = req.params;
  try {
    const resultado = await Amigos.aceptarSolicitud(id);
    if (resultado === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json({ message: 'Solicitud aceptada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function rechazarSolicitud(req, res) {
  const { id } = req.params;
  try {
    const resultado = await Amigos.rechazarSolicitud(id);
    if (resultado === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json({ message: 'Solicitud rechazada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerAmigos(req, res) {
  const { id } = req.params;
  try {
    const amigos = await Amigos.obtenerAmigos(id);
    res.json(amigos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function estadoRelacion(req, res) {
  const { usuarioId, amigoId } = req.query;
  try {
    const estado = await Amigos.obtenerEstadoRelacion(usuarioId, amigoId);
    res.json({ estado : estado || "ninguno" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// eliminarAmistad : calderon
async function eliminarAmistad(req, res) {
  const { usuarioId, amigoId } = req.body;
  try {
    const resultado = await Amigos.eliminarAmistad(usuarioId, amigoId);
    if (resultado === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró la relación de amistad" });
    }
    res.json({ message: "Amistad eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Contador de amigos:
async function contarAmigos(req, res) {
  const { id } = req.params;
  try {
    const total = await Amigos.contarAmigos(id);
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  enviarSolicitud,
  obtenerSolicitudesPendientes,
  aceptarSolicitud,
  rechazarSolicitud,
  obtenerAmigos,
  estadoRelacion,
  eliminarAmistad,
  contarAmigos,
};