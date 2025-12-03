import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { User, UserPlus, UserMinus, Film, Tv, Award, Users as UsersIcon, Search, ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import AvatarConNivel from "../../components/Avatar/AvatarConNivel";

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
  const [experiencia, setExperiencia] = useState<number>(0);

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
        setExperiencia(user.experiencia || 0);
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
    if (res.ok) {
      toast.success("✅ Solicitud de amistad enviada");
      setEstadoRelacion("pendiente");
    } else {
      toast.error(data.error || "Error al enviar solicitud");
    }
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
    if (res.ok) {
      toast.success("Amigo eliminado");
      setEstadoRelacion(null);
    } else {
      toast.error(data.error || "Error al eliminar amigo");
    }
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
    <div className="min-h-screen bg-gradient-dark pb-20">
      {/* Header */}
      <div className="bg-gradient-mesh border-b border-cinechamp-border-primary pt-20 pb-8">
        <div className="container-cinechamp">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-cinechamp-text-secondary hover:text-cinechamp-text-primary transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver
          </button>

          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="p-2 bg-gradient-accent rounded-xl shadow-glow-accent">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">Perfil de {profile.name}</h1>
          </div>
        </div>
      </div>

      {/* Perfil y buscadores */}
      <div className="container-cinechamp mt-8">
        <div className="card-glass p-6 mb-8 animate-scale-in">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar y botones de amistad */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="group">
                <AvatarConNivel
                  photoUrl={profile.photoUrl}
                  experiencia={experiencia}
                  size="md"
                  showLevel={true}
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xl font-bold text-gradient mb-3">{profile.name}</p>
                <div className="flex flex-wrap gap-2">
                  {estadoRelacion === "aceptado" ? (
                    <>
                      <button disabled className="flex items-center gap-1 px-3 py-1.5 bg-cinechamp-accent-success/20 border border-cinechamp-accent-success text-cinechamp-accent-success rounded-lg text-sm cursor-default">
                        <CheckCircle className="w-4 h-4" />
                        Son Amigos
                      </button>
                      <button
                        onClick={eliminarAmistad}
                        className="flex items-center gap-1 px-3 py-1.5 bg-cinechamp-accent-error/20 border border-cinechamp-accent-error text-cinechamp-accent-error hover:bg-cinechamp-accent-error hover:text-white rounded-lg text-sm transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />
                        Eliminar
                      </button>
                    </>
                  ) : estadoRelacion === "pendiente" ? (
                    <button disabled className="flex items-center gap-1 px-3 py-1.5 bg-cinechamp-accent-warning/20 border border-cinechamp-accent-warning text-cinechamp-accent-warning rounded-lg text-sm cursor-default">
                      <Clock className="w-4 h-4" />
                      Pendiente
                    </button>
                  ) : (
                    <button
                      onClick={enviarSolicitudAmistad}
                      className="flex items-center gap-1 btn-primary text-sm py-1.5"
                    >
                      <UserPlus className="w-4 h-4" />
                      Agregar Amigo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Buscadores */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:ml-auto md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinechamp-text-tertiary" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && buscarPeliculas()}
                  className="input-modern pl-10 text-sm"
                  placeholder="Buscar película o serie"
                />
              </div>
              <div className="relative flex-1 sm:w-64">
                <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinechamp-text-tertiary" />
                <input
                  value={nickAmigo}
                  onChange={(e) => setNickAmigo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && buscarAmigo()}
                  className="input-modern pl-10 text-sm"
                  placeholder="Buscar amigo"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Izquierda: Contenido */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {["movie", "tv"].map((type) => (
              <div key={`favoritos-${type}`} className="card-glass p-6 animate-slide-up">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  {type === "movie" ? <Film className="w-6 h-6 text-cinechamp-accent-primary" /> : <Tv className="w-6 h-6 text-cinechamp-accent-secondary" />}
                  <span className="text-gradient">Favoritos - {type === "movie" ? "Películas" : "Series"}</span>
                </h2>
                {favorites.filter(f => f.media_type === type).length === 0 ? (
                  <p className="text-cinechamp-text-tertiary text-center py-8">No hay favoritos aún</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {favorites.filter(f => f.media_type === type).slice(0, 9).map((movie) => (
                      <div key={`${movie.id}-${type}`} className="group cursor-pointer" onClick={() => navigate(`/contenido/${type}/${movie.id}`)}>
                        <div className="aspect-[2/3] rounded-lg overflow-hidden border border-cinechamp-border-primary group-hover:border-cinechamp-accent-primary transition-colors">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <p className="text-xs text-center mt-2 line-clamp-2 text-cinechamp-text-secondary group-hover:text-cinechamp-text-primary transition-colors">{movie.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {["movie", "tv"].map((type) => (
              <div key={`historial-${type}`} className="card-glass p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  {type === "movie" ? <Film className="w-6 h-6 text-cinechamp-accent-tertiary" /> : <Tv className="w-6 h-6 text-cinechamp-accent-success" />}
                  <span className="text-gradient">Historial - {type === "movie" ? "Películas" : "Series"}</span>
                </h2>
                {historial.filter(h => h.media_type === type).length === 0 ? (
                  <p className="text-cinechamp-text-tertiary text-center py-8">No hay historial aún</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {historial.filter(h => h.media_type === type).slice(0, 9).map((item) => (
                      <div key={`${item.id}-${type}`} className="group cursor-pointer" onClick={() => navigate(`/contenido/${type}/${item.id}`)}>
                        <div className="aspect-[2/3] rounded-lg overflow-hidden border border-cinechamp-border-primary group-hover:border-cinechamp-accent-primary transition-colors">
                          <img
                            src={item.posterUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <p className="text-xs text-center mt-2 line-clamp-2 text-cinechamp-text-secondary group-hover:text-cinechamp-text-primary transition-colors">{item.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Derecha: Logros y Amigos */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="card-glass p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-cinechamp-accent-tertiary" />
                <span className="text-gradient">Logros</span>
              </h2>
              {achievements.length === 0 ? (
                <p className="text-cinechamp-text-tertiary text-center py-8">No hay logros desbloqueados</p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {achievements.map((logro) => (
                    <div
                      key={logro.id}
                      className="w-20 flex flex-col items-center text-center group cursor-pointer"
                      title={`${logro.title} - ${logro.description}`}
                    >
                      <div className="w-12 h-12 rounded-lg border-2 border-cinechamp-border-primary group-hover:border-cinechamp-accent-tertiary overflow-hidden transition-colors">
                        <img
                          src={logro.image_url}
                          alt={logro.title}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="text-xs mt-2 text-cinechamp-text-secondary group-hover:text-cinechamp-text-primary transition-colors">{logro.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-glass p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <UsersIcon className="w-6 h-6 text-cinechamp-accent-secondary" />
                <span className="text-gradient">Amigos</span>
              </h2>
              {amigos.length === 0 ? (
                <p className="text-cinechamp-text-tertiary text-center py-8">Este usuario no tiene amigos aún</p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {amigos.map((amigo) => (
                    <div
                      key={amigo.id}
                      className="text-center group cursor-pointer"
                      onClick={() => navigate(`/usuario/${amigo.nick}`)}
                    >
                      <div className="w-16 h-16 rounded-full border-2 border-cinechamp-border-primary group-hover:border-cinechamp-accent-primary overflow-hidden transition-colors">
                        <img
                          src={amigo.avatar || "https://i.pravatar.cc/150"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          alt={amigo.nick}
                        />
                      </div>
                      <p className="text-sm mt-2 text-cinechamp-text-secondary group-hover:text-cinechamp-text-primary transition-colors">{amigo.nick}</p>
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
