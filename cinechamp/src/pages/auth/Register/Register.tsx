// Register.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function Register() {
  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [avatar, setAvatar] = useState(''); // si deseas permitir subir un avatar
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/usuarios/register', {
        nick,
        email,
        contraseña,
        avatar
      });
      setMensaje('Usuario creado correctamente. Ahora puedes iniciar sesión.');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse');
      setMensaje('');
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nick:</label>
          <input 
            type="text" 
            value={nick} 
            onChange={(e) => setNick(e.target.value)} 
            required 
          />
        </div>
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
        <div>
          <label>Avatar (opcional):</label>
          <input 
            type="text" 
            value={avatar} 
            onChange={(e) => setAvatar(e.target.value)} 
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
    </div>
  );
}

export default Register;