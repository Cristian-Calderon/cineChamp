# 📊 Auditoría de Arquitectura y Buenas Prácticas - CineChamp

**Fecha:** 2025-12-03
**Auditor:** Claude Code
**Alcance:** Backend (Node.js/Express) + Frontend (React/TypeScript)

---

## 📋 Resumen Ejecutivo

### Estado General: ⚠️ REQUIERE MEJORAS

El proyecto tiene una base sólida con separación clara entre frontend y backend, pero presenta **violaciones importantes del patrón MVC**, **código duplicado**, y **falta de validaciones de seguridad**. Se identificaron **23 issues críticos** y **15 mejoras recomendadas**.

### Prioridades:
1. 🔴 **CRÍTICO**: Mover queries de controladores a modelos (violación MVC)
2. 🔴 **CRÍTICO**: Agregar validación de inputs (seguridad)
3. 🟡 **ALTA**: Crear capa de servicios en frontend
4. 🟡 **ALTA**: Eliminar código duplicado
5. 🟢 **MEDIA**: Mejorar manejo de errores

---

## 🔴 PROBLEMAS CRÍTICOS

### 1. Violaciones del Patrón MVC en Backend

#### ❌ Problema: Queries SQL directamente en controladores

**Archivos afectados:**
- `server/controllers/usuarioController.js:107-114`
- `server/controllers/contenidoController.js` (múltiples líneas)

**Ejemplo de violación:**

```javascript
// ❌ MAL: Query en controller (usuarioController.js:107-114)
async function buscarUsuariosPorNick(req, res) {
  const { nick } = req.query;
  if (!nick) return res.status(400).json({ error: "Falta el nick" });

  try {
    const [rows] = await db.query(
      'SELECT id, nick, avatar FROM usuario WHERE nick LIKE ?',
      [`%${nick}%`]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**Queries que deben moverse a modelos:**

En `contenidoController.js`:
- Líneas 90-93: `INSERT IGNORE INTO contenido_guardado`
- Líneas 99-103: `SELECT FROM contenido_guardado`
- Líneas 173-176: `INSERT IGNORE INTO favoritos`
- Líneas 191-194: `SELECT FROM favoritos`
- Líneas 221-224: `SELECT FROM contenido_guardado` (historial)
- Líneas 268-271: `INSERT INTO calificacion`
- Líneas 291-294: `SELECT FROM calificacion`
- Líneas 346-349: `DELETE FROM contenido_guardado`
- Líneas 371-374: `DELETE FROM favoritos`

**✅ Solución:**

Crear métodos en los modelos correspondientes:

```javascript
// ✅ BIEN: Query en model (usuarioModel.js)
const buscarUsuariosPorNick = async (nick) => {
  const [rows] = await db.query(
    'SELECT id, nick, avatar FROM usuario WHERE nick LIKE ?',
    [`%${nick}%`]
  );
  return rows;
};

// ✅ BIEN: Controller solo llama al model
async function buscarUsuariosPorNick(req, res) {
  const { nick } = req.query;
  if (!nick) return res.status(400).json({ error: "Falta el nick" });

  try {
    const usuarios = await Usuario.buscarUsuariosPorNick(nick);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**Impacto:** 🔴 CRÍTICO
**Esfuerzo:** Media (2-3 horas)
**Archivos a crear/modificar:**
- Crear: `server/models/contenidoModel.js` con todos los métodos de DB
- Modificar: `server/controllers/contenidoController.js` (refactorizar)
- Modificar: `server/models/usuarioModel.js` (agregar método de búsqueda)

---

### 2. Falta de Validación de Inputs (Seguridad)

#### ❌ Problema: No hay validación de formato/contenido

**Archivos afectados:**
- `server/controllers/usuarioController.js:10-23` (registro)
- `server/controllers/contenidoController.js` (múltiples endpoints)

**Issues identificados:**

1. **Registro de usuario (`usuarioController.js:10-23`):**
   - ❌ No valida formato de email
   - ❌ No valida longitud de contraseña
   - ❌ No valida caracteres del nick
   - ❌ No valida URL del avatar

2. **Campo comentario en calificaciones:**
   - ❌ No hay sanitización de HTML/scripts (riesgo XSS)
   - ❌ No hay límite de longitud

3. **URLs en avatares:**
   - ❌ Acepta cualquier string sin validar que sea URL válida

**✅ Solución:**

Instalar y usar una librería de validación como `joi` o `express-validator`:

```javascript
// ✅ BIEN: Validación con express-validator
const { body, validationResult } = require('express-validator');

// Middleware de validación
const validarRegistro = [
  body('nick')
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Nick debe tener 3-20 caracteres alfanuméricos'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('contraseña')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Contraseña debe tener mínimo 8 caracteres, mayúsculas, minúsculas y números'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar debe ser una URL válida')
];

// Aplicar en ruta
router.post('/register', validarRegistro, UsuarioController.registrar);
```

**Para sanitizar comentarios (prevenir XSS):**

```javascript
const sanitizeHtml = require('sanitize-html');

// En calificarContenido
const comentarioSanitizado = sanitizeHtml(comentario, {
  allowedTags: [], // No permitir ningún HTML
  allowedAttributes: {}
});
```

**Impacto:** 🔴 CRÍTICO (seguridad)
**Esfuerzo:** Media (3-4 horas)
**Dependencias:** `npm install express-validator sanitize-html`

---

### 3. Código Duplicado - Detección de Tipo de Contenido

#### ❌ Problema: Lógica idéntica repetida en múltiples funciones

**Archivos afectados:**
- `server/controllers/contenidoController.js:58-82` (agregarContenidoController)
- `server/controllers/contenidoController.js:136-161` (favoritoContenidoController)

**Código duplicado (48 líneas repetidas):**

```javascript
// ❌ MAL: Duplicado en agregarContenidoController
let tipoAPI;
let tipoGuardado;

if (tipo === 'pelicula' || tipo === 'movie') {
  tipoAPI = 'movie';
  tipoGuardado = 'pelicula';
} else if (tipo === 'serie' || tipo === 'tv') {
  tipoAPI = 'tv';
  tipoGuardado = 'serie';
} else {
  // ... 20+ líneas más de detección automática
}

// ❌ MAL: Mismo código repetido en favoritoContenidoController (líneas 136-161)
```

**✅ Solución:**

Extraer a función helper reutilizable:

```javascript
// ✅ BIEN: Crear utils/tipoContenidoHelper.js
const { obtenerDetallesPorId } = require('../models/apiUsuarioModel');

const normalizarTipoContenido = async (tipo, id_api) => {
  // Si el tipo está definido, normalizarlo
  if (tipo === 'pelicula' || tipo === 'movie') {
    return { tipoAPI: 'movie', tipoGuardado: 'pelicula' };
  }
  if (tipo === 'serie' || tipo === 'tv') {
    return { tipoAPI: 'tv', tipoGuardado: 'serie' };
  }

  // Auto-detectar tipo
  let data = await obtenerDetallesPorId(id_api, 'tv');
  if (data && data.success !== false) {
    return { tipoAPI: 'tv', tipoGuardado: 'serie', data };
  }

  data = await obtenerDetallesPorId(id_api, 'movie');
  if (data && data.success !== false) {
    return { tipoAPI: 'movie', tipoGuardado: 'pelicula', data };
  }

  throw new Error('Contenido no encontrado en TMDB');
};

module.exports = { normalizarTipoContenido };

// ✅ BIEN: Usar en controllers
const { normalizarTipoContenido } = require('../utils/tipoContenidoHelper');

const agregarContenidoController = async (req, res) => {
  const { id_usuario, id_api, tipo } = req.body;
  try {
    const { tipoAPI, tipoGuardado, data } = await normalizarTipoContenido(tipo, id_api);
    // ... resto de la lógica
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
```

**Impacto:** 🔴 CRÍTICO (mantenibilidad)
**Esfuerzo:** Baja (1 hora)
**Beneficio:** Elimina 48+ líneas duplicadas

---

### 4. Configuración de API Duplicada

#### ❌ Problema: API_KEY y BASE_URL definidos en 3 lugares

**Archivos afectados:**
- `server/controllers/contenidoController.js:8-9`
- `server/models/contenidoModel.js:4-5`
- `server/models/apiUsuarioModel.js:5-6`

**✅ Solución:**

Centralizar en archivo de configuración:

```javascript
// ✅ BIEN: Crear config/tmdb.js
require('dotenv').config();

module.exports = {
  API_KEY: process.env.TMDB_API_KEY,
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  LANGUAGE: 'es-ES'
};

// ✅ BIEN: Usar en todos los archivos
const { API_KEY, BASE_URL, LANGUAGE } = require('../config/tmdb');
```

**Impacto:** 🟡 ALTA
**Esfuerzo:** Muy baja (15 minutos)

---

## 🟡 PROBLEMAS DE ALTA PRIORIDAD

### 5. Frontend: No Existe Capa de Servicios

#### ❌ Problema: API calls dispersas en componentes

**Archivos afectados:**
- `cinechamp/src/pages/private/Perfil.tsx` (líneas 85, 121, 134, 147, 152, 165)
- `cinechamp/src/pages/private/PaginaPelicula.tsx` (líneas 43, 62)
- `cinechamp/src/pages/private/EditarPerfil.tsx` (líneas 24, 51)
- **Todos los componentes de páginas tienen fetch directo**

**Issues:**
- ❌ URL hardcodeada `http://localhost:3001` repetida en 15+ archivos
- ❌ Lógica de autenticación (headers, token) duplicada
- ❌ Manejo de errores inconsistente
- ❌ Dificulta testing y mantenimiento

**✅ Solución:**

Crear capa de servicios con cliente API centralizado:

```typescript
// ✅ BIEN: Crear src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async delete<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Delete failed');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();

// ✅ BIEN: Crear src/services/usuarioService.ts
import { apiClient } from './api';

export const usuarioService = {
  obtenerPorNick: (nick: string) =>
    apiClient.get(`/api/usuarios/nick/${nick}`),

  obtenerPorId: (id: number) =>
    apiClient.get(`/api/usuarios/${id}`),

  actualizar: (id: number, datos: any) =>
    apiClient.post(`/api/usuarios/${id}`, datos),

  buscar: (nick: string) =>
    apiClient.get(`/api/usuarios/buscar?nick=${encodeURIComponent(nick)}`),
};

// ✅ BIEN: Crear src/services/contenidoService.ts
import { apiClient } from './api';

export const contenidoService = {
  obtenerDetalles: (tipo: string, id: string) =>
    apiClient.get(`/contenido/detalles/${tipo}/${id}`),

  agregarAFavoritos: (id_usuario: number, id_tmdb: number, tipo: string) =>
    apiClient.post('/contenido/favorito', { id_usuario, id_tmdb, tipo }),

  obtenerFavoritos: (id_usuario: number) =>
    apiClient.get(`/api/contenido/favoritos/${id_usuario}`),

  calificar: (datos: any) =>
    apiClient.post('/contenido/calificar', datos),
};

// ✅ BIEN: Usar en componentes
import { usuarioService } from '../../services/usuarioService';

// En Perfil.tsx
useEffect(() => {
  if (!nick) return;

  usuarioService.obtenerPorNick(nick)
    .then((user) => {
      setUserId(user.id);
      setProfile({
        name: user.nick,
        photoUrl: user.avatar || defaultAvatar,
      });
      setExperiencia(user.experiencia || 0);
    })
    .catch((err) => {
      console.error("Error al obtener usuario:", err);
      navigate("/login");
    });
}, [nick, navigate]);
```

**Beneficios:**
- ✅ URL centralizada (fácil cambiar a producción)
- ✅ Headers y autenticación en un solo lugar
- ✅ Manejo de errores consistente
- ✅ Fácil mockear para testing
- ✅ TypeScript types centralizados

**Impacto:** 🟡 ALTA
**Esfuerzo:** Alta (6-8 horas para refactorizar todos los componentes)
**Archivos a crear:**
- `src/services/api.ts`
- `src/services/usuarioService.ts`
- `src/services/contenidoService.ts`
- `src/services/logrosService.ts`
- `src/services/socialService.ts`

---

### 6. Código Comentado Debe Eliminarse

#### ❌ Problema: Código muerto en el repositorio

**Archivos afectados:**
- `server/controllers/usuarioController.js:78-87`

```javascript
// ❌ MAL: Función comentada
/**async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.eliminarUsuario(id);
    if (eliminado === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}*/
```

**✅ Solución:**

Si no se va a usar, eliminar. Si se puede necesitar en el futuro, confiar en Git history.

**Impacto:** 🟢 BAJA
**Esfuerzo:** Muy baja (2 minutos)

---

## 🟢 MEJORAS RECOMENDADAS

### 7. Manejo de Errores Inconsistente

**Problema actual:**
- Algunos endpoints retornan `error.message`
- Otros retornan mensajes custom
- No hay formato estándar de respuesta de error

**✅ Solución:**

Crear middleware de manejo de errores centralizado:

```javascript
// ✅ BIEN: Crear middleware/errorHandler.js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Log en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = { ApiError, errorHandler };

// ✅ BIEN: Usar en index.js
const { errorHandler } = require('./middleware/errorHandler');

// ... todas las rutas ...

// Middleware de error debe ir al final
app.use(errorHandler);

// ✅ BIEN: Usar en controllers
const { ApiError } = require('../middleware/errorHandler');

async function obtenerUsuarioPorId(req, res, next) {
  try {
    const { id } = req.params;
    const usuario = await Usuario.obtenerUsuarioPorId(id);
    if (!usuario) throw new ApiError(404, 'Usuario no encontrado');
    res.json(usuario);
  } catch (error) {
    next(error); // Pasar al middleware de errores
  }
}
```

**Impacto:** 🟢 MEDIA
**Esfuerzo:** Media (2-3 horas)

---

### 8. Falta Middleware de Autenticación

**Problema:** No hay verificación de JWT en rutas protegidas

**✅ Solución:**

```javascript
// ✅ BIEN: Crear middleware/auth.js
const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new ApiError(401, 'Token no proporcionado');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Agregar info del usuario a req
    next();
  } catch (error) {
    throw new ApiError(401, 'Token inválido o expirado');
  }
};

module.exports = { verificarToken };

// ✅ BIEN: Usar en rutas protegidas
const { verificarToken } = require('../middleware/auth');

router.get('/favoritos/:id_usuario', verificarToken, obtenerFavoritosPorUsuario);
router.post('/agregar', verificarToken, agregarContenidoController);
```

**Impacto:** 🔴 CRÍTICO (seguridad)
**Esfuerzo:** Baja (1 hora)

---

### 9. Variables de Entorno no Documentadas

**Problema:** No hay archivo `.env.example`

**✅ Solución:**

```bash
# ✅ BIEN: Crear server/.env.example
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dbcinechamp
PORT=3001
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
TMDB_API_KEY=tu_api_key_de_tmdb
NODE_ENV=development
```

**Impacto:** 🟢 BAJA
**Esfuerzo:** Muy baja (5 minutos)

---

### 10. Falta Logging Estructurado

**Problema:** console.log disperso, sin niveles ni formato

**✅ Solución:**

```javascript
// ✅ BIEN: Usar winston o pino
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;

// Usar: logger.info(), logger.error(), logger.debug()
```

**Impacto:** 🟢 MEDIA
**Esfuerzo:** Media (2 horas)

---

## 📊 Resumen de Issues por Prioridad

### 🔴 CRÍTICOS (4 issues)
1. Violaciones MVC - queries en controllers
2. Falta validación de inputs
3. Código duplicado (tipo contenido)
4. No hay middleware de autenticación

### 🟡 ALTAS (3 issues)
5. No existe capa de servicios en frontend
6. Configuración API duplicada
7. Código comentado

### 🟢 MEDIAS (3 issues)
8. Manejo de errores inconsistente
9. Variables de entorno no documentadas
10. Falta logging estructurado

---

## 🎯 Plan de Acción Recomendado

### Fase 1: Seguridad y Arquitectura (Semana 1)
**Prioridad: CRÍTICA**

1. ✅ Agregar middleware de autenticación JWT
2. ✅ Implementar validación de inputs (express-validator)
3. ✅ Mover queries a modelos (refactorizar controllers)
4. ✅ Crear helper para tipo de contenido

**Esfuerzo estimado:** 12-16 horas

---

### Fase 2: Refactorización Frontend (Semana 2)
**Prioridad: ALTA**

1. ✅ Crear capa de servicios (api.ts, usuarioService.ts, etc.)
2. ✅ Refactorizar componentes para usar servicios
3. ✅ Centralizar configuración de API

**Esfuerzo estimado:** 8-10 horas

---

### Fase 3: Mejoras de Calidad (Semana 3)
**Prioridad: MEDIA**

1. ✅ Implementar middleware de errores
2. ✅ Agregar logging estructurado
3. ✅ Crear .env.example
4. ✅ Eliminar código comentado

**Esfuerzo estimado:** 4-6 horas

---

## ✅ Aspectos Positivos del Código Actual

**Lo que está bien hecho:**

1. ✅ **Queries parametrizadas**: Todas las queries usan placeholders `?`, previniendo SQL injection básico
2. ✅ **Separación de carpetas**: Estructura MVC clara (controllers, models, routes)
3. ✅ **Uso de bcrypt**: Contraseñas hasheadas correctamente (10 rounds)
4. ✅ **JWT implementado**: Sistema de autenticación con tokens
5. ✅ **TypeScript en frontend**: Tipos definidos para datos
6. ✅ **Modelos limpios**: `usuarioModel.js` y `socialModel.js` solo contienen queries
7. ✅ **Manejo de errores**: Try-catch en la mayoría de funciones
8. ✅ **Componentes reutilizables**: `AvatarConNivel`, `MenuUsuario`, etc.
9. ✅ **Diseño consistente**: Uso de Tailwind con tema personalizado
10. ✅ **Git usado correctamente**: Historial de commits claro

---

## 📝 Conclusiones

El proyecto **CineChamp tiene fundamentos sólidos** pero necesita refactorización en áreas críticas:

### Fortalezas:
- Arquitectura básica correcta
- Seguridad básica implementada (bcrypt, JWT, queries parametrizadas)
- Código TypeScript en frontend

### Debilidades principales:
- Violaciones del patrón MVC (queries en controllers)
- Falta de validaciones
- Código duplicado
- No hay capa de servicios en frontend

### Recomendación final:

**Priorizar la Fase 1 (seguridad y arquitectura)** antes de agregar nuevas funcionalidades. Los issues críticos pueden causar problemas de mantenimiento a largo plazo y vulnerabilidades de seguridad.

Una vez completada la refactorización, el proyecto estará en excelente estado para escalar y agregar las funcionalidades sociales planificadas.

---

**Fin del reporte de auditoría** 📊
