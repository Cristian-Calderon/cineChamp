const fetch = require("node-fetch");
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function obtenerDesdeTMDB(id, tipo) {
  const url = `${BASE_URL}/${tipo}/${id}?api_key=${TMDB_API_KEY}&language=es`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB falló");
  
  const data = await res.json();
  if (data.success === false) throw new Error("TMDB devolvió un error");

  return {
    id: data.id,
    titulo: data.title || data.name,
    sinopsis: data.overview,
    fecha: data.release_date || data.first_air_date,
    posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
    rating: data.vote_average,
  };
}

async function otraApiNueva(id) {
  return {
    id,
    titulo: "Desconocido",
    sinopsis: "No se pudo obtener información del contenido.",
    fecha: null,
    posterUrl: null,
    rating: null,
  };
}

async function obtenerDetallesPorId(id, tipo) {
  try {
    return await obtenerDesdeTMDB(id, tipo);
  } catch (err) {
    console.warn("⚠️ TMDB falló:", err.message);
    console.warn("Usando OMDb como fallback.");
    return await otraApiNueva(id);
  }
}

module.exports = {
  obtenerDetallesPorId,
};
