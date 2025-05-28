import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/images-perfil/firulais.jpg";
import NivelSteam from "../../components/PerfilHeader/NivelSteam";
import fondoUsuarios from "../../assets/imagen-header-logo/logo2.jpeg";


type Usuario = {
  id: number;
  nick: string;
  email: string;
  avatar: string;
  cantidadAmigos?: number;
  cantidadCalificaciones?: number;
};

export default function UsuarioResultado() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [relaciones, setRelaciones] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nick = params.get("nick");
  const userId = parseInt(localStorage.getItem("userId") || "0");
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const navigate = useNavigate();

  useEffect(() => {
    if (!nick) return;

    setLoading(true);
    fetch(`${apiBase}/api/usuarios/buscar?nick=${encodeURIComponent(nick)}&userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se encontraron usuarios");
        return res.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setError("No se encontraron usuarios");
          setUsuarios([]);
        } else {
          setError("");
          setUsuarios(data);
          obtenerEstados(data);
          obtenerDatosExtra(data);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [nick, userId]);

  const obtenerEstados = async (usuarios: Usuario[]) => {
    const estadosTemp: { [key: number]: string } = {};

    const promesas = usuarios.map(async (usuario) => {
      const res = await fetch(`${apiBase}/api/amigos/estado?usuarioId=${userId}&amigoId=${usuario.id}`);
      if (res.ok) {
        const data = await res.json();
        estadosTemp[usuario.id] = data.estado || "ninguno";
      } else {
        estadosTemp[usuario.id] = "ninguno";
      }
    });

    await Promise.all(promesas);
    setRelaciones(estadosTemp);
  };

  const obtenerDatosExtra = async (usuarios: Usuario[]) => {
    const usuariosConDatos = await Promise.all(
      usuarios.map(async (usuario) => {
        try {
          const [resAmigos, resCalificaciones] = await Promise.all([
            fetch(`${apiBase}/api/amigos/contador/${usuario.id}`),
            fetch(`${apiBase}/api/usuarios/contador-calificaciones/${usuario.id}`)
          ]);

          const amigosData = await resAmigos.json();
          const calificacionesData = await resCalificaciones.json();

          return {
            ...usuario,
            cantidadAmigos: amigosData.total,
            cantidadCalificaciones: calificacionesData.total
          };
        } catch (err) {
          console.error(`Error al obtener datos extra de ${usuario.nick}:`, err);
          return usuario;
        }
      })
    );

    setUsuarios(usuariosConDatos);
  };

  const enviarSolicitudAmistad = async (amigoId: number) => {
    const res = await fetch(`${apiBase}/api/amigos/solicitud`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId: userId,
        amigoId: amigoId,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje("✅ Solicitud de amistad enviada correctamente");
      setRelaciones((prev) => ({ ...prev, [amigoId]: "pendiente" }));
    } else {
      setMensaje(`❌ Error: ${data.error}`);
    }

    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url(${fondoUsuarios})`,
    }}
  >
   <div className="relative z-10 min-h-screen p-6 max-w-6xl mx-auto bg-white/40 backdrop-blur-sm rounded-lg flex flex-col justify-start">

      <h1 className="text-2xl font-bold mb-4">Resultados de búsqueda</h1>
   <button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold mb-6"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  Volver
</button>

      {loading && <p className="text-gray-500">🔄 Buscando usuarios...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {mensaje && <p className="text-blue-600 mb-4">{mensaje}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuarios.map((user) => {
          const avatarUrl = user.avatar
            ? user.avatar.startsWith("http")
              ? user.avatar
              : `${apiBase}${user.avatar}`
            : defaultAvatar;

          return (
            <div
              key={user.id}
              className="bg-slate-100 border border-gray-300 rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition hover:scale-[1.01]"
            >
              <div className="relative w-full flex justify-center ">
                <Link to={`/usuario/${user.nick}`}>
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-32 h-32 object-cover rounded-lg border-4 border-white shadow-sm hover:ring hover:ring-blue-400 transition"
                  />
                </Link>
                <div className="absolute top-3 right-14 w-7 ">
                  <NivelSteam id_usuario={user.id} />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mt-3">{user.nick}</h2>
              <p className="text-sm text-gray-500 mb-2">{user.email}</p>

              <div className="flex flex-col items-center gap-1 text-sm text-gray-700 mb-4">
                <p className="flex items-center gap-2">
                  👥 <span className="font-semibold">Amigos:</span> {user.cantidadAmigos ?? "…"}
                </p>
                <p className="flex items-center gap-2">
                  🎬 <span className="font-semibold">Calificaciones:</span> {user.cantidadCalificaciones ?? "…"}
                </p>
              </div>

              {relaciones[user.id] === "aceptado" && (
                <p className="text-green-600 font-medium text-sm">✔ Ya son amigos</p>
              )}

              {relaciones[user.id] === "pendiente" && (
                <p className="text-yellow-500 font-medium text-sm">⏳ Solicitud pendiente</p>
              )}

              {relaciones[user.id] === "ninguno" && (
                <button
                  onClick={() => enviarSolicitudAmistad(user.id)}
                  className="mt-2 bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded text-sm font-semibold transition"
                >
                  ➕ Agregar amigo
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
