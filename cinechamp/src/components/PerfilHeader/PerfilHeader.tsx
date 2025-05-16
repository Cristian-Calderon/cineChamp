import Avatar from "../Avatar/Avatar";

type PerfilHeaderProps = {
  photoUrl: string;
  name: string;
  onLogout?: () => void;
  onEditProfile?: () => void;
  estadoRelacion?: "ninguna" | "pendiente" | "amigos";
  onAgregarAmigo?: () => void;
  onEliminarAmigo?: () => void;
};

export default function PerfilHeader({
  photoUrl,
  name,
  onLogout,
  onEditProfile,
  estadoRelacion,
  onAgregarAmigo,
  onEliminarAmigo,
}: PerfilHeaderProps) {
  return (
    <div className="w-full bg-white border rounded-xl p-4 shadow-md mb-10">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 border-4 border-gray-300 rounded-full overflow-hidden">
          <Avatar src={photoUrl} size={80} />
        </div>

        {/* Info */}
        <div>
          <p className="text-lg font-semibold">{name}</p>

          {/* Botones perfil propio */}
          {onEditProfile && onLogout && (
            <div className="mt-2 flex gap-2 flex-wrap">
              <button
                onClick={onEditProfile}
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
              >
                Editar Perfil
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          )}

          {/* Botones amistad */}
          {estadoRelacion === "ninguna" && onAgregarAmigo && (
            <button
              onClick={onAgregarAmigo}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Agregar amigo
            </button>
          )}
          {estadoRelacion === "amigos" && onEliminarAmigo && (
            <button
              onClick={onEliminarAmigo}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Eliminar amigo
            </button>
          )}
          {estadoRelacion === "pendiente" && (
            <p className="mt-2 text-sm text-gray-500">Solicitud enviada</p>
          )}
        </div>
      </div>
    </div>
  );
}
