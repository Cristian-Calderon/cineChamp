import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Heart, Calendar, Clock, Film, Tv, Plus, Users } from "lucide-react";
import { toast } from "react-toastify";
import ModalPuntuacion from "../../components/Modal/ModalPuntuacion";

type ContenidoDetalle = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  number_of_seasons?: number;
  genres?: { id: number; name: string }[];
  credits?: {
    cast?: { id: number; name: string; character: string; profile_path?: string }[];
  };
};

export default function PaginaPelicula() {
  const { tipo, id } = useParams<{ tipo: string; id: string }>();
  const navigate = useNavigate();
  const [contenido, setContenido] = useState<ContenidoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = parseInt(localStorage.getItem("userId") || "0");

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [puntuacionInput, setPuntuacionInput] = useState("");
  const [comentarioInput, setComentarioInput] = useState("");

  useEffect(() => {
    if (!id || !tipo) return;

    const fetchDetalles = async () => {
      try {
        const tipoAPI = tipo === "movie" ? "movie" : "tv";
        const res = await fetch(`http://localhost:3001/contenido/detalles/${tipoAPI}/${id}`);
        const data = await res.json();
        setContenido(data);
      } catch (error) {
        console.error("Error al obtener detalles:", error);
        toast.error("Error al cargar detalles");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalles();
  }, [id, tipo]);

  const agregarAFavoritos = async () => {
    if (!contenido) return;

    try {
      const tipoContenido = tipo === "movie" ? "pelicula" : "serie";
      const res = await fetch("http://localhost:3001/contenido/favorito", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_api: contenido.id,
          tipo: tipoContenido,
        }),
      });

      if (res.ok) {
        toast.success("✅ Agregado a favoritos");
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al agregar a favoritos");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de red");
    }
  };

  const abrirModalHistorial = () => {
    setModalVisible(true);
  };

  const guardarEnHistorial = async () => {
    const puntuacion = parseInt(puntuacionInput, 10);
    if (!puntuacion || puntuacion < 1 || puntuacion > 10) {
      toast.error("Puntuación inválida (1-10)");
      return;
    }

    if (!contenido) return;

    try {
      const tipoContenido = tipo === "movie" ? "pelicula" : "serie";

      // Agregar al historial
      const res = await fetch("http://localhost:3001/contenido/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_api: contenido.id,
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
          id_api: contenido.id,
          tipo: tipoContenido,
          puntuacion,
          comentario: comentarioInput,
          tipoGuardado: "historial",
        }),
      });

      toast.success("✅ Añadido al historial y calificado");
    } catch (err) {
      console.error("❌ Error de red:", err);
      toast.error("Error de red al guardar");
    } finally {
      setModalVisible(false);
      setPuntuacionInput("");
      setComentarioInput("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cinechamp-accent-primary/30 border-t-cinechamp-accent-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cinechamp-text-secondary">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!contenido) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center pb-20">
        <div className="text-center">
          <p className="text-cinechamp-text-primary text-xl mb-4">Contenido no encontrado</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Volver
          </button>
        </div>
      </div>
    );
  }

  const titulo = contenido.title || contenido.name || "Sin título";
  const fecha = contenido.release_date || contenido.first_air_date;
  const anio = fecha ? new Date(fecha).getFullYear() : null;
  const rating = contenido.vote_average?.toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-dark pb-20">
      {/* Backdrop */}
      {contenido.backdrop_path && (
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${contenido.backdrop_path}`}
            alt={titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cinechamp-bg-primary via-cinechamp-bg-primary/60 to-transparent" />
        </div>
      )}

      {/* Contenido */}
      <div className="container-cinechamp -mt-40 relative z-10">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-cinechamp-text-secondary hover:text-cinechamp-text-primary transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="card-glass p-4 animate-scale-in">
              {contenido.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${contenido.poster_path}`}
                  alt={titulo}
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="aspect-[2/3] bg-cinechamp-bg-tertiary rounded-lg flex items-center justify-center">
                  {tipo === "movie" ? (
                    <Film className="w-24 h-24 text-cinechamp-text-tertiary" />
                  ) : (
                    <Tv className="w-24 h-24 text-cinechamp-text-tertiary" />
                  )}
                </div>
              )}

              {/* Acciones */}
              <div className="mt-4 space-y-3">
                <button onClick={abrirModalHistorial} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Agregar al Historial
                </button>
                <button onClick={agregarAFavoritos} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Agregar a Favoritos
                </button>
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título y Rating */}
            <div className="card-glass p-6 animate-slide-up">
              <h1 className="text-4xl font-bold mb-3 text-gradient">{titulo}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-cinechamp-text-secondary mb-4">
                {anio && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {anio}
                  </span>
                )}
                {contenido.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {contenido.runtime} min
                  </span>
                )}
                {contenido.number_of_seasons && (
                  <span className="flex items-center gap-1">
                    <Tv className="w-4 h-4" />
                    {contenido.number_of_seasons} temporadas
                  </span>
                )}
                {rating && (
                  <span className="flex items-center gap-1 text-cinechamp-accent-tertiary font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    {rating}/10
                  </span>
                )}
              </div>

              {/* Géneros */}
              {contenido.genres && contenido.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {contenido.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-cinechamp-bg-elevated border border-cinechamp-border-primary rounded-lg text-xs font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sinopsis */}
            {contenido.overview && (
              <div className="card-glass p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-cinechamp-accent-primary">📖</span>
                  Sinopsis
                </h2>
                <p className="text-cinechamp-text-secondary leading-relaxed">
                  {contenido.overview}
                </p>
              </div>
            )}

            {/* Reparto */}
            {contenido.credits?.cast && contenido.credits.cast.length > 0 && (
              <div className="card-glass p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-cinechamp-accent-secondary" />
                  Reparto Principal
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {contenido.credits.cast.slice(0, 8).map((actor) => (
                    <div key={actor.id} className="text-center group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-cinechamp-border-primary group-hover:border-cinechamp-accent-primary transition-colors mb-2">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-cinechamp-bg-tertiary flex items-center justify-center">
                            <Users className="w-12 h-12 text-cinechamp-text-tertiary" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-cinechamp-text-primary truncate">
                        {actor.name}
                      </p>
                      <p className="text-xs text-cinechamp-text-tertiary truncate">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de puntuación */}
      {modalVisible && contenido && (
        <ModalPuntuacion
          isOpen={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setPuntuacionInput("");
            setComentarioInput("");
          }}
          item={{
            id: contenido.id,
            title: contenido.title,
            name: contenido.name,
            media_type: tipo === "movie" ? "movie" : "tv",
            poster_path: contenido.poster_path,
          }}
          tipo="historial"
          onSubmit={guardarEnHistorial}
          puntuacion={puntuacionInput}
          setPuntuacion={setPuntuacionInput}
          comentario={comentarioInput}
          setComentario={setComentarioInput}
        />
      )}
    </div>
  );
}
