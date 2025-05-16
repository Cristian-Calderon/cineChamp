import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar/Avatar"; // 🔁 ajusta la ruta si está en otro directorio

type Amigo = {
  id: number;
  nick: string;
  avatar: string;
};

type AmigosPreviewProps = {
  amigos: Amigo[];
};

export default function AmigosComponente({ amigos }: AmigosPreviewProps) {
  const [verTodos, setVerTodos] = useState(false);
  const amigosCortos = amigos.slice(0, 6);
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl p-4 shadow-md relative">
      <h2 className="text-2xl font-semibold mb-4">Amigos</h2>

      {amigos.length === 0 ? (
        <p className="text-gray-500">No tienes amigos aún.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {amigosCortos.map((amigo) => (
            <div key={amigo.id} className="text-center w-16">
              <div
                onClick={() => navigate(`/usuario/${amigo.nick}`)}
                className="cursor-pointer"
              >
                <Avatar src={amigo.avatar} size={56} />
              </div>
              <p className="text-xs truncate">{amigo.nick}</p>
            </div>
          ))}
        </div>
      )}

      {amigos.length > 6 && (
        <div className="mt-4 text-right">
          <button
            onClick={() => setVerTodos(true)}
            className="text-blue-600 text-sm hover:underline"
          >
            Ver todos →
          </button>
        </div>
      )}

      {/* Modal */}
      {verTodos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Todos tus amigos</h3>
              <button
                onClick={() => setVerTodos(false)}
                className="text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {amigos.map((amigo) => (
                <div key={amigo.id} className="text-center w-20">
                  <Avatar src={amigo.avatar} size={56} />
                  <p className="text-sm truncate">{amigo.nick}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
