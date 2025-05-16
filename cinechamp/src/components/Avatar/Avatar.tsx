
type AvatarProps = {
    src?: string;
    alt?: string;
    className?: string;
    size?: number; 
  };
  
  export default function Avatar({ src, alt = "Avatar", className = "", size = 56 }: AvatarProps) {
    const avatarFinal = src && src.trim() !== "" ? src : "/img/imagen_perfil.jpeg";
  
    return (
      <img
        src={avatarFinal}
        alt={alt}
        className={`rounded-full object-cover border ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  