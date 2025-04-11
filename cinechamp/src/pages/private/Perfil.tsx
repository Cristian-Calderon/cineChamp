// src/pages/private/Perfil.tsx
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

type UserResponse = {
  nick: string;
  avatar?: string;
};

interface PerfilProps {
  onLogout: () => void;
}

export default function Perfil({ onLogout }: PerfilProps) {
  const { nick } = useParams(); // <- viene desde la URL
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nick");
    navigate("/login");
  };

  const [profile, setProfile] = useState<Profile>({
    name: "",
    photoUrl: "",
  });

  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [latest, setLatest] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!nick) return;

    // 🔁 Traer datos del usuario desde el backend
    axios
      .get<UserResponse>(`http://localhost:3000/api/usuarios/nick/${nick}`)
      .then((res) => {
        const user = res.data;
        setProfile({
          name: user.nick,
          photoUrl: user.avatar || "https://i.pravatar.cc/150?img=3",
        });
      })
      .catch((err) => {
        console.error(err);
        navigate("/"); // Si hay error, redirige a inicio
      });

    // (Opcional) Traer favoritos y últimas
    // axios.get("/api/favorites").then((res) => setFavorites(res.data));
    // axios.get("/api/latest").then((res) => setLatest(res.data));
  }, [nick, navigate]);

  const buscarPeliculas = () => {
    if (!query) return;
    navigate(`/resultados?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Perfil de {nick}</h1>

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
            <div
              key={movie.id}
              className="border rounded shadow-sm overflow-hidden"
            >
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

      {/* Últimas Agregadas */}
      <div className="border rounded-xl p-4 shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Últimas Películas Agregadas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {latest.map((movie) => (
            <div
              key={movie.id}
              className="border rounded shadow-sm overflow-hidden"
            >
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

          {/* Boton cerrar sesion */}
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
