import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

type Usuario = {
  id: number;
  nick: string;
  email: string;
  avatar: string;
};

export default function UsuarioResultado() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nick = params.get("nick");

  useEffect(() => {
    if (!nick) return;

    fetch(`http://localhost:3001/api/usuarios/buscar?nick=${encodeURIComponent(nick)}`)
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
        }
      })
      .catch((err) => setError(err.message));
  }, [nick]);

  const enviarSolicitudAmistad = async (amigoId: number) => {
    const userId = parseInt(localStorage.getItem("userId") || "0");

    const res = await fetch("http://localhost:3001/api/amigos/solicitud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId: userId,
        amigoId: amigoId,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje("Solicitud de amistad enviada ✅");
    } else {
      setMensaje(`Error: ${data.error}`);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resultados de búsqueda</h1>

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
              <button
                onClick={() => enviarSolicitudAmistad(user.id)}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Agregar amigo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}