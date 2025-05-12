import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

type Usuario = {
  id: number;
  nick: string;
  email: string;
  avatar: string;
};

export default function UsuarioResultado() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

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
      .then(setUsuario)
      .catch((err) => setError(err.message));
  }, [nick]);

  const enviarSolicitudAmistad = async () => {
    const userId = parseInt(localStorage.getItem("userId") || "0");
  
    const res = await fetch("http://localhost:3001/api/amigos/solicitud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId: userId,
        amigoId: usuario?.id, 
      }),
    });
  
    const data = await res.json();
    console.log("🔁 Respuesta del backend:", data);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resultado de búsqueda</h1>

      {error && <p className="text-red-600">{error}</p>}
      {mensaje && <p className="text-blue-600 mb-2">{mensaje}</p>}

      {usuario && (
        <div className="border rounded p-4 shadow flex items-center gap-4">
      <Link to={`/usuario/${usuario.nick}`}>
            <img
              src={usuario.avatar || "https://i.pravatar.cc/150"}
              alt="Avatar"
              className="w-20 h-20 object-cover rounded-full border cursor-pointer"
            />
          </Link>
          <div className="flex-1">
            <p className="text-lg font-semibold">{usuario.nick}</p>
            <p className="text-sm text-gray-500">{usuario.email}</p>
            <button
              onClick={enviarSolicitudAmistad}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Agregar amigo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
