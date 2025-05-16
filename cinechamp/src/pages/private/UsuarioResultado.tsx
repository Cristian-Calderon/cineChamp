import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

type Usuario = {
  id: number;
  nick: string;
  email: string;
  avatar: string;
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
        estadosTemp[usuario.id] = "ninguno"; // fallback si da error
      }
    });

    await Promise.all(promesas);
    setRelaciones(estadosTemp);
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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resultados de búsqueda</h1>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      >
        ← Volver
      </button>


      {loading && <p className="text-gray-500">🔄 Buscando usuarios...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {mensaje && <p className="text-blue-600 mb-4">{mensaje}</p>}

      <div className="space-y-4">
        {usuarios.map((user) => (
          <div key={user.id} className="border rounded p-4 shadow flex items-center gap-4">
            <Link to={`/usuario/${user.nick}`}>
              <img
                src={user.avatar || "https://i.pravatar.cc/150"}
                alt="Avatar"
                className="w-20 h-20 object-cover rounded-full border cursor-pointer"
              />
            </Link>
            <div className="flex-1">
              <p className="text-lg font-semibold">{user.nick}</p>
              <p className="text-sm text-gray-500">{user.email}</p>

              {relaciones[user.id] === "aceptado" && (
                <p className="text-green-600 mt-2">✔ Ya son amigos</p>
              )}
              {relaciones[user.id] === "pendiente" && (
                <p className="text-yellow-500 mt-2">⏳ Solicitud pendiente</p>
              )}
              {relaciones[user.id] === "ninguno" && (
                <button
                  onClick={() => enviarSolicitudAmistad(user.id)}
                  className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Agregar amigo
                </button>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}