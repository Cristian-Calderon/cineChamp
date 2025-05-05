import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Tipos
// ... (mismos que ya definiste arriba)

export default function Perfil({ onLogout }) {
  const { nick } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "", photoUrl: "" });
  const [favorites, setFavorites] = useState<{ id: number; posterUrl: string; title: string; media_type: string }[]>([]);
  const [historial, setHistorial] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [query, setQuery] = useState("");
  const [nickAmigo, setNickAmigo] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [amigos, setAmigos] = useState<{ id: number; nick: string; avatar?: string }[]>([]);
  const [editNick, setEditNick] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  const goHome = () => navigate("/");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (!nick) return;
    const token = localStorage.getItem("token");

    axios.get(`http://localhost:3001/api/usuarios/nick/${nick}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const user = res.data as { id: number; nick: string; avatar?: string };
        setUserId(user.id);
        setProfile({
          name: user.nick,
          photoUrl: user.avatar || "https://i.pravatar.cc/150?img=3",
        });
        setEditNick(user.nick);
        setEditAvatar(user.avatar || "");
      })
      .catch((err) => {
        console.error("Error al obtener usuario:", err);
        navigate("/login");
      });
  }, [nick, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    fetch(`http://localhost:3001/api/logros/verificar/${userId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(data => console.log("✅ Logros verificados:", data))
      .catch(err => console.error("❌ Error al verificar logros:", err));

    fetch(`http://localhost:3001/api/logros/${profile.name}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setAchievements)
      .catch(console.error);

    fetch(`/api/contenido/favoritos/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFavorites)
      .catch(console.error);

    fetch(`/api/contenido/historial/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setHistorial)
      .catch(console.error);

    fetch(`http://localhost:3001/api/amigos/solicitudes/${userId}`)
      .then((res) => res.json())
      .then(setSolicitudes)
      .catch(console.error);

    fetch(`http://localhost:3001/api/amigos/lista/${userId}`)
      .then((res) => res.json())
      .then(setAmigos)
      .catch(console.error);
  }, [userId, profile.name]);

  const buscarPeliculas = () => {
    if (!query || !nick) return;
    navigate(`/id/${nick}/resultados?q=${encodeURIComponent(query)}`);
  };

  const buscarAmigo = () => {
    if (!nickAmigo) return;
    navigate(`/usuario/resultado?nick=${encodeURIComponent(nickAmigo)}`);
  };

  interface Solicitud {
    id: number;
    nick: string;
    avatar?: string;
  }

  const aceptarSolicitud = async (amigoId: number): Promise<void> => {
    const res = await fetch(`http://localhost:3001/api/amigos/solicitud/${amigoId}/aceptar`, {
      method: "POST",
    });
    const data: { error?: string } = await res.json();
    if (res.ok) {
      setSolicitudes((prev: Solicitud[]) => prev.filter((s) => s.id !== amigoId));
    } else {
      alert("❌ Error al aceptar: " + data.error);
    }
  };

  const guardarCambios = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick: editNick, avatar: editAvatar }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Perfil actualizado");
        setProfile({ name: editNick, photoUrl: editAvatar });
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      {/* Perfil */}
      <div className="border rounded-xl p-4 shadow-md flex items-center gap-6 mb-10">
        <div className="w-28 h-28 border-4 border-gray-300 rounded-full overflow-hidden">
          <img
            src={profile.photoUrl}
            alt="Foto de perfil"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xl font-semibold">{profile.name}</p>
          <button
            onClick={() => navigate(`/editar-perfil`)}
            className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded"
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Favoritos */}
      <div className="border rounded-xl p-4 shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Favoritos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {favorites.map((movie) => (
            <div key={movie.id} className="border rounded shadow-sm overflow-hidden">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-2 text-center">
                <p className="text-sm font-medium">{movie.title}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {movie.media_type === "movie" ? "🎬 Película" : "📺 Serie"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logros */}
      <div className="border rounded-xl p-4 shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Logros</h2>
        <div className="flex flex-wrap gap-4">
          {achievements.map((logro) => (
            <div
              key={logro.id}
              className="w-20 flex flex-col items-center text-center"
              title={`${logro.title} - ${logro.description}`}
            >
              <img
                src={logro.image_url}
                alt={logro.title}
                className="w-[40px] h-[40px] object-contain border rounded shadow-md"
              />
              <span className="text-xs mt-1">{logro.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buscar películas y amigos */}
      <div className="border rounded-xl p-4 shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Buscar</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Nombre de película"
          />
          <button
            onClick={buscarPeliculas}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Buscar Película
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <input
            value={nickAmigo}
            onChange={(e) => setNickAmigo(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Buscar amigo por nick"
          />
          <button
            onClick={buscarAmigo}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Buscar Amigo
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
          >
            Cerrar sesión
          </button>
          <button onClick={goHome} className="bg-gray-300 px-4 py-2 rounded">
            Ir al Home
          </button>
        </div>
      </div>

      {/* Solicitudes */}
      <div className="border rounded-xl p-4 shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Solicitudes de amistad</h2>
        {solicitudes.length === 0 ? (
          <p className="text-gray-500">No tienes solicitudes pendientes.</p>
        ) : (
          <div className="space-y-3">
            {solicitudes.map((s) => (
              <div key={`amigo-${s.id}`} className="flex items-center gap-4">
                <img
                  src={s.avatar || "https://i.pravatar.cc/150"}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="flex-1 font-medium">{s.nick}</span>
                <button
                  onClick={() => aceptarSolicitud(s.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  Aceptar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Amigos */}
      <div className="border rounded-xl p-4 shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Mis Amigos</h2>
        {amigos.length === 0 ? (
          <p className="text-gray-500">No tienes amigos aún.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {amigos.map((amigo) => (
              <div key={amigo.id} className="text-center">
                <img
                  src={amigo.avatar || "https://i.pravatar.cc/150"}
                  className="w-14 h-14 rounded-full border mb-1"
                  alt={amigo.nick}
                />
                <p className="text-sm">{amigo.nick}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}