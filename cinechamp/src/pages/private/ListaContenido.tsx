import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import fondoContenido from "../../assets/imagenes/cinema.jpg";

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

const ITEMS_POR_PAGINA = 30;

export default function ListaContenido() {
  const { nick, section, media_type } = useParams<Params>();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<number | null>(null);
  const [items, setItems] = useState<Movie[]>([]);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

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
        const filtered = data.filter((item) => item.media_type === media_type);
        setItems(filtered);
      })
      .catch((err) => console.error("Error cargando contenido:", err));
  }, [userId, section, media_type, navigate]);

  const eliminarContenido = async (id_api: number) => {
    if (!userId) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3001/contenido/eliminar`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuario: userId,
          id_api,
          tipoGuardado: section,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert("❌ Error al eliminar: " + error.message);
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id_api));
    } catch (err) {
      console.error("Error al eliminar contenido:", err);
    }
  };

  const filtrados = items.filter((item) =>
    item.title.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrados.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const elementosPagina = filtrados.slice(inicio, inicio + ITEMS_POR_PAGINA);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
      {/* Contenido principal */}
      <div className="relative z-10 p-6 max-w-6xl mx-auto bg-black/40 backdrop-blur-sm rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 9H16a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Volver
          </button>

          <input
            type="text"
            placeholder="🔍 Buscar por título..."
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPaginaActual(1);
            }}
            className="w-full sm:w-72 border border-gray-300 rounded px-4 py-2 text-black "
          />
        </div>

        <h1 className="text-3xl font-bold mb-4 ">
          {section === "favoritos"
            ? `🎉 Favoritos – ${media_type === "movie" ? "Películas" : "Series"}`
            : `🕘 Historial – ${media_type === "movie" ? "Películas" : "Series"}`}
        </h1>

        {elementosPagina.length === 0 ? (
          <p className="text-gray-300">No hay contenido para mostrar.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 ">
              {elementosPagina.map((item) => (
                <div
                  key={item.id}
                  className="relative border rounded-xl shadow hover:shadow-lg transition p-2 bg-white text-black "
                >
                  {item.posterUrl ? (
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-[300px] object-cover rounded-xl"
                      onClick={() =>
                        navigate(`/contenido/${item.media_type}/${item.id}`)
                      }
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center ">
                      <span className="text-sm text-gray-600">Sin imagen</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => eliminarContenido(item.id)}
                      className="absolute top-2 right-2 bg-white text-red-600 p-1.5 rounded-full shadow hover:bg-red-100 transition"
                      title="Eliminar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-lg font-semibold truncate">{item.title}</p>
                    <p className="text-base text-blue-600">
                      {item.media_type === "movie" ? "Película" : "Serie"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded disabled:opacity-50"
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => cambiarPagina(i + 1)}
                  className={`px-3 py-1 rounded ${paginaActual === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded disabled:opacity-50"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
