import { useEffect, useState } from "react";

type Resena = {
  nick: string;
  puntuacion: number;
  comentario?: string;
  avatar?: string;
};

type Props = {
  id_api: string;
  tipo: "tv" | "pelicula";
};

export default function ResenasDeUsuarios({ id_api, tipo }: Props) {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [media, setMedia] = useState<string | null>(null);
  const userNick = localStorage.getItem("nick");
  const userId = localStorage.getItem("userId");
  const userAvatar = localStorage.getItem("avatar") || null;

  const [editando, setEditando] = useState(false);
  const [comentarioEditado, setComentarioEditado] = useState("");
  const [puntuacionEditada, setPuntuacionEditada] = useState<number>(5);
  const [mensaje, setMensaje] = useState<{ tipo: "error" | "ok"; texto: string } | null>(null);

  const propiaResena = resenas.find((r) => r.nick === userNick);

  // 🔁 Nueva función para recargar reseñas
  const cargarReseñas = () => {
    fetch(`http://localhost:3001/api/contenido/comentarios/${id_api}`)
      .then((res) => res.json())
      .then((data) => {
        setResenas(data.reseñas || []);
        setMedia(data.media || null);

        const propia = data.reseñas?.find((r: Resena) => r.nick === userNick);
        if (propia) {
          setComentarioEditado(propia.comentario || "");
          setPuntuacionEditada(propia.puntuacion);
        }
      })
      .catch((err) => console.error("❌ Error al cargar reseñas:", err));
  };

  useEffect(() => {
    cargarReseñas();
  }, [id_api, userNick]);

  const handleGuardarComentario = async () => {
    if (!userId) return;

    try {
      const response = await fetch("http://localhost:3001/api/contenido/calificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: Number(userId),
          id_api,
          tipo: tipo === "tv" ? "serie" : "pelicula",
          puntuacion: puntuacionEditada,
          comentario: comentarioEditado,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMensaje({ tipo: "error", texto: "❌ Error al guardar comentario" });
        console.error("❌ Error del servidor:", errorText);
        return;
      }

      setMensaje({ tipo: "ok", texto: "✅ Comentario guardado" });
      setEditando(false);
      cargarReseñas(); // 🔄 Refrescar reseñas desde el backend
    } catch (error) {
      console.error("❌ Error al guardar reseña:", error);
      setMensaje({ tipo: "error", texto: "❌ Error al guardar reseña" });
    }

    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-semibold text-black mb-4">🗣 Reseñas de usuarios</h2>

      {media && (
        <p className="text-gray-700 mb-4">
          Valoración media: <b>{media}/10</b>
        </p>
      )}

      {mensaje && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            mensaje.tipo === "ok" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {!propiaResena && !editando && (
        <button
          onClick={() => setEditando(true)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Añadir reseña
        </button>
      )}

      {editando && (
        <div className="bg-white rounded-xl p-4 shadow-md mb-6">
          <p className="font-semibold text-gray-800 mb-2">
            {propiaResena ? "✏️ Editar tu reseña" : "📝 Escribe tu reseña"}
          </p>

          <p className="text-sm mb-2 text-gray-600">
            Puntuación: <span className="font-bold text-yellow-700">⭐ {puntuacionEditada}/10</span>
          </p>

          <textarea
            className="w-full text-sm border rounded p-2 text-gray-800"
            rows={3}
            placeholder="Escribe tu comentario..."
            value={comentarioEditado}
            onChange={(e) => setComentarioEditado(e.target.value)}
          />
          <div className="mt-2">
            <button
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              onClick={handleGuardarComentario}
            >
              Guardar
            </button>
            <button
              className="ml-2 px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {resenas.length === 0 ? (
          <p className="text-gray-400">No hay reseñas todavía.</p>
        ) : (
          resenas.map((resena, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-md"
            >
              <img
                src={
                  resena.avatar
                    ? resena.avatar.startsWith("http")
                      ? resena.avatar
                      : `http://localhost:3001/${resena.avatar}`
                    : "/default-avatar.png"
                }
                alt={resena.nick}
                className="w-16 h-16 rounded-md object-cover shadow border border-gray-200"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  <a href={`/usuario/${resena.nick}`} className="hover:underline">
                    {resena.nick}
                  </a>
                </p>
                <p className="text-sm text-yellow-600 mb-1">⭐ {resena.puntuacion}/10</p>

                {resena.nick === userNick ? (
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-gray-800 italic">
                      “{resena.comentario || "Sin comentario"}”
                    </p>
                    {!editando && (
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => setEditando(true)}
                      >
                        Editar
                      </button>
                    )}
                  </div>
                ) : (
                  resena.comentario && (
                    <p className="text-gray-800 mt-1 italic">
                      “{resena.comentario}”
                    </p>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
