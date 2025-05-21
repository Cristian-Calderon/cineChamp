import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ModalPuntuacion from "../../components/Modal/ModalPuntuacion";
import fondoContenido from "../../assets/imagenes/cinema.jpg"; // Fondo importado

type Resultado = {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path?: string | null;
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
  const [tipoGuardadoModal, setTipoGuardadoModal] = useState<"favorito" | "historial" | null>(null);
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
      const filtrados = data.filter((item: Resultado) => item.media_type === "movie" || item.media_type === "tv");
      setResultados(filtrados);
    } catch (error) {
      console.error("❌ Error al buscar:", error);
    } finally {
      setLoading(false);
    }
  };

  const manejarAgregar = (item: Resultado, tipo: "favorito" | "historial") => {
    setModalItem(item);
    setTipoGuardadoModal(tipo);
    setModalVisible(true);
  };

  const guardarContenido = async () => {
    const puntuacion = parseInt(puntuacionInput, 10);
    if (!puntuacion || puntuacion < 1 || puntuacion > 10) {
      alert("❌ Puntuación inválida.");
      return;
    }

    if (!modalItem || !tipoGuardadoModal) return;

    try {
      const res = await fetch("http://localhost:3001/contenido/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_api: modalItem.id,
          tipoGuardado: tipoGuardadoModal,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        alert("❌ Error: " + result.error);
        return;
      }

      await fetch("http://localhost:3001/contenido/calificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_api: modalItem.id,
          tipo: modalItem.media_type === "movie" ? "pelicula" : "serie",
          puntuacion,
          comentario: comentarioInput,
          tipoGuardado: tipoGuardadoModal,
        }),
      });

      alert("✅ Guardado correctamente");
    } catch (err) {
      console.error("❌ Error de red:", err);
    } finally {
      setModalVisible(false);
      setModalItem(null);
      setTipoGuardadoModal(null);
      setPuntuacionInput("");
      setComentarioInput("");
    }
  };

  const renderTarjeta = (item: Resultado) => (
    <div
      key={item.id}
      className="relative border rounded-xl shadow hover:shadow-lg transition p-2 bg-cyan-800 text-white"
    >
      {item.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={item.title || item.name}
          className="w-full h-[300px] object-cover rounded-xl"
        />
      ) : (
        <div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center">
          <span className="text-sm text-gray-600">Sin imagen</span>
        </div>
      )}

      <div className="flex justify-around mt-1">
        <button
          onClick={() => manejarAgregar(item, "favorito")}
          title="Agregar a favoritos"
          className="bg-white/80 hover:bg-white text-red-500 p-2 rounded-full shadow transition hover:scale-105"
        >❤️</button>
        <button
          onClick={() => manejarAgregar(item, "historial")}
          title="Agregar a historial"
          className="bg-white/80 hover:bg-white text-blue-500 p-2 rounded-full shadow transition hover:scale-105"
        >📜</button>
        <button
          onClick={() => navigate(`/contenido/${item.media_type}/${item.id}`)}
          title="Ver detalles"
          className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow transition hover:scale-105"
        >▶️</button>
      </div>

      <div className="mt-3 text-center">
        <p className="text-sm font-semibold truncate">{item.title || item.name}</p>
        <p className="text-lg text-black">
          {item.media_type === "movie" ? "Película" : "Serie"}
        </p>
      </div>
    </div>
  );

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
        {nick && (
          <button
            onClick={() => navigate(`/perfil/${nick}`)}
            className="mb-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 9H16a1 1 0 110 2H4.414l3.293 3.293a1 1 0 01-1.414 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Volver al perfil
          </button>
        )}

        <h1 className="text-2xl font-bold mb-4">Resultados de búsqueda</h1>

        {loading ? (
          <p className="text-center text-gray-300">🔄 Cargando...</p>
        ) : resultados.length === 0 ? (
          <p className="text-center text-gray-300">No hay resultados.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {resultados.map(renderTarjeta)}
          </div>
        )}

        {modalVisible && modalItem && tipoGuardadoModal && (
          <ModalPuntuacion
            isOpen={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setModalItem(null);
              setTipoGuardadoModal(null);
              setPuntuacionInput("");
              setComentarioInput("");
            }}
            item={modalItem}
            tipo={tipoGuardadoModal}
            onSubmit={guardarContenido}
            puntuacion={puntuacionInput}
            setPuntuacion={setPuntuacionInput}
            comentario={comentarioInput}
            setComentario={setComentarioInput}
          />
        )}
      </div>
    </div>
  );
}
