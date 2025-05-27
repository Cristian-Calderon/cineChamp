import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  media_type: "movie" | "tv";
};

type CarruselProps = {
  titulo: string;
  items: Movie[];
  onVerMas?: () => void;
  total?: number;
  onClickItem?: (item: any) => void;
};

export default function Carrusel({ titulo, items, onVerMas, total, onClickItem }: CarruselProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-xl p-5 shadow-lg w-full mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {titulo}
        {typeof total === "number" && <span className="text-sm text-gray-500"> ({total})</span>}
      </h2>

      <div className="relative overflow-x-auto">
        <div className="flex gap-6 snap-x snap-mandatory scroll-pl-4 overflow-x-auto pb-4 scrollbar-hide">
          {items.slice(0, 10).map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 snap-start w-64 transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => {
                if (onClickItem) {
                  onClickItem(item);
                } else {
                  navigate(`/contenido/${item.media_type}/${item.id}`);
                }
              }}
            >
              <div className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
                  <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {onVerMas && (
        <div className="mt-4 text-right">
          <button
            onClick={onVerMas}
            className="text-blue-600 text-sm hover:underline hover:text-blue-800 transition"
          >
            Ver más →
          </button>
        </div>
      )}
    </div>
  );
}