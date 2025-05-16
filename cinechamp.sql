-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: dbcinechamp
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `amigos`
--

DROP TABLE IF EXISTS `amigos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amigos`
--

LOCK TABLES `amigos` WRITE;
/*!40000 ALTER TABLE `amigos` DISABLE KEYS */;
INSERT INTO `amigos` VALUES (2,12,3,'pendiente','2025-05-05 14:45:38'),(3,4,5,'pendiente','2025-05-14 20:05:04'),(4,4,6,'pendiente','2025-05-14 20:18:03');
/*!40000 ALTER TABLE `amigos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calificacion`
--

DROP TABLE IF EXISTS `calificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificacion` (
  `id_calificacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `puntuacion` int DEFAULT NULL,
  `comentario` text,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_api` int NOT NULL,
  `tipo` enum('pelicula','serie') NOT NULL,
  PRIMARY KEY (`id_calificacion`),
  UNIQUE KEY `unique_usuario_api` (`id_usuario`,`id_api`),
  CONSTRAINT `calificacion_chk_1` CHECK ((`puntuacion` between 1 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calificacion`
--

LOCK TABLES `calificacion` WRITE;
/*!40000 ALTER TABLE `calificacion` DISABLE KEYS */;
INSERT INTO `calificacion` VALUES (1,4,10,'impecable','2025-05-08 16:30:42',155,'pelicula'),(4,4,1,NULL,'2025-05-08 16:43:35',1924,'pelicula'),(5,4,1,'malisima, aburridisima','2025-05-08 16:44:27',8966,'pelicula'),(6,4,1,NULL,'2025-05-08 16:44:34',18239,'pelicula'),(7,4,1,NULL,'2025-05-08 16:44:42',55192,'pelicula'),(8,4,10,'Una de mis peliculas favoritas, la recomiendo','2025-05-08 16:56:23',6479,'pelicula'),(9,4,3,'me gusto!!','2025-05-08 17:34:03',1359227,'pelicula'),(10,4,10,'El mejor doctor de Santa coloma','2025-05-09 17:28:25',1408,'serie'),(11,4,1,NULL,'2025-05-09 17:29:06',456,'serie'),(12,4,1,NULL,'2025-05-09 17:29:13',67258,'serie'),(13,4,1,NULL,'2025-05-12 15:21:14',129827,'serie'),(14,4,10,NULL,'2025-05-12 15:21:48',65733,'serie'),(15,4,1,NULL,'2025-05-12 15:21:52',57911,'serie'),(16,4,1,NULL,'2025-05-12 15:22:57',98613,'pelicula'),(18,4,1,NULL,'2025-05-12 15:23:41',1418,'serie'),(19,4,1,NULL,'2025-05-13 15:43:15',19515,'serie'),(20,4,1,NULL,'2025-05-13 15:43:25',633624,'pelicula'),(21,4,1,NULL,'2025-05-13 15:43:59',73379,'serie'),(23,4,1,NULL,'2025-05-13 15:52:30',28700,'serie'),(24,4,8,'El nuevo superman','2025-05-13 15:53:37',4604,'serie'),(25,6,10,'buena','2025-05-14 17:25:13',1258945,'pelicula'),(26,6,10,'super buena','2025-05-14 17:26:35',120,'pelicula'),(27,6,2,'dasd','2025-05-14 17:27:05',1088087,'pelicula'),(29,6,1,'asdsad','2025-05-14 17:27:23',83193,'serie'),(30,6,5,'sdsadsadsadsadsadsadsadsad','2025-05-14 17:27:34',1346,'serie'),(31,6,5,'5','2025-05-14 17:28:04',2287,'serie'),(33,6,5,'5','2025-05-14 17:28:15',125249,'pelicula'),(35,6,5,'5','2025-05-14 17:28:26',268,'pelicula'),(37,6,5,'5','2025-05-14 17:28:35',2661,'pelicula'),(38,6,5,'5','2025-05-14 17:28:39',209112,'pelicula'),(39,6,5,'5','2025-05-14 17:28:43',414906,'pelicula'),(41,4,10,NULL,'2025-05-14 17:29:31',1061474,'pelicula');
/*!40000 ALTER TABLE `calificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contenido_guardado`
--

DROP TABLE IF EXISTS `contenido_guardado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contenido_guardado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_api` int NOT NULL,
  `tipo` enum('pelicula','serie') NOT NULL,
  `fecha_guardado` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_usuario_api_tipo` (`id_usuario`,`id_api`,`tipo`),
  CONSTRAINT `contenido_guardado_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contenido_guardado`
--

LOCK TABLES `contenido_guardado` WRITE;
/*!40000 ALTER TABLE `contenido_guardado` DISABLE KEYS */;
INSERT INTO `contenido_guardado` VALUES (1,4,2661,'pelicula','2025-04-17 11:22:03'),(2,7,232380,'serie','2025-04-17 11:31:18'),(3,7,1107666,'pelicula','2025-04-17 11:31:22'),(4,7,415,'pelicula','2025-04-17 11:31:50'),(5,7,41676,'pelicula','2025-04-17 11:31:54'),(6,7,31749,'serie','2025-04-17 11:31:57'),(7,7,15804,'pelicula','2025-04-17 11:31:59'),(8,7,602307,'pelicula','2025-04-17 11:35:14'),(9,7,10502,'pelicula','2025-04-17 11:35:18'),(10,4,10223,'pelicula','2025-04-25 17:15:52'),(11,4,888,'pelicula','2025-04-25 17:16:11'),(12,4,34391,'serie','2025-04-25 17:16:13'),(13,4,445033,'pelicula','2025-04-25 17:16:13'),(14,4,68658,'pelicula','2025-04-25 17:16:14'),(15,4,1399,'serie','2025-04-25 17:18:16'),(16,4,95396,'serie','2025-04-25 17:18:39'),(17,4,100088,'pelicula','2025-04-25 17:25:21'),(18,4,211707,'pelicula','2025-04-25 17:25:23'),(19,4,603,'pelicula','2025-05-05 14:22:30'),(20,4,11393,'pelicula','2025-05-05 14:56:59'),(23,4,21769,'pelicula','2025-05-05 15:05:28'),(31,4,294993,'pelicula','2025-05-06 15:51:20'),(32,4,1429,'pelicula','2025-05-06 15:54:52'),(33,4,34307,'serie','2025-05-06 15:55:51'),(34,4,1577,'pelicula','2025-05-06 16:51:36'),(35,4,460458,'pelicula','2025-05-06 16:51:39'),(36,4,7737,'pelicula','2025-05-06 16:51:42'),(37,4,133121,'pelicula','2025-05-06 16:51:43'),(38,4,400136,'pelicula','2025-05-06 16:51:45'),(39,4,173897,'pelicula','2025-05-06 16:51:46'),(40,4,35791,'pelicula','2025-05-06 16:51:49'),(41,4,71679,'pelicula','2025-05-06 16:51:50'),(42,4,721881,'pelicula','2025-05-06 16:51:52'),(43,4,747512,'pelicula','2025-05-06 16:51:53'),(44,4,1085422,'pelicula','2025-05-06 16:51:55'),(45,4,1366,'pelicula','2025-05-06 16:52:33'),(46,4,1107666,'pelicula','2025-05-06 16:52:36'),(47,4,557,'pelicula','2025-05-06 16:53:55'),(48,4,315635,'pelicula','2025-05-06 16:53:57'),(50,4,961651,'pelicula','2025-05-06 16:53:59'),(52,4,569094,'pelicula','2025-05-06 16:54:01'),(53,4,225914,'pelicula','2025-05-06 16:54:02'),(54,4,299536,'pelicula','2025-05-06 17:28:39'),(55,4,24428,'pelicula','2025-05-06 17:28:43'),(56,4,33623,'pelicula','2025-05-06 17:28:43'),(57,4,299534,'pelicula','2025-05-06 17:28:45'),(58,4,99861,'pelicula','2025-05-06 17:28:46'),(59,4,9320,'pelicula','2025-05-06 17:28:47'),(60,4,624091,'pelicula','2025-05-06 17:28:49'),(61,4,127475,'pelicula','2025-05-06 17:28:51'),(62,4,242299,'pelicula','2025-05-06 17:28:52'),(63,4,940543,'pelicula','2025-05-06 17:28:53'),(64,4,1771,'pelicula','2025-05-06 17:28:57'),(65,4,76338,'pelicula','2025-05-06 17:29:12'),(66,4,1337143,'pelicula','2025-05-06 17:29:13'),(67,4,10195,'pelicula','2025-05-06 17:29:14'),(68,4,183154,'pelicula','2025-05-06 17:29:16'),(69,4,31533,'pelicula','2025-05-06 17:29:17'),(70,4,63736,'pelicula','2025-05-06 17:29:18'),(71,4,1015595,'pelicula','2025-05-06 17:29:19'),(72,4,413279,'pelicula','2025-05-06 17:29:19'),(73,4,76535,'pelicula','2025-05-06 17:29:20'),(74,4,745151,'pelicula','2025-05-06 17:29:55'),(75,4,93127,'pelicula','2025-05-06 17:29:56'),(77,4,1217455,'pelicula','2025-05-06 17:39:44'),(136,4,1009722,'pelicula','2025-05-07 10:41:20'),(137,4,1104688,'pelicula','2025-05-07 10:41:21'),(138,4,326522,'pelicula','2025-05-07 10:41:23'),(139,4,775293,'pelicula','2025-05-08 14:46:51'),(146,4,373223,'pelicula','2025-05-08 14:58:25'),(150,4,125249,'pelicula','2025-05-08 15:52:16'),(151,4,268,'pelicula','2025-05-08 16:22:15'),(153,4,155,'pelicula','2025-05-08 16:30:42'),(154,4,1924,'pelicula','2025-05-08 16:37:14'),(157,4,8966,'pelicula','2025-05-08 16:44:27'),(158,4,18239,'pelicula','2025-05-08 16:44:34'),(159,4,55192,'pelicula','2025-05-08 16:44:42'),(160,4,6479,'pelicula','2025-05-08 16:56:23'),(161,4,1359227,'pelicula','2025-05-08 17:34:03'),(162,4,1408,'pelicula','2025-05-09 17:28:25'),(163,4,456,'serie','2025-05-09 17:29:06'),(164,4,67258,'pelicula','2025-05-09 17:29:13'),(165,4,129827,'pelicula','2025-05-12 15:21:14'),(166,4,65733,'pelicula','2025-05-12 15:21:48'),(167,4,57911,'pelicula','2025-05-12 15:21:52'),(168,4,98613,'pelicula','2025-05-12 15:22:57'),(170,4,1418,'pelicula','2025-05-12 15:23:41'),(171,4,19515,'serie','2025-05-13 15:43:15'),(172,4,633624,'pelicula','2025-05-13 15:43:25'),(173,4,73379,'serie','2025-05-13 15:43:59'),(175,4,28700,'serie','2025-05-13 15:52:30'),(176,4,4604,'serie','2025-05-13 15:53:37'),(177,6,1258945,'pelicula','2025-05-14 17:25:13'),(178,6,120,'pelicula','2025-05-14 17:26:35'),(179,6,1088087,'pelicula','2025-05-14 17:27:05'),(181,6,83193,'pelicula','2025-05-14 17:27:23'),(182,6,1346,'serie','2025-05-14 17:27:34'),(183,6,2287,'pelicula','2025-05-14 17:28:04'),(185,6,125249,'pelicula','2025-05-14 17:28:15'),(187,6,268,'pelicula','2025-05-14 17:28:26'),(189,6,2661,'pelicula','2025-05-14 17:28:35'),(190,6,209112,'pelicula','2025-05-14 17:28:39'),(191,6,414906,'pelicula','2025-05-14 17:28:43'),(193,4,1061474,'pelicula','2025-05-14 17:29:31');
/*!40000 ALTER TABLE `contenido_guardado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_tmdb` int DEFAULT NULL,
  `titulo` text,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `id_usuario` (`id_usuario`,`id_tmdb`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (1,2287,'Rize',4),(4,268,'Batman',4),(5,1366,'Rocky',7),(6,480530,'Creed II: La leyenda de Rocky',7),(7,877119,'Rocky',7),(8,1025,'Las aventuras de Rocky y Bullwinkle',7),(9,2098,'Cita en Las Vegas (Viva Las Vegas)',7),(10,1399,'Juego de tronos',4),(11,95396,'Separación',4),(12,100088,'Pólvora negra',4),(13,211707,'Grounded: Making The Last of Us',4),(14,603,'Matrix',4),(15,11393,'El mejor',4),(19,6479,'Soy leyenda',4),(21,33701,'Los bronceados hacen ski',4),(25,1134424,'El guerrero mágico: La leyenda de las ocho lunas',4),(29,34307,'Shameless',4);
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foro`
--

DROP TABLE IF EXISTS `foro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foro` (
  `id_foro` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_foro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foro`
--

LOCK TABLES `foro` WRITE;
/*!40000 ALTER TABLE `foro` DISABLE KEYS */;
/*!40000 ALTER TABLE `foro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hilos`
--

DROP TABLE IF EXISTS `hilos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hilos`
--

LOCK TABLES `hilos` WRITE;
/*!40000 ALTER TABLE `hilos` DISABLE KEYS */;
/*!40000 ALTER TABLE `hilos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logros`
--

DROP TABLE IF EXISTS `logros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logros`
--

LOCK TABLES `logros` WRITE;
/*!40000 ALTER TABLE `logros` DISABLE KEYS */;
INSERT INTO `logros` VALUES (1,'logro_usuario','Fundadores','Primeros 10 registrados','http://localhost:3001/assets/fundadores.png'),(3,'logro_usuario1','Soñadores','Primeros 100 registrados','http://localhost:3001/assets/soñador.png'),(4,'logro_usuario2','Creadores','Primeros 250 registrados','http://localhost:3001/assets/credores.png'),(5,'logro_usuario3','Suertudos','Primeros 600 registrados','http://localhost:3001/assets/suertudo.png'),(6,'logro_usuario4','Unicos','Primeros 1000 registrados','http://localhost:3001/assets/unicos.png'),(8,'logro_usuario5','Nuevo Freak','10 películas vistas','http://localhost:3001/assets/Freak.png'),(9,'logro_usuario6','Entendido','25 películas vistas','http://localhost:3001/assets/entendido.png'),(10,'logro_usuario7','El_bicho','55 películas vistas','http://localhost:3001/assets/Elbicho.png'),(11,'logro_usuario8','Soldado_Oscuro','70 películas vistas','http://localhost:3001/assets/SoldadoOscuro.png'),(12,'logro_usuario9','Me_gusta_cine','80 películas vistas','http://localhost:3001/assets/megustaElCine.png'),(16,'logro_usuario10','No puedo parar','300 películas vistas','http://localhost:3001/assets/NopuedoParar.png'),(17,'logro_usuario11','No veo la Luz','400 películas vistas','http://localhost:3001/assets/noVeolaLuz.png'),(18,'logro_usuario12','Necesito ver más','500 películas vistas','http://localhost:3001/assets/necesitoverMas.png'),(19,'logro_usuario13','Indomable','600 películas vistas','http://localhost:3001/assets/indomable.png'),(20,'logro_usuario14','Freak','700 películas vistas','http://localhost:3001/assets/Freak.png'),(21,'logro_favorito','Primer Favorito','Has agregado tu primer favorito','http://localhost:3001/assets/primero.png');
/*!40000 ALTER TABLE `logros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nick` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nick` (`nick`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Juan123','juan@example.com','password123','juan_avatar.jpg','2025-05-05 14:50:05'),(2,'Maria456','maria@example.com','password456','maria_avatar.jpg','2025-05-05 14:50:05'),(3,'ctapazco','ctapazco@example.com','ctapazco','https://i.pravatar.cc/150?img=3','2025-05-05 14:50:05'),(4,'ctapazco2290','ctapasco907@gmail.com','$2b$10$Byds08T0BrcIZPTomhirQOTw7pBykucDpycJtwxjs8kApuSBdGZj.','https://media.gq.com.mx/photos/6046677d32fb42c17c0c6fe7/4:3/w_2664,h_1998,c_limit/SUPERMAN.jpg','2025-05-05 14:50:05'),(5,'cris92','cris@cris.com','$2b$10$D2wpvEm6tngj9GNP1sMbS.tH2ZpCEkn/a3wMwmJID/qYdrFPdUzxy','','2025-05-05 14:50:05'),(6,'damaso','damaso@damaso.com','$2b$10$RFROr1EcPwoRuf3TF.V3y.w2g4FIBNsgoBXbVVtkEzFC3ZAbhVOO6','','2025-05-05 14:50:05'),(7,'damaso2','damaso2@damaso.com','$2b$10$PCu6.6MmkNHXKF/peRR7wuyljAPv.gDf9dmbqcQlUSwFdHj4G9n5C','https://i0.wp.com/imgs.hipertextual.com/wp-content/uploads/2025/02/INVI_S3_First_Look6_3000-scaled.jpg?resize=1200%2C675&quality=70&strip=all&ssl=1','2025-05-05 14:50:05'),(9,'ctapascoAdmin','ctapasco907@hotmail.com','$2b$10$KVQk6ciPmsp32K.oG51gUehBPNvUTtz5nbhTCX0N8Fehfm53A0f9y','','2025-05-05 14:50:05'),(12,'ctapascoAdmin1','ctapasco@hotmail.com','$2b$10$yGdcItLLpqIr0pK5PdMtceTafyYw9/p8a9BIUbACmCvZy/lmswpJe','','2025-05-05 14:50:05'),(13,'tapazco001','tapazco@hotmail.com','$2b$10$kcuuzEFOGE22bVXRreSaHOuq2v0BLXC3wkzy6BmIoFk4ywnrOcLsW','','2025-05-05 14:54:00'),(14,'tapasco2','ctapasco2@gmail.com','$2b$10$Yy2JfRzsdpaggee3ScxBTuaXK7x0NFSdFl/1enLREXhO0WLQUsr6m',NULL,'2025-05-16 13:48:51');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_logros`
--

DROP TABLE IF EXISTS `usuario_logros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_logros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `logro_id` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`logro_id`),
  KEY `logro_id` (`logro_id`),
  CONSTRAINT `usuario_logros_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `usuario_logros_ibfk_2` FOREIGN KEY (`logro_id`) REFERENCES `logros` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_logros`
--

LOCK TABLES `usuario_logros` WRITE;
/*!40000 ALTER TABLE `usuario_logros` DISABLE KEYS */;
INSERT INTO `usuario_logros` VALUES (2,4,1,'2025-05-05 14:22:30'),(4,12,21,'2025-05-05 14:42:33'),(5,13,1,'2025-05-05 14:54:00'),(10,4,21,'2025-05-05 15:09:17'),(12,4,9,'2025-05-06 17:36:18'),(15,4,12,'2025-05-07 09:20:15'),(16,4,16,'2025-05-07 09:38:23'),(30,4,10,'2025-05-07 10:41:28'),(31,4,11,'2025-05-12 15:21:17'),(32,6,1,'2025-05-14 17:24:14'),(33,14,21,'2025-05-16 13:48:51'),(34,14,3,'2025-05-16 13:49:08');
/*!40000 ALTER TABLE `usuario_logros` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-16 16:19:16
