import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Film, Tv, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

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
  const [itemToDelete, setItemToDelete] = useState<Movie | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    loadContent();
  }, [userId, section, media_type, navigate]);

  const loadContent = () => {
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
  };

  const openDeleteModal = (e: React.MouseEvent, item: Movie) => {
    e.stopPropagation();
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const confirmarEliminacion = async () => {
    if (!userId || !itemToDelete) return;

    try {
      const endpoint = section === "favoritos"
        ? "http://localhost:3001/contenido/favoritos/eliminar"
        : "http://localhost:3001/contenido/historial/eliminar";

      const body = section === "favoritos"
        ? { id_usuario: userId, id_tmdb: itemToDelete.id }
        : { id_usuario: userId, id_api: itemToDelete.id };

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success("✅ Contenido eliminado correctamente");
        loadContent();
        closeDeleteModal();
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al eliminar");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de red al eliminar");
    }
  };

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
                className="card-glass p-3 group hover:shadow-card-hover transition-all cursor-pointer animate-scale-in relative"
                onClick={() => navigate(`/contenido/${media_type}/${item.id}`)}
              >
                {/* Botón de eliminar */}
                <button
                  onClick={(e) => openDeleteModal(e, item)}
                  className="absolute top-2 right-2 z-10 p-2 bg-red-500/80 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>

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

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card-glass max-w-md w-full p-6 animate-scale-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cinechamp-text-primary">
                  Confirmar eliminación
                </h3>
                <p className="text-sm text-cinechamp-text-tertiary">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            {/* Contenido */}
            <div className="mb-6">
              <p className="text-cinechamp-text-secondary mb-4">
                ¿Estás seguro de que deseas eliminar <span className="font-semibold text-cinechamp-text-primary">"{itemToDelete.title}"</span> de tu {section === "favoritos" ? "lista de favoritos" : "historial"}?
              </p>

              {/* Preview del contenido */}
              <div className="flex items-center gap-3 p-3 bg-cinechamp-bg-tertiary rounded-lg border border-cinechamp-border-primary">
                <img
                  src={itemToDelete.posterUrl}
                  alt={itemToDelete.title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-cinechamp-text-primary truncate">
                    {itemToDelete.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-cinechamp-text-tertiary mt-1">
                    {itemToDelete.media_type === "movie" ? (
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
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 bg-cinechamp-bg-tertiary hover:bg-cinechamp-bg-elevated text-cinechamp-text-primary rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
