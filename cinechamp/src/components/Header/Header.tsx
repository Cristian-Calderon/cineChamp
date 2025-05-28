import { useNavigate } from "react-router-dom";
import logo from "../../assets/imagen-header-logo/logo.svg";

export default function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const nick = localStorage.getItem("nick");
    if (nick) {
      navigate(`/id/${nick}`);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="w-full flex items-center justify-between p-4 shadow-md bg-white">
      <img
        src={logo}
        alt="CineChamp Logo"
        className="h-20 w-auto object-contain cursor-pointer"
        onClick={handleLogoClick}
      />
    </header>
  );
}
