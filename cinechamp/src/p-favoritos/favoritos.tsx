import { useState } from "react";

type Movie = {
  id: number;
  title: string;
  poster: string;
};


const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = () => {
    const newMovie: Movie = {
      id: Date.now(),
      title: `Película ${movies.length + 1}`,
      poster: "https://via.placeholder.com/150" // Imagen de prueba
    };
    setMovies((prevMovies) => {
      const updatedMovies = [newMovie, ...prevMovies];
      return updatedMovies.slice(0, 10); // Solo mantiene las 10 más recientes
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <button 
        onClick={addMovie} 
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Agregar Película
      </button>
      <div className="flex gap-4 overflow-x-auto p-2">
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[150px] shadow-lg bg-white p-2 rounded">
            <img src={movie.poster} alt={movie.title} className="w-32 h-48 object-cover rounded" />
            <p className="text-sm mt-2 font-semibold text-center">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
