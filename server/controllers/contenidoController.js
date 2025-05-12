const { buscarContenido } = require('../models/contenidoModel');
const { obtenerDetallesPorId, buscarSeries } = require('../models/apiUsuarioModel');
const { verificarLogros } = require('../logros');
const db = require('../models/db');
const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const buscarAPI = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Falta el parámetro de búsqueda' });

  const resultados = await buscarContenido(query);
  res.json(resultados);
};

const verificarConexionAPI = async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/550?api_key=${API_KEY}`);
    const data = await response.json();
    if (data && data.id) {
      res.send('✅ Conectado a TMDB API: ' + data.title);
    } else {
      res.status(500).send('❌ Falló la conexión con la API');
    }
  } catch (error) {
    console.error('❌ Error conectando a TMDB:', error);
    res.status(500).send('❌ No se pudo conectar a TMDB API');
  }
};

const buscarContenidoController = async (req, res) => {
  const query = req.query.q;

  try {
    const peliculas = await buscarContenido(query);
    const series = await buscarSeries(query);
    const resultados = [...peliculas, ...series];
    res.json(resultados);
  } catch (error) {
    console.error("Error al buscar contenido:", error);
    res.status(500).json({ error: "Error al buscar contenido" });
  }
};

const agregarContenidoController = async (req, res) => {
  const { id_usuario, id_api } = req.body;
  console.log("📩 Datos recibidos en agregarContenidoController:", { id_usuario, id_api });

  if (!id_usuario || !id_api) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    let data = await obtenerDetallesPorId(id_api, 'movie');
    let tipo = 'pelicula';

    if (!data || data.success === false) {
      data = await obtenerDetallesPorId(id_api, 'tv');
      tipo = 'serie';
    }

    if (!data || data.success === false) {
      return res.status(404).json({ error: 'Contenido no encontrado en TMDB' });
    }

    const [result] = await db.query(
      'INSERT IGNORE INTO contenido_guardado (id_usuario, id_api, tipo) VALUES (?, ?, ?)',
      [id_usuario, id_api, tipo]
    );

    let id_contenidoGuardado = result.insertId;

    if (!id_contenidoGuardado) {
      const [rows] = await db.query(
        'SELECT id FROM contenido_guardado WHERE id_usuario = ? AND id_api = ?',
        [id_usuario, id_api]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No se encontró contenido_guardado existente' });
      }
      id_contenidoGuardado = rows[0].id;
    }

    await verificarLogros(id_usuario);

    res.status(201).json({
      message: `${tipo === 'pelicula' ? 'Película' : 'Serie'} agregada correctamente.`,
      id_contenidoGuardado,
    });
  } catch (error) {
    console.error('❌ Error al agregar contenido:', error);
    res.status(500).json({ error: 'Error interno al guardar contenido' });
  }
};

const favoritoContenidoController = async (req, res) => {
  const { id_usuario, id_tmdb } = req.body;
  console.log("📩 Datos recibidos en favoritoContenidoController:", { id_usuario, id_tmdb });

  if (!id_usuario || !id_tmdb) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    let data = await obtenerDetallesPorId(id_tmdb, 'movie');
    let tipo = 'pelicula';

    if (!data || data.success === false) {
      data = await obtenerDetallesPorId(id_tmdb, 'tv');
      tipo = 'serie';
    }

    if (!data || data.success === false) {
      return res.status(404).json({ error: 'Contenido no encontrado en TMDB' });
    }

    const titulo = data.title || data.name;

    await db.query(
      'INSERT IGNORE INTO favoritos (id_usuario, id_tmdb, titulo) VALUES (?, ?, ?)',
      [id_usuario, id_tmdb, titulo]
    );

    await verificarLogros(id_usuario);

    res.status(201).json({ message: `${tipo === 'pelicula' ? 'Película' : 'Serie'} marcada como favorita: ${titulo}` });
  } catch (error) {
    console.error('Error al marcar favorito:', error);
    res.status(500).json({ error: 'Error interno al guardar favorito' });
  }
};

const obtenerFavoritosPorUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const [favoritos] = await db.query(
      'SELECT id_tmdb FROM favoritos WHERE id_usuario = ?',
      [id_usuario]
    );

    const resultados = await Promise.all(
      favoritos.map(async ({ id_tmdb }) => {
        let data = await obtenerDetallesPorId(id_tmdb, 'movie');
        let tipo = 'movie';

        if (!data || data.success === false) {
          data = await obtenerDetallesPorId(id_tmdb, 'tv');
          tipo = 'tv';
        }

        return {
          id: id_tmdb,
          title: data?.title || data?.name,
          posterUrl: `https://image.tmdb.org/t/p/w500${data?.poster_path}`,
          media_type: tipo
        };
      })
    );

    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

const obtenerHistorialPorUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const [historial] = await db.query(
      'SELECT id, id_api, tipo FROM contenido_guardado WHERE id_usuario = ?',
      [id_usuario]
    );

    const resultados = await Promise.all(
      historial.map(async ({ id, id_api, tipo }) => {
        const data = await obtenerDetallesPorId(id_api, tipo === 'pelicula' ? 'movie' : 'tv');
        return {
          id: id_api,
          id_contenidoGuardado: id,
          title: data?.title || data?.name,
          posterUrl: `https://image.tmdb.org/t/p/w500${data?.poster_path}`,
          media_type: tipo === 'pelicula' ? 'movie' : 'tv'
        };
      })
    );

    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

const calificarContenido = async (req, res) => {
  const { id_usuario, id_api, tipo, puntuacion, comentario } = req.body;
  console.log("📩 Body recibido en /calificar:", req.body);

  if (!id_usuario || !id_api || !tipo || !puntuacion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  if (puntuacion < 1 || puntuacion > 10) {
    return res.status(400).json({ error: 'La puntuación debe estar entre 1 y 10' });
  }

  try {
    await db.query(
      'INSERT INTO calificacion (id_usuario, id_api, tipo, puntuacion, comentario) VALUES (?, ?, ?, ?, ?)',
      [id_usuario, id_api, tipo, puntuacion, comentario || null]
    );

    res.status(201).json({ message: '✅ Calificación guardada correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar calificación:', error);
    res.status(500).json({ error: 'Error interno al guardar la calificación' });
  }
};





const obtenerCalificacionesDelUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const [calificaciones] = await db.query(
      'SELECT id_api, tipo, puntuacion, comentario FROM calificacion WHERE id_usuario = ?',
      [id_usuario]
    );

    const resultados = await Promise.all(
      calificaciones.map(async ({ id_api, tipo, puntuacion, comentario }) => {
        const data = await obtenerDetallesPorId(id_api, tipo === 'pelicula' ? 'movie' : 'tv');

        return {
          id: id_api,
          title: data?.title || data?.name,
          posterUrl: data?.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : null,
          media_type: tipo === 'pelicula' ? 'movie' : 'tv',
          puntuacion,
          comentario
        };
      })
    );

    res.json(resultados);
  } catch (error) {
    console.error('❌ Error al obtener calificaciones del usuario:', error);
    res.status(500).json({ error: 'Error interno al obtener calificaciones' });
  }
};






module.exports = {
  buscarAPI,
  verificarConexionAPI,
  buscarContenidoController,
  favoritoContenidoController,
  agregarContenidoController,
  obtenerHistorialPorUsuario,
  obtenerFavoritosPorUsuario,
  calificarContenido,
  obtenerCalificacionesDelUsuario
};
