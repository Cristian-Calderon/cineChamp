import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [nick, setNick] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(""); // Para la URL
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Para archivo subido
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
        setAvatarUrl(user.avatar || "");
        setOriginal({ nick: user.nick, avatar: user.avatar || "" });
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleSave = async () => {
    if (!userId) return;

    const formData = new FormData();
    if (nick && nick !== original.nick) formData.append("nick", nick);

    if (avatarFile) {
      formData.append("avatar", avatarFile); // Archivo
    } else if (avatarUrl && avatarUrl !== original.avatar) {
      formData.append("avatar", avatarUrl); // URL directa
    }

    const res = await fetch(`http://localhost:3001/api/usuarios/${userId}`, {
      method: "PUT",
      body: formData,
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
        value={avatarUrl}
        onChange={(e) => {
          setAvatarUrl(e.target.value);
          setAvatarFile(null); // Si escribe URL, anula archivo
        }}
        className="border p-2 rounded w-full mb-2"
      />

      <label className="block font-semibold mb-1">o Subir nueva imagen</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setAvatarFile(e.target.files[0]);
            setAvatarUrl(""); // Si sube archivo, anula URL
          }
        }}
        className="mb-4"
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
