const sameUserMiddleware = (req, res, next) => {
  const idUsuario =
    req.body?.id_usuario ??
    req.params?.id_usuario;

  if (!idUsuario) {
    return res.status(400).json({
      error: 'Falta el id del usuario'
    });
  }

  if (Number(req.usuario.id) !== Number(idUsuario)) {
    return res.status(403).json({
      error: 'No tienes permiso para acceder a los datos de este usuario'
    });
  }

  next();
};

module.exports = sameUserMiddleware;