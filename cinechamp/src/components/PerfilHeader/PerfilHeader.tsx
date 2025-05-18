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
    <div className="w-full bg-white border rounded-xl p-4 shadow-md mb-10 text-black">
      <div className="flex items-center gap-6">
        {/* Avatar grande cuadrado */}
        <Avatar
          src={photoUrl}
          className="rounded-sm w-36 h-36 border-4 border-gray-300"
        />

        {/* Info */}
        <div>
          <p className="text-xl font-bold">{name}</p>

          {/* Botones perfil propio */}
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

          {/* Botones amistad */}
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
    </div>
  );
}
