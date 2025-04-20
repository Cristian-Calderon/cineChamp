// src/pages/private/BuscarUsuario.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
    id: number;
    nick: string;
    avatar?: string;
};

export default function BuscarUsuario() {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState<User[]>([]);
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();
    const [estados, setEstados] = useState<{ [key: number]: string }>({});

    const obtenerEstados = async (usuarios: User[]) => {
        const userId = parseInt(localStorage.getItem("userId") || "0");
        const estadosTemp: { [key: number]: string } = {};

        for (const usuario of usuarios) {
            const res = await fetch(`/api/amigos/estado?usuarioId=${userId}&amigoId=${usuario.id}`);
            const data = await res.json();
            estadosTemp[usuario.id] = data.estado || "ninguno";
        }

        setEstados(estadosTemp);
    };



    const buscar = async () => {

        if (!query) return;
        try {
            const res = await fetch(`/api/usuarios/buscar?nick=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResultados(data);
            obtenerEstados(data);
            if (data.length === 0) setMensaje("No se encontraron usuarios");
            else setMensaje("");
        } catch (error) {
            console.error("Error al buscar usuarios:", error);
            setMensaje("Hubo un error al buscar");
        }

    };

    const agregarAmigo = async (amigoId: number) => {
        const userId = parseInt(localStorage.getItem("userId") || "0");
        const res = await fetch("/api/amigos/solicitud", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: userId, amigo_id: amigoId }),
        });

        const data = await res.json();
        if (res.ok) alert("Amigo agregado");
        else alert("Error: " + data.error);
    };



    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Buscar Amigos</h1>

            <div className="flex gap-2 mb-6">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por nick"
                    className="border p-2 rounded w-full"
                />
                <button
                    onClick={buscar}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Buscar
                </button>
            </div>

            {mensaje && <p className="text-center text-gray-500">{mensaje}</p>}


            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {resultados.map((user) => (
                    <div
                        key={user.id}
                        className="border rounded-xl p-4 shadow flex flex-col items-center"
                    >
                        <img
                            src={user.avatar || "https://i.pravatar.cc/150?img=8"}
                            alt="avatar"
                            className="w-20 h-20 rounded-full mb-2 object-cover"
                        />
                        <p className="font-semibold">{user.nick}</p>



                        {estados[user.id] === "aceptado" && <p className="text-green-600">✔ Amigo</p>}
                        {estados[user.id] === "pendiente" && <p className="text-yellow-500">⏳ Pendiente</p>}
                        {estados[user.id] === "ninguno" && (
                            <button onClick={() => agregarAmigo(user.id)} className="...">
                                + Agregar Amigo
                            </button>
                        )}
                        <button
                            className="mt-1 text-blue-600 underline text-sm"
                            onClick={() => navigate(`/id/${user.nick}`)}
                        >
                            Ver perfil
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
