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
  const token = localStorage.getItem("token");

  const [modalVisible, setModalVisible] = useState(false);
  const [puntuacion, setPuntuacion] = useState("");
  const [comentario, setComentario] = useState("");

  // =====================================================
  // CARGAR CONTENIDO
  // =====================================================

  useEffect(() => {
    if (!id || !tipo) return;

    // -----------------------------------------------------
    // Detalles del contenido - PÚBLICO
    // -----------------------------------------------------

    fetch(`http://localhost:3001/api/contenido/detalles/${tipo}/${id}`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al cargar contenido");
        }

        return data;
      })
      .then(setPelicula)
      .catch((error) => {
        console.error("❌ Error al cargar contenido:", error);
      });

    // -----------------------------------------------------
    // Comentarios - PÚBLICO
    // -----------------------------------------------------

    fetch(`http://localhost:3001/api/contenido/comentarios/${id}`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al cargar comentarios");
        }

        return data;
      })
      .then((data) => {
        setMediaUsuarios(data.media || null);
        setTotalResenas(
          Array.isArray(data.reseñas) ? data.reseñas.length : 0
        );
      })
      .catch((error) => {
        console.error("❌ Error al cargar comentarios:", error);
      });

    // -----------------------------------------------------
    // Series
    // -----------------------------------------------------

    if (tipo === "tv") {
      // Estructura de series - PÚBLICA
      fetch(
        `http://localhost:3001/contenido/series/${id}/tmdb/estructura-simple`
      )
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(
              data.error || "Error al cargar temporadas"
            );
          }

          return data;
        })
        .then((data) => {
          setTemporadas(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error("❌ Error al cargar temporadas:", error);
          setTemporadas([]);
        });

      // Temporadas vistas - PROTEGIDA
      fetch(
        `http://localhost:3001/contenido/temporadas-vistas/${userId}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(
              data.error || "Error al cargar temporadas vistas"
            );
          }

          return data;
        })
        .then((data) => {
          const estado: Record<number, boolean> = {};

          if (Array.isArray(data)) {
            data.forEach((t: number) => {
              estado[t] = true;
            });
          }

          setVistas(estado);
        })
        .catch((error) => {
          console.error(
            "❌ Error al cargar temporadas vistas:",
            error
          );
          setVistas({});
        });
    }

    // -----------------------------------------------------
    // FAVORITOS - PROTEGIDA
    // -----------------------------------------------------

    fetch(
      `http://localhost:3001/api/contenido/favoritos/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Error al cargar favoritos"
          );
        }

        return data;
      })
      .then((data) => {
        const favoritos = Array.isArray(data) ? data : [];

        const fav = favoritos.some(
          (f: { id: number }) =>
            Number(f.id) === Number(id)
        );

        setEsFavorito(fav);
      })
      .catch((error) => {
        console.error(
          "❌ Error al cargar favoritos:",
          error
        );
        setEsFavorito(false);
      });

    // -----------------------------------------------------
    // HISTORIAL - PROTEGIDA
    // -----------------------------------------------------

    fetch(
      `http://localhost:3001/api/contenido/historial/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Error al cargar historial"
          );
        }

        return data;
      })
      .then((data) => {
        const historial = Array.isArray(data) ? data : [];

        const existe = historial.some(
          (item: { id: number }) =>
            Number(item.id) === Number(id)
        );

        setYaEnHistorial(existe);
      })
      .catch((error) => {
        console.error(
          "❌ Error al cargar historial:",
          error
        );
        setYaEnHistorial(false);
      });

  }, [id, tipo, userId, token]);

  // =====================================================
  // FAVORITOS
  // =====================================================

  const toggleFavorito = async () => {
    const endpoint = esFavorito
      ? "/api/contenido/eliminar"
      : "/api/contenido/favorito";

    const method = esFavorito ? "DELETE" : "POST";

    try {
      const response = await fetch(
        `http://localhost:3001${endpoint}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_usuario: userId,
            id_api: parseInt(id!),
            id_tmdb: parseInt(id!),
            tipoGuardado: "favoritos",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Error al modificar favoritos"
        );
      }

      setEsFavorito(!esFavorito);

      toast.success(
        esFavorito
          ? "Eliminado de favoritos"
          : "Añadido a favoritos"
      );
    } catch (error) {
      console.error(
        "❌ Error con favoritos:",
        error
      );

      toast.error(
        "Error al modificar favoritos"
      );
    }
  };

  // =====================================================
  // ELIMINAR DEL HISTORIAL
  // =====================================================

  const eliminarDelHistorial = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/contenido/eliminar",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_usuario: userId,
            id_api: parseInt(id!),
            tipoGuardado: "historial",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo eliminar del historial"
        );
      }

      setYaEnHistorial(false);

      toast.success(
        "🗑️ Eliminado del historial"
      );
    } catch (error) {
      console.error(
        "❌ Error al eliminar del historial:",
        error
      );

      toast.error(
        "Error al eliminar del historial"
      );
    }
  };

  // =====================================================
  // ABRIR MODAL HISTORIAL
  // =====================================================

  const abrirModalHistorial = () => {
    if (yaEnHistorial) {
      return;
    }

    setModalVisible(true);
  };

  // =====================================================
  // GUARDAR EN HISTORIAL + CALIFICAR
  // =====================================================

  const guardarEnHistorialConPuntuacion = async () => {
    const nota = parseInt(puntuacion, 10);

    if (!nota || nota < 1 || nota > 10) {
      toast.error(
        "❌ Puntuación inválida (1-10)"
      );
      return;
    }

    const tipoContenido =
      tipo === "movie"
        ? "pelicula"
        : "serie";

    try {
      // -----------------------------------------------
      // Añadir al historial
      // -----------------------------------------------

      const responseHistorial = await fetch(
        "http://localhost:3001/contenido/agregar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_usuario: userId,
            id_api: parseInt(id!),
            tipo: tipoContenido,
          }),
        }
      );

      const dataHistorial =
        await responseHistorial.json();

      if (!responseHistorial.ok) {
        throw new Error(
          dataHistorial.error ||
            "Error al añadir al historial"
        );
      }

      // -----------------------------------------------
      // Calificar contenido
      // -----------------------------------------------

      const responseCalificacion = await fetch(
        "http://localhost:3001/contenido/calificar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_usuario: userId,
            id_api: parseInt(id!),
            tipo: tipoContenido,
            puntuacion: nota,
            comentario,
            tipoGuardado: "historial",
          }),
        }
      );

      const dataCalificacion =
        await responseCalificacion.json();

      if (!responseCalificacion.ok) {
        throw new Error(
          dataCalificacion.error ||
            "Error al guardar la calificación"
        );
      }

      toast.success(
        "✅ Contenido añadido a historial y calificado"
      );

      setYaEnHistorial(true);
      setModalVisible(false);
      setPuntuacion("");
      setComentario("");
    } catch (err) {
      console.error(
        "❌ Error al guardar historial o calificación:",
        err
      );

      toast.error(
        "Error al guardar historial o calificación"
      );
    }
  };

  // =====================================================
  // TEMPORADAS VISTAS
  // =====================================================

  const toggleTemporadaVista = async (
    idTemporada: number
  ) => {
    const yaVista = vistas[idTemporada];

    try {
      const method = yaVista
        ? "DELETE"
        : "POST";

      const response = await fetch(
        "http://localhost:3001/contenido/temporada/vista",
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_usuario: userId,
            id_contenido: parseInt(id!),
            id_temporada: idTemporada,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Error al actualizar temporada vista"
        );
      }

      setVistas((prev) => ({
        ...prev,
        [idTemporada]: !yaVista,
      }));

      toast.success(
        yaVista
          ? "Temporada desmarcada como vista"
          : "Temporada marcada como vista"
      );
    } catch (err) {
      console.error(
        "❌ Error al marcar temporada como vista:",
        err
      );

      toast.error(
        "Error al actualizar temporada vista"
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  if (!pelicula) {
    return (
      <p className="p-6">
        Cargando contenido...
      </p>
    );
  }

  return (
    <div className="bg-white text-black">

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

              <p className="text-gray-200 text-xl">
                {pelicula.sinopsis}
              </p>

              <p className="text-xl text-gray-300">
                Fecha oficial de Lanzamiento:{" "}
                <b>{pelicula.fecha}</b>
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
                  ❤️{" "}
                  {esFavorito
                    ? "En Favoritos"
                    : "Añadir a Favoritos"}
                </button>

                <button
                  onClick={
                    yaEnHistorial
                      ? eliminarDelHistorial
                      : abrirModalHistorial
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow transition ${
                    yaEnHistorial
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {yaEnHistorial
                    ? "🗑️ Eliminar de Historial"
                    : "🎬 Añadir a Historial"}
                </button>

              </div>
            </div>

            {mediaUsuarios && (
              <div className="hidden md:block md:w-60">
                <NotaMedia
                  media={mediaUsuarios}
                  totalResenas={totalResenas}
                />
              </div>
            )}

          </div>
        </div>
      )}

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
              toggleTemporadaVista={
                toggleTemporadaVista
              }
            />
          )}

          {pelicula.reparto.length > 0 && (
            <RepartoContenido
              reparto={pelicula.reparto}
            />
          )}

          <ResenasDeUsuarios
            id_api={id!}
            tipo={tipo as "tv" | "pelicula"}
          />

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
          onSubmit={
            guardarEnHistorialConPuntuacion
          }
          puntuacion={puntuacion}
          setPuntuacion={setPuntuacion}
          comentario={comentario}
          setComentario={setComentario}
        />
      )}

    </div>
  );
}