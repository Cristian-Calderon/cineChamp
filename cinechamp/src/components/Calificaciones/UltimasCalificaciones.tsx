import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Star } from "lucide-react";

interface Calificacion {
  id: string;
  titulo: string;
  puntuacion: number;
  comentario?: string;
  posterUrl: string;
}

interface Props {
  calificaciones: Calificacion[];
}

export default function UltimasCalificaciones({ calificaciones }: Props) {
  const navigate = useNavigate();
  const limiteInicial = 7;

  const nick = localStorage.getItem("nick"); // Asegúrate de tener esto guardado al hacer login

  const calificacionesMostradas = calificaciones.slice(0, limiteInicial);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Últimas Calificaciones</h2>
      {calificaciones.length === 0 ? (
        <p className="text-gray-500 text-sm">No has calificado ningún contenido aún.</p>
      ) : (
        <>
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
            {calificacionesMostradas.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-start border-b pb-4 last:border-b-0"
              >
                <img
                  src={item.posterUrl}
                  alt={item.titulo}
                  className="w-14 h-20 object-cover rounded-md shadow"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.titulo}</p>
                  <div className="flex items-center text-sm text-yellow-600 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500 mr-1" />
                    {item.puntuacion}/10
                  </div>
                  {item.comentario && (
                    <p className="text-sm italic text-gray-600 mt-1">“{item.comentario}”</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            {calificaciones.length > limiteInicial && (
              <button
                onClick={() => navigate(`/usuario/${nick}/Calificaciones`)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Ver más
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
