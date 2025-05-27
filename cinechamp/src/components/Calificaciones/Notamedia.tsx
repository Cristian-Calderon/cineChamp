type NotaMediaProps = {
  media: string;
  totalResenas: number;
};

export default function NotaMedia({ media, totalResenas }: NotaMediaProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-white text-black rounded-xl p-6 shadow-lg">
      <div className="w-20 h-20 rounded-full bg-cyan-500 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
        {parseInt(media)}<span className="text-sm">⭐ </span>
      </div>
      <p className="mt-3 text-lg font-semibold uppercase tracking-wide text-center">
        Puntuación de usuarios
      </p>
      <p className="text-xs text-gray-500">Basado en {totalResenas} reseña(s)</p>
    </div>
  );
}
