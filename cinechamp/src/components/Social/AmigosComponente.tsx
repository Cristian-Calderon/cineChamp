import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar/Avatar";

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
  const navigate = useNavigate();
  const amigosCortos = amigos.slice(0, 6);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md relative h-[160px] text-black">
      <h2 className="text-2xl font-semibold mb-4">Amigos</h2>

      {amigos.length === 0 ? (
        <p className="text-gray-500">No tienes amigos aún.</p>
      ) : (
        <div className="flex gap-4 items-center">
          {amigosCortos.map((amigo) => (
            <div key={amigo.id} className="w-14 flex flex-col items-center text-center">
              <div
                onClick={() => navigate(`/usuario/${amigo.nick}`)}
                className="cursor-pointer"
              >
                <Avatar src={amigo.avatar} size={48} />
              </div>
              <span className="text-xs mt-1 truncate w-full">{amigo.nick}</span>
            </div>
          ))}

          {amigos.length > 6 && (
            <button
              onClick={() => setVerTodos(true)}
              className="text-sm text-blue-600 hover:underline ml-auto"
            >
              Ver todos →
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {verTodos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg max-h-[80vh] overflow-y-auto text-black">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Todos tus amigos</h3>
              <button
                onClick={() => setVerTodos(false)}
                className="text-gray-600 text-lg hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
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
