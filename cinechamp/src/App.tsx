import { useState, useEffect } from 'react';
import './App.css';
import imgperfil from './assets/images-perfil/perfil-example.jpg';

import Profile from './user-profile/profile';
import PFavorites from './p-favoritos/favoritos';

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<any>(null);  // Aquí almacenaremos los datos del backend

  useEffect(() => {
    // Hacemos la petición fetch al backend
    fetch('http://localhost:5000/data') // Cambia la URL según tu backend
      .then(response => response.json())
      .then(data => {
        setData(data); // Actualizamos el estado con los datos recibidos
      })
      .catch(error => console.error('Error al obtener los datos:', error));
  }, []);

  return (
    <>
      <div className="App">
        <Profile img={imgperfil} nick="Juan" ubicacion="Barcelona" grupo="Sin grupo" />
        <PFavorites />
        
        {/* Mostrar los datos recibidos desde el backend */}
        <div>
          <h2>Datos del backend:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
        
        {/* main */}

        {/* etiqueta footer */}
      </div>
    </>
  );
}

export default App;