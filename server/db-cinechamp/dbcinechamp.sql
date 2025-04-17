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


-- Tabla d contenido 
CREATE TABLE contenido_guardado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_api INT NOT NULL,
    tipo ENUM('pelicula', 'serie') NOT NULL,
    fecha_guardado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (id_usuario)
);
