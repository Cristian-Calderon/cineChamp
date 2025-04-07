const { buscarContenido } = require('../models/contenidoModel');
const { buscarPeliculas, buscarSeries } = require('../models/apiUsuarioModel');
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
  const { id, title, name } = req.body;
  try {
    await db.query(
      'INSERT IGNORE INTO agregados (id_tmdb, titulo) VALUES (?, ?)',
      [id, title || name]
    );
    res.status(200).json({ message: 'Contenido agregado' });
  } catch (error) {
    console.error('Error al agregar contenido:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

const favoritoContenidoController = async (req, res) => {
  const { id, title, name } = req.body;
  try {
    await db.query(
      'INSERT IGNORE INTO favoritos (id_tmdb, titulo) VALUES (?, ?)',
      [id, title || name]
    );
    res.status(200).json({ message: 'Marcado como favorito' });
  } catch (error) {
    console.error('Error al marcar favorito:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = {
  buscarAPI,
  verificarConexionAPI,
  buscarPeliculasController,
  buscarSeriesController,
  favoritoContenidoController,
  agregarContenidoController
};