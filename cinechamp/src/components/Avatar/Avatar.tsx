type AvatarProps = {
  src?: string;
  alt?: string;
  className?: string; // para w-36 h-36 etc.
  size?: number;       // opcional: para estilos inline si no se usa Tailwind
};

export default function Avatar({
  src,
  alt = "Avatar",
  className = "rounded-full w-14 h-14", // clase por defecto
  size,
}: AvatarProps) {
  const avatarFinal = src && src.trim() !== "" ? src : "/img/imagen_perfil.jpeg";

  return (
    <img
      src={avatarFinal}
      alt={alt}
      className={`object-cover border ${className}`}
      style={size ? { width: size, height: size } : undefined}
    />
  );
}
