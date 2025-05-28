const { buscarContenido } = require('../models/contenidoModel');
const { obtenerDetallesPorId, buscarSeries } = require('../models/apiUsuarioModel');
const { verificarLogros } = require('../logros');
const { otorgarXP } = require('./nivelController');

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

  await otorgarXP(id_usuario, 'favorito');

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
  await otorgarXP(id_usuario, 'favorito');

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


const eliminarFavoritoController = async (req, res) => {
  const { id_usuario, id_tmdb } = req.body;

  if (!id_usuario || !id_tmdb) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    await db.query(
      'DELETE FROM favoritos WHERE id_usuario = ? AND id_tmdb = ?',
      [id_usuario, id_tmdb]
    );
    res.json({ message: '❌ Eliminado de favoritos' });
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    res.status(500).json({ error: 'Error interno al eliminar favorito' });
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

  if (comentario) {
  await otorgarXP(id_usuario, 'comentario');
}
  
  
  if (!id_usuario || !id_api || !tipo || !puntuacion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  if (puntuacion < 1 || puntuacion > 10) {
    return res.status(400).json({ error: 'La puntuación debe estar entre 1 y 10' });
  }

  try {
    // ¿Ya existe una calificación?
    const [existe] = await db.query(
      'SELECT * FROM calificacion WHERE id_usuario = ? AND id_api = ? AND tipo = ?',
      [id_usuario, id_api, tipo]
    );

    if (existe.length > 0) {
      // Si existe, actualiza solo el comentario
      await db.query(
        'UPDATE calificacion SET comentario = ? WHERE id_usuario = ? AND id_api = ? AND tipo = ?',
        [comentario || null, id_usuario, id_api, tipo]
      );
      return res.status(200).json({ message: '✏️ Comentario actualizado' });
    } else {
      // Si no existe, inserta
      await db.query(
        'INSERT INTO calificacion (id_usuario, id_api, tipo, puntuacion, comentario) VALUES (?, ?, ?, ?, ?)',
        [id_usuario, id_api, tipo, puntuacion, comentario || null]
      );
      return res.status(201).json({ message: '✅ Calificación creada correctamente' });
    }
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

const obtenerDetallesCompletos = async (req, res) => {
  const { tipo, id } = req.params;

  try {
    const data = await obtenerDetallesPorId(id, tipo); // esta ya la tienes

    if (!data || data.success === false) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }

    // Obtener reparto desde TMDB
    const response = await fetch(`${BASE_URL}/${tipo}/${id}/credits?api_key=${API_KEY}`);
    const credits = await response.json();

    const reparto = credits.cast?.slice(0, 10).map(actor => ({
      nombre: actor.name,
      personaje: actor.character,
      foto: actor.profile_path
        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
        : null
    })) || [];

    const resultado = {
      id: data.id,
      titulo: data.title || data.name,
      sinopsis: data.overview,
      fecha: data.release_date || data.first_air_date,
      posterUrl: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : null,
      rating: data.vote_average,
      reparto
    };

    res.json(resultado);
  } catch (error) {
    console.error("❌ Error al obtener detalles completos:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

const obtenerResenasPorContenido = async (req, res) => {
  const { id_api } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT c.puntuacion, c.comentario, u.nick, u.avatar
       FROM calificacion c
       JOIN usuario u ON c.id_usuario = u.id
       WHERE c.id_api = ?`,
      [id_api]
    );

    const baseUrl = process.env.BASE_URL || "http://localhost:3001";

    const reseñasConUrl = rows.map(r => ({
      ...r,
      avatar: r.avatar ? `${baseUrl}${r.avatar}` : null
    }));

    const media =
      rows.length > 0
        ? (rows.reduce((acc, r) => acc + r.puntuacion, 0) / rows.length).toFixed(1)
        : null;

    res.json({ media, reseñas: reseñasConUrl });
  } catch (error) {
    console.error("❌ Error al obtener reseñas:", error);
    res.status(500).json({ error: "Error interno al obtener reseñas" });
  }
};


const eliminarContenidoController = async (req, res) => {
  const { id_usuario, id_api, tipoGuardado } = req.body;

  if (!id_usuario || !id_api || !tipoGuardado) {
    return res.status(400).json({ error: 'Faltan datos necesarios' });
  }

  try {
    if (tipoGuardado === "favoritos") {
      await db.query(
        "DELETE FROM favoritos WHERE id_usuario = ? AND id_tmdb = ?",
        [id_usuario, id_api]
      );
    } else if (tipoGuardado === "historial") {
      await db.query(
        "DELETE FROM contenido_guardado WHERE id_usuario = ? AND id_api = ?",
        [id_usuario, id_api]
      );
    } else {
      return res.status(400).json({ error: 'Tipo inválido' });
    }


    await db.query(
      "DELETE FROM calificacion WHERE id_usuario = ? AND id_api = ?",
      [id_usuario, id_api]
    );

    res.json({ message: "✅ Contenido y calificación eliminados correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar contenido:", error);
    res.status(500).json({ error: "Error interno al eliminar contenido" });
  }
};



const obtenerDatosSeries = async (req, res) => {
  const { id_api } = req.params;

  try {
    const url = `https://api.themoviedb.org/3/tv/${id_api}?api_key=${API_KEY}&language=es`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.success === false) {
      return res.status(404).json({ error: "Serie no encontrada" });
    }

    const temporadas = await Promise.all(
      data.seasons.map(async (temp) => {
        // Opción para obtener título completo y número de episodios más precisos:
        const detalleTempUrl = `https://api.themoviedb.org/3/tv/${id_api}/season/${temp.season_number}?api_key=${API_KEY}&language=es`;
        const detalleRes = await fetch(detalleTempUrl);
        const detalleData = await detalleRes.json();

        return {
          id: temp.id,
          numero: temp.season_number,
          nombre: temp.name,
          descripcion: detalleData.overview || '',
          poster_url: temp.poster_path
            ? `https://image.tmdb.org/t/p/w300${temp.poster_path}`
            : null,
          episodios: (detalleData.episodes || []).map((ep) => ({
            id: ep.id,
            numero: ep.episode_number,
            titulo: ep.name,
            descripcion: ep.overview || '',
            fecha_emision: ep.air_date,
            poster_url: ep.still_path
              ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
              : null,
          })),
        };
      })
    );

    res.json(temporadas);
  } catch (error) {
    console.error("❌ Error al obtener temporadas:", error);
    res.status(500).json({ error: "Error al obtener temporadas" });
  }
};

const marcarTemporadaVista = async (req, res) => {
  const { id_usuario, id_serie, temporada } = req.body;
  await db.query(
    'INSERT IGNORE INTO temporadas_vistas (id_usuario, id_serie, id_temporada) VALUES (?, ?, ?)',
    [id_usuario, id_serie, temporada]
  );
  res.json({ message: '✅ Temporada marcada como vista' });
};

// DELETE /contenido/temporada/vista
const desmarcarTemporadaVista = async (req, res) => {
  const { id_usuario, id_serie, temporada } = req.body;
  await db.query(
    'DELETE FROM temporadas_vistas WHERE id_usuario = ? AND id_serie = ? AND id_temporada = ?',
    [id_usuario, id_serie, temporada]
  );
  res.json({ message: '🗑️ Temporada desmarcada' });
};


const obtenerTemporadasVistas = async (req, res) => {
  const { id_usuario, id_serie } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT id_temporada FROM temporadas_vistas WHERE id_usuario = ? AND id_serie = ?',
      [id_usuario, id_serie]
    );

    const vistas = rows.map((row) => row.id_temporada);
    res.json(vistas);
  } catch (error) {
    console.error('❌ Error al obtener temporadas vistas:', error);
    res.status(500).json({ error: 'Error interno al obtener temporadas vistas' });
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
  obtenerCalificacionesDelUsuario,
  obtenerDetallesCompletos,
  obtenerResenasPorContenido,
  eliminarContenidoController,
  obtenerDatosSeries,
  marcarTemporadaVista,
  desmarcarTemporadaVista,
  obtenerTemporadasVistas,
  eliminarFavoritoController
};
