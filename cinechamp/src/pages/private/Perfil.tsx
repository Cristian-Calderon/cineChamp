import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Search from "./Search";

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

interface PerfilProps {
  onLogout: () => void;
}

export default function Perfil({ onLogout }: PerfilProps) {
  const { nick } = useParams();
  const location = useLocation(); // 👈 para detectar query param
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile>({ name: "", photoUrl: "" });
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [historial, setHistorial] = useState<Movie[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [query, setQuery] = useState("");
  const [nickAmigo, setNickAmigo] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [amigos, setAmigos] = useState<Amigo[]>([]);

  const goHome = () => navigate("/");

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
        setUserId(user.id);
        setProfile({
          name: user.nick,
          photoUrl: user.avatar || "https://i.pravatar.cc/150?img=3",
        });
      })
      .catch((err) => {
        console.error("Error al obtener usuario:", err);
        navigate("/login");
      });
  }, [nick, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    fetch(`/api/contenido/favoritos/${userId}`, {
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

    fetch(`/api/contenido/historial/${userId}`, {
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

    fetch(`http://localhost:3001/api/amigos/solicitudes/${userId}`)
      .then((res) => res.json())
      .then(setSolicitudes)
      .catch(console.error);

    fetch(`http://localhost:3001/api/amigos/lista/${userId}`)
      .then((res) => res.json())
      .then(setAmigos)
      .catch(console.error);
  }, [userId]);

  const cargarLogros = async () => {
    const token = localStorage.getItem("token");
    if (!nick || !token || !userId) return;

    try {
      // 🧠 Primero forza verificación
      await fetch(`http://localhost:3001/api/logros/forzar/${userId}`);

      // 📥 Luego carga los logros actualizados
      const res = await fetch(`http://localhost:3001/api/logros/${nick}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nuevos = await res.json();
      setAchievements(nuevos);
    } catch (err) {
      console.error("Error al cargar logros:", err);
    }
  };


  // ✅ Cargar logros al inicio Y si ?refrescar=1 está en la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const necesitaRecarga = params.get("refrescar") === "1";
    if (necesitaRecarga) {
      console.log("🔁 Refrescando logros por query param");
    }
    cargarLogros();
  }, [nick, userId, location.search]);

  const buscarPeliculas = () => {
    if (!query || !nick) return;
    navigate(`/id/${nick}/resultados?q=${encodeURIComponent(query)}`);
  };

  const buscarAmigo = () => {
    if (!nickAmigo) return;
    navigate(`/usuario/resultado?nick=${encodeURIComponent(nickAmigo)}`);
  };

  const aceptarSolicitud = async (amigoId: number) => {
    const res = await fetch(`http://localhost:3001/api/amigos/solicitud/${amigoId}/aceptar`, {
      method: "POST",
    });
    const data = await res.json();
    if (res.ok) {
      setSolicitudes((prev) => prev.filter((s) => s.id !== amigoId));
    } else {
      alert("❌ Error al aceptar: " + data.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  return (

    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">CineChamp</h1>

      {/* Perfil y buscadores */}
      <div className="w-full bg-white border rounded-xl p-4 shadow-md mb-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 border-4 border-gray-300 rounded-full overflow-hidden">
            <img src={profile.photoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-lg font-semibold">{profile.name}</p>
            <button
              onClick={() => navigate(`/editar-perfil`)}
              className="mt-1 bg-indigo-600 text-white px-3 py-1 rounded text-sm"
            >Editar Perfil</button>
            <button onClick={handleLogout} className="mt-2 ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm">Cerrar sesión</button>
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
              <div className="mt-2 text-right">
                     <button
                  onClick={() =>
                    navigate(`/usuario/${nick}/lista/favoritos/${type}`)
                  }
                  className="text-blue-600 text-sm hover:underline"
                >
                  Ver más →
                </button>

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
              <div className="mt-2 text-right">
                    <button
                  onClick={() =>
                    navigate(`/usuario/${nick}/lista/historial/${type}`)
                  }
                  className="text-blue-600 text-sm hover:underline"
                >
                  Ver más →
                </button>
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
            <h2 className="text-2xl font-semibold mb-4">Mis Amigos</h2>
            {amigos.length === 0 ? (
              <p className="text-gray-500">No tienes amigos aún.</p>
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

      {/* Solicitudes */}
      <div className="border rounded-xl p-4 shadow-md mt-6">
        <h2 className="text-2xl font-semibold mb-4">Solicitudes de amistad</h2>
        {solicitudes.length === 0 ? (
          <p className="text-gray-500">No tienes solicitudes pendientes.</p>
        ) : (
          <div className="space-y-3">
            {solicitudes.map((s) => (
              <div key={`amigo-${s.id}`} className="flex items-center gap-4">
                <img src={s.avatar || "https://i.pravatar.cc/150"} className="w-10 h-10 rounded-full object-cover border" />
                <span className="flex-1 font-medium">{s.nick}</span>
                <button onClick={() => aceptarSolicitud(s.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Aceptar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
