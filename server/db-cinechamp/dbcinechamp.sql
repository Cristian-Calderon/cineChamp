-- 
-- Relación entre todas las tablas
-- Usuarios pueden crear hilos y publicar posts en los foros.
-- Usuarios pueden calificar películas/series y dejar comentarios sobre ellas.
-- Usuarios pueden agregarse como amigos con un estado de amistad.
-- Los foros contienen hilos de discusión, y estos tienen posts.
-- Los hilos pertenecen a un foro y son creados por un usuario.
-- Los posts pueden ser respuestas a otros posts o directamente a un hilo.
-- La biblioteca de contenido (películas/series) contiene información sobre cada título.
-- Las películas y series son tipos de contenido en la biblioteca.


-- Tabla de usuarios
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nick VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NULL
);

-- Tabla de amigos (relación entre usuarios)
CREATE TABLE amigos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    amigo_id INT NOT NULL,
    estado ENUM('pendiente', 'aceptado', 'rechazado', 'bloqueado') NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_amigos_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_amigos_amigo FOREIGN KEY (amigo_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabla de foro
CREATE TABLE foro (
    id_foro INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de hilos
CREATE TABLE hilos (
    id_hilo INT AUTO_INCREMENT PRIMARY KEY,
    id_foro INT NOT NULL,
    id_usuario INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    follow BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_hilo_foro FOREIGN KEY (id_foro) REFERENCES foro(id_foro) ON DELETE CASCADE,
    CONSTRAINT fk_hilo_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabla de post (respuestas en los hilos)
CREATE TABLE post (
    id_post INT AUTO_INCREMENT PRIMARY KEY,
    id_hilo INT NOT NULL,
    id_usuario INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    parent_post_id INT DEFAULT NULL,
    CONSTRAINT fk_post_hilo FOREIGN KEY (id_hilo) REFERENCES hilos(id_hilo) ON DELETE CASCADE,
    CONSTRAINT fk_post_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_parent_post FOREIGN KEY (parent_post_id) REFERENCES post(id_post) ON DELETE CASCADE
);

-- Tabla de contenido (películas y series en una sola tabla)
CREATE TABLE contenido (
    id_biblioteca INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    fecha_estreno DATE NOT NULL,
    sinopsis TEXT,
    puntuacion DECIMAL(3,1) DEFAULT 0, -- Promedio de calificaciones
    tipo ENUM('pelicula', 'serie') NOT NULL
);

-- Tabla de películas (subcategoría de contenido)
CREATE TABLE peliculas (
    id_pelicula INT AUTO_INCREMENT PRIMARY KEY,
    id_biblioteca INT NOT NULL,
    director VARCHAR(100) NOT NULL,
    duracion INT NOT NULL, -- Minutos
    CONSTRAINT fk_pelicula_biblioteca FOREIGN KEY (id_biblioteca) REFERENCES contenido(id_biblioteca) ON DELETE CASCADE
);

-- Tabla de series (subcategoría de contenido)
CREATE TABLE series (
    id_serie INT AUTO_INCREMENT PRIMARY KEY,
    id_biblioteca INT NOT NULL,
    episodio VARCHAR(100) NOT NULL,
    temporada INT NOT NULL,
    CONSTRAINT fk_serie_biblioteca FOREIGN KEY (id_biblioteca) REFERENCES contenido(id_biblioteca) ON DELETE CASCADE
);

-- Nueva tabla de calificacion May 12:
-- Tabla de calificación de contenido por los usuarios
CREATE TABLE calificacion (
    id_calificacion INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    puntuacion INT DEFAULT NULL CHECK (puntuacion BETWEEN 1 AND 10),
    comentario TEXT,
    fecha TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    id_api INT NOT NULL,
    tipo ENUM('pelicula', 'serie') NOT NULL,
    
    PRIMARY KEY (id_calificacion),

    -- Un usuario solo puede calificar una vez el mismo contenido de la API
    UNIQUE KEY unique_usuario_api (id_usuario, id_api),

    -- Claves foráneas sugeridas (puedes modificar los nombres de tabla y columna si son diferentes)
    CONSTRAINT fk_calificacion_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_calificacion_api FOREIGN KEY (id_api) REFERENCES contenido(id_biblioteca) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de calificación de contenido por los usuarios
CREATE TABLE calificacion (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_biblioteca INT NOT NULL,
    puntuacion INT CHECK (puntuacion BETWEEN 1 AND 10),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_calificacion_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_calificacion_biblioteca FOREIGN KEY (id_biblioteca) REFERENCES contenido(id_biblioteca) ON DELETE CASCADE,
    CONSTRAINT unique_calificacion UNIQUE (id_usuario, id_biblioteca)
);

-- Tabla contenido
CREATE TABLE contenido_guardado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_api INT NOT NULL,
    tipo ENUM('pelicula', 'serie') NOT NULL,
    fecha_guardado TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contenido_guardado_ibfk_1 FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    KEY id_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




--tabla favoritos
CREATE TABLE `favoritos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_tmdb` INT DEFAULT NULL,
  `titulo` TEXT,
  `id_usuario` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `id_usuario` (`id_usuario`, `id_tmdb`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Logros 
CREATE TABLE `logros` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(100) DEFAULT NULL,
  `title` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




-- usuario_logros

CREATE TABLE `usuario_logros` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT DEFAULT NULL,
  `logro_id` INT DEFAULT NULL,
  `fecha` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `logro_id` (`logro_id`),
  CONSTRAINT `usuario_logros_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `usuario_logros_ibfk_2` FOREIGN KEY (`logro_id`) REFERENCES `logros` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO logros (id, codigo, title, description, image_url) VALUES
(1, 'logro_usuario', 'Fundadores', 'Primeros 10 registrados', 'http://localhost:3001/assets/fundadores.png'),
(3, 'logro_usuario1', 'Soñadores', 'Primeros 100 registrados', 'http://localhost:3001/assets/soñador.png'),
(4, 'logro_usuario2', 'Creadores', 'Primeros 250 registrados', 'http://localhost:3001/assets/credores.png'),
(5, 'logro_usuario3', 'Suertudos', 'Primeros 600 registrados', 'http://localhost:3001/assets/suertudo.png'),
(6, 'logro_usuario4', 'Unicos', 'Primeros 1000 registrados', 'http://localhost:3001/assets/unicos.png'),
(8, 'logro_usuario5', 'Nuevo Freak', '10 películas vistas', 'http://localhost:3001/assets/Freak.png'),
(9, 'logro_usuario6', 'Entendido', '25 películas vistas', 'http://localhost:3001/assets/entendido.png'),
(10, 'logro_usuario7', 'El_bicho', '55 películas vistas', 'http://localhost:3001/assets/Elbicho.png'),
(11, 'logro_usuario8', 'Soldado_Oscuro', '70 películas vistas', 'http://localhost:3001/assets/SoldadoOscuro.png'),
(12, 'logro_usuario9', 'Me_gusta_cine', '80 películas vistas', 'http://localhost:3001/assets/megustaElCine.png'),
(16, 'logro_usuario10', 'No puedo parar', '300 películas vistas', 'http://localhost:3001/assets/NopuedoParar.png'),
(17, 'logro_usuario11', 'No veo la Luz', '400 películas vistas', 'http://localhost:3001/assets/noVeolaLuz.png'),
(18, 'logro_usuario12', 'Necesito ver más', '500 películas vistas', 'http://localhost:3001/assets/necesitoverMas.png'),
(19, 'logro_usuario13', 'Indomable', '600 películas vistas', 'http://localhost:3001/assets/indomable.png'),
(20, 'logro_usuario14', 'Freak', '700 películas vistas', 'http://localhost:3001/assets/Freak.png'),
(21, 'logro_favorito', 'Primer Favorito', 'Has agregado tu primer favorito', 'http://localhost:3001/assets/primero.png');


--modificacion tabla calificacion :
ALTER TABLE calificacion 
CHANGE id_biblioteca id_contenidoGuardado INT NOT NULL;

--Qued apendiente borrar contrains
ALTER TABLE calificacion DROP INDEX unique_calificacion;
ALTER TABLE calificacion ADD UNIQUE unique_usuario_api (id_usuario, id_api);
