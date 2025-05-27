import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Carrusel from "../../components/CarucelContenido/Carrusel";
import LogrosPreview from "../../components/Logros/LogrosComponentes";
import AmigosComponentes from "../../components/Social/AmigosComponente";
import UltimasCalificaciones from "../../components/Calificaciones/UltimasCalificaciones";
import PerfilHeader from "../../components/PerfilHeader/PerfilHeader";
import BuscadorUnificado from "../../components/BuscadorUnificado/BuscadorUnificado";
import logo from "../../assets/imagen-header-logo/LogoCineChamp.png";

// URL base de la API
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  media_type: "movie" | "tv";
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  unlocked: boolean;
};

type Amigo = {
  id: number;
  nick: string;
  avatar: string;
};

type SolicitudEstado = "ninguna" | "pendiente" | "amigos";

export default function PerfilPublico() {
  const { nick } = useParams<{ nick: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<{ name: string; photoUrl: string }>({ name: "", photoUrl: "" });
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [historial, setHistorial] = useState<Movie[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [calificaciones, setCalificaciones] = useState<any[]>([]);
  const [estadoRelacion, setEstadoRelacion] = useState<SolicitudEstado | null>(null);

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");
  const [userIdPerfil, setUserIdPerfil] = useState<number | null>(null);

  const loggedNick = localStorage.getItem("nick");

  // Verificar token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

    useEffect(() => {
    if (nick && loggedNick === nick) {
      navigate(`/id/${nick}`, { replace: true });
    }
  }, [nick, loggedNick, navigate]);
  
  // Cargar datos del perfil público
  useEffect(() => {
    if (!nick) return;
    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}/api/usuarios/nick/${nick}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data as { id: number; nick: string; avatar?: string };
        setUserIdPerfil(user.id);
        const photoUrl = user.avatar ? `${BACKEND_URL}${user.avatar}` : "";
        setProfile({ name: user.nick, photoUrl });
      })
      .catch((err) => {
        console.error("Error al obtener usuario público:", err);
        navigate(`/usuario/resultado?nick=${encodeURIComponent(nick)}`);
      });
  }, [nick, navigate]);

  // Cargar contenido: favoritos, historial, logros, amigos y calificaciones
  useEffect(() => {
    if (!userIdPerfil) return;
    const token = localStorage.getItem("token");

    // Estado de relación
    fetch(
      `${BACKEND_URL}/api/amigos/estado?usuarioId=${userIdLogueado}&amigoId=${userIdPerfil}`
    )
      .then((res) => res.json())
      .then((data) => {
        const estadoStr = data.estado as string;
        let est: SolicitudEstado = "ninguna";
        if (estadoStr === "aceptado") {
          est = "amigos";
        } else if (estadoStr === "pendiente") {
          est = "pendiente";
        }
        setEstadoRelacion(est);
      })
      .catch(console.error);

    // Favoritos e historial
    if (token) {
      fetch(`${BACKEND_URL}/api/contenido/favoritos/${userIdPerfil}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setFavorites)
        .catch(console.error);

      fetch(`${BACKEND_URL}/api/contenido/historial/${userIdPerfil}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setHistorial)
        .catch(console.error);
    }

    // Lista de amigos con URL absoluta
    fetch(`${BACKEND_URL}/api/amigos/lista/${userIdPerfil}`)
      .then((res) => res.json())
      .then((data: Amigo[]) => {
        const amigosConUrl = data.map((a) => ({
          ...a,
          avatar: a.avatar ? `${BACKEND_URL}${a.avatar}` : "",
        }));
        setAmigos(amigosConUrl);
      })
      .catch(console.error);

    // Logros
    fetch(`${BACKEND_URL}/api/logros/${nick}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAchievements)
      .catch(console.error);

    // Calificaciones
    fetch(`${BACKEND_URL}/contenido/usuarios/${userIdPerfil}/calificaciones`)
      .then((res) => res.json())
      .then(setCalificaciones)
      .catch(console.error);
  }, [userIdPerfil, userIdLogueado, nick]);

  // Funciones de solicitud/amigo
  const enviarSolicitudAmistad = async () => {
    const res = await fetch(`${BACKEND_URL}/api/amigos/solicitud`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId: userIdLogueado, amigoId: userIdPerfil }),
    });
    const data = await res.json();
    if (res.ok) {
      setEstadoRelacion("pendiente");
      setAmigos((prev) => [
        ...prev,
        {
          id: userIdPerfil!,
          nick: profile.name,
          avatar: profile.photoUrl,
        },
      ]);
    } else {
      alert(data.message || data.error || "Error al enviar solicitud");
    }
  };

  const eliminarAmistad = async () => {
    const res = await fetch(`${BACKEND_URL}/api/amigos/eliminar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId: userIdLogueado, amigoId: userIdPerfil }),
    });
    const data = await res.json();
    if (res.ok) {
      setEstadoRelacion("ninguna");
      setAmigos((prev) => prev.filter((a) => a.id !== userIdPerfil));
    } else {
      alert(data.message || data.error || "Error al eliminar amistad");
    }
  };

  const handleClickContenido = (item: Movie) => {
    navigate(`/contenido/${item.media_type}/${item.id}`, { state: { editable: false } });
  };

  return (
    <div className="p-6 w-full">
      <div className="w-full bg-stone-500 border rounded-xl p-4 shadow-md mb-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <img
          src={logo}
          alt="CineChamp Logo"
          className="h-30 w-40 object-contain cursor-pointer"
          onClick={() => navigate(localStorage.getItem("nick") ? `/id/${localStorage.getItem("nick")}` : "/")}
        />
        <PerfilHeader
          photoUrl={profile.photoUrl}
          name={profile.name}
          estadoRelacion={estadoRelacion || undefined}
          onAgregarAmigo={enviarSolicitudAmistad}
          onEliminarAmigo={eliminarAmistad}
        />
        <BuscadorUnificado
          onBuscarPeliculas={(q) => navigate(`/id/${nick}/buscador?q=${encodeURIComponent(q)}`)}
          onBuscarAmigo={(n) => navigate(`/usuario/resultado?nick=${encodeURIComponent(n)}`)}
        />
      </div>

      {/* Bloque principal: historial, favoritos, logros, amigos, calificaciones */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-4/6">
          <Carrusel
            titulo="🎬 Historial - Películas"
            items={historial.filter((h) => h.media_type === "movie").slice(0, 10)}
            total={historial.filter((h) => h.media_type === "movie").length}
            onVerMas={() => navigate(`/usuario/${nick}/lista/historial/movie`)}
            onClickItem={handleClickContenido}
          />
          <Carrusel
            titulo="📺 Historial - Series"
            items={historial.filter((h) => h.media_type === "tv").slice(0, 10)}
            total={historial.filter((h) => h.media_type === "tv").length}
            onVerMas={() => navigate(`/usuario/${nick}/lista/historial/tv`)}
            onClickItem={handleClickContenido}
          />
          <Carrusel
            titulo="🎬 Películas Favoritas"
            items={favorites.filter((f) => f.media_type === "movie").slice(0, 10)}
            total={favorites.filter((f) => f.media_type === "movie").length}
            onVerMas={() => navigate(`/usuario/${nick}/lista/favoritos/movie`)}
            onClickItem={handleClickContenido}
          />
          <Carrusel
            titulo="📺 Series Favoritas"
            items={favorites.filter((f) => f.media_type === "tv").slice(0, 10)}
            total={favorites.filter((f) => f.media_type === "tv").length}
            onVerMas={() => navigate(`/usuario/${nick}/lista/favoritos/tv`)}
            onClickItem={handleClickContenido}
          />
        </div>

        <div className="w-full lg:w-1/2 space-y-4">
          <LogrosPreview achievements={achievements} />
          <AmigosComponentes amigos={amigos} />
          <UltimasCalificaciones calificaciones={calificaciones.map(cal => ({ ...cal, id: cal.id.toString() }))} />
        </div>
      </div>
    </div>
  );
}
