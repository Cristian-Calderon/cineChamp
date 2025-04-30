import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import Home from "./pages/private/Home/Home"; // Ejemplo de vista principal
import Perfil from "./pages/private/Perfil";
import Resultados from "./pages/private/Resultados";
import UsuarioResultado from "./pages/private/UsuarioResultado";
import BuscarUsuario from "./pages/private/BuscarUsuario";
import EditarPerfil from "./pages/private/EditarPerfil";
import ListaContenido from "./pages/private/ListaContenido";


export default function App() {
  // El token ya se lee directamente desde localStorage al iniciar
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nick");
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


        <Route
          path="/resultados"
          element={
            token ? <Resultados /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/usuario/resultado"
          element={token ? <UsuarioResultado /> : <Navigate to="/login" />}
        />

        <Route path="/buscar-usuario" element={<BuscarUsuario />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />

        <Route path="/uFavoritos/:userId" element={<ListaContenido />} />
        <Route path="/uHistorial/:userId" element={<ListaContenido />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

