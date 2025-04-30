import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


//definimos el tipo de pelicula que esperamos
type Movie = {
  id: number;
  title: string;
  name?: string;
  media_type: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
};

export default function Resultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  const [resultados, setResultados] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscar = async () => {
      if (!query) return;
      try {
        const res = await fetch(`http://localhost:3001/contenido/bContenido?q=${encodeURIComponent(query)}`);

        const data = await res.json();
        console.log("🔎 Resultados desde backend:", data);

        // Filtrar solo películas y series
        const filtrados = data.filter(
          (item: Movie) =>
            item.media_type === "movie" || item.media_type === "tv"
        );

        setResultados(filtrados);
      } catch (error) {
        console.error("Error al buscar:", error);
      } finally {
        setLoading(false);
      }
    };
    buscar();
  }, [query]);

  const agregarFavorito = async (movie: Movie) => {
    const userId = parseInt(localStorage.getItem("userId") || "0");
    console.log("👤 ID del usuario:", userId);

    const response = await fetch("http://localhost:3001/contenido/favorito", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_usuario: userId,
        id_tmdb: movie.id
      }),
    });

    const data = await response.json();
    console.log("✅ Backend respondió:", data);

    if (!response.ok) {
      console.log("⚠️ Error al agregar favorito: " + data.error);
    }
  };

  // Historial de las peliculas que hemos visto:
  const agregarHistorial = async (movie: Movie) => {
    const userId = parseInt(localStorage.getItem("userId") || "0");
    console.log("👤 ID del usuario:", userId);

    console.log("🛰️ Enviando a backend:", {
      id_usuario: userId,
      id_api: movie.id
    });

    const response = await fetch("http://localhost:3001/contenido/agregar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: userId,
        id_api: movie.id
      }),
    });


    console.log("Se agrego al historial");
  };



  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Resultados para: "{query}"</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : resultados.length === 0 ? (
        <p className="text-center text-gray-500">No se encontraron resultados.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {resultados.map((movie) => (
            <div key={movie.id} className="border rounded p-2 shadow-sm text-center">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="w-full h-[100px] object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-[100px] bg-gray-200 flex items-center justify-center mb-2 rounded">
                  <span className="text-sm text-gray-600">Sin imagen</span>
                </div>
              )}
              <p className="text-sm font-semibold">{movie.title || movie.name}</p>
              <p className="text-xs text-gray-500">
                {movie.release_date || movie.first_air_date || "Sin fecha"}
              </p>
              <p className="text-xs text-blue-600 font-medium">
                {movie.media_type === "movie" ? "Película" : "Serie"}
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => agregarFavorito(movie)}
                  className="bg-green-500 text-white rounded px-2 py-1 text-sm"
                >
                  + Favoritos
                </button>
                <button
                  onClick={() => agregarHistorial(movie)}
                  className="bg-yellow-500 text-white rounded px-2 py-1 text-sm"
                >
                  + Historial
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/perfil")}
          className="text-blue-600 underline text-sm"
        >
          ← Volver al perfil
        </button>
      </div>
    </div>
  );
}
