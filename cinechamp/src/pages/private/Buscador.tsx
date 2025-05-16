import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// Tipo para los resultados de búsqueda
type Resultado = {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path?: string | null;
};

export default function Buscador() {
  const { nick } = useParams();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = parseInt(localStorage.getItem("userId") || "0");

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setQuery(q);
    if (q) buscar(q);
  }, [location.search]);

  const buscar = async (busqueda: string) => {
    if (!busqueda.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/contenido/bContenido?q=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      const filtrados = data.filter((item: Resultado) => item.media_type === "movie" || item.media_type === "tv");
      setResultados(filtrados);
    } catch (error) {
      console.error("❌ Error al buscar:", error);
    } finally {
      setLoading(false);
    }
  };

  const manejarAgregar = async (item: Resultado, tipoGuardado: "favorito" | "historial") => {
    console.log("Guardando como:", tipoGuardado, item);

    const puntuacionStr = prompt("⭐ Puntuación (1–10):");
    if (puntuacionStr === null) return;

    const puntuacion = parseInt(puntuacionStr, 10);
    if (!puntuacion || puntuacion < 1 || puntuacion > 10) {
      alert("❌ Puntuación inválida.");
      return;
    }

    const comentario = prompt("💬 Comentario (opcional):");
    if (comentario === null) return;

    try {
      
      const res = await fetch("http://localhost:3001/contenido/agregar", {
        
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_api: item.id,
          tipoGuardado, // solo por ver en backend si llega
        }),
        
      });

      console.log("📤 Enviado a /contenido/agregar:", {
        id_usuario: userId,
        id_api: item.id,
        tipoGuardado,
      });
      
      


      const result = await res.json();
      if (!res.ok) {
        console.log("❌ Error en agregar:", result);
        alert("❌ Error: " + result.error);
        return;
      }
      

      const calificacionRes = await fetch("http://localhost:3001/contenido/calificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_api: item.id,
          tipo: item.media_type === "movie" ? "pelicula" : "serie",
          puntuacion,
          comentario,
          tipoGuardado,
        }),
      });

      const calificacionResult = await calificacionRes.json();
      console.log("📦 Calificación respuesta:", calificacionResult);

      alert("✅ Guardado correctamente");
    } catch (err) {
      console.error("❌ Error de red:", err);
    }
  };

  const renderTarjeta = (item: Resultado) => (
    <div key={item.id} className="border rounded p-2 shadow-sm text-center">
      {item.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={item.title || item.name}
          className="w-full h-[100px] object-cover rounded mb-2"
        />
      ) : (
        <div className="w-full h-[100px] bg-gray-200 flex items-center justify-center mb-2 rounded">
          <span className="text-sm text-gray-600">Sin imagen</span>
        </div>
      )}
      <p className="text-sm font-semibold">{item.title || item.name}</p>
      <p className="text-xs text-blue-600 font-medium">{item.media_type === "movie" ? "Película" : "Serie"}</p>
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={() => manejarAgregar(item, "favorito")}
          className="bg-green-500 text-white rounded px-2 py-1 text-sm"
        >
          + Favorito
        </button>
        <button
          onClick={() => manejarAgregar(item, "historial")}
          className="bg-yellow-500 text-white rounded px-2 py-1 text-sm"
        >
          + Historial
        </button>

      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resultados de búsqueda</h1>
      {loading ? (
        <p className="text-center text-gray-500">🔄 Cargando...</p>
      ) : resultados.length === 0 ? (
        <p className="text-center text-gray-500">No hay resultados.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {resultados.map(renderTarjeta)}
        </div>
      )}
    </div>
  );
}
