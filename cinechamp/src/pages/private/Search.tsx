import { useState } from 'react';

type Resultado = {
  id: number;
  title?: string;
  name?: string;
};

export default function Search() {
  const [peticionUsuario, setQuery] = useState('');
  //Guarda lo que el usuario escribe en el input de búsqueda.
  const [peliculas, setPeliculas] = useState<Resultado[]>([]);
  const [series, setSeries] = useState<Resultado[]>([]);
  //mostrar mensajes mientras cargan los datos
  const [loading, setLoading] = useState(false);
  //Guarda los favoritos y agregados del usuario por su id
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [agregados, setAgregados] = useState<number[]>([]);

  const buscar = async () => {
    //si la peticion del usuario es vacia no devuleve nada,
    if (!peticionUsuario.trim()) return;
    setLoading(true);
    try {
      //hace 2 peticiones fecth al mismo tiempo al back-end(server-apiUusuarioModel)
      const [resPeliculas, resSeries] = await Promise.all([
        fetch(`http://localhost:3000/contenido/buscar?q=${encodeURIComponent(peticionUsuario)}`),
        fetch(`http://localhost:3000/contenido/buscarS?q=${encodeURIComponent(peticionUsuario)}`),
      ]);
      
      //convierte la respuesta en un json
      const peliculasData = await resPeliculas.json();
      const seriesData = await resSeries.json();
      //ahora guarda eso en estados
      setPeliculas(peliculasData);
      setSeries(seriesData);
    } catch (error) {
      console.error('Error al buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarFavoritos = async (item : Resultado) => {
    try {
      await fetch('http://localhost:3000/contenido/favorito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
  
      setFavoritos((prev) =>
        prev.includes(item.id) ? prev.filter((f) => f !== item.id) : [...prev, item.id]
      );
    } catch (error) {
      console.error('Error al marcar favorito:', error);
    }
  };

  const agregarElemento = async (item: Resultado) => {
    if (agregados.includes(item.id)) return;
  
    try {
      await fetch('http://localhost:3000/contenido/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      setAgregados([...agregados, item.id]);
      alert('✅ Agregado correctamente');
    } catch (error) {
      console.error('Error al agregar:', error);
    }
  };
  

  const renderItem = (item: Resultado) => (
    <li key={item.id} style={{ marginBottom: '0.5rem' }}>
      {item.title || item.name}
      <button
        onClick={() => agregarElemento(item)}
        style={{ marginLeft: '1rem' }}
      >
        ➕ Agregar
      </button>
      <button
        onClick={() => agregarFavoritos(item)}
        style={{
          marginLeft: '0.5rem',
          color: favoritos.includes(item.id) ? 'gold' : 'gray',
        }}
      >
        ⭐ Favorito
      </button>
    </li>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Buscar Películas y Series</h1>

      <input
        type="text"
        placeholder="Escribe algo..."
        value={peticionUsuario}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <button onClick={buscar} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        Buscar
      </button>

      {loading && <p>🔍 Cargando...</p>}

      {!loading && (
        <>
          <h2>🎬 Películas</h2>
          <ul>{peliculas.map(renderItem)}</ul>

          <h2>📺 Series</h2>
          <ul>{series.map(renderItem)}</ul>
        </>
      )}
    </div>
  );
}
