import React from "react";

type Episodio = {
  id: number;
  numero: number;
  titulo: string;
  descripcion: string;
  fecha_emision: string;
  poster_url: string | null;
};

type Temporada = {
  id: number;
  numero: number;
  nombre: string;
  descripcion: string;
  poster_url: string | null;
  episodios: Episodio[];
};

type Props = {
  temporadas: Temporada[];
  vistas: Record<number, boolean>;
  toggleTemporadaVista?: (idTemporada: number) => void;
  editable?: boolean; 
};

export default function TemporadasContenido({ temporadas, vistas, toggleTemporadaVista, editable = true }: Props) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">📺 Temporadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {temporadas.map((temp) => (
          <div
            key={temp.id}
            className="flex gap-4 bg-white rounded-lg shadow-sm p-4 items-center"
          >
            <img
              src={temp.poster_url || "https://via.placeholder.com/60x90?text=Sin+Imagen"}
              alt={temp.nombre}
              className="w-[60px] h-[90px] object-cover rounded"
            />
            <div className="flex flex-col justify-center text-sm">
              <strong>{temp.nombre || `Temporada ${temp.numero}`}</strong>
              <span className="text-gray-600">{temp.episodios.length} episodios</span>
              <label className="inline-flex items-center gap-1 mt-1">
                <input
                  type="checkbox"
                  checked={vistas[temp.id] || false}
                  disabled={!editable}
                  onChange={() => editable && toggleTemporadaVista?.(temp.id)}
                  className="accent-blue-600"
                />
                <span className="text-xs text-gray-700">Vista</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}