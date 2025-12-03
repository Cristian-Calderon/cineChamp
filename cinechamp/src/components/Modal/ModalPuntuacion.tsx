import { X, Star } from "lucide-react";
import { useEffect } from "react";

interface ModalPuntuacionProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: number;
    title?: string;
    name?: string;
    media_type: "movie" | "tv";
    poster_path?: string | null;
  };
  tipo: string;
  onSubmit: () => void;
  puntuacion: string;
  setPuntuacion: (value: string) => void;
  comentario: string;
  setComentario: (value: string) => void;
}

export default function ModalPuntuacion({
  isOpen,
  onClose,
  item,
  tipo,
  onSubmit,
  puntuacion,
  setPuntuacion,
  comentario,
  setComentario,
}: ModalPuntuacionProps) {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const titulo = item.title || item.name || "Sin título";
  const puntuacionNum = parseInt(puntuacion, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full border border-neutral-800 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-800">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Calificar</h2>
            <p className="text-sm text-cinechamp-gray-text line-clamp-1">{titulo}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Puntuación */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Puntuación (1-10)
            </label>

            {/* Selector de estrellas visual */}
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPuntuacion(num.toString())}
                  className="group transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 transition-all ${
                      num <= puntuacionNum
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-neutral-600 group-hover:text-neutral-500"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Input numérico */}
            <input
              type="number"
              min="1"
              max="10"
              value={puntuacion}
              onChange={(e) => {
                const value = e.target.value;

                // Permitir campo vacío (para borrar)
                if (value === "") {
                  setPuntuacion("");
                  return;
                }

                // Convertir a número
                const num = parseInt(value, 10);

                // Solo permitir números entre 1 y 10
                if (!isNaN(num) && num >= 1 && num <= 10) {
                  setPuntuacion(value);
                }
                // Si es mayor a 10, limitar a 10
                else if (!isNaN(num) && num > 10) {
                  setPuntuacion("10");
                }
                // Si es menor a 1 pero es un número válido, limitar a 1
                else if (!isNaN(num) && num < 1 && num > 0) {
                  setPuntuacion("1");
                }
              }}
              onBlur={(e) => {
                // Al perder el foco, si está vacío o es 0, poner 1
                if (e.target.value === "" || parseInt(e.target.value, 10) === 0) {
                  setPuntuacion("1");
                }
              }}
              maxLength={2}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinechamp-red-primary focus:border-transparent transition-all"
              placeholder="1-10"
            />
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinechamp-red-primary focus:border-transparent transition-all resize-none"
              placeholder="¿Qué te pareció?"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-3 bg-cinechamp-red-primary hover:bg-cinechamp-red-hover rounded-lg font-semibold transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
