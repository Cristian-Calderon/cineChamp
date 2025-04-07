import "./footer.css";
import ejemplo from "../../assets/images-footer/ejemplo.webp";

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-images ">
        <img src={ejemplo} alt="Imagen de logo cinechamp" />
      </div>

      <div className="footer-basic">
        <ul>
          <li>Lo basico</li>
          <li>Sobre Cinechamp</li>
          <li>Contacto</li>
          <li>Foros de ayuda</li>
        </ul>
      </div>

      <div className="footer-participa">
        <ul>
          <li>Guia de resenas</li>
          <li>Agregar una pelicula</li>
          <li>Agregar nueva seria</li>
        </ul>
      </div>

      <div className="footer-comunidad">
        <ul>
          <li>Comunidad</li>
          <li>Directrices</li>
          <li>Debates</li>
          <li>Tabla de clasificaciones</li>
        </ul>
      </div>

      <div className="footer-legal">
        <ul>
          <li>Terminos de uso</li>
          <li>Politica de privacidad</li>
          <li>Politica DMCA</li>
        </ul>
      </div>
    </div>
  );
}
