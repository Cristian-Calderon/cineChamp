import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type NivelSteamProps = {
  id_usuario: number;
};

export default function NivelSteam({ id_usuario }: NivelSteamProps) {
  const [nivel, setNivel] = useState(1);
  const [progreso, setProgreso] = useState(0);

useEffect(() => {
  console.log("Componente NivelSteam montado");
  console.log("ID del usuario recibido:", id_usuario);

 const fetchNivel = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/contenido/xp/${id_usuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log("Respuesta de la API:", data);

    if (!res.ok) {
      console.error("❌ Error de autenticación:", data);
      return;
    }

    if (
      typeof data.nivel === "number" &&
      typeof data.progreso === "number"
    ) {
      console.log("Nivel:", data.nivel, "Progreso:", data.progreso);
      setNivel(data.nivel);
      setProgreso(data.progreso);
    } else {
      console.warn("⚠️ Datos no válidos:", data);
    }
  } catch (error) {
    console.error("❌ Error al cargar nivel:", error);
  }
};

  if (id_usuario && id_usuario !== 0) {
    fetchNivel();
  }
}, [id_usuario]);
  const colorNivel = (nivel: number) => {
    if (nivel >= 30) return "#ffd700";
    if (nivel >= 15) return "#c0c0c0";
    if (nivel >= 5) return "#cd7f32";
    return "#a3e635";
  };

  return (
    <div className="w-24 h-24">
      <CircularProgressbar
        value={progreso}
        text={`Nvl ${nivel}`}
        styles={buildStyles({
          textColor: "#111827",
          pathColor: colorNivel(nivel),
          trailColor: "#e5e7eb",
          textSize: "16px",
        })}
      />
    </div>
  );
}
