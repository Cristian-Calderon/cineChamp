import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Carrusel from "../../components/CarucelContenido/Carrusel";
import LogrosPreview from "../../components/Logros/LogrosComponentes";
import AmigosComponentes from "../../components/Social/AmigosComponente";
import UltimasCalificaciones from "../../components/Calificaciones/UltimasCalificaciones";
import PerfilHeader from "../../components/PerfilHeader/PerfilHeader";
import BuscadorUnificado from "../../components/BuscadorUnificado/BuscadorUnificado";
import logo from "../../assets/imagen-header-logo/logo2.jpeg";

const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";


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


type SolicitudEstado =
  | "ninguna"
  | "pendiente"
  | "amigos";


export default function PerfilPublico() {

  const { nick } = useParams<{
    nick: string;
  }>();

  const navigate = useNavigate();


  const [profile, setProfile] = useState<{
    name: string;
    photoUrl: string;
  }>({
    name: "",
    photoUrl: "",
  });


  const [favorites, setFavorites] =
    useState<Movie[]>([]);

  const [historial, setHistorial] =
    useState<Movie[]>([]);

  const [achievements, setAchievements] =
    useState<Achievement[]>([]);

  const [amigos, setAmigos] =
    useState<Amigo[]>([]);

  const [calificaciones, setCalificaciones] =
    useState<any[]>([]);

  const [estadoRelacion, setEstadoRelacion] =
    useState<SolicitudEstado | null>(null);


  const userIdLogueado = parseInt(
    localStorage.getItem("userId") || "0"
  );

  const [userIdPerfil, setUserIdPerfil] =
    useState<number | null>(null);


  const loggedNick =
    localStorage.getItem("nick");


  // =====================================================
  // COMPROBAR TOKEN
  // =====================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

  }, [navigate]);


  // =====================================================
  // SI ES EL PROPIO PERFIL
  // =====================================================

  useEffect(() => {

    if (
      nick &&
      loggedNick === nick
    ) {
      navigate(
        `/id/${nick}`,
        { replace: true }
      );
    }

  }, [
    nick,
    loggedNick,
    navigate,
  ]);


  // =====================================================
  // OBTENER USUARIO
  // =====================================================

  useEffect(() => {

    if (!nick) return;

    const token =
      localStorage.getItem("token");

    axios
      .get(
        `${BACKEND_URL}/api/usuarios/nick/${nick}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )
      .then((res) => {

        const user = res.data as {
          id: number;
          nick: string;
          avatar?: string;
        };

        setUserIdPerfil(user.id);

        const photoUrl =
          user.avatar
            ? `${BACKEND_URL}${user.avatar}`
            : "";

        setProfile({
          name: user.nick,
          photoUrl,
        });

      })
      .catch((err) => {

        console.error(
          "❌ Error al obtener usuario público:",
          err
        );

        navigate(
          `/usuario/resultado?nick=${encodeURIComponent(
            nick
          )}`
        );

      });

  }, [
    nick,
    navigate,
  ]);


  // =====================================================
  // CARGAR DATOS DEL PERFIL
  // =====================================================

  useEffect(() => {

    if (!userIdPerfil) return;

    const token =
      localStorage.getItem("token");

    if (!token) return;


    // ===================================================
    // ESTADO DE AMISTAD
    // ===================================================

    fetch(
      `${BACKEND_URL}/api/amigos/estado?usuarioId=${userIdLogueado}&amigoId=${userIdPerfil}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error ||
              "Error al obtener estado"
          );
        }

        return data;

      })
      .then((data) => {

        const estadoStr =
          data.estado as string;

        let est: SolicitudEstado =
          "ninguna";

        if (
          estadoStr === "aceptado"
        ) {
          est = "amigos";
        }

        if (
          estadoStr === "pendiente"
        ) {
          est = "pendiente";
        }

        setEstadoRelacion(est);

      })
      .catch((error) => {

        console.error(
          "❌ Error estado amistad:",
          error
        );

        setEstadoRelacion(
          "ninguna"
        );

      });


    // ===================================================
    // FAVORITOS
    // ===================================================

    fetch(
      `${BACKEND_URL}/api/contenido/favoritos/${userIdPerfil}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {

        const data =
          await res.json();

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

        setFavorites(data);

      })
      .catch((error) => {

        console.error(
          "❌ Error al cargar favoritos:",
          error
        );

        setFavorites([]);

      });


    // ===================================================
    // HISTORIAL
    // ===================================================

    fetch(
      `${BACKEND_URL}/api/contenido/historial/${userIdPerfil}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {

        const data =
          await res.json();

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

        setHistorial(data);

      })
      .catch((error) => {

        console.error(
          "❌ Error al cargar historial:",
          error
        );

        setHistorial([]);

      });


    // ===================================================
    // LISTA DE AMIGOS
    // ===================================================

    fetch(
      `${BACKEND_URL}/api/amigos/lista/${userIdPerfil}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {

        const data =
          await res.json();

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

        const amigosConUrl =
          data.map((a) => ({
            ...a,

            avatar: a.avatar
              ? `${BACKEND_URL}${a.avatar}`
              : "",
          }));

        setAmigos(
          amigosConUrl
        );

      })
      .catch((error) => {

        console.error(
          "❌ Error al cargar amigos:",
          error
        );

        setAmigos([]);

      });


    // ===================================================
    // LOGROS
    // ===================================================

    fetch(
      `${BACKEND_URL}/api/logros/${nick}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error ||
              "Error al cargar logros"
          );
        }

        return Array.isArray(data)
          ? data
          : [];

      })
      .then((data) => {

        setAchievements(data);

      })
      .catch((error) => {

        console.error(
          "❌ Error al cargar logros:",
          error
        );

        setAchievements([]);

      });


    // ===================================================
    // CALIFICACIONES
    // ===================================================

    fetch(
      `${BACKEND_URL}/contenido/usuarios/${userIdPerfil}/calificaciones`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {

        const data =
          await res.json();

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

  }, [
    userIdPerfil,
    userIdLogueado,
    nick,
  ]);


  // =====================================================
  // ENVIAR SOLICITUD
  // =====================================================

  const enviarSolicitudAmistad =
    async () => {

      if (!userIdPerfil) return;

      const token =
        localStorage.getItem("token");

      try {

        const res =
          await fetch(
            `${BACKEND_URL}/api/amigos/solicitud`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                usuarioId:
                  userIdLogueado,

                amigoId:
                  userIdPerfil,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error ||
              "Error al enviar solicitud"
          );
        }

        setEstadoRelacion(
          "pendiente"
        );

      } catch (error) {

        console.error(
          "❌ Error al enviar solicitud:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Error al enviar solicitud"
        );

      }

    };


  // =====================================================
  // ELIMINAR AMISTAD
  // =====================================================

  const eliminarAmistad =
    async () => {

      if (!userIdPerfil) return;

      const token =
        localStorage.getItem("token");

      try {

        const res =
          await fetch(
            `${BACKEND_URL}/api/amigos/eliminar`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                usuarioId:
                  userIdLogueado,

                amigoId:
                  userIdPerfil,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error ||
              "Error al eliminar amistad"
          );
        }

        setEstadoRelacion(
          "ninguna"
        );

        setAmigos(
          (prev) =>
            prev.filter(
              (a) =>
                a.id !== userIdPerfil
            )
        );

      } catch (error) {

        console.error(
          "❌ Error al eliminar amistad:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Error al eliminar amistad"
        );

      }

    };


  // =====================================================
  // CLICK CONTENIDO
  // =====================================================

  const handleClickContenido =
    (item: Movie) => {

      navigate(
        `/contenido/${item.media_type}/${item.id}`,
        {
          state: {
            editable: false,
          },
        }
      );

    };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="p-6 w-full">

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

          onClick={() =>
            navigate(
              localStorage.getItem(
                "nick"
              )
                ? `/id/${localStorage.getItem(
                    "nick"
                  )}`
                : "/"
            )
          }
        />


        <PerfilHeader
          photoUrl={
            profile.photoUrl
          }

          name={
            profile.name
          }

          estadoRelacion={
            estadoRelacion ||
            undefined
          }

          onAgregarAmigo={
            enviarSolicitudAmistad
          }

          onEliminarAmigo={
            eliminarAmistad
          }

          id_usuario={
            userIdPerfil ?? 0
          }
        />


        <BuscadorUnificado

          onBuscarPeliculas={(q) =>
            navigate(
              `/id/${nick}/buscador?q=${encodeURIComponent(
                q
              )}`
            )
          }

          onBuscarAmigo={(n) =>
            navigate(
              `/usuario/resultado?nick=${encodeURIComponent(
                n
              )}`
            )
          }

        />

      </div>


      {/* =================================================
          CONTENIDO
      ================================================= */}

      <div className="flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-4/6">

          <Carrusel
            titulo="🎬 Historial - Películas"

            items={
              historial
                .filter(
                  (h) =>
                    h.media_type ===
                    "movie"
                )
                .slice(0, 10)
            }

            total={
              historial.filter(
                (h) =>
                  h.media_type ===
                  "movie"
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

            items={
              historial
                .filter(
                  (h) =>
                    h.media_type ===
                    "tv"
                )
                .slice(0, 10)
            }

            total={
              historial.filter(
                (h) =>
                  h.media_type ===
                  "tv"
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
            titulo="🎬 Películas Favoritas"

            items={
              favorites
                .filter(
                  (f) =>
                    f.media_type ===
                    "movie"
                )
                .slice(0, 10)
            }

            total={
              favorites.filter(
                (f) =>
                  f.media_type ===
                  "movie"
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
            titulo="📺 Series Favoritas"

            items={
              favorites
                .filter(
                  (f) =>
                    f.media_type ===
                    "tv"
                )
                .slice(0, 10)
            }

            total={
              favorites.filter(
                (f) =>
                  f.media_type ===
                  "tv"
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
            achievements={
              achievements
            }
          />


          <AmigosComponentes
            amigos={amigos}
          />


          <UltimasCalificaciones
            calificaciones={
              calificaciones.map(
                (cal) => ({
                  ...cal,
                  id:
                    cal.id.toString(),
                })
              )
            }
          />

        </div>

      </div>

    </div>
  );
}