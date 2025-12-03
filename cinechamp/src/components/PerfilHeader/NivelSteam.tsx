import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Trophy, TrendingUp } from 'lucide-react';
import { obtenerInfoNivel, formatearXP } from '../../utils/nivelCalculator';

interface NivelSteamProps {
  experiencia: number;
}

export default function NivelSteam({ experiencia }: NivelSteamProps) {
  const info = obtenerInfoNivel(experiencia);

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700 shadow-xl">
      <div className="flex items-center gap-6">
        {/* Círculo de progreso */}
        <div className="w-28 h-28 flex-shrink-0">
          <CircularProgressbar
            value={info.porcentajeProgreso}
            text={`${info.nivelActual}`}
            styles={buildStyles({
              textColor: '#ffffff',
              pathColor: '#ef4444',
              trailColor: '#404040',
              textSize: '28px',
              pathTransitionDuration: 0.5,
            })}
          />
        </div>

        {/* Información de nivel */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-xl font-bold">Nivel {info.nivelActual}</h3>
          </div>

          {/* Barra de progreso lineal */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-cinechamp-gray-text">
              <span>{formatearXP(info.xpEnNivelActual)} XP</span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {formatearXP(info.xpParaSiguienteNivel - info.xpParaNivelActual)} XP
              </span>
            </div>

            {/* Barra de progreso */}
            <div className="relative h-3 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cinechamp-red-primary to-red-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${info.porcentajeProgreso}%` }}
              >
                {/* Brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>

            {/* Texto de progreso */}
            <p className="text-xs text-cinechamp-gray-text text-center">
              {Math.round(info.porcentajeProgreso)}% al siguiente nivel
            </p>
          </div>

          {/* XP Total */}
          <div className="text-sm text-cinechamp-gray-text">
            <span className="font-semibold text-white">{formatearXP(info.xpActual)}</span> XP total
          </div>
        </div>
      </div>

      {/* Tooltip de cómo ganar XP */}
      <div className="mt-4 pt-4 border-t border-neutral-700">
        <p className="text-xs text-cinechamp-gray-text text-center">
          Gana XP calificando películas y series, completando logros y siendo activo en la comunidad
        </p>
      </div>
    </div>
  );
}
