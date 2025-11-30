import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Users, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

type User = {
  id: number;
  nick: string;
  avatar?: string;
};

export default function BuscarUsuario() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [estados, setEstados] = useState<{ [key: number]: string }>({});

  const obtenerEstados = async (usuarios: User[]) => {
    const userId = parseInt(localStorage.getItem("userId") || "0");
    const estadosTemp: { [key: number]: string } = {};

    for (const usuario of usuarios) {
      const res = await fetch(`/api/amigos/estado?usuarioId=${userId}&amigoId=${usuario.id}`);
      const data = await res.json();
      estadosTemp[usuario.id] = data.estado || "ninguno";
    }

    setEstados(estadosTemp);
  };

  const buscar = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/usuarios/buscar?nick=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResultados(data);
      obtenerEstados(data);

      if (data.length === 0) {
        toast.info("No se encontraron usuarios");
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      toast.error("Error al buscar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const agregarAmigo = async (amigoId: number, nick: string) => {
    const userId = parseInt(localStorage.getItem("userId") || "0");

    try {
      const res = await fetch("/api/amigos/solicitud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: userId, amigo_id: amigoId }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Solicitud enviada a ${nick}`);
        setEstados({ ...estados, [amigoId]: "pendiente" });
      } else {
        toast.error(data.error || "Error al enviar solicitud");
      }
    } catch (error) {
      toast.error("Error de red");
    }
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
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">Buscar Amigos</h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl animate-slide-up">
            <div className="card-glass p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinechamp-text-tertiary" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && buscar()}
                    placeholder="Buscar por nickname..."
                    className="input-modern pl-11"
                  />
                </div>
                <button onClick={buscar} className="btn-primary px-6" disabled={loading}>
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-cinechamp mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cinechamp-accent-primary/30 border-t-cinechamp-accent-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-cinechamp-text-secondary">Buscando usuarios...</p>
            </div>
          </div>
        ) : resultados.length === 0 && query ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="p-6 bg-cinechamp-bg-tertiary rounded-full mb-6">
              <Users className="w-16 h-16 text-cinechamp-text-tertiary" />
            </div>
            <p className="text-xl text-cinechamp-text-primary mb-2">No se encontraron usuarios</p>
            <p className="text-sm text-cinechamp-text-tertiary">Intenta con otro nickname</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {resultados.map((user) => (
              <div
                key={user.id}
                className="card-glass p-4 flex flex-col items-center text-center group hover:shadow-card-hover transition-all animate-scale-in"
              >
                {/* Avatar */}
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full border-2 border-cinechamp-border-primary group-hover:border-cinechamp-accent-primary transition-colors overflow-hidden">
                    <img
                      src={user.avatar || "https://i.pravatar.cc/150?img=8"}
                      alt={user.nick}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                </div>

                {/* Nick */}
                <p className="font-semibold text-cinechamp-text-primary mb-2 truncate w-full">
                  {user.nick}
                </p>

                {/* Estado */}
                {estados[user.id] === "aceptado" && (
                  <div className="flex items-center gap-1 text-cinechamp-accent-success text-sm mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Amigo</span>
                  </div>
                )}
                {estados[user.id] === "pendiente" && (
                  <div className="flex items-center gap-1 text-cinechamp-accent-warning text-sm mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Pendiente</span>
                  </div>
                )}
                {estados[user.id] === "ninguno" && (
                  <button
                    onClick={() => agregarAmigo(user.id, user.nick)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-cinechamp-accent-primary hover:bg-cinechamp-accent-secondary text-white text-sm rounded-lg transition-colors mb-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Agregar
                  </button>
                )}

                {/* Ver perfil */}
                <button
                  onClick={() => navigate(`/usuario/${user.nick}`)}
                  className="text-cinechamp-accent-primary hover:text-cinechamp-accent-secondary text-sm font-medium transition-colors"
                >
                  Ver perfil →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
