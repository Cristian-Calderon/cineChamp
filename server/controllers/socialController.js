// controllers/socialController.js
const Amigos = require('../models/socialModel');


// =====================================================
// ENVIAR SOLICITUD
// =====================================================

async function enviarSolicitud(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { amigoId } = req.body;

    if (!amigoId) {
      return res.status(400).json({
        error: 'Falta el usuario destinatario'
      });
    }

    if (Number(usuarioId) === Number(amigoId)) {
      return res.status(400).json({
        error: 'No puedes enviarte una solicitud a ti mismo'
      });
    }

    const id = await Amigos.enviarSolicitud(usuarioId, amigoId);

    res.status(201).json({
      message: 'Solicitud enviada',
      id
    });

  } catch (error) {
    console.error('Error al enviar solicitud:', error);

    res.status(500).json({
      error: error.message
    });
  }
}


// =====================================================
// SOLICITUDES PENDIENTES
// =====================================================

async function obtenerSolicitudesPendientes(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const solicitudes =
      await Amigos.obtenerSolicitudesPendientes(usuarioId);

    res.json(solicitudes);

  } catch (error) {
    console.error(
      'Error al obtener solicitudes:',
      error
    );

    res.status(500).json({
      error: error.message
    });
  }
}


// =====================================================
// ACEPTAR SOLICITUD
// =====================================================

async function aceptarSolicitud(req, res) {
  try {
    const solicitudId = req.params.id;
    const usuarioId = req.usuario.id;

    const resultado =
      await Amigos.aceptarSolicitud(
        solicitudId,
        usuarioId
      );

    if (resultado === 0) {
      return res.status(404).json({
        error: 'Solicitud no encontrada'
      });
    }

    res.json({
      message: 'Solicitud aceptada'
    });

  } catch (error) {
    console.error(
      'Error al aceptar solicitud:',
      error
    );

    res.status(500).json({
      error: error.message
    });
  }
}


// =====================================================
// RECHAZAR SOLICITUD
// =====================================================

async function rechazarSolicitud(req, res) {
  try {
    const solicitudId = req.params.id;
    const usuarioId = req.usuario.id;

    const resultado =
      await Amigos.rechazarSolicitud(
        solicitudId,
        usuarioId
      );

    if (resultado === 0) {
      return res.status(404).json({
        error: 'Solicitud no encontrada'
      });
    }

    res.json({
      message: 'Solicitud rechazada'
    });

  } catch (error) {
    console.error(
      'Error al rechazar solicitud:',
      error
    );

    res.status(500).json({
      error: error.message
    });
  }
}


// =====================================================
// LISTA DE AMIGOS
// =====================================================

async function obtenerAmigos(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const amigos =
      await Amigos.obtenerAmigos(usuarioId);

    res.json(amigos);

  } catch (error) {
    console.error(
      'Error al obtener amigos:',
      error
    );

    res.status(500).json({
      error: error.message
    });
  }
}


// =====================================================
// ESTADO DE RELACIÓN
// =====================================================

async function estadoRelacion(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { amigoId } = req.query;

    if (!amigoId) {
      return res.status(400).json({
        error: 'Falta el amigoId'
      });
    }

    const estado =
      await Amigos.obtenerEstadoRelacion(
        usuarioId,
        amigoId
      );

    res.json({
      estado: estado || 'ninguno'
    });

  } catch (error) {
    console.error(
      'Error al obtener estado de relación:',
      error
    );

    res.status(500).json({
      error: error.message
    });
  }
}


// =====================================================
// ELIMINAR AMISTAD
// =====================================================

async function eliminarAmistad(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { amigoId } = req.body;

    if (!amigoId) {
      return res.status(400).json({
        error: 'Falta el amigoId'
      });
    }

    const resultado =
      await Amigos.eliminarAmistad(
        usuarioId,
        amigoId
      );

    if (resultado === 0) {
      return res.status(404).json({
        error: 'No se encontró la relación de amistad'
      });
    }

    res.json({
      message: 'Amistad eliminada correctamente'
    });

  } catch (error) {
    console.error(
      'Error al eliminar amistad:',
      error
    );

    res.status(500).json({
      error: error.message
    });
  }
}


// =====================================================
// CONTADOR DE AMIGOS
// =====================================================

async function contarAmigos(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const total =
      await Amigos.contarAmigos(usuarioId);

    res.json({
      total
    });

  } catch (error) {
    console.error(
      'Error al contar amigos:',
      error
    );

    res.status(500).json({
      error: error.message
    });
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
  contarAmigos
};