import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ResenasDeUsuarios from "../../components/Calificaciones/ReñesaPorUsuarios";
import NotaMedia from "../../components/Calificaciones/Notamedia";
import TemporadasContenido from "../../components/PaginaPeliculaComponentes/TemporadasContenido";
import RepartoContenido from "../../components/PaginaPeliculaComponentes/RepartoContenido";
import ModalPuntuacion from "../../components/Modal/ModalPuntuacion";
import { toast } from "react-toastify";

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
  reparto: Actor[];
};

type Temporada = {
  id: number;
  numero: number;
  nombre: string;
  descripcion: string;
  poster_url: string | null;
  episodios: {
    id: number;
    numero: number;
    titulo: string;
    descripcion: string;
    fecha_emision: string;
    poster_url: string | null;
  }[];
};

export default function PaginaPelicula() {
  const { id, tipo } = useParams<{ id: string; tipo: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const editable = location.state?.editable ?? true;

  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [mediaUsuarios, setMediaUsuarios] = useState<string | null>(null);
  const [totalResenas, setTotalResenas] = useState<number>(0);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [vistas, setVistas] = useState<Record<number, boolean>>({});
  const [esFavorito, setEsFavorito] = useState<boolean>(false);
  const [yaEnHistorial, setYaEnHistorial] = useState(false);

  const userId = parseInt(localStorage.getItem("userId") || "0");

  const [modalVisible, setModalVisible] = useState(false);
  const [puntuacion, setPuntuacion] = useState("");
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    if (!id || !tipo) return;

    fetch(`http://localhost:3001/api/contenido/detalles/${tipo}/${id}`)
      .then((res) => res.json())
      .then(setPelicula)
      .catch(console.error);

    fetch(`http://localhost:3001/api/contenido/comentarios/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMediaUsuarios(data.media || null);
        setTotalResenas(data.reseñas?.length || 0);
      })
      .catch(console.error);

    if (tipo === "tv") {
      fetch(`http://localhost:3001/contenido/series/${id}/tmdb/estructura-simple`)
        .then((res) => res.json())
        .then(setTemporadas)
        .catch(console.error);

      fetch(`http://localhost:3001/contenido/temporadas-vistas/${userId}/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const estado: Record<number, boolean> = {};
          data.forEach((t: number) => (estado[t] = true));
          setVistas(estado);
        })
        .catch(console.error);
    }

    fetch(`http://localhost:3001/api/contenido/favoritos/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const fav = data.some((f: { id: number }) => f.id === parseInt(id!));
        setEsFavorito(fav);
      })
      .catch(console.error);

    // Chequear si ya está en historial
    fetch(`http://localhost:3001/api/contenido/historial/${userId}`)
      .then((res) => res.json())
      .then((historial) => {
        const existe = historial.some((item: any) => item.id === parseInt(id!));
        setYaEnHistorial(existe);
      })
      .catch(console.error);
  }, [id, tipo]);

  const toggleFavorito = async () => {
    const endpoint = esFavorito ? "/api/contenido/eliminar" : "/api/contenido/favorito";
    const method = esFavorito ? "DELETE" : "POST";

    await fetch(`http://localhost:3001${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: userId,
        id_api: parseInt(id!),
        id_tmdb: parseInt(id!),
        tipoGuardado: "favoritos",
      }),
    });

    setEsFavorito(!esFavorito);
    toast.success(esFavorito ? "Eliminado de favoritos" : "Añadido a favoritos");
  };

  const abrirModalHistorial = () => {
    if (yaEnHistorial) {
      toast.info("Ya está en tu historial");
      return;
    }
    setModalVisible(true);
  };

  const guardarEnHistorialConPuntuacion = async () => {
    const nota = parseInt(puntuacion, 10);
    if (!nota || nota < 1 || nota > 10) {
      toast.error("❌ Puntuación inválida (1-10)");
      return;
    }

    const tipoContenido = tipo === "movie" ? "pelicula" : "serie";

    try {
      // 1. Agregar a historial
      await fetch("http://localhost:3001/contenido/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_api: parseInt(id!),
          tipoGuardado: "historial",
        }),
      });

      // 2. Agregar puntuación
      await fetch("http://localhost:3001/contenido/calificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_api: parseInt(id!),
          tipo: tipoContenido,
          puntuacion: nota,
          comentario,
          tipoGuardado: "historial",
        }),
      });

      toast.success("✅ Contenido añadido a historial y calificado");
      setYaEnHistorial(true);
      setModalVisible(false);
      setPuntuacion("");
      setComentario("");
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error("Error al guardar historial o calificación");
    }
  };

  if (!pelicula) return <p className="p-6">Cargando contenido...</p>;

  function toggleTemporadaVista(idTemporada: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="bg-white text-black">
      {/* Cabecera */}
      {pelicula.posterUrl && (
        <div
          className="relative min-h-[40vh] flex items-center justify-center px-6 py-12"
          style={{
            backgroundImage: `url(${pelicula.posterUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row gap-8 items-start">
            <img
              src={pelicula.posterUrl}
              alt={pelicula.titulo}
              className="w-full md:w-64 rounded-xl shadow-lg object-cover"
            />
            <div className="flex-1 space-y-3 text-white">
              <h1 className="text-6xl font-bold">
                {pelicula.titulo}
                <span className="text-gray-300 text-2xl font-light">
                  ({new Date(pelicula.fecha).getFullYear()})
                </span>
              </h1>
              <p className="text-gray-200 text-xl">{pelicula.sinopsis}</p>
              <p className="text-xl text-gray-300">
                Fecha oficial de Lanzamiento: <b>{pelicula.fecha}</b>
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={toggleFavorito}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow transition ${
                    esFavorito
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-white/30 text-white hover:bg-white/50"
                  }`}
                >
                  ❤️ {esFavorito ? "En Favoritos" : "Añadir a Favoritos"}
                </button>

                <button
                  onClick={abrirModalHistorial}
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  🎬 Añadir a Historial
                </button>
              </div>
            </div>

            {mediaUsuarios && (
              <div className="hidden md:block md:w-60">
                <NotaMedia media={mediaUsuarios} totalResenas={totalResenas} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contenido inferior */}
      <div className="w-full bg-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8 flex justify-start">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/30 hover:bg-white/40 text-black font-medium shadow-sm transition"
            >
              Ir al Home
            </button>
          </div>

          {temporadas.length > 0 && (
            <TemporadasContenido
              temporadas={temporadas}
              vistas={vistas}
              editable={editable}
              toggleTemporadaVista={toggleTemporadaVista}
            />
          )}

          {pelicula.reparto.length > 0 && (
            <RepartoContenido reparto={pelicula.reparto} />
          )}

          <ResenasDeUsuarios id_api={id!} tipo={tipo as "tv" | "pelicula"} />
        </div>
      </div>

      {modalVisible && (
        <ModalPuntuacion
          isOpen={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setPuntuacion("");
            setComentario("");
          }}
          item={{
            id: parseInt(id!),
            title: pelicula?.titulo,
            media_type: tipo as "movie" | "tv",
          }}
          tipo="historial"
          onSubmit={guardarEnHistorialConPuntuacion}
          puntuacion={puntuacion}
          setPuntuacion={setPuntuacion}
          comentario={comentario}
          setComentario={setComentario}
        />
      )}
    </div>
  );
}
