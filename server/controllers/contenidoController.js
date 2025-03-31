const { buscarContenido } = require('../models/contenidoModel');
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

module.exports = {
  buscarAPI,
  verificarConexionAPI
};
