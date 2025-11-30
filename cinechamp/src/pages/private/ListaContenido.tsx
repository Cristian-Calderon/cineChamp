import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Film, Tv, Loader2 } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  media_type: "movie" | "tv";
};

type Params = {
  nick: string;
  section: "favoritos" | "historial";
  media_type: "movie" | "tv";
};

export default function ListaContenido() {
  const { nick, section, media_type } = useParams<Params>();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<number | null>(null);
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Título dinámico
  const titulo = section === "favoritos"
    ? `🎉 Favoritos – ${media_type === "movie" ? "Películas" : "Series"}`
    : `🕘 Historial – ${media_type === "movie" ? "Películas" : "Series"}`;

  // 1) Obtener userId a partir del nick
  useEffect(() => {
    if (!nick) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    axios
      .get<{ id: number }>(`http://localhost:3001/api/usuarios/nick/${nick}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUserId(res.data.id))
      .catch(err => {
        console.error("No pudimos resolver el usuario:", err);
        navigate("/login", { replace: true });
      });
  }, [nick, navigate]);

  // 2) Cuando ya tengamos userId, pedimos el contenido
  useEffect(() => {
    if (userId == null) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    fetch(`http://localhost:3001/contenido/${section}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Falló la carga de contenido");
        return res.json() as Promise<Movie[]>;
      })
      .then(data => {
        // filtramos por movie|tv
        const filtered = data.filter(item => item.media_type === media_type);
        setItems(filtered);
      })
      .catch(err => console.error("Error cargando contenido:", err))
      .finally(() => setLoading(false));
  }, [userId, section, media_type, navigate]);

  return (
    <div className="min-h-screen bg-gradient-dark pb-20">
      {/* Header */}
      <div className="bg-gradient-mesh border-b border-cinechamp-border-primary pt-20 pb-8">
        <div className="container-cinechamp">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-cinechamp-text-secondary hover:text-cinechamp-text-primary transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver
          </button>

          <div className="flex items-center gap-3 animate-fade-in">
            <div className="p-2 bg-gradient-accent rounded-xl shadow-glow-accent">
              {media_type === "movie" ? (
                <Film className="w-6 h-6 text-white" />
              ) : (
                <Tv className="w-6 h-6 text-white" />
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">{titulo}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-cinechamp mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-cinechamp-accent-primary animate-spin mx-auto mb-4" />
              <p className="text-cinechamp-text-secondary">Cargando contenido...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="p-6 bg-cinechamp-bg-tertiary rounded-full mb-6">
              {media_type === "movie" ? (
                <Film className="w-16 h-16 text-cinechamp-text-tertiary" />
              ) : (
                <Tv className="w-16 h-16 text-cinechamp-text-tertiary" />
              )}
            </div>
            <p className="text-xl text-cinechamp-text-primary mb-2">No hay contenido para mostrar</p>
            <p className="text-sm text-cinechamp-text-tertiary">
              {section === "favoritos"
                ? "Aún no has agregado ningún favorito"
                : "Tu historial está vacío"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card-glass p-3 group hover:shadow-card-hover transition-all cursor-pointer animate-scale-in"
                onClick={() => navigate(`/contenido/${media_type}/${item.id}`)}
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden border border-cinechamp-border-primary group-hover:border-cinechamp-accent-primary transition-colors mb-3">
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="text-sm font-semibold text-cinechamp-text-primary mb-1 line-clamp-2 group-hover:text-cinechamp-accent-primary transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-1 text-xs text-cinechamp-text-tertiary">
                  {item.media_type === "movie" ? (
                    <>
                      <Film className="w-3 h-3" />
                      <span>Película</span>
                    </>
                  ) : (
                    <>
                      <Tv className="w-3 h-3" />
                      <span>Serie</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
