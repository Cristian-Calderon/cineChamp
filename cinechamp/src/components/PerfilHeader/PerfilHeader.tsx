import Avatar from "../Avatar/Avatar";
import NivelSteam from "./NivelSteam";

type PerfilHeaderProps = {
  id_usuario: number;
  photoUrl: string;
  name: string;
  peliculasVistas?: number;
  onLogout?: () => void;
  onEditProfile?: () => void;
  estadoRelacion?: "ninguna" | "pendiente" | "amigos";
  onAgregarAmigo?: () => void;
  onEliminarAmigo?: () => void;
};

export default function PerfilHeader({
  id_usuario, 
  photoUrl,
  name,
  onLogout,
  onEditProfile,
  estadoRelacion,
  onAgregarAmigo,
  onEliminarAmigo,
}: PerfilHeaderProps) {
  {
    return (
      <div className="w-full bg-white border rounded-xl p-4 shadow-md mb-10 text-black">
        <div className="flex items-center justify-between gap-6">
          {/* Avatar + Info del usuario */}
          <div className="flex items-center gap-6">
            <Avatar
              src={photoUrl}
              className="rounded-sm w-36 h-36 border-4 border-gray-300"
            />

            <div>
              <p className="text-xl font-bold">{name}</p>

              {onEditProfile && onLogout && (
                <div className="mt-3 flex gap-3 flex-wrap">
                  <button
                    onClick={onEditProfile}
                    className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 transition"
                  >
                    Editar Perfil
                  </button>
                  <button
                    onClick={onLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}

              {estadoRelacion === "ninguna" && onAgregarAmigo && (
                <button
                  onClick={onAgregarAmigo}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                >
                  Agregar amigo
                </button>
              )}
              {estadoRelacion === "amigos" && onEliminarAmigo && (
                <button
                  onClick={onEliminarAmigo}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
                >
                  Eliminar amigo
                </button>
              )}
              {estadoRelacion === "pendiente" && (
                <p className="mt-3 text-sm text-gray-500">Solicitud enviada</p>
              )}
            </div>
          </div>

          {/* Nivel alineado a la derecha */}
          <div className="w-40">
            <NivelSteam id_usuario={id_usuario} />
          </div>
        </div>
      </div>
    );
  }
}
