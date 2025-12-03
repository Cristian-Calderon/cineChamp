import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Edit, Settings, LogOut, ChevronDown } from 'lucide-react';

interface MenuUsuarioProps {
  onLogout: () => void;
}

export default function MenuUsuario({ onLogout }: MenuUsuarioProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEditProfile = () => {
    navigate('/editar-perfil');
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setIsOpen(false);
  };

  // Calcular posición del menú cuando se abre
  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8, // 8px debajo del botón
        left: rect.left,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón principal */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="btn-secondary inline-flex items-center gap-2 group"
      >
        <Edit className="w-4 h-4" />
        <span>Opciones</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Menú dropdown renderizado en body usando portal */}
      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="fixed w-56 animate-scale-in origin-top-left z-[9999]"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          <div className="card-glass overflow-hidden shadow-2xl border border-neutral-700">
            <div className="p-2 space-y-1">
              {/* Editar Perfil */}
              <button
                onClick={handleEditProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-cinechamp-text-secondary hover:text-cinechamp-text-primary hover:bg-cinechamp-bg-hover rounded-xl transition-all duration-200 group"
              >
                <Edit className="w-5 h-5 text-cinechamp-accent-primary group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Editar Perfil</div>
                  <div className="text-xs text-cinechamp-text-tertiary">Cambiar avatar, nombre</div>
                </div>
              </button>

              {/* Configuración */}
              <button
                onClick={() => {
                  // TODO: Navegar a configuración cuando exista
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-cinechamp-text-secondary hover:text-cinechamp-text-primary hover:bg-cinechamp-bg-hover rounded-xl transition-all duration-200 group"
              >
                <Settings className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Configuración</div>
                  <div className="text-xs text-cinechamp-text-tertiary">Preferencias y privacidad</div>
                </div>
              </button>

              {/* Separador */}
              <div className="h-px bg-cinechamp-border-primary my-2" />

              {/* Cerrar Sesión */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-cinechamp-accent-error hover:text-white hover:bg-cinechamp-accent-error/90 rounded-xl transition-all duration-200 group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 group-hover:translate-x-1 transition-all" />
                <div className="flex-1">
                  <div className="text-sm font-bold">Cerrar Sesión</div>
                  <div className="text-xs opacity-75">Salir de tu cuenta</div>
                </div>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
