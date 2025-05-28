import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import fondoContenido from "../../assets/imagenes/logo2.jpeg";

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
    <div
      className="relative min-h-screen text-white"
      style={{
        backgroundImage: `url(${fondoContenido})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 p-6 max-w-6xl mx-auto bg-black/40 backdrop-blur-sm rounded-lg">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-transform transform hover:scale-105 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <h1 className="text-3xl font-bold mb-8">Todas tus Calificaciones</h1>

        {loading ? (
          <p className="text-gray-300">Cargando...</p>
        ) : calificaciones.length === 0 ? (
          <p className="text-gray-300 text-sm">No hay calificaciones disponibles.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {calificacionesPaginadas.map((item) => (
                <div
                  key={item.id}
                  className="relative border rounded-xl shadow hover:shadow-lg transition p-2 bg-white text-black"
                >
                  {item.posterUrl ? (
                    <img
                      src={item.posterUrl}
                      alt={item.titulo}
                      className="w-full h-[300px] object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center">
                      <span className="text-sm text-gray-600">Sin imagen</span>
                    </div>
                  )}

                  <div className="mt-3 text-center">
                    <p className="text-lg font-semibold truncate">{item.titulo}</p>
                    <p className="text-base text-yellow-600 flex justify-center items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
                      {item.puntuacion}/10
                    </p>
                    {item.comentario && (
                      <p className="text-sm italic text-gray-600 mt-1 line-clamp-3">“{item.comentario}”</p>
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
    </div>
  );
}
