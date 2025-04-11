
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/Footer/Footer';

interface HomeProps {
  onLogout: () => void;
}

function Home({ onLogout }: HomeProps) {
  const navigate = useNavigate();

  const goToPerfil = () => {
    const nick = localStorage.getItem('nick');
    if (nick) {
      navigate(`/id/${nick}`);
    }
  };

  return (
    <div>
      <h1>Bienvenido al Home</h1>
      
      <button onClick={onLogout}>Cerrar Sesión</button>
      <button onClick={goToPerfil}>Ir a mi perfil</button>

      <Footer />
    </div>
  );
}

export default Home;