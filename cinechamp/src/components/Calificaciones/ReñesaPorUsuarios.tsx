import { useEffect, useState } from "react";

type Resena = {
    nick: string;
    puntuacion: number;
    comentario?: string;
    avatar?: string;
  };
  
  type Props = {
    id_api: string;
  };
  
  export default function ResenasDeUsuarios({ id_api }: Props) {
    const [resenas, setResenas] = useState<Resena[]>([]);
    const [media, setMedia] = useState<string | null>(null);
  
    useEffect(() => {
      fetch(`http://localhost:3001/api/contenido/comentarios/${id_api}`)
        .then((res) => res.json())
        .then((data) => {
          setResenas(data.reseñas || []);
          setMedia(data.media || null);
        })
        .catch((err) => console.error("❌ Error al cargar reseñas:", err));
    }, [id_api]);
  
    return (
      <div className="mt-10 flex flex-col md:flex-row gap-6">
        {/* Cuadro de nota media */}
        {media && (
          <div className="md:w-1/3 bg-yellow-100 border border-yellow-300 rounded-xl p-6 text-center shadow-md">
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">⭐ Nota media</h3>
            <p className="text-5xl font-bold text-yellow-600">{media}</p>
            <p className="text-gray-600 text-sm mt-2">Según {resenas.length} reseña(s)</p>
          </div>
        )}
  
        {/* Lista de reseñas */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">🗣 Reseñas de usuarios</h2>
          {resenas.length === 0 ? (
            <p className="text-gray-500">No hay reseñas todavía.</p>
          ) : (
            <div className="space-y-4">
              {resenas.map((resena, idx) => (
                <div key={idx} className="flex gap-4 items-start border-b pb-3 last:border-b-0">
                  <img
                    src={
                      resena.avatar
                        ? resena.avatar.startsWith("http")
                          ? resena.avatar
                          : `http://localhost:3001/${resena.avatar}`
                        : "/default-avatar.png"
                    }
                    alt={resena.nick}
                    className="w-10 h-10 rounded-full object-cover shadow"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      <a href={`/usuario/${resena.nick}`} className="hover:underline">
                        {resena.nick}
                      </a>
                    </p>
                    <p className="text-sm text-yellow-600">⭐ {resena.puntuacion}/10</p>
                    {resena.comentario && (
                      <p className="text-gray-700 mt-1 italic">“{resena.comentario}”</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  