
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

//funcion con 2 parametros
const obtenerDetallesPorId = async (id, tipo = 'movie') => {
  try {
    //peticion a  tmmdb
    const res = await fetch(
      `${BASE_URL}/${tipo}/${id}?api_key=${API_KEY}&language=es-ES`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error al obtener detalles para ${tipo} con id ${id}:`, error);
    return null;
  }
};


module.exports = { buscarPeliculas, buscarSeries, obtenerDetallesPorId };