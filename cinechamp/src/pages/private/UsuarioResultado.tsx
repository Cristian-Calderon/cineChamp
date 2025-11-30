import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, UserPlus, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

type Usuario = {
  id: number;
  nick: string;
  email: string;
  avatar: string;
};

export default function UsuarioResultado() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nick = params.get("nick");

  useEffect(() => {
    if (!nick) return;

    fetch(`http://localhost:3001/api/usuarios/nick/${nick}`)
      .then((res) => {
        if (!res.ok) throw new Error("Usuario no encontrado");
        return res.json();
      })
      .then((data) => {
        setUsuario(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  }, [nick]);

  const enviarSolicitudAmistad = async () => {
    const userId = parseInt(localStorage.getItem("userId") || "0");

    try {
      const res = await fetch("http://localhost:3001/api/amigos/solicitud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: userId,
          amigo_id: usuario?.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`✅ Solicitud enviada a ${usuario?.nick}`);
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

          <div className="flex items-center gap-3 animate-fade-in">
            <div className="p-2 bg-gradient-accent rounded-xl shadow-glow-accent">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">Resultado de Búsqueda</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-cinechamp mt-8">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-cinechamp-accent-primary animate-spin mx-auto mb-4" />
                <p className="text-cinechamp-text-secondary">Cargando usuario...</p>
              </div>
            </div>
          ) : usuario ? (
            <div className="card-glass p-8 animate-scale-in">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div
                  onClick={() => navigate(`/usuario/${usuario.nick}`)}
                  className="cursor-pointer group relative"
                >
                  <div className="w-32 h-32 rounded-full border-4 border-cinechamp-accent-primary shadow-glow-accent overflow-hidden">
                    <img
                      src={usuario.avatar || "https://i.pravatar.cc/150"}
                      alt={usuario.nick}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-accent opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gradient mb-2">{usuario.nick}</h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-cinechamp-text-secondary mb-4">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{usuario.email}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={enviarSolicitudAmistad}
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      Agregar Amigo
                    </button>
                    <button
                      onClick={() => navigate(`/usuario/${usuario.nick}`)}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      Ver Perfil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="p-6 bg-cinechamp-bg-tertiary rounded-full mb-6">
                <User className="w-16 h-16 text-cinechamp-text-tertiary" />
              </div>
              <p className="text-xl text-cinechamp-text-primary mb-2">Usuario no encontrado</p>
              <p className="text-sm text-cinechamp-text-tertiary">Intenta con otro nickname</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
