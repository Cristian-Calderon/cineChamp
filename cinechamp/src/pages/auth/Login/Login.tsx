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
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={contraseña} 
            onChange={(e) => setContraseña(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
      
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">
        ✅ ¡Tailwind está funcionando!
      </h1>
    </div>
    </div>
  );
}

export default Login;