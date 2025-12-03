# 📋 Tareas Pendientes - CineChamp

**Fecha de creación:** 2025-12-03
**Estado:** Pendiente de implementación

---

## 🎯 Tareas para implementar

### 1. Validación de puntuación 1-10 en calificaciones
**Descripción:**
- Actualmente el input de puntuación no está limitado correctamente
- Se puede ingresar cualquier número (mayor a 10, números con más de 2 dígitos, etc.)
- Debe limitarse a:
  - Solo permitir números del 1 al 10
  - Máximo 2 dígitos
  - Validación en tiempo real (mientras el usuario escribe)
  - Validación en el backend también

**Detalles técnicos:**
- Frontend: `/cinechamp/src/components/Modal/ModalPuntuacion.tsx`
- Frontend: `/cinechamp/src/pages/private/PaginaPelicula.tsx` (función `guardarEnHistorial`)
- Frontend: `/cinechamp/src/pages/private/Buscador.tsx` (función `guardarContenido`)
- Backend: `/server/controllers/contenidoController.js` (función `calificarContenido` línea 195)
- Agregar validación en el input: `maxLength={2}`, `min={1}`, `max={10}`
- Validar antes de enviar al backend
- Mensaje de error claro si intenta poner un número inválido

**Prioridad:** Alta

---

### 2. Sistema de subida de imágenes de perfil para usuarios
**Descripción:**
- Implementar funcionalidad para que cada usuario pueda subir su propia imagen de perfil
- Actualmente existe un sistema de avatares predefinidos, pero se necesita permitir subida de archivos
- El backend ya tiene Multer configurado para subida de archivos (ver `/server/utils/multerConfig.js`)
- Se debe explicar paso a paso todo el proceso de implementación

**Detalles técnicos:**
- Backend:
  - `/server/utils/multerConfig.js` - Ya existe configuración de Multer
  - `/server/controllers/usuarioController.js` - Añadir endpoint para actualizar avatar
  - `/server/routes/usuarioRoutes.js` - Ruta para subir imagen
  - Carpeta de almacenamiento: `/server/assets/uploads`
- Frontend:
  - `/cinechamp/src/pages/private/EditarPerfil.tsx` - Agregar input tipo file
  - `/cinechamp/src/components/Avatar.tsx` - Mostrar imagen personalizada
  - Implementar preview de imagen antes de subir
- Consideraciones:
  - Validar tipo de archivo (solo imágenes: jpg, png, gif, webp)
  - Validar tamaño máximo (ej: 2MB)
  - Optimizar/redimensionar imagen en el servidor
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
- Ya existe componente `NivelSteam.tsx` en `/cinechamp/src/components/PerfilHeader/`

**Detalles técnicos:**
- Frontend: `/cinechamp/src/pages/private/Perfil.tsx`
- Frontend: `/cinechamp/src/pages/private/PerfilPublico.tsx`
- Componente existente: `/cinechamp/src/components/PerfilHeader/NivelSteam.tsx`
- Backend: Verificar endpoint `/api/logros/forzar/:id` y endpoints de nivel
- Verificar si el componente `NivelSteam` ya está siendo usado
- Si no, integrarlo en el perfil
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
