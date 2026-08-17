// models/socialModel.js
const db = require('./db');


// =====================================================
// ENVIAR SOLICITUD
// =====================================================

const enviarSolicitud = async (usuarioId, amigoId) => {
  console.log("📩 Recibida solicitud de amistad:");
  console.log("➡️ Usuario que envía:", usuarioId);
  console.log("➡️ Usuario que recibe:", amigoId);

  const [rows] = await db.query(
    `SELECT *
     FROM amigos
     WHERE (usuario_id = ? AND amigo_id = ?)
        OR (usuario_id = ? AND amigo_id = ?)`,
    [usuarioId, amigoId, amigoId, usuarioId]
  );

  if (rows.length > 0) {
    throw new Error(
      "Ya existe una solicitud o amistad entre estos usuarios"
    );
  }

  const [result] = await db.query(
    `INSERT INTO amigos
     (usuario_id, amigo_id, estado)
     VALUES (?, ?, "pendiente")`,
    [usuarioId, amigoId]
  );

  return result.insertId;
};


// =====================================================
// SOLICITUDES PENDIENTES
// =====================================================

const obtenerSolicitudesPendientes = async (usuarioId) => {
  const [rows] = await db.query(
    `SELECT
       a.id,
       u.nick,
       u.avatar
     FROM amigos a
     JOIN usuario u ON a.usuario_id = u.id
     WHERE a.amigo_id = ?
       AND a.estado = 'pendiente'`,
    [usuarioId]
  );

  return rows;
};


// =====================================================
// ACEPTAR SOLICITUD
// =====================================================

const aceptarSolicitud = async (solicitudId, usuarioId) => {
  const [result] = await db.query(
    `UPDATE amigos
     SET estado = "aceptado"
     WHERE id = ?
       AND amigo_id = ?
       AND estado = "pendiente"`,
    [solicitudId, usuarioId]
  );

  return result.affectedRows;
};


// =====================================================
// RECHAZAR SOLICITUD
// =====================================================

const rechazarSolicitud = async (solicitudId, usuarioId) => {
  const [result] = await db.query(
    `UPDATE amigos
     SET estado = "rechazado"
     WHERE id = ?
       AND amigo_id = ?
       AND estado = "pendiente"`,
    [solicitudId, usuarioId]
  );

  return result.affectedRows;
};


// =====================================================
// LISTA DE AMIGOS
// =====================================================

const obtenerAmigos = async (usuarioId) => {
  const [rows] = await db.query(
    `SELECT
       u.id,
       u.nick,
       u.avatar
     FROM amigos a
     JOIN usuario u
       ON u.id = IF(
         a.usuario_id = ?,
         a.amigo_id,
         a.usuario_id
       )
     WHERE (
       a.usuario_id = ?
       OR a.amigo_id = ?
     )
     AND a.estado = 'aceptado'`,
    [usuarioId, usuarioId, usuarioId]
  );

  return rows;
};


// =====================================================
// ESTADO DE RELACIÓN
// =====================================================

const obtenerEstadoRelacion = async (usuarioId, amigoId) => {
  const [rows] = await db.query(
    `SELECT estado
     FROM amigos
     WHERE (usuario_id = ? AND amigo_id = ?)
        OR (usuario_id = ? AND amigo_id = ?)`,
    [usuarioId, amigoId, amigoId, usuarioId]
  );

  return rows[0]?.estado || null;
};


// =====================================================
// ELIMINAR AMISTAD
// =====================================================

const eliminarAmistad = async (usuarioId, amigoId) => {
  const [result] = await db.query(
    `DELETE FROM amigos
     WHERE (
       (usuario_id = ? AND amigo_id = ?)
       OR
       (usuario_id = ? AND amigo_id = ?)
     )
     AND estado = 'aceptado'`,
    [usuarioId, amigoId, amigoId, usuarioId]
  );

  return result.affectedRows;
};


// =====================================================
// CONTADOR DE AMIGOS
// =====================================================

const contarAmigos = async (usuarioId) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total
     FROM amigos
     WHERE (
       usuario_id = ?
       OR amigo_id = ?
     )
     AND estado = 'aceptado'`,
    [usuarioId, usuarioId]
  );

  return rows[0].total;
};


module.exports = {
  enviarSolicitud,
  obtenerSolicitudesPendientes,
  aceptarSolicitud,
  rechazarSolicitud,
  obtenerAmigos,
  obtenerEstadoRelacion,
  eliminarAmistad,
  contarAmigos
};