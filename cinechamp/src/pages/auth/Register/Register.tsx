import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { Film, User, Mail, Lock, UserPlus, Sparkles, Image } from "lucide-react";

function Register() {
  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [avatar, setAvatar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMensaje('');

    try {
      const response = await axios.post('http://localhost:3001/api/usuarios/register', {
        nick,
        email,
        contraseña,
        avatar
      });
      setMensaje('¡Cuenta creada! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-gradient-mesh">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cinechamp-accent-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cinechamp-accent-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {/* Logo Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-accent rounded-2xl shadow-glow-accent">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gradient">CineChamp</h1>
          </div>
          <p className="text-cinechamp-text-secondary flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Únete a la comunidad cinematográfica
          </p>
        </div>

        {/* Card */}
        <div className="card-glass p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-center">Crear cuenta</h2>
            <p className="text-sm text-center text-cinechamp-text-secondary">
              Completa los datos para registrarte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Success Message */}
            {mensaje && (
              <div className="p-4 bg-cinechamp-accent-success/10 border border-cinechamp-accent-success/30 rounded-lg animate-slide-down">
                <p className="text-cinechamp-accent-success text-sm text-center">
                  {mensaje}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-cinechamp-accent-error/10 border border-cinechamp-accent-error/30 rounded-lg animate-slide-down">
                <p className="text-cinechamp-accent-error text-sm text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Nick Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cinechamp-text-secondary" htmlFor="nick">
                Nombre de Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinechamp-text-tertiary" />
                <input
                  id="nick"
                  type="text"
                  className="input-modern pl-11"
                  placeholder="tu_nickname"
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cinechamp-text-secondary" htmlFor="email">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinechamp-text-tertiary" />
                <input
                  id="email"
                  type="email"
                  className="input-modern pl-11"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cinechamp-text-secondary" htmlFor="contraseña">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinechamp-text-tertiary" />
                <input
                  id="contraseña"
                  type="password"
                  className="input-modern pl-11"
                  placeholder="••••••••"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Avatar Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cinechamp-text-secondary" htmlFor="avatar">
                URL de Avatar (opcional)
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinechamp-text-tertiary" />
                <input
                  id="avatar"
                  type="text"
                  className="input-modern pl-11"
                  placeholder="https://..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cinechamp-border-primary" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-cinechamp-bg-elevated text-cinechamp-text-tertiary">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-cinechamp-accent-primary hover:text-cinechamp-accent-secondary font-semibold transition-colors inline-flex items-center gap-2 group"
            >
              Iniciar sesión
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-cinechamp-text-tertiary mt-6">
          Al registrarte, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}

export default Register;