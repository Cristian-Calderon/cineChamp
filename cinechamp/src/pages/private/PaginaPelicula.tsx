import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ResenasDeUsuarios from "../../components/Calificaciones/ReñesaPorUsuarios";
import NotaMedia from "../../components/Calificaciones/Notamedia";

type Actor = {
  nombre: string;
  personaje: string;
  foto: string | null;
};

type Pelicula = {
  id: number;
  titulo: string;
  sinopsis: string;
  posterUrl: string | null;
  fecha: string;
  rating: number;
  reparto: Actor[];
};

export default function PaginaPelicula() {
  const { id, tipo } = useParams<{ id: string; tipo: string }>();
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [mediaUsuarios, setMediaUsuarios] = useState<string | null>(null);
  const [totalResenas, setTotalResenas] = useState<number>(0);

  useEffect(() => {
    if (!id || !tipo) return;

    // Cargar detalles de la película
    fetch(`http://localhost:3001/api/contenido/detalles/${tipo}/${id}`)
      .then((res) => res.json())
      .then((data) => setPelicula(data))
      .catch((err) => console.error("❌ Error al obtener detalles:", err));

    // Cargar nota media y total de reseñas
    fetch(`http://localhost:3001/api/contenido/comentarios/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMediaUsuarios(data.media || null);
        setTotalResenas(data.reseñas?.length || 0);
      })
      .catch((err) => console.error("❌ Error al obtener media:", err));
  }, [id, tipo]);

  if (!pelicula) return <p className="p-6">Cargando contenido...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="relative flex flex-col md:flex-row gap-6">
        {/* Poster */}
        {pelicula.posterUrl && (
          <img
            src={pelicula.posterUrl}
            alt={pelicula.titulo}
            className="w-full md:w-64 rounded-xl shadow-lg"
          />
        )}

        {/* Detalles de la película */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{pelicula.titulo}</h1>
          <p className="text-gray-500 mb-2">📅 {pelicula.fecha}</p>
          <p className="text-yellow-600 font-medium mb-4">
            ⭐ {pelicula.rating.toFixed(1)}
          </p>
          <p className="text-gray-700">{pelicula.sinopsis}</p>
        </div>

        {/* Nota media a la derecha */}
        {mediaUsuarios && (
  <div className="hidden md:block md:w-52 lg:w-60">
    <NotaMedia media={mediaUsuarios} totalResenas={totalResenas} />
  </div>
)}
      </div>

      {/* Reparto en carrusel */}
      {pelicula.reparto.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">🎭 Reparto principal</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {pelicula.reparto.map((actor, idx) => (
              <div key={idx} className="flex-shrink-0 w-32 text-center">
                {actor.foto ? (
                  <img
                    src={actor.foto}
                    alt={actor.nombre}
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2" />
                )}
                <p className="text-sm font-medium">{actor.nombre}</p>
                <p className="text-xs text-gray-500">{actor.personaje}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reseñas de usuarios */}
      <ResenasDeUsuarios id_api={id!} />
    </div>
  );
}
