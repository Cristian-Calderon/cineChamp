import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  media_type: "movie" | "tv";
};

export default function ListaContenido() {
  const { userId } = useParams();
  const location = useLocation();
  const [items, setItems] = useState<Movie[]>([]);
  const [titulo, setTitulo] = useState("");

  useEffect(() => {
    const tipo = location.pathname.includes("favoritos") ? "favoritos" : "historial";
    setTitulo(tipo === "favoritos" ? "Favoritos" : "Historial");

    fetch(`http://localhost:3001/api/contenido/${tipo}/${userId}`)
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => console.error("Error cargando contenido:", err));
  }, [userId, location.pathname]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{titulo}</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">No hay contenido para mostrar.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded shadow-sm overflow-hidden">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-2 text-center">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {item.media_type === "movie" ? "🎬 Película" : "📺 Serie"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
