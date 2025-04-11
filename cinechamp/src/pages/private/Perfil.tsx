import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

type Movie = {
  id: number;
  title: string;
  posterUrl: string;
};

type Profile = {
  name: string;
  photoUrl: string;
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

type UserResponse = {
  id: number;
  nick: string;
  avatar?: string;
};

interface PerfilProps {
  onLogout: () => void;
}

export default function Perfil({ onLogout }: PerfilProps) {
  const { nick } = useParams();
  const navigate = useNavigate();


  const goHome = () => {
  navigate("/");
  };

  const [profile, setProfile] = useState<Profile>({ name: "", photoUrl: "" });
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [historial, setHistorial] = useState<Movie[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [query, setQuery] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  // Obtener usuario por nick y guardar ID
  useEffect(() => {
    if (!nick) return;

    axios
      .get<UserResponse>(`http://localhost:3001/api/usuarios/nick/${nick}`)
      .then((res) => {
        const user = res.data;
        setUserId(user.id); // Guardamos el ID del usuario
        setProfile({
          name: user.nick,
          photoUrl: user.avatar || "https://i.pravatar.cc/150?img=3",
        });
      })
      .catch((err) => {
        console.error("Error al obtener usuario:", err);
        navigate("/");
      });
  }, [nick, navigate]);

  // Obtener favoritos, historial y logros usando el userId
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/contenido/favoritos/${userId}`)
      .then((res) => res.json())
      .then(setFavorites)
      .catch(console.error);

    fetch(`/api/contenido/historial/${userId}`)
      .then((res) => res.json())
      .then(setHistorial)
      .catch(console.error);

    fetch(`/api/usuario/${userId}/logros`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Logros desde backend:", data);
        setAchievements(data);
      })
      .catch(console.error);
  }, [userId]);

  const buscarPeliculas = () => {
    if (!query) return;
    navigate(`/resultados?q=${encodeURIComponent(query)}`);
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
        </div>
      </div>

      {/* Favoritos */}
      <div className="border rounded-xl p-4 shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Películas Favoritas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {favorites.map((movie) => (
            <div key={movie.id} className="border rounded shadow-sm overflow-hidden">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <p className="text-sm text-center p-1">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Historial */}
      <div className="border rounded-xl p-4 shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Historial de Películas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {historial.map((movie) => (
            <div key={movie.id} className="border rounded shadow-sm overflow-hidden">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <p className="text-sm text-center p-1">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Logros estilo Steam */}
      <div className="border rounded-xl p-4 shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Logros</h2>
        <div className="flex flex-wrap gap-4">
          {achievements.map((logro) => (
            <div
              key={logro.id}
              className="w-20 flex flex-col items-center text-center tooltip"
              title={`${logro.title} - ${logro.description}`}
            >
              <img
                src={logro.imageUrl}
                alt={logro.title}
                className="w-[40px] h-[40px] object-contain border rounded shadow-md"
              />
              <span className="text-xs mt-1">{logro.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buscador */}
      <div className="border rounded-xl p-4 shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Buscar Películas</h2>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Nombre de la película"
          />
          <button
            onClick={buscarPeliculas}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>

          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
          >
            Cerrar sesión
          </button>
          <button onClick={goHome}>Ir al Home</button>

        </div>
      </div>
    </div>
  );
}
