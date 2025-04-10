import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import Home from "./pages/private/Home/Home"; // Ejemplo de vista principal
import Perfil from "./pages/private/Perfil";

function App() {
  // Este estado guardará el token. Si es null, se asume que el usuario no está autenticado.
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Función para cerrar sesión (opcionalmente la podrías manejar en otro componente)
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 
          Si NO hay token, forzamos a que la ruta "/" redirija a "/login".
          Si hay token, enviamos a Home (o la ruta principal que prefieras).
        */}
        <Route
          path="/"
          element={
            token ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />

        {/* 
          Ruta de Login. Si hay token, redirigimos a "/", si no, mostramos el componente <Login />
        */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login setToken={setToken} />}
        />

        {/* 
          Ruta de Register. Igualmente, si hay token, redirigimos a "/", 
          si no hay token, mostramos <Register />
        */}
        <Route
          path="/register"
          element={token ? <Navigate to="/" /> : <Register />}
        />

        <Route
          path="/perfil"
          element={token ? <Perfil /> : <Navigate to="/login" />}
        />

        {/* 
          Para cualquier otra ruta, si no la encuentra, podrías redirigirla 
          a "/" o a alguna página de error 404, a gusto.
        */}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
