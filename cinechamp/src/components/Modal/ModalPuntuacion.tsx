// src/components/ModalPuntuacion.tsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type Resultado = {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
};

type ModalPuntuacionProps = {
  isOpen: boolean;
  onClose: () => void;
  item: Resultado;
  tipo: "favorito" | "historial";
  onSubmit: () => void;
  puntuacion: string;
  setPuntuacion: (v: string) => void;
  comentario: string;
  setComentario: (v: string) => void;
};

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
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold mb-4 text-gray-800">
                  📊 Puntuar: {item.title || item.name}
                </Dialog.Title>

                <input
                  type="number"
                  min={1}
                  max={10}
                  placeholder="⭐ Puntuación (1–10)"
                  value={puntuacion}
                  onChange={(e) => setPuntuacion(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                />

                <textarea
                  placeholder="💬 Comentario (opcional)"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={onSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
