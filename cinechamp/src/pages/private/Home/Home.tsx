// Home.tsx
import React from 'react';
import Footer from '../../../components/Footer/Footer';
import Perfil from '../Perfil';

interface HomeProps {
  onLogout: () => void;
}

function Home({ onLogout }: HomeProps) {
  return (
    <div>
      <h1>Bienvenido al Home</h1>
      
      <button onClick={onLogout}>Cerrar Sesión</button>
      <Footer></Footer>
    </div>
  );
}

export default Home;
