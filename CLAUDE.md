# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Descripción del Proyecto

CineChamp es una aplicación web para seguimiento y calificación de películas y series. Permite a los usuarios registrar contenido visto, calificar, comentar, marcar favoritos, seguir temporadas de series, y conectar con otros usuarios mediante un sistema de amistades. Incluye un sistema de logros y niveles (estilo Steam) basado en la actividad del usuario.

## Estructura del Proyecto

Este es un monorepo con dos aplicaciones principales:

- **`/cinechamp`** - Frontend (React + TypeScript + Vite)
- **`/server`** - Backend (Node.js + Express)
- **`/cinechamp.sql`** - Schema de la base de datos MySQL

## Comandos de Desarrollo

### Frontend (desde `/cinechamp`)

```bash
npm install              # Instalar dependencias
npm run dev             # Iniciar servidor de desarrollo (Vite)
npm run build           # Compilar para producción (tsc -b && vite build)
npm run lint            # Ejecutar ESLint
npm run preview         # Preview de build de producción
```

El frontend corre por defecto en `http://localhost:5173` con proxy configurado hacia el backend en `localhost:3001`.

### Backend (desde `/server`)

```bash
npm install             # Instalar dependencias
npm start               # Iniciar servidor (node index.js)
npm run dev             # Iniciar con nodemon (desarrollo)
```

El backend corre en `http://localhost:3001` (configurable via `PORT` en `.env`).

### Iniciar todo el proyecto

Según `requisitos.md`:
```bash
# Verificar instalaciones
node -v
npm -v

# Instalar dependencias (ejecutar en /cinechamp y /server)
npm install

# Iniciar frontend (desde /cinechamp)
npm run dev

# Iniciar backend (desde /server)
npx nodemon
```

## Configuración de Base de Datos

El backend requiere un archivo `.env` en `/server` con las siguientes variables:

```
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=dbcinechamp
PORT=3001
JWT_SECRET=tu_secreto_jwt
```

Para inicializar la base de datos:
1. Importar el schema: `mysql -u root -p dbcinechamp < cinechamp.sql`
2. Ver instrucciones en `crearusuariodb.txt` para crear el usuario de base de datos

## Arquitectura Backend

### Estructura MVC

El backend sigue patrón MVC con las siguientes capas:

- **`/controllers`** - Lógica de negocio
  - `usuarioController.js` - Registro, login (JWT + bcrypt), perfil, búsqueda de usuarios
  - `contenidoController.js` - CRUD de contenido, calificaciones, favoritos, historial
  - `logrosController.js` - Sistema de logros y verificación automática
  - `nivelController.js` - Cálculo de nivel y XP del usuario
  - `socialController.js` - Sistema de amistades (solicitudes, aceptar/rechazar)

- **`/models`** - Acceso a datos (MySQL con mysql2/promise)
  - `db.js` - Pool de conexiones configurado con variables de entorno
  - `usuarioModel.js` - Queries de usuarios
  - `contenidoModel.js` - Queries de contenido guardado, calificaciones
  - `socialModel.js` - Queries de sistema social/amigos
  - `apiUsuarioModel.js` - Interacción con APIs externas

- **`/routes`** - Definición de endpoints REST
  - `usuarioRoutes.js` - `/api/usuarios/*`
  - `contenidoRoutes.js` - `/api/contenido/*` y `/contenido/*`
  - `logrosRoutes.js` - `/api/logros/*`
  - `socialRoutes.js` - `/api/amigos/*`

- **`/utils`**
  - `multerConfig.js` - Configuración de Multer para subida de avatares a `/assets/uploads`
  - `apiPuente.js` - Integración con API externa (TMDB)

- **`/logros`** - Sistema de logros modulares
  - `index.js` - Orquestador de logros
  - `favoritos.js` y otros - Cada logro es un módulo independiente

### Endpoints Importantes

- `POST /api/usuarios/register` - Registro con avatar (JSON body: nick, email, contraseña, avatar)
- `POST /api/usuarios/login` - Login que devuelve JWT (JSON body: email, contraseña)
- `GET /api/usuarios/nick/:nick` - Obtener usuario por nickname
- `GET /api/usuarios/buscar` - Buscar usuarios
- `POST /api/contenido/agregar` - Agregar contenido al historial
- `POST /api/contenido/favorito` - Marcar como favorito
- `POST /api/contenido/calificar` - Calificar contenido (1-10)
- `GET /api/contenido/usuarios/:id_usuario/calificaciones` - Obtener calificaciones de usuario
- `POST /api/contenido/temporada/vista` - Marcar temporada como vista
- `GET /api/logros/forzar/:id` - Forzar verificación de logros para usuario

### Base de Datos (MySQL)

Tablas principales:
- `usuario` - Información de usuarios, nivel, XP, avatar
- `calificacion` - Puntuaciones (1-10) y comentarios con unique constraint `(id_usuario, id_api)`
- `contenido_guardado` - Historial de contenido visto
- `favoritos` - Contenido marcado como favorito
- `amigos` - Relaciones de amistad con estados: pendiente/aceptado/rechazado/bloqueado
- `logros_usuario` - Logros desbloqueados por usuario
- `temporadas_vistas` - Tracking de temporadas vistas en series

Los contenidos se identifican por `id_api` (ID de API externa, probablemente TMDB) y `tipo` enum('pelicula','serie').

## Arquitectura Frontend

### Stack Tecnológico
- React 18 con TypeScript
- React Router DOM v7 para routing
- Tailwind CSS v4 para estilos
- Axios para peticiones HTTP
- React Toastify para notificaciones
- Lucide React para iconos
- React Circular Progressbar para indicadores de nivel

### Estructura de Páginas

- **`/pages/auth`** - Páginas públicas
  - `Login.tsx` - Login con JWT
  - `Register.tsx` - Registro con avatar

- **`/pages/private`** - Rutas protegidas (requieren token en localStorage)
  - `Perfil.tsx` - Perfil propio del usuario (`/id/:nick`)
  - `PerfilPublico.tsx` - Perfil de otros usuarios (`/usuario/:nick`)
  - `EditarPerfil.tsx` - Edición de perfil
  - `Buscador.tsx` - Búsqueda de contenido
  - `UsuarioResultado.tsx` - Resultados de búsqueda de usuarios
  - `PaginaPelicula.tsx` - Detalles de película/serie (`/contenido/:tipo/:id`)
  - `ListaContenido.tsx` - Listas de historial/favoritos (`/usuario/:nick/lista/:section/:media_type`)
  - `Calificaciones.tsx` - Todas las calificaciones del usuario

### Componentes Principales

- **`Header.tsx`** - Navegación principal con búsqueda
- **`Footer.tsx`** - Footer de la aplicación
- **`Avatar.tsx`** - Avatar de usuario
- **`ModalPuntuacion.tsx`** - Modal para calificar contenido
- **`Calificaciones/`** - `Notamedia.tsx`, `ReñesaPorUsuarios.tsx`, `UltimasCalificaciones.tsx`
- **`Social/`** - `AmigosComponente.tsx`, `SolicitudesAmistad.tsx`
- **`Logros/LogrosComponentes.tsx`** - Visualización de logros
- **`PerfilHeader/`** - `PerfilHeader.tsx`, `NivelSteam.tsx` - Cabecera de perfil con sistema de nivel
- **`PaginaPeliculaComponentes/`** - `RepartoContenido.tsx`, `TemporadasContenido.tsx`, `BotonAgregarHistorial.tsx`
- **`CarucelContenido/Carrusel.tsx`** - Carrusel de contenido

### Sistema de Autenticación

La autenticación se implementa en `App.tsx`:
- JWT almacenado en `localStorage.token`
- Nick del usuario en `localStorage.nick`
- Componente `HomeRedirect` (línea 19-23) redirige a `/id/:nick` si autenticado, sino a `/login`
- Rutas privadas verifican token y redirigen a `/login` si no existe
- `handleLogout` (línea 28-32) limpia localStorage

### Proxy de API

Configurado en `vite.config.ts` (líneas 11-17):
- Todas las peticiones a `/api/*` se redirigen a `http://localhost:3001`
- El path `/api` se elimina antes de enviar al backend
- Esto permite evitar CORS durante desarrollo

## Flujos Importantes

### Sistema de Calificaciones
1. Usuario califica contenido (1-10) con comentario opcional
2. Se valida constraint único por usuario/contenido en tabla `calificacion`
3. Automáticamente se invoca `verificarLogros()` para desbloquear logros
4. Se actualiza XP y nivel del usuario

### Sistema de Logros
- Verificación automática después de acciones clave (calificar, agregar favorito, etc.)
- Endpoint `/api/logros/forzar/:id` para verificación manual de todos los logros de un usuario
- Cada módulo en `/server/logros/` es autocontenido y exporta función de verificación

### Series y Temporadas
- Endpoint `/api/contenido/series/:id_api/tmdb/estructura-simple` obtiene estructura de serie
- `POST /api/contenido/temporada/vista` marca temporada como vista
- `DELETE /api/contenido/temporada/vista` desmarca temporada
- `GET /api/contenido/temporadas-vistas/:id_usuario/:id_serie` obtiene estado

### Sistema Social
- Solicitud de amistad → tabla `amigos` con estado 'pendiente'
- Aceptar/rechazar → actualiza estado a 'aceptado'/'rechazado'
- Posibilidad de bloquear → estado 'bloqueado'

## Consideraciones Técnicas

- El proyecto usa TypeScript en frontend y JavaScript (CommonJS) en backend
- Avatares se suben con Multer a `/server/assets/uploads` (servidos en `/uploads`)
- Bcrypt con 10 rounds para hashear contraseñas
- El backend sirve archivos estáticos desde `/public` y `/assets`
- Frontend usa rutas dinámicas basadas en nick de usuario
- ToastContainer global configurado en `App.tsx` (línea 52) con posición top-right y autoClose 3s
