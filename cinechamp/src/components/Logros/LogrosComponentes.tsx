import { useState } from "react";

type Achievement = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  unlocked: boolean;
};

type LogrosPreviewProps = {
  achievements: Achievement[];
};

export default function LogrosComponentes({ achievements }: LogrosPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const primeros = achievements.slice(0, 3);
  const restantes = achievements.slice(3);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md text-black"> 
      <h2 className="text-xl font-semibold mb-4">🏆 Logros</h2>

      <div className="flex gap-4">
        {primeros.map((logro) => (
          <div key={logro.id} className="w-20 flex flex-col items-center text-center" title={logro.description}>
            <img
              src={logro.image_url}
              alt={logro.title}
              className="w-[50px] h-[50px] object-contain border border-white/30 rounded shadow-md"
            />
            <span className="text-xs mt-1">{logro.title}</span>
          </div>
        ))}

        {restantes.length > 0 && (
          <button
            onClick={() => setIsOpen(true)}
            className="text-sm text-blue-400 hover:underline self-center ml-auto"
          >
            Ver todos →
          </button>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
          <div className="bg-white text-black rounded-xl p-6 max-w-xl w-full relative shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Todos los Logros</h3>
            <div className="grid grid-cols-4 gap-4 max-h-[300px] overflow-y-auto">
              {achievements.map((logro) => (
                <div key={logro.id} className="flex flex-col items-center text-center" title={logro.description}>
                  <img
                    src={logro.image_url}
                    alt={logro.title}
                    className="w-[50px] h-[50px] object-contain border rounded shadow"
                  />
                  <span className="text-xs mt-1">{logro.title}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
