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
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Películas */}
        <div className="flex gap-2 w-full sm:w-64">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => buscarSiEnter(e, () => onBuscarPeliculas(query))}
            className="border p-2 rounded w-full"
            placeholder="Buscar película o serie"
          />
          <button
            onClick={() => onBuscarPeliculas(query)}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Buscar
          </button>
        </div>
  
        {/* Amigos */}
        <div className="flex gap-2 w-full sm:w-64">
          <input
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            onKeyDown={(e) => buscarSiEnter(e, () => onBuscarAmigo(nick))}
            className="border p-2 rounded w-full"
            placeholder="Buscar amigo"
          />
          <button
            onClick={() => onBuscarAmigo(nick)}
            className="bg-green-600 text-white px-3 py-2 rounded"
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
  