
const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const buscarPeliculas = async (query) => {
  if (!String(query).trim()) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Error al buscar películas:', error);
    return [];
  }
};

const buscarSeries = async (query) => {
  if (!String(query).trim()) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/search/tv?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Error al buscar series:', error);
    return [];
  }
};

module.exports = { buscarPeliculas, buscarSeries };