import { useState } from "react";
import ModalPuntuacion from "./Modal/ModalPuntuacion";
import { toast } from "react-toastify";

type Props = {
  id_api: number;
  tipo: "movie" | "tv";
  titulo: string;
  posterUrl: string | null;
};

export default function BotonAgregarHistorial({ id_api, tipo, titulo, posterUrl }: Props) {
  const userId = parseInt(localStorage.getItem("userId") || "0");
  const [modalVisible, setModalVisible] = useState(false);
  const [puntuacion, setPuntuacion] = useState("");
  const [comentario, setComentario] = useState("");

  const abrirModal = () => {
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setPuntuacion("");
    setComentario("");
  };

  const agregarHistorial = async () => {
  const score = parseInt(puntuacion, 10);
  if (isNaN(score) || score < 1 || score > 10) {
    toast.error("❌ Puntuación inválida");
    return;
  }

  try {
    // 1. Verificar si ya está en historial
    const historialRes = await fetch(`http://localhost:3001/api/contenido/historial/${userId}`);
    const historialData = await historialRes.json();
    const yaExiste = historialData.some((item: any) => item.id === id_api);

    if (yaExiste) {
      toast.info("ℹ️ Ya está en tu historial");
      cerrarModal();
      return;
    }

    // 2. Agregar a historial
    await fetch("http://localhost:3001/contenido/agregar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: userId,
        id_api,
        tipoGuardado: "historial",
      }),
    });

    // 3. Calificar
    await fetch("http://localhost:3001/contenido/calificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: userId,
        id_api,
        tipo: tipo === "movie" ? "pelicula" : "serie",
        puntuacion: score,
        comentario,
        tipoGuardado: "historial",
      }),
    });

    toast.success("✅ Añadido a historial y calificado");
    cerrarModal();
  } catch (err) {
    console.error("Error:", err);
    toast.error("❌ Hubo un error");
  }
};

  return (
    <>
      <button
        onClick={abrirModal}
        className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        📽️ Añadir a Historial
      </button>

      {modalVisible && (
        <ModalPuntuacion
          isOpen={modalVisible}
          onClose={cerrarModal}
          item={{ id: id_api, title: titulo, media_type: tipo, poster_path: posterUrl }}
          tipo="historial"
          onSubmit={agregarHistorial}
          puntuacion={puntuacion}
          setPuntuacion={setPuntuacion}
          comentario={comentario}
          setComentario={setComentario}
        />
      )}
    </>
  );
}
