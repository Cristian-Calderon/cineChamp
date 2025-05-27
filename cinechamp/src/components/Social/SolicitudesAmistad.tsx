import { UserPlus } from "lucide-react";

// URL base para avatares
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface Solicitud {
  id: string;
  nick: string;
  avatar?: string;
}

interface Props {
  solicitudes: Solicitud[];
  aceptarSolicitud: (id: string) => void;
}

export default function SolicitudesAmistad({ solicitudes = [], aceptarSolicitud }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-blue-500" />
        Solicitudes de amistad
      </h2>
      {solicitudes.length === 0 ? (
        <p className="text-sm text-gray-500">No tienes solicitudes pendientes.</p>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((s) => (
            <div key={`amigo-${s.id}`} className="flex items-center gap-3">
              <img
                src={
                  s.avatar
                    ? `${BACKEND_URL}${s.avatar}`
                    : "https://i.pravatar.cc/150"
                }
                alt={s.nick}
                className="w-9 h-9 rounded-full object-cover border"
              />
              <span className="flex-1 text-sm font-medium text-gray-700">{s.nick}</span>
              <button
                onClick={() => aceptarSolicitud(s.id)}
                className="bg-green-500 hover:bg-green-600 transition-colors text-white px-3 py-1 rounded-md text-xs font-medium"
              >
                Aceptar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
