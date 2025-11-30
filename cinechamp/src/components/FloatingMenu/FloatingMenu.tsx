import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, User, Users, Star, LogOut, X, Menu } from "lucide-react";

interface FloatingMenuProps {
  onLogout?: () => void;
  userNick?: string;
}

export default function FloatingMenu({ onLogout, userNick }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Inicio", path: userNick ? `/id/${userNick}` : "/" },
    { icon: Search, label: "Buscar", path: userNick ? `/id/${userNick}/buscador` : "/buscar" },
    { icon: User, label: "Perfil", path: userNick ? `/id/${userNick}` : "/perfil" },
    { icon: Users, label: "Usuarios", path: "/buscar-usuario" },
    { icon: Star, label: "Favoritos", path: userNick ? `/usuario/${userNick}/lista/favoritos/all` : "#" },
  ];

  // Manejar inicio de arrastre (mouse y touch)
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  // Manejar movimiento
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;

    // Limitar dentro de los bordes de la pantalla
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;

    setPosition({
      x: Math.max(20, Math.min(newX, maxX)),
      y: Math.max(20, Math.min(newY, maxY)),
    });
  };

  // Manejar fin de arrastre
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Click en el menú (solo si no se estaba arrastrando)
  const handleMenuClick = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  // Navegar a una ruta
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Cerrar menú
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
    setIsOpen(false);
  };

  // Event listeners para drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, dragStart, position]);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? "none" : "all 0.3s ease",
      }}
    >
      {/* Botón principal flotante */}
      <div
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={handleMenuClick}
        className={`
          w-14 h-14 rounded-full
          bg-gradient-accent
          shadow-glow-accent
          flex items-center justify-center
          cursor-grab active:cursor-grabbing
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-glow-cyan active:scale-95
          border-2 border-cinechamp-accent-primary/30
          ${isOpen ? "scale-110 shadow-glow-cyan" : ""}
        `}
      >
        <div className="relative">
          <Menu className={`w-6 h-6 text-white transition-all duration-300 ${isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
          <X className={`w-6 h-6 text-white absolute top-0 left-0 transition-all duration-300 ${isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
        </div>
      </div>

      {/* Menú expandido */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 animate-scale-in">
          <div className="card-glass overflow-hidden min-w-[220px]">
            {/* Items del menú */}
            <div className="p-2 space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigate(item.path)}
                  className="
                    w-full flex items-center gap-3 px-4 py-3
                    text-cinechamp-text-secondary hover:text-cinechamp-text-primary
                    hover:bg-cinechamp-bg-hover
                    rounded-xl transition-all duration-200
                    group
                  "
                >
                  <item.icon className="w-5 h-5 text-cinechamp-accent-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}

              {/* Separador */}
              <div className="h-px bg-cinechamp-border-primary my-2" />

              {/* Logout */}
              {onLogout && (
                <button
                  onClick={handleLogoutClick}
                  className="
                    w-full flex items-center gap-3 px-4 py-3
                    text-cinechamp-accent-error hover:text-cinechamp-accent-error/80
                    hover:bg-cinechamp-accent-error/10
                    rounded-xl transition-all duration-200
                    group
                  "
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Cerrar Sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
