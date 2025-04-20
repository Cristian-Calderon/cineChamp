// src/pages/private/EditarPerfil.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [nick, setNick] = useState("");
  const [avatar, setAvatar] = useState("");
  const [original, setOriginal] = useState({ nick: "", avatar: "" });

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


    const res = await fetch(`http://localhost:3001/api/usuarios/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cambios),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Perfil actualizado");
      navigate(`/id/${nick}`);
    } else {
      alert("❌ Error: " + data.error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

      <label className="block font-semibold mb-1">Nick</label>
      <input
        value={nick}
        onChange={(e) => setNick(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <label className="block font-semibold mb-1">Avatar (URL)</label>
      <input
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Guardar cambios
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
