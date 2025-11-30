# 📦 Instrucciones para Crear la Base de Datos de CineChamp

## Requisitos Previos

1. MySQL instalado (versión 8.0 o superior)
2. Acceso a MySQL como usuario root o con privilegios de creación de bases de datos

## Método 1: Desde la Terminal (Linux/Mac/Windows con Git Bash)

### Paso 1: Acceder a MySQL
```bash
mysql -u root -p
```
Te pedirá la contraseña de MySQL.

### Paso 2: Ejecutar el script completo
Dentro de MySQL, ejecuta:
```sql
source /Users/cristian/Documents/cineChamp/database-setup.sql
```

**Nota:** Ajusta la ruta según donde tengas el proyecto.

### Paso 3: Verificar que se creó correctamente
```sql
USE dbcinechamp;
SHOW TABLES;
```

Deberías ver 11 tablas:
- amigos
- calificacion
- contenido_guardado
- favoritos
- foro
- hilos
- logros
- post
- temporadas_vistas
- usuario
- usuario_logros

---

## Método 2: Importar directamente desde la terminal (Un solo comando)

```bash
mysql -u root -p < /Users/cristian/Documents/cineChamp/database-setup.sql
```

Después puedes verificar ingresando a MySQL:
```bash
mysql -u root -p
USE dbcinechamp;
SHOW TABLES;
```

---

## Método 3: Usando MySQL Workbench (GUI)

1. Abre MySQL Workbench
2. Conecta a tu servidor MySQL
3. Ve a: `File` → `Run SQL Script...`
4. Selecciona el archivo `database-setup.sql`
5. Click en `Run`
6. Espera a que termine la ejecución

---

## Método 4: Usando phpMyAdmin

1. Accede a phpMyAdmin
2. Click en la pestaña "SQL"
3. Abre el archivo `database-setup.sql` con un editor de texto
4. Copia todo el contenido
5. Pégalo en el cuadro de texto de phpMyAdmin
6. Click en "Ejecutar" o "Go"

---

## 🔧 Configurar el Archivo .env del Backend

Después de crear la base de datos, configura el archivo `.env` en la carpeta `/server`:

```bash
cd server
```

Crea o edita el archivo `.env`:

```env
# Configuración de la base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=dbcinechamp
PORT=3001

# JWT Secret (genera uno aleatorio)
JWT_SECRET=tu_secreto_muy_seguro_aqui

# API de TMDB (The Movie Database)
TMDB_API_KEY=tu_api_key_de_tmdb
```

### Obtener API Key de TMDB:
1. Ve a https://www.themoviedb.org/
2. Crea una cuenta gratuita
3. Ve a Settings → API
4. Solicita una API Key (gratis)
5. Copia la "API Key (v3 auth)" en tu .env

---

## ✅ Verificar que Todo Funciona

### 1. Instalar dependencias del backend:
```bash
cd server
npm install
```

### 2. Iniciar el backend:
```bash
npm run dev
```

### 3. Probar la conexión a la BD:
Abre tu navegador en:
```
http://localhost:3001/check-db
```

Deberías ver: `✅ Conectado a la base de datos`

### 4. Probar la API de TMDB:
```
http://localhost:3001/contenido/check-api
```

Deberías ver: `✅ Conectado a TMDB API: Fight Club`

---

## 🎯 Iniciar el Frontend

```bash
cd cinechamp
npm install
npm run dev
```

Abre tu navegador en: `http://localhost:5173`

---

## 🐛 Solución de Problemas Comunes

### Error: "Access denied for user"
- Verifica que tu contraseña en `.env` sea correcta
- Verifica que el usuario tenga permisos en la base de datos

### Error: "Unknown database 'dbcinechamp'"
- Asegúrate de haber ejecutado el script `database-setup.sql` completo
- Verifica con: `SHOW DATABASES;` en MySQL

### Error: "Table doesn't exist"
- El script no se ejecutó completamente
- Vuelve a ejecutar el script `database-setup.sql`

### Error en el backend: "experiencia column not found"
- Significa que usaste el `cinechamp.sql` viejo
- Usa `database-setup.sql` que tiene todas las correcciones

---

## 📊 Estructura de la Base de Datos Creada

| Tabla | Propósito |
|-------|-----------|
| `usuario` | Usuarios registrados con experiencia y nivel |
| `amigos` | Sistema de amistades entre usuarios |
| `contenido_guardado` | Historial de películas/series vistas |
| `favoritos` | Contenido marcado como favorito |
| `calificacion` | Puntuaciones y comentarios de usuarios |
| `temporadas_vistas` | Tracking de temporadas vistas de series |
| `logros` | Catálogo de logros disponibles |
| `usuario_logros` | Logros desbloqueados por cada usuario |
| `foro`, `hilos`, `post` | Sistema de foros (no implementado aún) |

---

## 🎨 Siguiente Paso: Agregar Iconos de Logros

Los iconos de logros deben estar en `/server/assets/` con estos nombres:
- fundadores.png
- soñador.png
- credores.png
- suertudo.png
- unicos.png
- Freak.png
- entendido.png
- Elbicho.png
- SoldadoOscuro.png
- megustaElCine.png
- NopuedoParar.png
- noVeolaLuz.png
- necesitoverMas.png
- indomable.png
- primero.png

---

¡Listo! Tu base de datos está configurada correctamente con todas las correcciones aplicadas. 🎉
