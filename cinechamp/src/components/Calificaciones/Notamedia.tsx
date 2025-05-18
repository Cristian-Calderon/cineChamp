
type NotaMediaProps = {
    media: string;
    totalResenas: number;
  };
  
  export default function NotaMedia({ media, totalResenas }: NotaMediaProps) {
    return (
      <div className="w-full h-full bg-yellow-100 border border-yellow-300 rounded-xl p-6 text-center shadow-md flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-yellow-800 mb-2">⭐ Nota media</h3>
        <p className="text-5xl font-bold text-yellow-600">{media}</p>
        <p className="text-gray-600 text-sm mt-2">Según {totalResenas} reseña(s)</p>
      </div>
    );
  }
  