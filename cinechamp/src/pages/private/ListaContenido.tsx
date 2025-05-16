import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [allIds, setAllIds] = useState<number[]>([]);
  const [filtro, setFiltro] = useState("");

  const titulo =
    section === "favoritos"
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
      .then((res) => setUserId(res.data.id))
      .catch((err) => {
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

    fetch(`http://localhost:3001/contenido/${section}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Falló la carga de contenido");
        return res.json() as Promise<Movie[]>;
      })
      .then((data) => {
        const filtered = data.filter(
          (item) => item.media_type === media_type
        );
        setItems(filtered);
        setAllIds(filtered.map((item) => item.id));
      })
      .catch((err) => console.error("Error cargando contenido:", err));
  }, [userId, section, media_type, navigate]);

  // 3) Filtrado dinámico por texto
  const filtrados = items.filter((item) =>
    item.title.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Volver
        </button>

        <input
          type="text"
          placeholder="🔍 Buscar por título..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full sm:w-72 border border-gray-300 rounded px-4 py-2"
        />
      </div>

      <h1 className="text-3xl font-bold mb-4">{titulo}</h1>

      <pre className="mb-4 text-xs text-gray-500">
        IDs en esta lista: {allIds.join(", ")}
      </pre>

      {filtrados.length === 0 ? (
        <p className="text-gray-500">No hay contenido para mostrar.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {filtrados.map((item) => (
            <div
              key={item.id}
              className="border rounded shadow-sm overflow-hidden"
            >
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-2 text-center">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {item.media_type === "movie" ? "🎬 Película" : "📺 Serie"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
