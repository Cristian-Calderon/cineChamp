import "./login.css";
export default function Login() {
  return (
    <div className="login-container">
      <div className="login-main">
        <form action="">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nombre de usuario o Correo"
          />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="Contraseña"
          />

          <button type="submit">Iniciar Sesion</button>
        </form>
      </div>
    </div>
  );
}
