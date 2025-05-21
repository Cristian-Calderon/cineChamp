import { useState as reactUseState } from "react";

export default function BuscadorDoble({
  onBuscarPeliculas,
  onBuscarAmigo,
}: {
  onBuscarPeliculas: (query: string) => void;
  onBuscarAmigo: (nick: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [nick, setNick] = useState("");

  const buscarSiEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
    accion: () => void
  ) => {
    if (e.key === "Enter") accion();
  };

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      {/* Películas */}
      <div className="w-[70%] relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => buscarSiEnter(e, () => onBuscarPeliculas(query))}
          placeholder="🔍 Buscar película o serie"
          className="w-full py-3 px-4 pr-[7rem] border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
        <button
          onClick={() => onBuscarPeliculas(query)}
          className="absolute top-1.5 right-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          Buscar
        </button>
      </div>

      {/* Amigos */}
      <div className="w-[70%] relative">
        <input
          type="text"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          onKeyDown={(e) => buscarSiEnter(e, () => onBuscarAmigo(nick))}
          placeholder="👤 Buscar amigo"
          className="w-full py-3 px-4 pr-[7rem] border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
        />
        <button
          onClick={() => onBuscarAmigo(nick)}
          className="absolute top-1.5 right-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          Buscar
        </button>
      </div>
    </div>



  );

}
function useState<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  return reactUseState(initialValue);
}
