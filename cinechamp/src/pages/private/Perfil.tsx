import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import Carrusel from "../../components/CarucelContenido/Carrusel";
import LogrosPreview from "../../components/Logros/LogrosComponentes";
import AmigosComponentes from "../../components/Social/AmigosComponente";
import UltimasCalificaciones from "../../components/Calificaciones/UltimasCalificaciones";
import SolicitudesAmistad from "../../components/Social/SolicitudesAmistad";
import PerfilHeader from "../../components/PerfilHeader/PerfilHeader";
import BuscadorUnificado from "../../components/BuscadorUnificado/BuscadorUnificado";
import logo from "../../assets/imagen-header-logo/logo2.jpeg";


type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  media_type: "movie" | "tv";
};


type Profile = {
  name: string;
  photoUrl: string;
  nivelUsuario?: number;
};


type Achievement = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  unlocked: boolean;
};


type UserResponse = {
  id: number;
  nick: string;
  avatar?: string;
};


type Solicitud = {
  id: number;
  usuario_id: number;
  nick: string;
  avatar: string;
};


type Amigo = {
  id: number;
  nick: string;
  avatar: string;
};


type Calificacion = {
  id: string;
  titulo: string;
  puntuacion: number;
  comentario: string;
  tipo: "movie" | "tv";
  posterUrl: string;
};


interface PerfilProps {
  onLogout: () => void;
}


export default function Perfil({ onLogout }: PerfilProps) {

  const BACKEND_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001";

  const { nick } = useParams();
  const location = useLocation();
  const navigate = useNavigate();


  const [profile, setProfile] = useState<Profile>({
    name: "",
    photoUrl: "",
  });

  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [historial, setHistorial] = useState<Movie[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [calificaciones, setCalificaciones] =
    useState<Calificacion[]>([]);


  // =====================================================
  // COMPROBAR LOGIN
  // =====================================================

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

  }, [navigate]);


  // =====================================================
  // OBTENER USUARIO POR NICK
  // =====================================================

  useEffect(() => {

    if (!nick) return;

    const token = localStorage.getItem("token");

    axios
      .get<UserResponse>(
        `${BACKEND_URL}/api/usuarios/nick/${nick}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {

        const user = res.data;

        setUserId(user.id);

        setProfile({
          name: user.nick,

          photoUrl: user.avatar
            ? `${BACKEND_URL}${user.avatar}`
            : "",
        });

      })
      .catch((err) => {

        console.error(
          "❌ Error al obtener usuario:",
          err
        );

        navigate("/login");

      });

  }, [nick, navigate, BACKEND_URL]);


  // =====================================================
  // CARGAR CONTENIDO DEL USUARIO
  // =====================================================

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!userId || !token) return;


    // ---------------------------------------------------
    // FAVORITOS
    // ---------------------------------------------------

    fetch(
      `${BACKEND_URL}/contenido/favoritos/${userId}`,
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
            data?.error ||
            "Error al cargar favoritos"
          );
        }

        return Array.isArray(data)
          ? data
          : [];

      })
      .then((data) => {

        const conTipo = data.map(
          (item: any) => ({
            ...item,
            media_type:
              item.media_type || "movie",
          })
        );

        setFavorites(conTipo);

      })
      .catch((error) => {

        console.error(
          "❌ Error al cargar favoritos:",
          error
        );

        setFavorites([]);

      });


    // ---------------------------------------------------
    // HISTORIAL
    // ---------------------------------------------------

    fetch(
      `${BACKEND_URL}/contenido/historial/${userId}`,
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
            data?.error ||
            "Error al cargar historial"
          );
        }

        return Array.isArray(data)
          ? data
          : [];

      })
      .then((data) => {

        const conTipo = data.map(
          (item: any) => ({
            ...item,
            media_type:
              item.media_type || "movie",
          })
        );

        setHistorial(conTipo);

      })
      .catch((error) => {

        console.error(
          "❌ Error al cargar historial:",
          error
        );

        setHistorial([]);

      });


    // ---------------------------------------------------
    // SOLICITUDES
    // ---------------------------------------------------

    fetch(
      `${BACKEND_URL}/api/amigos/solicitudes/${userId}`,
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
            data?.error ||
            "Error al cargar solicitudes"
          );
        }

        return Array.isArray(data)
          ? data
          : [];

      })
      .then((data) => {

        setSolicitudes(data);

      })
      .catch((error) => {

        console.error(
          "❌ Error al cargar solicitudes:",
          error
        );

        setSolicitudes([]);

      });


    // ---------------------------------------------------
    // AMIGOS
    // ---------------------------------------------------

    fetch(
      `${BACKEND_URL}/api/amigos/lista/${userId}`,
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
            data?.error ||
            "Error al cargar amigos"
          );
        }

        return Array.isArray(data)
          ? data
          : [];

      })
      .then((data: Amigo[]) => {

        const amigosConUrl = data.map(
          (a) => ({
            ...a,

            avatar: a.avatar
              ? `${BACKEND_URL}${a.avatar}`
              : "",
          })
        );

        setAmigos(amigosConUrl);

      })
      .catch((error) => {

        console.error(
          "❌ Error al cargar amigos:",
          error
        );

        setAmigos([]);

      });


    // ---------------------------------------------------
    // CALIFICACIONES
    // ---------------------------------------------------

    fetch(
      `${BACKEND_URL}/contenido/usuarios/${userId}/calificaciones`
    )
      .then(async (res) => {

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error ||
            "Error al cargar calificaciones"
          );
        }

        return Array.isArray(data)
          ? data
          : [];

      })
      .then((data) => {

        setCalificaciones(data);

      })
      .catch((error) => {

        console.error(
          "❌ Error al cargar calificaciones:",
          error
        );

        setCalificaciones([]);

      });

  }, [userId, BACKEND_URL]);


  // =====================================================
  // CARGAR LOGROS
  // =====================================================

  useEffect(() => {

    if (!nick || !userId) return;

    const cargarLogros = async () => {

      const token =
        localStorage.getItem("token");

      if (!token) return;

      try {

        await fetch(
          `${BACKEND_URL}/api/logros/forzar/${userId}`
        );

        const res = await fetch(
          `${BACKEND_URL}/api/logros/${nick}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const nuevos = await res.json();

        if (!res.ok) {
          throw new Error(
            nuevos?.error ||
            "Error al cargar logros"
          );
        }

        setAchievements(
          Array.isArray(nuevos)
            ? nuevos
            : []
        );

      } catch (error) {

        console.error(
          "❌ Error al cargar logros:",
          error
        );

        setAchievements([]);

      }

    };

    const params =
      new URLSearchParams(
        location.search
      );

    const necesitaRecarga =
      params.get("refrescar") === "1";

    if (necesitaRecarga) {
      console.log(
        "🔁 Refrescando logros por query param"
      );
    }

    cargarLogros();

  }, [
    nick,
    userId,
    location.search,
    BACKEND_URL,
  ]);


  // =====================================================
  // ACEPTAR SOLICITUD
  // =====================================================

  const aceptarSolicitud = async (
    solicitudId: number
  ) => {

    const token =
      localStorage.getItem("token");

    try {

      const res = await fetch(
        `${BACKEND_URL}/api/amigos/solicitud/${solicitudId}/aceptar`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
          "Error al aceptar solicitud"
        );
      }


      // Buscar solicitud antes de eliminarla
      const solicitudAceptada =
        solicitudes.find(
          (s) => s.id === solicitudId
        );


      setSolicitudes(
        (prev) =>
          prev.filter(
            (s) => s.id !== solicitudId
          )
      );


      if (solicitudAceptada) {

        const nuevoAmigo: Amigo = {

          id: solicitudAceptada.usuario_id,

          nick:
            solicitudAceptada.nick,

          avatar:
            solicitudAceptada.avatar
              ? `${BACKEND_URL}${solicitudAceptada.avatar}`
              : "",
        };

        setAmigos(
          (prev) => [
            ...prev,
            nuevoAmigo,
          ]
        );

      }

    } catch (error) {

      console.error(
        "❌ Error al aceptar solicitud:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Error al aceptar solicitud"
      );

    }

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("userId");

    localStorage.removeItem("nick");

    onLogout();

    navigate("/login");

  };


  // =====================================================
  // CLICK CONTENIDO
  // =====================================================

  const handleClickContenido = (
    item: Movie
  ) => {

    navigate(
      `/contenido/${item.media_type}/${item.id}`,
      {
        state: {
          editable: true,
        },
      }
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-400 via-slate-50 to-black text-black p-6">

      <div
        className="w-full border rounded-xl p-4 shadow-md mb-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6"
        style={{
          backgroundColor: "#e6e6e6",
        }}
      >

        <img
          src={logo}
          alt="CineChamp Logo"
          className="h-30 w-40 object-contain cursor-pointer"

          onClick={() => {

            const storedNick =
              localStorage.getItem("nick");

            if (storedNick) {

              navigate(
                `/id/${storedNick}`
              );

            } else {

              navigate("/");

            }

          }}
        />


        <PerfilHeader
          id_usuario={userId ?? 0}
          photoUrl={profile.photoUrl}
          name={profile.name}
          peliculasVistas={37}
          onEditProfile={() =>
            navigate("/editar-perfil")
          }
          onLogout={handleLogout}
        />


        <BuscadorUnificado
          onBuscarPeliculas={(query) =>
            navigate(
              `/id/${nick}/buscador?q=${encodeURIComponent(query)}`
            )
          }

          onBuscarAmigo={(nickAmigo) =>
            navigate(
              `/usuario/resultado?nick=${encodeURIComponent(nickAmigo)}`
            )
          }
        />

      </div>


      <div className="flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-4/6">

          <Carrusel
            titulo="🎬 Historial - Películas"
            items={historial
              .filter(
                (h) =>
                  h.media_type === "movie"
              )
              .slice(0, 10)}
            total={
              historial.filter(
                (h) =>
                  h.media_type === "movie"
              ).length
            }
            onVerMas={() =>
              navigate(
                `/usuario/${nick}/lista/historial/movie`
              )
            }
            onClickItem={
              handleClickContenido
            }
          />


          <Carrusel
            titulo="📺 Historial - Series"
            items={historial
              .filter(
                (h) =>
                  h.media_type === "tv"
              )
              .slice(0, 10)}
            total={
              historial.filter(
                (h) =>
                  h.media_type === "tv"
              ).length
            }
            onVerMas={() =>
              navigate(
                `/usuario/${nick}/lista/historial/tv`
              )
            }
            onClickItem={
              handleClickContenido
            }
          />


          <Carrusel
            titulo="🎬 Tus Películas Favoritas"
            items={favorites
              .filter(
                (f) =>
                  f.media_type === "movie"
              )
              .slice(0, 10)}
            total={
              favorites.filter(
                (f) =>
                  f.media_type === "movie"
              ).length
            }
            onVerMas={() =>
              navigate(
                `/usuario/${nick}/lista/favoritos/movie`
              )
            }
            onClickItem={
              handleClickContenido
            }
          />


          <Carrusel
            titulo="📺 Tus Series Favoritas"
            items={favorites
              .filter(
                (f) =>
                  f.media_type === "tv"
              )
              .slice(0, 10)}
            total={
              favorites.filter(
                (f) =>
                  f.media_type === "tv"
              ).length
            }
            onVerMas={() =>
              navigate(
                `/usuario/${nick}/lista/favoritos/tv`
              )
            }
            onClickItem={
              handleClickContenido
            }
          />

        </div>


        <div className="w-full lg:w-1/2 space-y-4">

          <LogrosPreview
            achievements={achievements}
          />

          <AmigosComponentes
            amigos={amigos}
            esPropio
          />

          <UltimasCalificaciones
            calificaciones={
              calificaciones.map(
                (cal) => ({
                  ...cal,
                  id: cal.id.toString(),
                })
              )
            }
          />

          <SolicitudesAmistad
            solicitudes={
              solicitudes.map(
                (s) => ({
                  ...s,
                  id: s.id.toString(),
                })
              )
            }

            aceptarSolicitud={
              (id: string) =>
                aceptarSolicitud(
                  Number(id)
                )
            }
          />

        </div>

      </div>

    </div>
  );
}