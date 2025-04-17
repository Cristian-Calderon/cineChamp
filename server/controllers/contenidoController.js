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

const buscarPeliculasController = async (req, res) => {
  const query = req.query.q;
  const resultados = await buscarContenido(query); 
  res.json(resultados);

};

const buscarSeriesController = async (req, res) => {
  const query = req.query.q;
  const resultados = await buscarSeries(query);
  res.json(resultados);
};

const agregarContenidoController = async (req, res) => {
  const { id_usuario, id_api } = req.body;
  console.log("📩 Datos recibidos en favoritoContenidoController:", { id_usuario, id_api });


  if (!id_usuario || !id_api) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    // 1. Intentamos primero obtener como película
    let data = await obtenerDetallesPorId(id_api, 'movie');
    let tipo = 'pelicula';

    // 2. Si no existe como película, intentamos como serie
    if (!data || data.success === false) {
      data = await obtenerDetallesPorId(id_api, 'tv');
      tipo = 'serie';
    }

    if (!data || data.success === false) {
      return res.status(404).json({ error: 'Contenido no encontrado en TMDB' });
    }

    // 3. Insertar en contenido_guardado
    await db.query(
      'INSERT IGNORE INTO contenido_guardado (id_usuario, id_api, tipo) VALUES (?, ?, ?)',
      [id_usuario, id_api, tipo]
    );

    // 4. Verificar logros
    //await verificarLogros(id_usuario);

    res.status(201).json({ message: `${tipo === 'pelicula' ? 'Película' : 'Serie'} agregada correctamente.` });
  } catch (error) {
    console.error('Error al agregar contenido:', error);
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
    // 1. Intentamos obtener como película
    let data = await obtenerDetallesPorId(id_tmdb, 'movie');
    let tipo = 'pelicula';

    // 2. Si falla, probamos como serie
    if (!data || data.success === false) {
      data = await obtenerDetallesPorId(id_tmdb, 'tv');
      tipo = 'serie';
    }

    if (!data || data.success === false) {
      return res.status(404).json({ error: 'Contenido no encontrado en TMDB' });
    }

    const titulo = data.title || data.name;

    // 3. Guardamos en tabla de favoritos
    await db.query(
      'INSERT IGNORE INTO favoritos (id_usuario, id_tmdb, titulo) VALUES (?, ?, ?)',
      [id_usuario, id_tmdb, titulo]
    );

    // 4. Verificamos logros automáticamente
    //await verificarLogros(id_usuario);

    res.status(201).json({ message: `${tipo === 'pelicula' ? 'Película' : 'Serie'} marcada como favorita: ${titulo}` });
  } catch (error) {
    console.error('Error al marcar favorito:', error);
    res.status(500).json({ error: 'Error interno al guardar favorito' });
  }
};

const obtenerFavoritosPorUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    //devulve a el usuario las que marco en favoritos(solo nos devulve un id de tmdb)
    const [favoritos] = await db.query(
      'SELECT id_tmdb FROM favoritos WHERE id_usuario = ?',
      [id_usuario]
    );
    //por cada id guardado llama a a la api
    const resultados = await Promise.all(
      favoritos.map(async ({ id_tmdb }) => {
        const data = await obtenerDetallesPorId(id_tmdb, 'movie');
        return {
          id: id_tmdb,
          title: data?.title,
          posterUrl: `https://image.tmdb.org/t/p/w500${data?.poster_path}`
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
      'SELECT id_api, tipo FROM contenido_guardado WHERE id_usuario = ?',
      [id_usuario]
    );

    const resultados = await Promise.all(
      historial.map(async ({ id_api, tipo }) => {
        const data = await obtenerDetallesPorId(id_api, tipo === 'pelicula' ? 'movie' : 'tv');
        return {
          id: id_api,
          title: data?.title || data?.name,
          posterUrl: `https://image.tmdb.org/t/p/w500${data?.poster_path}`
        };
      })
    );

    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = {
  buscarAPI,
  verificarConexionAPI,
  buscarPeliculasController,
  buscarSeriesController,
  favoritoContenidoController,
  agregarContenidoController,
  obtenerHistorialPorUsuario,
  obtenerFavoritosPorUsuario
};