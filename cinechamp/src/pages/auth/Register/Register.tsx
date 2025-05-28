import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/imagen-header-logo/logo2.jpeg'; 
import fondoRegistro from '../../../assets/imagenes/prueb.jpeg'; 



function Register() {
  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nick', nick);
    formData.append('email', email);
    formData.append('contrasena', contrasena);
    if (avatarFile) formData.append('avatar', avatarFile);

    try {
      await axios.post('http://localhost:3001/api/usuarios/register', formData);

      setMensaje('✅ Usuario creado correctamente. Redirigiendo al login...');
      setError('');

      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      console.error('Error en registro:', err.response || err);
      const serverError = err.response?.data?.error;
      setError(serverError || 'Error al registrarse');
      setMensaje('');
    }
  };

  return (
    <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center"
  style={{ backgroundImage: `url(${fondoRegistro})` }}
>
  <div className="w-full max-w-md bg-white/90 p-8 rounded-lg shadow-xl backdrop-blur-md">
   
    <div className="flex justify-center mb-2">
      <img src={logo} alt="Logo" className="h-24" />
    </div>

    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Registro</h2>
        {mensaje && <p className="text-green-500 text-sm mb-4 text-center">{mensaje}</p>}
        {error   && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="nick" className="block text-gray-700 mb-1">Nick:</label>
            <input
              id="nick"
              name="nick"
              type="text"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contrasena" className="block text-gray-700 mb-1">Contraseña:</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="avatar" className="block text-gray-700 mb-1">Avatar (opcional):</label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition-colors"
          >
            Registrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
