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
  const [estadoRelacion, setEstadoRelacion] = useState<"ninguna" | "pendiente" | "amigos" | null>(null);

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");
  const [userIdPerfil, setUserIdPerfil] = useState<number | null>(null);

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
        const user = res.data as { id: number; nick: string; avatar?: string };
        setUserIdPerfil(user.id);
        setProfile({
          name: user.nick,
          photoUrl: user.avatar || "",
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
      .then((data) => {
        let estado = data.estado;
        if (estado === "aceptado") estado = "amigos";
        if (estado === null) estado = "ninguna";
        setEstadoRelacion(estado);
      })
      .catch(console.error);

    fetch(`/api/contenido/favoritos/${userIdPerfil}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFavorites)
      .catch(console.error);

    fetch(`/api/contenido/historial/${userIdPerfil}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setHistorial)
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
    setEstadoRelacion("ninguna");
  };

  // 👇 Esta función navega con editable: false
  const handleClickContenido = (item: any) => {
    navigate(`/contenido/${item.media_type}/${item.id}`, {
      state: { editable: false },
    });
  };

  return (
    <div className="p-6 w-full">
      <div className="w-full bg-stone-500 border rounded-xl p-4 shadow-md mb-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <img
          src={logo}
          alt="CineChamp Logo"
          className="h-30 w-40 object-contain cursor-pointer"
          onClick={() => {
            const storedNick = localStorage.getItem("nick");
            if (storedNick) {
              navigate(`/id/${storedNick}`);
            } else {
              navigate("/");
            }
          }}
        />
        <PerfilHeader
          photoUrl={profile.photoUrl}
          name={profile.name}
          estadoRelacion={estadoRelacion === null ? undefined : estadoRelacion}
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
            items={historial.filter((h: any) => h.media_type === "movie").slice(0, 10)}
            total={historial.filter((h: any) => h.media_type === "movie").length}
            onVerMas={() => navigate(`/usuario/${nick}/lista/historial/movie`)}
            onClickItem={handleClickContenido}
          />

          <Carrusel
            titulo="📺 Historial - Series"
            items={historial.filter((h: any) => h.media_type === "tv").slice(0, 10)}
            total={historial.filter((h: any) => h.media_type === "tv").length}
            onVerMas={() => navigate(`/usuario/${nick}/lista/historial/tv`)}
            onClickItem={handleClickContenido}
          />

          <Carrusel
            titulo="🎬 Tus Películas Favoritas"
            items={favorites.filter((f: any) => f.media_type === "movie").slice(0, 10)}
            total={favorites.filter((f: any) => f.media_type === "movie").length}
            onVerMas={() => navigate(`/usuario/${nick}/lista/favoritos/movie`)}
            onClickItem={handleClickContenido}
          />

          <Carrusel
            titulo="📺 Tus Series Favoritas"
            items={favorites.filter((f: any) => f.media_type === "tv").slice(0, 10)}
            total={favorites.filter((f: any) => f.media_type === "tv").length}
            onVerMas={() => navigate(`/usuario/${nick}/lista/favoritos/tv`)}
            onClickItem={handleClickContenido}
          />
        </div>

        <div className="w-full lg:w-1/2 space-y-4">
          <LogrosPreview achievements={achievements} />
          <AmigosComponentes amigos={amigos} />
          <UltimasCalificaciones
            calificaciones={calificaciones.map((cal: any) => ({
              ...cal,
              id: cal.id.toString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
