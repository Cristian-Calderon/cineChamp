// Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

// dentro del componente:

interface LoginProps {
  setToken: (token: string) => void;
}

function Login({ setToken }: LoginProps) {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/usuarios/login', {
        email,
        contraseña,
      });

      
      const { token, nick, id } = response.data as { token: string; nick: string; id: string };
      // Guardamos el token en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('nick', nick);
      localStorage.setItem("userId", id);
      // Actualizamos el estado en App
      setToken(token);
      navigate(`/id/${nick}`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1" htmlFor="contraseña">
              Contraseña:
            </label>
            <input
              id="contraseña"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition-colors"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;