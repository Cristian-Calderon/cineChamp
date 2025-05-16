type BotonesPerfilPropioProps = {
    onEditProfile: () => void;
    onLogout: () => void;
  };
  
  export default function BotonesPerfilPropio({
    onEditProfile,
    onLogout,
  }: BotonesPerfilPropioProps) {
    return (
      <div className="mt-2 flex gap-2">
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
    );
  }
  