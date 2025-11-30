import React from "react";

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
};

export default function Carrusel({ titulo, items, onVerMas }: CarruselProps) {
  return (
    <div className="card-glass p-6 w-full animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-cinechamp-text-primary">{titulo}</h2>

      <div className="relative overflow-x-auto">
        <div className="flex gap-4 snap-x snap-mandatory scroll-pl-4 overflow-x-auto pb-4 scrollbar-hide">
          {items.slice(0, 10).map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 snap-start w-44 transition-transform transform hover:scale-105"
            >
              <div className="relative group rounded-xl overflow-hidden border border-cinechamp-border-primary hover:border-cinechamp-accent-primary transition-all shadow-card hover:shadow-card-hover">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-cinechamp-bg-primary/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-cinechamp-text-primary text-sm font-semibold truncate">{item.title}</p>
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
            className="text-cinechamp-accent-primary text-sm hover:text-cinechamp-accent-secondary transition-colors font-semibold inline-flex items-center gap-1 group"
          >
            Ver más
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
