import { obtenerInfoNivel } from '../../utils/nivelCalculator';

interface AvatarConNivelProps {
  photoUrl: string;
  experiencia: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLevel?: boolean;
}

const sizeConfig = {
  sm: { container: 'w-20 h-20', img: 'w-16 h-16', border: 'border-4', badge: 'text-xs px-2 py-0.5', ring: 6 },
  md: { container: 'w-28 h-28', img: 'w-24 h-24', border: 'border-4', badge: 'text-sm px-3 py-1', ring: 8 },
  lg: { container: 'w-36 h-36', img: 'w-32 h-32', border: 'border-4', badge: 'text-sm px-3 py-1', ring: 10 },
  xl: { container: 'w-44 h-44', img: 'w-40 h-40', border: 'border-[6px]', badge: 'text-base px-4 py-1.5', ring: 12 },
};

export default function AvatarConNivel({
  photoUrl,
  experiencia,
  size = 'lg',
  showLevel = true
}: AvatarConNivelProps) {
  const info = obtenerInfoNivel(experiencia);
  const config = sizeConfig[size];

  // Calcular el stroke-dasharray para el círculo de progreso
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = (info.porcentajeProgreso / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Contenedor principal */}
      <div className={`relative ${config.container}`}>
        {/* SVG del anillo de progreso */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 120 120"
        >
          {/* Círculo de fondo (gris) */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#404040"
            strokeWidth={config.ring}
            opacity="0.3"
          />
          {/* Círculo de progreso (rojo) */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth={config.ring}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))'
            }}
          />
        </svg>

        {/* Avatar en el centro */}
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <div className={`${config.img} rounded-full ${config.border} border-neutral-900 overflow-hidden shadow-2xl`}>
            <img
              src={photoUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Badge de nivel */}
      {showLevel && (
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold ${config.badge} rounded-full border-2 border-neutral-900 shadow-lg whitespace-nowrap`}>
          <span className="drop-shadow-md">Nv.{info.nivelActual}</span>
        </div>
      )}

      {/* Tooltip con porcentaje (aparece en hover) */}
      <div className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs font-semibold px-2 py-1 rounded-full border-2 border-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        {Math.round(info.porcentajeProgreso)}%
      </div>
    </div>
  );
}
