import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Image, Save, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [nick, setNick] = useState("");
  const [avatar, setAvatar] = useState("");
  const [original, setOriginal] = useState({ nick: "", avatar: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    if (!token || !id) {
      navigate("/login");
      return;
    }

    setUserId(parseInt(id));

    fetch(`http://localhost:3001/api/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((user) => {
        setNick(user.nick);
        setAvatar(user.avatar || "");
        setOriginal({ nick: user.nick, avatar: user.avatar || "" });
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleSave = async () => {
    if (!userId) return;

    const cambios: any = {};
    if (nick && nick !== original.nick) cambios.nick = nick;
    if (avatar && avatar !== original.avatar) cambios.avatar = avatar;

    if (Object.keys(cambios).length === 0) {
      toast.info("No hay cambios para guardar");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Perfil actualizado correctamente");
        if (cambios.nick) {
          localStorage.setItem("nick", cambios.nick);
        }
        setTimeout(() => navigate(`/id/${nick}`), 1000);
      } else {
        toast.error(data.error || "Error al actualizar perfil");
      }
    } catch (error) {
      toast.error("Error de red");
    } finally {
      setIsLoading(false);
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
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">Editar Perfil</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container-cinechamp mt-8">
        <div className="max-w-2xl mx-auto">
          <div className="card-glass p-8 space-y-6 animate-slide-up">
            {/* Preview Avatar */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-cinechamp-accent-primary shadow-glow-accent overflow-hidden">
                  <img
                    src={avatar || "https://i.pravatar.cc/150?img=3"}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://i.pravatar.cc/150?img=3";
                    }}
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-accent opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
            </div>

            {/* Nick Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cinechamp-text-secondary">
                Nombre de Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinechamp-text-tertiary" />
                <input
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                  className="input-modern pl-11"
                  placeholder="Tu nickname"
                />
              </div>
            </div>

            {/* Avatar Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cinechamp-text-secondary">
                URL de Avatar
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinechamp-text-tertiary" />
                <input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="input-modern pl-11"
                  placeholder="https://..."
                />
              </div>
              <p className="text-xs text-cinechamp-text-tertiary">
                Ingresa la URL de tu imagen de perfil
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                  </>
                )}
              </button>
              <button
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
