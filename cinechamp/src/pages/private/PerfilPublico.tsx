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

export default function PerfilPublico() {
  const { nick } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "", photoUrl: "" });
  const [favorites, setFavorites] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [estadoRelacion, setEstadoRelacion] = useState(null);

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");
  const [userIdPerfil, setUserIdPerfil] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (!nick) return;
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3001/api/usuarios/nick/${nick}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        const defaultAvatar = "https://i.pravatar.cc/150?img=3";
        setUserIdPerfil(user.id);
        setProfile({
          name: user.nick,
          photoUrl: user.avatar && user.avatar.trim() !== "" ? user.avatar : defaultAvatar,
        });
      })
      .catch((err) => {
        console.error("Error al obtener usuario público:", err);
        navigate("/usuario/resultado?nick=" + nick);
      });
  }, [nick, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!userIdPerfil || !token) return;

    fetch(`http://localhost:3001/api/amigos/estado?usuarioId=${userIdLogueado}&amigoId=${userIdPerfil}`)
      .then((res) => res.json())
      .then((data) => setEstadoRelacion(data.estado))
      .catch(console.error);

    fetch(`/api/contenido/favoritos/${userIdPerfil}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch(console.error);

    fetch(`/api/contenido/historial/${userIdPerfil}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setHistorial(data))
      .catch(console.error);

    fetch(`http://localhost:3001/api/amigos/lista/${userIdPerfil}`)
      .then((res) => res.json())
      .then(setAmigos)
      .catch(console.error);

    fetch(`http://localhost:3001/api/logros/${nick}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAchievements)
      .catch(console.error);

    fetch(`http://localhost:3001/contenido/usuarios/${userIdPerfil}/calificaciones`)
      .then((res) => res.json())
      .then(setCalificaciones)
      .catch(console.error);
  }, [userIdPerfil, userIdLogueado, nick]);

  const enviarSolicitudAmistad = async () => {
    const res = await fetch("http://localhost:3001/api/amigos/solicitud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId: userIdLogueado, amigoId: userIdPerfil }),
    });
    const data = await res.json();
    alert(data.message || "Solicitud de amistad enviada.");
    setEstadoRelacion("pendiente");
  };

  const eliminarAmistad = async () => {
    const res = await fetch("http://localhost:3001/api/amigos/eliminar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId: userIdLogueado, amigoId: userIdPerfil }),
    });
    const data = await res.json();
    alert(data.message || "Amigo eliminado.");
    setEstadoRelacion(null);
  };

  return (
    <div className="p-6 w-full">
      <div className="w-full bg-stone-500 border rounded-xl p-4 shadow-md mb-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <img src={logo} alt="CineChamp Logo" className="h-30  w-40 object-contain" />
        <PerfilHeader
          photoUrl={profile.photoUrl}
          name={profile.name}
          estadoRelacion={estadoRelacion}
          onAgregarAmigo={enviarSolicitudAmistad}
          onEliminarAmigo={eliminarAmistad}
        />
        <BuscadorUnificado
          onBuscarPeliculas={(query) => navigate(`/id/${nick}/buscador?q=${encodeURIComponent(query)}`)}
          onBuscarAmigo={(nickAmigo) => navigate(`/usuario/resultado?nick=${encodeURIComponent(nickAmigo)}`)}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-4/6">
          <Carrusel
            titulo="🎬 Historial - Películas"
            items={historial.filter(h => h.media_type === "movie").slice(0, 10)}
            onVerMas={() => navigate(`/usuario/${nick}/lista/historial/movie`)}
          />
          <Carrusel
            titulo="📺 Historial - Series"
            items={historial.filter(h => h.media_type === "tv").slice(0, 10)}
            onVerMas={() => navigate(`/usuario/${nick}/lista/historial/tv`)}
          />
          <Carrusel
            titulo="🎬 Tus Películas Favoritas"
            items={favorites.filter(f => f.media_type === "movie").slice(0, 10)}
            onVerMas={() => navigate(`/usuario/${nick}/lista/favoritos/movie`)}
          />
          <Carrusel
            titulo="📺 Tus Series Favoritas"
            items={favorites.filter(f => f.media_type === "tv").slice(0, 10)}
            onVerMas={() => navigate(`/usuario/${nick}/lista/favoritos/tv`)}
          />
        </div>

        <div className="w-full lg:w-1/2 space-y-4">
          <LogrosPreview achievements={achievements} />
          <AmigosComponentes amigos={amigos} />
          <UltimasCalificaciones
            calificaciones={calificaciones.map(cal => ({
              ...cal,
              id: cal.id.toString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
