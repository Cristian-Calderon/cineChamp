-- ====================================
-- CINECHAMP - BASE DE DATOS COMPLETA
-- Versión corregida y funcional
-- ====================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS dbcinechamp;
USE dbcinechamp;

-- ====================================
-- TABLA: usuario
-- ====================================
DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nick` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `experiencia` int DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nick` (`nick`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- TABLA: amigos
-- ====================================
DROP TABLE IF EXISTS `amigos`;
CREATE TABLE `amigos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `amigo_id` int NOT NULL,
  `estado` enum('pendiente','aceptado','rechazado','bloqueado') NOT NULL,
  `fecha_solicitud` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_amigos_usuario` (`usuario_id`),
  KEY `fk_amigos_amigo` (`amigo_id`),
  CONSTRAINT `fk_amigos_amigo` FOREIGN KEY (`amigo_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_amigos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- TABLA: contenido_guardado (historial)
-- ====================================
DROP TABLE IF EXISTS `contenido_guardado`;
CREATE TABLE `contenido_guardado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_api` int NOT NULL,
  `tipo` enum('pelicula','serie') NOT NULL,
  `fecha_guardado` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_usuario_api_tipo` (`id_usuario`,`id_api`,`tipo`),
  CONSTRAINT `contenido_guardado_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- TABLA: favoritos
-- ====================================
DROP TABLE IF EXISTS `favoritos`;
CREATE TABLE `favoritos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_tmdb` int NOT NULL,
  `tipo` enum('pelicula','serie') NOT NULL,
  `titulo` text,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `unique_usuario_tmdb_tipo` (`id_usuario`,`id_tmdb`,`tipo`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- TABLA: calificacion
-- ====================================
DROP TABLE IF EXISTS `calificacion`;
CREATE TABLE `calificacion` (
  `id_calificacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_api` int NOT NULL,
  `tipo` enum('pelicula','serie') NOT NULL,
  `puntuacion` int DEFAULT NULL,
  `comentario` text,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_calificacion`),
  UNIQUE KEY `unique_usuario_api_tipo` (`id_usuario`,`id_api`,`tipo`),
  CONSTRAINT `fk_calificacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calificacion_chk_1` CHECK ((`puntuacion` between 1 and 10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- TABLA: temporadas_vistas
-- ====================================
DROP TABLE IF EXISTS `temporadas_vistas`;
CREATE TABLE `temporadas_vistas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_serie` int NOT NULL,
  `id_temporada` int NOT NULL,
  `fecha_marcado` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_temporada_vista` (`id_usuario`,`id_serie`,`id_temporada`),
  CONSTRAINT `fk_temporadas_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- TABLA: logros
-- ====================================
DROP TABLE IF EXISTS `logros`;
CREATE TABLE `logros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- TABLA: usuario_logros
-- ====================================
DROP TABLE IF EXISTS `usuario_logros`;
CREATE TABLE `usuario_logros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `logro_id` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`logro_id`),
  KEY `logro_id` (`logro_id`),
  CONSTRAINT `usuario_logros_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuario_logros_ibfk_2` FOREIGN KEY (`logro_id`) REFERENCES `logros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- TABLAS DE FORO (OPCIONAL - NO SE USAN ACTUALMENTE)
-- ====================================
DROP TABLE IF EXISTS `foro`;
CREATE TABLE `foro` (
  `id_foro` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_foro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `hilos`;
CREATE TABLE `hilos` (
  `id_hilo` int NOT NULL AUTO_INCREMENT,
  `id_foro` int NOT NULL,
  `id_usuario` int NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido` text NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `follow` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_hilo`),
  KEY `fk_hilo_foro` (`id_foro`),
  KEY `fk_hilo_usuario` (`id_usuario`),
  CONSTRAINT `fk_hilo_foro` FOREIGN KEY (`id_foro`) REFERENCES `foro` (`id_foro`) ON DELETE CASCADE,
  CONSTRAINT `fk_hilo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id_post` int NOT NULL AUTO_INCREMENT,
  `id_hilo` int NOT NULL,
  `id_usuario` int NOT NULL,
  `contenido` text NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `parent_post_id` int DEFAULT NULL,
  PRIMARY KEY (`id_post`),
  KEY `fk_post_hilo` (`id_hilo`),
  KEY `fk_post_usuario` (`id_usuario`),
  KEY `fk_parent_post` (`parent_post_id`),
  CONSTRAINT `fk_parent_post` FOREIGN KEY (`parent_post_id`) REFERENCES `post` (`id_post`) ON DELETE CASCADE,
  CONSTRAINT `fk_post_hilo` FOREIGN KEY (`id_hilo`) REFERENCES `hilos` (`id_hilo`) ON DELETE CASCADE,
  CONSTRAINT `fk_post_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- DATOS INICIALES: logros
-- ====================================
INSERT INTO `logros` (`id`, `codigo`, `title`, `description`, `image_url`) VALUES
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

-- ====================================
-- VERIFICACIÓN
-- ====================================
SELECT 'Base de datos creada exitosamente!' as Mensaje;
SHOW TABLES;
