import React, { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";

import Perfil from "./pages/private/Perfil";
import Buscador from "./pages/private/Buscador";
import UsuarioResultado from "./pages/private/UsuarioResultado";

import EditarPerfil from "./pages/private/EditarPerfil";
import ListaContenido from "./pages/private/ListaContenido";
import TodasLasCalificaciones from "./pages/private/Calificaciones";
import PerfilPublico from "./pages/private/PerfilPublico";


// Verificar ruta /
function HomeRedirect() {
  const token = localStorage.getItem("token");
  const nick = localStorage.getItem("nick"); // asegúrate de guardarlo al hacer login
  if (token && nick) {
    return <Navigate to={`/id/${nick}`} replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}



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

        {/* ruta raíz: envía a login o, si ya estás, a tu perfil */}
        <Route path="/" element={<HomeRedirect />} />

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
          path="/id/:nick/buscador"
          element={
            token ? <Buscador /> : <Navigate to="/login" />
          }
        />



        <Route
          path="/usuario/resultado"
          element={token ? <UsuarioResultado /> : <Navigate to="/login" />}
        />

       
        <Route path="/editar-perfil" element={<EditarPerfil />} />



        <Route path="/usuario/:nick/lista/:section/:media_type"
          element={token ? <ListaContenido /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/usuario/:nick"
          element={token ? <PerfilPublico /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />

        <Route
          path="/usuario/:nick/Calificaciones"
          element={token ? <TodasLasCalificaciones /> : <Navigate to="/login" replace />}
        />




      </Routes>




    </BrowserRouter>







  );
}

