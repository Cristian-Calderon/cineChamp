import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  media_type: "movie" | "tv";
};

type Profile = {
  name: string;
  photoUrl: string;
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  image_url: string;
};

type UserResponse = {
  id: number;
  nick: string;
  avatar?: string;
};

type Amigo = {
  id: number;
  nick: string;
  avatar: string;
};

export default function PerfilPublico() {
  const { nick } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile>({ name: "", photoUrl: "" });
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [historial, setHistorial] = useState<Movie[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [query, setQuery] = useState("");
  const [nickAmigo, setNickAmigo] = useState("");
  const [userIdPerfil, setUserIdPerfil] = useState<number | null>(null);
  const [estadoRelacion, setEstadoRelacion] = useState<string | null>(null);

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (!nick) return;
    const token = localStorage.getItem("token");

    axios
      .get<UserResponse>(`http://localhost:3001/api/usuarios/nick/${nick}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        setUserIdPerfil(user.id);
        setProfile({
          name: user.nick,
          photoUrl: user.avatar || "https://i.pravatar.cc/150?img=3",
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

    // Obtener estado de relación
    fetch(`http://localhost:3001/api/amigos/estado?usuarioId=${userIdLogueado}&amigoId=${userIdPerfil}`)
      .then((res) => res.json())
      .then((data) => setEstadoRelacion(data.estado))
      .catch(console.error);

    // Favoritos
    fetch(`/api/contenido/favoritos/${userIdPerfil}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const conTipo = data.map((item: any) => ({
          ...item,
          media_type: item.media_type || "movie",
        }));
        setFavorites(conTipo);
      })
      .catch(console.error);

    // Historial
    fetch(`/api/contenido/historial/${userIdPerfil}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const conTipo = data.map((item: any) => ({
          ...item,
          media_type: item.media_type || "movie",
        }));
        setHistorial(conTipo);
      })
      .catch(console.error);

    // Amigos
    fetch(`http://localhost:3001/api/amigos/lista/${userIdPerfil}`)
      .then((res) => res.json())
      .then(setAmigos)
      .catch(console.error);

    // Logros
    fetch(`http://localhost:3001/api/logros/${nick}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAchievements)
      .catch(console.error);
  }, [userIdPerfil, userIdLogueado, nick]);

  const enviarSolicitudAmistad = async () => {
    const res = await fetch("http://localhost:3001/api/amigos/solicitud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId: userIdLogueado,
        amigoId: userIdPerfil,
      }),
    });

    const data = await res.json();
    alert(data.message || "Solicitud de amistad enviada.");
    setEstadoRelacion("pendiente");
  };

  const eliminarAmistad = async () => {
    const res = await fetch("http://localhost:3001/api/amigos/eliminar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId: userIdLogueado,
        amigoId: userIdPerfil,
      }),
    });

    const data = await res.json();
    alert(data.message || "Amigo eliminado.");
    setEstadoRelacion(null);
  };

  const buscarPeliculas = () => {
    if (!query || !nick) return;
    navigate(`/usuario/${nick}/resultados?q=${encodeURIComponent(query)}`);
  };

  const buscarAmigo = () => {
    if (!nickAmigo) return;
    navigate(`/usuario/resultado?nick=${encodeURIComponent(nickAmigo)}`);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">CineChamp - Perfil público</h1>

      {/* Perfil y buscadores */}
      <div className="w-full bg-white border rounded-xl p-4 shadow-md mb-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 border-4 border-gray-300 rounded-full overflow-hidden">
            <img src={profile.photoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-lg font-semibold">{profile.name}</p>
            {estadoRelacion === "aceptado" ? (
              <>
                <button disabled className="mt-1 bg-green-600 text-white px-3 py-1 rounded text-sm opacity-70 cursor-default">
                  ✅ Son Amigos
                </button>
                <button
                  onClick={eliminarAmistad}
                  className="mt-2 ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Eliminar Amigo
                </button>
              </>
            ) : estadoRelacion === "pendiente" ? (
              <button disabled className="mt-1 bg-yellow-500 text-white px-3 py-1 rounded text-sm opacity-70 cursor-default">
                ⏳ Pendiente
              </button>
            ) : (
              <button
                onClick={enviarSolicitudAmistad}
                className="mt-1 bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Agregar Amigo
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-end">
          <div className="flex gap-2 w-full sm:w-64">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Buscar película o serie"
            />
            <button onClick={buscarPeliculas} className="bg-blue-600 text-white px-3 rounded">Buscar</button>
          </div>
          <div className="flex gap-2 w-full sm:w-64">
            <input
              value={nickAmigo}
              onChange={(e) => setNickAmigo(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Buscar amigo"
            />
            <button onClick={buscarAmigo} className="bg-green-600 text-white px-3 rounded">Buscar</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Izquierda: Contenido */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {["movie", "tv"].map((type) => (
            <div key={`favoritos-${type}`} className="border rounded-xl p-4 shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                {type === "movie" ? "🎬 Favoritos - Películas" : "📺 Favoritos - Series"}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {favorites.filter(f => f.media_type === type).slice(0, 9).map((movie) => (
                  <div key={`${movie.id}-${type}`} className="flex flex-col items-center">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-120 h-[123px] object-cover rounded-md shadow-sm"
                    />
                    <p className="text-xs text-center mt-2 line-clamp-2">{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {["movie", "tv"].map((type) => (
            <div key={`historial-${type}`} className="border rounded-xl p-2 shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                {type === "movie" ? "🎬 Historial - Películas" : "📺 Historial - Series"}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {historial.filter(h => h.media_type === type).slice(0, 9).map((item) => (
                  <div key={`${item.id}-${type}`} className="flex flex-col items-center">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-120 h-[123px] object-cover rounded-md shadow-sm"
                    />
                    <p className="text-xs text-center mt-2 line-clamp-2">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Derecha: Logros y Amigos */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="border rounded-xl p-4 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Logros</h2>
            <div className="flex flex-wrap gap-4">
              {achievements.map((logro) => (
                <div key={logro.id} className="w-20 flex flex-col items-center text-center" title={`${logro.title} - ${logro.description}`}>
                  <img src={logro.image_url} alt={logro.title} className="w-[40px] h-[40px] object-contain border rounded shadow-md" />
                  <span className="text-xs mt-1">{logro.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-xl p-4 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Amigos</h2>
            {amigos.length === 0 ? (
              <p className="text-gray-500">Este usuario no tiene amigos aún.</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {amigos.map((amigo) => (
                  <div key={amigo.id} className="text-center">
                    <img src={amigo.avatar || "https://i.pravatar.cc/150"} className="w-14 h-14 rounded-full border mb-1 object-cover" alt={amigo.nick} />
                    <p className="text-sm">{amigo.nick}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
