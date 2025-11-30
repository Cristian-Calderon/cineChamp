import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import Perfil from "./pages/private/Perfil";
import Buscador from "./pages/private/Buscador";
import UsuarioResultado from "./pages/private/UsuarioResultado";
import BuscarUsuario from "./pages/private/BuscarUsuario";
import EditarPerfil from "./pages/private/EditarPerfil";
import ListaContenido from "./pages/private/ListaContenido";
import PerfilPublico from "./pages/private/PerfilPublico";
import PaginaPelicula from "./pages/private/PaginaPelicula";
import FloatingMenu from "./components/FloatingMenu/FloatingMenu";

// Verificar ruta /
function HomeRedirect() {
  const token = localStorage.getItem("token");
  const nick = localStorage.getItem("nick");
  if (token && nick) {
    return <Navigate to={`/id/${nick}`} replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

// Wrapper para páginas con FloatingMenu
interface AuthLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

function AuthLayout({ children, onLogout }: AuthLayoutProps) {
  const nick = localStorage.getItem("nick");
  return (
    <>
      {children}
      <FloatingMenu onLogout={onLogout} userNick={nick || undefined} />
    </>
  );
}

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nick");
    localStorage.removeItem("userId");
    setToken(null);
  };


  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz: redirige a login o perfil */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Rutas públicas (sin FloatingMenu) */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />

        {/* Rutas protegidas (con FloatingMenu) */}
        <Route
          path="/id/:nick"
          element={
            token ? (
              <AuthLayout onLogout={handleLogout}>
                <Perfil onLogout={handleLogout} />
              </AuthLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/id/:nick/buscador"
          element={
            token ? (
              <AuthLayout onLogout={handleLogout}>
                <Buscador />
              </AuthLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/usuario/resultado"
          element={
            token ? (
              <AuthLayout onLogout={handleLogout}>
                <UsuarioResultado />
              </AuthLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/buscar-usuario"
          element={
            token ? (
              <AuthLayout onLogout={handleLogout}>
                <BuscarUsuario />
              </AuthLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/editar-perfil"
          element={
            token ? (
              <AuthLayout onLogout={handleLogout}>
                <EditarPerfil />
              </AuthLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/usuario/:nick/lista/:section/:media_type"
          element={
            token ? (
              <AuthLayout onLogout={handleLogout}>
                <ListaContenido />
              </AuthLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/usuario/:nick"
          element={
            token ? (
              <AuthLayout onLogout={handleLogout}>
                <PerfilPublico />
              </AuthLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/contenido/:tipo/:id"
          element={
            token ? (
              <AuthLayout onLogout={handleLogout}>
                <PaginaPelicula />
              </AuthLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Toast Container global */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

