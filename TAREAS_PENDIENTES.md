# 📋 Tareas Pendientes - CineChamp

**Fecha de creación:** 2025-12-03
**Estado:** Pendiente de implementación

---

## 🎯 Tareas para implementar

### ~~1. Validación de puntuación 1-10 en calificaciones~~ ✅ COMPLETADA
**Descripción:**
- ✅ Input validado con limitación en tiempo real
- ✅ Solo permite números del 1 al 10
- ✅ maxLength={2} implementado
- ✅ Validación en backend mejorada (verifica NaN, rango 1-10)

**Archivos modificados:**
- ✅ `/cinechamp/src/components/Modal/ModalPuntuacion.tsx` - Validación en tiempo real
- ✅ `/server/controllers/contenidoController.js` - Validación robusta en backend

**Fecha completada:** 2025-12-03

**Prioridad:** ~~Alta~~ COMPLETADA

---

### 2. Sistema de subida de imágenes de perfil para usuarios
**Descripción:**
- Implementar funcionalidad para que cada usuario pueda subir su propia imagen de perfil
- Actualmente existe un sistema de avatares predefinidos, pero se necesita permitir subida de archivos
- **NOTA:** El backend NO tiene Multer configurado aún, hay que crearlo desde cero
- Se debe explicar paso a paso todo el proceso de implementación

**Estado actual del sistema de avatares:**
- Los avatares se guardan en la columna `avatar` de la tabla `usuario` (solo el nombre del archivo, ej: "Freak.png")
- Avatares predefinidos están en `/server/assets/` (Elbicho.png, Freak.png, etc.)
- El servidor sirve estos archivos estáticos desde `/assets`

**Pregunta de diseño - ¿Cómo guardar las imágenes de cada usuario?**
Opciones a considerar:
1. **Archivo con nombre único por usuario:** `{userId}_avatar.jpg` en `/server/assets/uploads/`
   - Ventaja: Simple, fácil de implementar
   - Ventaja: Fácil encontrar y eliminar imagen anterior
2. **Carpeta por usuario:** `/server/assets/uploads/{userId}/avatar.jpg`
   - Ventaja: Organizado, permite múltiples archivos por usuario en el futuro
   - Desventaja: Más complejo, más carpetas
3. **Nombre con timestamp/UUID:** `/server/assets/uploads/abc123_1234567890.jpg`
   - Ventaja: Evita colisiones de nombres
   - Desventaja: Difícil eliminar imagen anterior (hay que buscar en DB)

**Detalles técnicos:**
- Backend:
  - **CREAR:** `/server/utils/multerConfig.js` - Configurar Multer desde cero
  - `/server/controllers/usuarioController.js` - Añadir endpoint para actualizar avatar con archivo
  - `/server/routes/usuarioRoutes.js` - Ruta POST para subir imagen con middleware Multer
  - Carpeta de almacenamiento: `/server/assets/uploads/` (crear si no existe)
- Frontend:
  - `/cinechamp/src/pages/private/EditarPerfil.tsx` - Agregar input tipo file
  - `/cinechamp/src/components/Avatar.tsx` - Mostrar imagen personalizada
  - Implementar preview de imagen antes de subir
- Consideraciones:
  - Validar tipo de archivo (solo imágenes: jpg, png, gif, webp)
  - Validar tamaño máximo (ej: 2MB)
  - Optimizar/redimensionar imagen en el servidor (opcional: usar sharp)
  - Eliminar imagen anterior al subir una nueva
  - Manejo de errores claro
- **Importante:** Se debe explicar cada paso del proceso durante la implementación

**Prioridad:** Media

---

### 3. Revisión de arquitectura y buenas prácticas
**Descripción:**
- Realizar una auditoría completa del proyecto
- Verificar si se está cumpliendo correctamente el patrón MVC
- Identificar violaciones de buenas prácticas
- Proponer mejoras y refactorizaciones necesarias

**Áreas a revisar:**
- **Backend:**
  - ¿Los controladores solo tienen lógica de negocio?
  - ¿Los modelos solo acceden a la base de datos?
  - ¿Las rutas solo definen endpoints?
  - Separación de responsabilidades
  - Manejo de errores consistente
  - Validaciones duplicadas
  - Código repetido (DRY principle)
- **Frontend:**
  - ¿Los componentes son reutilizables?
  - ¿Hay lógica de negocio en componentes que debería estar en servicios?
  - Manejo de estados
  - Llamadas a API duplicadas
  - Código repetido
- **General:**
  - Consistencia en nombres de variables y funciones
  - Comentarios útiles vs código auto-explicativo
  - Seguridad (SQL injection, XSS, validaciones)
  - Performance y optimizaciones

**Detalles técnicos:**
- Revisar todos los archivos en `/server/controllers/`, `/server/models/`, `/server/routes/`
- Revisar todos los componentes en `/cinechamp/src/pages/`, `/cinechamp/src/components/`
- Documentar hallazgos en un reporte
- Priorizar mejoras críticas vs mejoras opcionales

**Prioridad:** Media-Alta

---

### 4. Corregir menú móvil que aparece en desktop
**Descripción:**
- Existe un botón/menú móvil que se creó solo para vistas responsive (mobile/tablet)
- Actualmente aparece también en desktop, cuando no debería
- Necesita aplicar breakpoints correctos para ocultar en pantallas grandes

**Detalles técnicos:**
- Buscar componente del menú móvil (probablemente en `/cinechamp/src/components/`)
- Aplicar clases de Tailwind para responsive:
  - `lg:hidden` - Ocultar en pantallas grandes
  - `md:hidden` - Ocultar en pantallas medianas
- Verificar que el menú desktop esté visible solo en pantallas grandes
- Probar en diferentes tamaños de pantalla

**Prioridad:** Media

---

### 5. Sistema de nivel y experiencia visible en el perfil
**Descripción:**
- Ya existe un sistema de niveles y XP en el backend (`/server/controllers/nivelController.js`)
- Ya existe tabla `usuario` con campos `nivel` y `experiencia`
- **Falta:** Mostrar visualmente en el perfil del usuario:
  - Nivel actual del usuario
  - Barra de progreso de experiencia
  - XP actual / XP necesario para siguiente nivel
  - Indicador visual atractivo (similar a Steam)
- **NOTA:** Ya existe componente `NivelSteam.tsx` en `/cinechamp/src/components/PerfilHeader/` (verificar si existe)

**Librería de círculo de progreso:**
- Ya está instalada: `react-circular-progressbar` v2.2.0 (ver `cinechamp/package.json:18`)
- Documentación: https://www.npmjs.com/package/react-circular-progressbar
- Esta librería permite crear un círculo que se va completando conforme el usuario gana experiencia
- Ejemplo de uso:
  ```tsx
  import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
  import 'react-circular-progressbar/dist/styles.css';

  <CircularProgressbar
    value={percentage}
    text={`${percentage}%`}
    styles={buildStyles({
      textColor: '#fff',
      pathColor: '#00ff00',
      trailColor: '#333'
    })}
  />
  ```
- Se debe usar para mostrar el progreso de XP del usuario de forma visual y atractiva

**Detalles técnicos:**
- Frontend: `/cinechamp/src/pages/private/Perfil.tsx`
- Frontend: `/cinechamp/src/pages/private/PerfilPublico.tsx`
- Componente: `/cinechamp/src/components/PerfilHeader/NivelSteam.tsx` (verificar si existe, si no, crear)
- Backend: Verificar endpoint `/api/logros/forzar/:id` y endpoints de nivel
- Verificar si el componente `NivelSteam` ya está siendo usado
- Si no existe, crearlo usando `react-circular-progressbar`
- Si existe, integrarlo en el perfil
- Agregar animaciones al ganar XP
- Mostrar cómo se gana XP (tooltip o sección explicativa)

**Prioridad:** Alta

---

## 💡 Ideas futuras - Funcionalidades sociales

### Brainstorming para convertir CineChamp en red social cinematográfica:

**Ya implementado:**
- ✅ Sistema de amistades (solicitudes, aceptar/rechazar)
- ✅ Perfiles públicos y privados
- ✅ Calificaciones y comentarios
- ✅ Sistema de logros
- ✅ Historial y favoritos

**Ideas por considerar:**

1. **Feed/Timeline social**
   - Ver actividad reciente de amigos (qué vieron, qué calificaron)
   - Sistema de "me gusta" en calificaciones de otros usuarios
   - Comentar en las reseñas de amigos

2. **Listas personalizadas**
   - Crear listas temáticas ("Películas de terror favoritas", "Para ver en verano")
   - Compartir listas con amigos
   - Listas colaborativas

3. **Recomendaciones**
   - Sistema de recomendaciones basado en gustos
   - "Amigos que también vieron esto"
   - Notificaciones cuando un amigo ve algo que te podría gustar

4. **Actividad en tiempo real**
   - "Actualmente viendo..." (check-in)
   - Ver qué están viendo tus amigos ahora

5. **Estadísticas y comparaciones**
   - Comparar tu perfil con amigos (géneros favoritos, tiempo visto)
   - Rankings de usuarios más activos
   - Badges/medallas especiales

6. **Funciones de comunidad**
   - Grupos temáticos
   - Discusiones/foros por película/serie
   - Eventos (ej: "Noche de terror este viernes")

7. **Gamificación adicional**
   - Desafíos entre amigos
   - Logros competitivos
   - Tablas de clasificación

8. **Otras ideas**
   - Watchlist compartida para ver con amigos
   - Integración con plataformas de streaming (Netflix, Prime, etc.)
   - Sistema de notificaciones push
   - Búsqueda de amigos por intereses similares

---

## 📝 Notas adicionales

- Priorizar las tareas según impacto en usuario y complejidad técnica
- Mantener la consistencia visual en todas las nuevas funcionalidades
- Documentar bien cada cambio importante
- Hacer testing exhaustivo antes de cada implementación
- Las funcionalidades sociales deben pensarse bien antes de implementar para evitar refactorizaciones grandes

---

## ✅ Tareas completadas hoy (2025-12-03)

1. ✅ Corregido problema de series guardándose como películas en historial
2. ✅ Corregido error al agregar a favoritos (parámetro id_tmdb vs id_api)
3. ✅ Implementado sistema de eliminación de contenido del historial y favoritos
4. ✅ Creado modal elegante de confirmación para eliminar contenido
5. ✅ Agregado botón de eliminar con icono de basurero en hover
