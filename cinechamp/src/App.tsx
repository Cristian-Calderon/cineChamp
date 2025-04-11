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
        <Route
          path="/"
          element={
            token ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
      <Route
         path="/login"
         element={<Login setToken={setToken} />}
      />

      

        <Route
          path="/register"
          element={token ? <Navigate to="/" /> : <Register />}
        />

        <Route
          path="/id/:nick"
          element={
            token ? (
              <Perfil onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;