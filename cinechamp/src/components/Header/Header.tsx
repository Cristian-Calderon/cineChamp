import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full flex items-center justify-between p-4 shadow-md bg-white">
      <div
        className="cursor-pointer flex items-center gap-2"
        onClick={() => navigate("/")}
      >
       <img
          src="../../assets/imagen-header-logo/LogoCineChamp.png" 
          alt="CineChamp Logo"
          className="h-30 w-auto max-w-[200px] object-contain"
        />

      </div>
    </header>
  );
}
