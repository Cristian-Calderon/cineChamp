import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Search, Film, Tv, Plus, Info, Loader2, Star } from "lucide-react";
import ModalPuntuacion from "../../components/Modal/ModalPuntuacion";
import { toast } from "react-toastify";

type Resultado = {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  poster_path?: string | null;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

export default function Buscador() {
  const { nick } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = parseInt(localStorage.getItem("userId") || "0");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState<Resultado | null>(null);
  const [puntuacionInput, setPuntuacionInput] = useState("");
  const [comentarioInput, setComentarioInput] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setQuery(q);
    if (q) buscar(q);
  }, [location.search]);

  const buscar = async (busqueda: string) => {
    if (!busqueda.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/contenido/bContenido?q=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      const filtrados = data.filter((item: Resultado) =>
        item.media_type === "movie" || item.media_type === "tv"
      );
      setResultados(filtrados);
    } catch (error) {
      console.error("❌ Error al buscar:", error);
      toast.error("Error al buscar contenido");
    } finally {
      setLoading(false);
    }
  };

  const manejarAgregar = (item: Resultado) => {
    setModalItem(item);
    setModalVisible(true);
  };

  const guardarContenido = async () => {
    const puntuacion = parseInt(puntuacionInput, 10);
    if (!puntuacion || puntuacion < 1 || puntuacion > 10) {
      toast.error("Puntuación inválida (1-10)");
      return;
    }

    if (!modalItem) return;

    try {
      const tipoContenido = modalItem.media_type === "movie" ? "pelicula" : "serie";

      // Agregar al historial
      const res = await fetch("http://localhost:3001/contenido/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_api: modalItem.id,
          tipoGuardado: "historial",
          tipo: tipoContenido,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Error al guardar");
        return;
      }

      // Calificar
      await fetch("http://localhost:3001/contenido/calificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_api: modalItem.id,
          tipo: tipoContenido,
          puntuacion,
          comentario: comentarioInput,
          tipoGuardado: "historial",
        }),
      });

      toast.success("Añadido al historial");
    } catch (err) {
      console.error("❌ Error de red:", err);
      toast.error("Error de red al guardar");
    } finally {
      setModalVisible(false);
      setModalItem(null);
      setPuntuacionInput("");
      setComentarioInput("");
    }
  };

  const renderTarjeta = (item: Resultado) => {
    const titulo = item.title || item.name || "Sin título";
    const anio = item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0];
    const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

    return (
      <div
        key={item.id}
        className="group relative movie-card cursor-pointer"
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-cinechamp-bg-tertiary border border-cinechamp-border-primary group-hover:border-cinechamp-accent-primary transition-colors">
          {item.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={titulo}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-cinechamp-text-tertiary">
              {item.media_type === "movie" ? (
                <Film className="w-12 h-12 mb-2" />
              ) : (
                <Tv className="w-12 h-12 mb-2" />
              )}
              <span className="text-sm">Sin imagen</span>
            </div>
          )}

          {/* Overlay con botones (aparece en hover) */}
          <div className="absolute inset-0 bg-cinechamp-bg-primary/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
            <button
              onClick={() => manejarAgregar(item)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-accent hover:shadow-glow-accent rounded-lg transition-all font-semibold text-sm text-white"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
            <button
              onClick={() => navigate(`/contenido/${item.media_type}/${item.id}`)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-cinechamp-bg-elevated hover:bg-cinechamp-bg-hover border border-cinechamp-border-primary rounded-lg transition-colors font-semibold text-sm"
            >
              <Info className="w-4 h-4" />
              Detalles
            </button>
          </div>

          {/* Badge de tipo */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-cinechamp-bg-primary/80 backdrop-blur-sm rounded-lg border border-cinechamp-border-primary">
            <div className="flex items-center gap-1">
              {item.media_type === "movie" ? (
                <Film className="w-3 h-3 text-cinechamp-accent-primary" />
              ) : (
                <Tv className="w-3 h-3 text-cinechamp-accent-secondary" />
              )}
              <span className="text-xs font-medium">
                {item.media_type === "movie" ? "Película" : "Serie"}
              </span>
            </div>
          </div>

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-cinechamp-accent-tertiary/90 backdrop-blur-sm rounded-lg border border-cinechamp-accent-tertiary">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-cinechamp-bg-primary text-cinechamp-bg-primary" />
                <span className="text-xs font-bold text-cinechamp-bg-primary">{rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-semibold line-clamp-2 leading-tight text-cinechamp-text-primary">{titulo}</h3>
          {anio && (
            <p className="text-xs text-cinechamp-text-tertiary">{anio}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-dark pb-20">
      {/* Header con gradiente */}
      <div className="bg-gradient-mesh border-b border-cinechamp-border-primary pt-20 pb-8">
        <div className="container-cinechamp">
          {/* Breadcrumb / Volver */}
          {nick && (
            <button
              onClick={() => navigate(-1)}
              className="mb-6 text-sm text-cinechamp-text-secondary hover:text-cinechamp-text-primary transition-colors flex items-center gap-2 group"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          )}

          {/* Título */}
          <div className="flex items-center gap-3 mb-2 animate-fade-in">
            <div className="p-2 bg-gradient-accent rounded-xl shadow-glow-accent">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">Resultados de búsqueda</h1>
          </div>

          {/* Query actual */}
          {query && (
            <p className="text-cinechamp-text-secondary animate-slide-up">
              Mostrando resultados para: <span className="text-cinechamp-text-primary font-semibold">"{query}"</span>
            </p>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="container-cinechamp mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cinechamp-accent-primary animate-spin mb-4" />
            <p className="text-cinechamp-text-secondary">Buscando contenido...</p>
          </div>
        ) : resultados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="p-6 bg-cinechamp-bg-tertiary rounded-full mb-6">
              <Search className="w-16 h-16 text-cinechamp-text-tertiary" />
            </div>
            <p className="text-xl text-cinechamp-text-primary mb-2">No se encontraron resultados</p>
            <p className="text-sm text-cinechamp-text-tertiary">Intenta con otra búsqueda</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between animate-slide-up">
              <p className="text-sm text-cinechamp-text-secondary">
                <span className="text-cinechamp-accent-primary font-bold">{resultados.length}</span> {resultados.length === 1 ? "resultado" : "resultados"}
              </p>
            </div>

            {/* Grid responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {resultados.map(renderTarjeta)}
            </div>
          </>
        )}
      </div>

      {/* Modal de puntuación */}
      {modalVisible && modalItem && (
        <ModalPuntuacion
          isOpen={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setModalItem(null);
            setPuntuacionInput("");
            setComentarioInput("");
          }}
          item={modalItem}
          tipo="historial"
          onSubmit={guardarContenido}
          puntuacion={puntuacionInput}
          setPuntuacion={setPuntuacionInput}
          comentario={comentarioInput}
          setComentario={setComentarioInput}
        />
      )}
    </div>
  );
}
