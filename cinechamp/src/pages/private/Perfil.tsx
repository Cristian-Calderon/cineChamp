import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Search, UserPlus, Trophy, Users as UsersIcon, Star, Film, Tv } from "lucide-react";
import Carrusel from "../../components/CarucelContenido/Carrusel";
import AvatarConNivel from "../../components/Avatar/AvatarConNivel";
import MenuUsuario from "../../components/MenuUsuario/MenuUsuario";

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
  experiencia?: number;
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

type Calificacion = {
  id: number;
  titulo: string;
  puntuacion: number;
  comentario: string;
  tipo: "movie" | "tv";
  posterUrl: string;
};

export default function Perfil({ onLogout }: PerfilProps) {
  const { nick } = useParams();
  const location = useLocation();
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
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [experiencia, setExperiencia] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:3001/contenido/usuarios/${userId}/calificaciones`)
      .then((res) => res.json())
      .then(setCalificaciones)
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (!nick) return;
    const token = localStorage.getItem("token");

    axios
      .get<UserResponse>(`http://localhost:3001/api/usuarios/nick/${nick}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        const defaultAvatar = "https://i.pravatar.cc/150?img=3";
        const avatarUrl = user.avatar && user.avatar.trim() !== "" ? user.avatar : defaultAvatar;

        setUserId(user.id);
        setProfile({
          name: user.nick,
          photoUrl: avatarUrl,
        });
        setExperiencia(user.experiencia || 0);
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
      await fetch(`http://localhost:3001/api/logros/forzar/${userId}`);

      const res = await fetch(`http://localhost:3001/api/logros/${nick}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nuevos = await res.json();
      setAchievements(nuevos);
    } catch (err) {
      console.error("Error al cargar logros:", err);
    }
  };

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
    navigate(`/id/${nick}/buscador?q=${encodeURIComponent(query)}`);
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

  return (
    <div className="min-h-screen bg-gradient-dark pb-20">
      {/* Header con gradiente */}
      <div className="relative bg-gradient-mesh border-b border-cinechamp-border-primary">
        <div className="container-cinechamp py-8">
          {/* Perfil Header */}
          <div className="card-glass p-6 mb-6 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar con anillo de nivel */}
              <div className="group">
                <AvatarConNivel
                  photoUrl={profile.photoUrl}
                  experiencia={experiencia}
                  size="lg"
                  showLevel={true}
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 text-gradient">{profile.name}</h1>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-cinechamp-text-secondary mb-4">
                  <span className="flex items-center gap-1">
                    <Film className="w-4 h-4" />
                    {historial.filter(h => h.media_type === "movie").length} películas
                  </span>
                  <span className="flex items-center gap-1">
                    <Tv className="w-4 h-4" />
                    {historial.filter(h => h.media_type === "tv").length} series
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {achievements.length} logros
                  </span>
                  <span className="flex items-center gap-1">
                    <UsersIcon className="w-4 h-4" />
                    {amigos.length} amigos
                  </span>
                </div>
                <MenuUsuario onLogout={onLogout} />
              </div>
            </div>
          </div>

          {/* Search Bars */}
          <div className="grid md:grid-cols-2 gap-4 animate-slide-up">
            {/* Buscar Contenido */}
            <div className="card-glass p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinechamp-text-tertiary" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && buscarPeliculas()}
                    className="input-modern pl-11"
                    placeholder="Buscar película o serie"
                  />
                </div>
                <button onClick={buscarPeliculas} className="btn-primary px-4">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Buscar Amigos */}
            <div className="card-glass p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinechamp-text-tertiary" />
                  <input
                    value={nickAmigo}
                    onChange={(e) => setNickAmigo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && buscarAmigo()}
                    className="input-modern pl-11"
                    placeholder="Buscar amigo"
                  />
                </div>
                <button onClick={buscarAmigo} className="btn-primary px-4">
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-cinechamp mt-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Contenido (2/3) */}
          <div className="lg:col-span-2 space-y-6">
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
              titulo="⭐ Películas Favoritas"
              items={favorites.filter(f => f.media_type === "movie").slice(0, 10)}
              onVerMas={() => navigate(`/usuario/${nick}/lista/favoritos/movie`)}
            />
            <Carrusel
              titulo="💜 Series Favoritas"
              items={favorites.filter(f => f.media_type === "tv").slice(0, 10)}
              onVerMas={() => navigate(`/usuario/${nick}/lista/favoritos/tv`)}
            />
          </div>

          {/* Right Column - Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Logros */}
            <div className="card-glass p-6 animate-slide-left">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-cinechamp-accent-tertiary" />
                <h2 className="text-xl font-bold">Logros</h2>
              </div>
              {achievements.length === 0 ? (
                <p className="text-cinechamp-text-tertiary text-sm">No hay logros aún</p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {achievements.map((logro) => (
                    <div
                      key={logro.id}
                      className="group relative"
                      title={`${logro.title} - ${logro.description}`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden border border-cinechamp-border-primary group-hover:border-cinechamp-accent-primary transition-colors">
                        <img
                          src={logro.image_url}
                          alt={logro.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Solicitudes de Amistad */}
            {solicitudes.length > 0 && (
              <div className="card-glass p-6 animate-slide-left" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <UserPlus className="w-5 h-5 text-cinechamp-accent-secondary" />
                  <h2 className="text-xl font-bold">Solicitudes</h2>
                  <span className="ml-auto bg-cinechamp-accent-primary text-white text-xs px-2 py-1 rounded-full">
                    {solicitudes.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {solicitudes.map((s) => (
                    <div
                      key={`amigo-${s.id}`}
                      className="flex items-center gap-3 p-3 bg-cinechamp-bg-tertiary rounded-lg hover:bg-cinechamp-bg-hover transition-colors"
                    >
                      <img
                        src={s.avatar || "https://i.pravatar.cc/150"}
                        className="w-10 h-10 rounded-full object-cover border border-cinechamp-border-primary"
                        alt={s.nick}
                      />
                      <span className="flex-1 font-medium text-sm">{s.nick}</span>
                      <button
                        onClick={() => aceptarSolicitud(s.id)}
                        className="px-3 py-1.5 bg-cinechamp-accent-success text-white text-xs rounded-lg hover:bg-cinechamp-accent-success/80 transition-colors"
                      >
                        Aceptar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amigos */}
            <div className="card-glass p-6 animate-slide-left" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 mb-4">
                <UsersIcon className="w-5 h-5 text-cinechamp-accent-primary" />
                <h2 className="text-xl font-bold">Amigos</h2>
              </div>
              {amigos.length === 0 ? (
                <p className="text-cinechamp-text-tertiary text-sm">No tienes amigos aún</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {amigos.slice(0, 6).map((amigo) => (
                    <div key={amigo.id} className="text-center group cursor-pointer">
                      <div className="aspect-square rounded-lg overflow-hidden border border-cinechamp-border-primary group-hover:border-cinechamp-accent-primary transition-colors mb-1">
                        <img
                          src={amigo.avatar || "https://i.pravatar.cc/150"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          alt={amigo.nick}
                        />
                      </div>
                      <p className="text-xs truncate text-cinechamp-text-secondary">{amigo.nick}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Últimas Calificaciones */}
            <div className="card-glass p-6 animate-slide-left" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-cinechamp-accent-tertiary" />
                <h2 className="text-xl font-bold">Calificaciones</h2>
              </div>
              {calificaciones.length === 0 ? (
                <p className="text-cinechamp-text-tertiary text-sm">No has calificado contenido aún</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {calificaciones.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-cinechamp-bg-tertiary rounded-lg hover:bg-cinechamp-bg-hover transition-colors"
                    >
                      <img
                        src={item.posterUrl}
                        className="w-12 h-16 object-cover rounded border border-cinechamp-border-primary"
                        alt={item.titulo}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.titulo}</p>
                        <div className="flex items-center gap-1 text-cinechamp-accent-tertiary mt-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold">{item.puntuacion}/10</span>
                        </div>
                        {item.comentario && (
                          <p className="text-xs text-cinechamp-text-tertiary mt-1 line-clamp-2 italic">
                            "{item.comentario}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
