import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import loginBg from '../../../assets/imagenes/poster.webp';

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
      interface LoginResponse {
        token: string;
        nick: string;
        id: string;
      }

      const response = await axios.post<LoginResponse>('http://localhost:3001/api/usuarios/login', {
        email,
        contraseña,
      });

      const { token, nick, id } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('nick', nick);
      localStorage.setItem("userId", id);
      setToken(token);
      navigate(`/id/${nick}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        {/* Panel izquierdo con imagen y lema */}
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white">CineChamp</h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="max-w-xl mt-6 text-lg leading-relaxed text-gray-100 font-medium drop-shadow-md"
              >
                <span className="block text-xl font-semibold mb-2">
                  Explora. Puntúa. Gana. ¡Conviértete en un CineChamp!
                </span>
                Comparte tu pasión por el cine, califica tus títulos favoritos, crea tu colección,
                comenta con amigos y sube de nivel con cada logro.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Panel derecho con formulario */}
        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-700 dark:text-white">CineChamp</h2>
              <p className="mt-3 text-gray-500 dark:text-gray-300">Inicia sesión en tu cuenta</p>
            </div>

            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                {error && (
                  <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="ejemplo@correo.com"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md 
                               dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 
                               focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="contraseña" className="text-sm text-gray-600 dark:text-gray-200">
                      Contraseña
                    </label>
                    <a href="#" className="text-sm text-gray-400 hover:text-blue-500 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <input
                    id="contraseña"
                    type="password"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                    placeholder="Tu contraseña"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md 
                               dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 
                               focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform 
                               bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring 
                               focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    Ingresar
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-400">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Regístrate
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
