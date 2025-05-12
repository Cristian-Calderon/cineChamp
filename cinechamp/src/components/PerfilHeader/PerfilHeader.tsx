import { useNavigate } from "react-router-dom";



type PerfilHeaderProps = {
  photoUrl: string;
  name: string;
  onLogout: () => void;
  onEditProfile: () => void;
};

export default function PerfilHeader({
  photoUrl,
  name,
  onLogout,
  onEditProfile,
}: PerfilHeaderProps) {


  return (
    
    <div className="w-full bg-white border rounded-xl p-4 shadow-md mb-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
           
      {/* Perfil y botones */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 border-4 border-gray-300 rounded-full overflow-hidden">
          <img
            src={photoUrl}
            alt="Foto de perfil"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-lg font-semibold">{name}</p>
          <button
            onClick={onEditProfile}
            className="mt-1 bg-indigo-600 text-white px-3 py-1 rounded text-sm"
          >
            Editar Perfil
          </button>
          <button
            onClick={onLogout}
            className="mt-2 ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
          >
            Cerrar sesión
          </button>
          
        </div>
        
      </div>
      
    </div>
  );
}
