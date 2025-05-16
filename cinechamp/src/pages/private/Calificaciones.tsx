import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";

interface Calificacion {
  id: string;
  titulo: string;
  puntuacion: number;
  comentario?: string;
  posterUrl: string;
}

const ITEMS_POR_PAGINA = 12;

export default function TodasLasCalificaciones() {
  const navigate = useNavigate();
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const id_usuario = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchCalificaciones() {
      try {
        const response = await fetch(`http://localhost:3001/api/contenido/usuarios/${id_usuario}/calificaciones`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Error al cargar calificaciones");

        const data = await response.json();
        setCalificaciones(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id_usuario) {
      fetchCalificaciones();
    } else {
      console.warn("No se encontró el ID de usuario en localStorage.");
    }
  }, [id_usuario]);

  const totalPaginas = Math.ceil(calificaciones.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const calificacionesPaginadas = calificaciones.slice(inicio, inicio + ITEMS_POR_PAGINA);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white text-gray-900 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 text-sm font-medium hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver
      </button>

      <h1 className="text-3xl font-bold mb-8">Todas tus Calificaciones</h1>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : calificaciones.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay calificaciones disponibles.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {calificacionesPaginadas.map((item) => (
              <div
                key={item.id}
                className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-md transition"
              >
                <img
                  src={item.posterUrl}
                  alt={item.titulo}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{item.titulo}</h3>
                  <div className="flex items-center text-yellow-600 text-sm mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500 mr-1" />
                    {item.puntuacion}/10
                  </div>
                  {item.comentario && (
                    <p className="text-sm italic text-gray-600 line-clamp-3">
                      “{item.comentario}”
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center mt-8 gap-4">
              <button
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(p => p - 1)}
                className={`px-4 py-2 text-sm rounded ${
                  paginaActual === 1 ? "bg-gray-200 text-gray-400" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                Anterior
              </button>
              <span className="text-sm font-medium">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(p => p + 1)}
                className={`px-4 py-2 text-sm rounded ${
                  paginaActual === totalPaginas ? "bg-gray-200 text-gray-400" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
