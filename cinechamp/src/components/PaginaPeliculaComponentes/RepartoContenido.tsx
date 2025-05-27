// components/DetalleContenido/RepartoContenido.tsx
import React from "react";

type Actor = {
  nombre: string;
  personaje: string;
  foto: string | null;
};

type Props = {
  reparto: Actor[];
};

export default function RepartoContenido({ reparto }: Props) {
  if (reparto.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">🎭 Reparto principal</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {reparto.map((actor, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-32 text-center bg-white rounded-xl p-3 shadow-sm"
          >
            {actor.foto ? (
              <img
                src={actor.foto}
                alt={actor.nombre}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-gray-800">{actor.nombre}</p>
            <p className="text-xs text-gray-500">{actor.personaje}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
