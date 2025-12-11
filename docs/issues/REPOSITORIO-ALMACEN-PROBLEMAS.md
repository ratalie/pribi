# 🐛 ISSUE: Problemas del Módulo Repositorio - Almacén

**Fecha**: 10 de Diciembre 2025  
**Módulo**: Repositorio - Almacén  
**Estado**: 🔴 En Progreso

---

## 📋 RESUMEN

Este documento lista todos los problemas identificados en el módulo de Almacén y sus soluciones.

---

## 🔴 PROBLEMAS CRÍTICOS

### 1. **Navegación/Breadcrumbs No Funcional**

**Problema**: 
- El breadcrumb "Almacén" no es clickeable, no se puede volver a la raíz desde una carpeta
- Cuando se navega a una carpeta, no hay forma de volver a la raíz del Almacén

**Solución**:
- ✅ Hacer "Almacén" clickeable en el breadcrumb
- ✅ Agregar función `navegarARaiz()` que llame a `cargarDocumentos(null)`

**Estado**: ✅ Resuelto

**Cambios realizados**:
- "Almacén" ahora es clickeable en el breadcrumb
- Agregada función `navegarARaiz()` que llama a `cargarDocumentos(null)`

---

### 2. **Doble Fetch Innecesario**

**Problema**:
- Se hacen dos fetchs al cargar la vista:
  1. `GET /api/v2/repository/society-profile/:structureId/nodes/core`
  2. `GET /api/v2/repository/society-profile/:structureId/nodes/root`

**Causa**:
- `useObtenerNodoRaiz` intenta primero `/nodes/root`, luego `/nodes/core`
- `listDocumentos` también llama a `/nodes/core`

**Solución**:
- Optimizar para usar solo `/nodes/root` cuando sea necesario
- Cachear el resultado del nodo raíz
- Evitar llamadas duplicadas

**Estado**: ⏳ Pendiente

---

### 3. **Carpetas de Documentos Generados Aparecen en Almacén**

**Problema**:
- Las carpetas que son de "documentos generados" aparecen en el Almacén
- Estas carpetas deberían estar solo en `/registros/sociedades/` o en "Documentos Generados"
- Carpetas que NO deben aparecer en Almacén:
  - `/core/sociedades/` y todas sus subcarpetas
  - `/core/juntas/` y todas sus subcarpetas (excepto las carpetas de juntas por fecha)
  - `/core/directorio/`

**Carpetas que SÍ deben aparecer en Almacén**:
- Carpetas creadas manualmente por el usuario
- Archivos subidos directamente al Almacén

**Solución**:
- Filtrar nodos que tengan `path` que empiece con `/core/sociedades/` o `/core/juntas/` o `/core/directorio/`
- O mejor: usar un flag/metadata del backend para identificar carpetas de "documentos generados"
- Si no hay flag, filtrar por nombre/path

**Estado**: ⏳ Pendiente

---

### 4. **Archivo Subido No Se Ve Inmediatamente**

**Problema**:
- Cuando se sube un archivo, no aparece en la lista hasta recargar manualmente
- El modal de subida se cierra pero no recarga la vista

**Solución**:
- ✅ Llamar a `cargarDocumentos(carpetaActual)` después de subir exitosamente
- Ya implementado en `@uploaded` del `UploadModal`, pero verificar que funcione

**Estado**: ⏳ Pendiente (verificar)

---

### 5. **Estructura de Carpetas de Juntas Incorrecta**

**Problema**:
- Las carpetas de juntas se crean con nombre de ID (ej: "4", "8", "1", "3")
- Deberían crearse con nombre de fecha (ej: "12/12/2023")
- No debe existir:
  ```
  /core/juntas/4/
    ├── junta 12122023121212
    ├── junta 12122023121401
  ```
- Debe existir:
  ```
  /core/juntas/
    ├── junta 12/12/2023
  ```

**Solución**:
- Cambiar el nombre de la carpeta de junta para usar fecha en lugar de ID
- Formato: "junta DD/MM/YYYY" (solo fecha, sin hora)
- Si ya existe una carpeta con esa fecha, reutilizarla en lugar de crear una nueva

**Estado**: ⏳ Pendiente

---

### 6. **Vista de Descargar Documentos de Juntas**

**Problema**:
- La vista `/operaciones/sociedades/:societyId/junta-accionistas/:flowId/descargar` tiene problemas:
  - Tiene sección "enviar automáticamente" que no debería estar
  - No tiene checkbox "seleccionar todos"
  - Los botones de descargar no funcionan

**Solución**:
- Quitar sección "enviar automáticamente"
- Agregar checkbox "Seleccionar todos"
- Arreglar funcionalidad de botones de descargar

**Estado**: ⏳ Pendiente

---

## 📝 NOTAS TÉCNICAS

### Diferenciación de Carpetas

**Carpetas de Documentos Generados** (NO mostrar en Almacén):
- Path empieza con `/core/sociedades/`
- Path empieza con `/core/juntas/` (excepto carpetas de fecha)
- Path empieza con `/core/directorio/`
- Nombre: "accionistas", "acuerdos societarios", "régimen facultades", "derechos y gravámenes", etc.

**Carpetas de Almacén** (SÍ mostrar):
- Carpetas creadas manualmente por el usuario
- Archivos subidos directamente
- NO tienen path que empiece con `/core/sociedades/` o `/core/juntas/` o `/core/directorio/`

### Endpoints del Backend

- `GET /api/v2/repository/society-profile/:structureId/nodes/core` - Todos los nodos core
- `GET /api/v2/repository/society-profile/:structureId/nodes/root` - Solo nodos raíz (core, common)
- `GET /api/v2/repository/society-profile/nodes/:nodeId` - Nodo específico con hijos
- `POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents` - Subir archivo
- `POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/folder` - Crear carpeta

---

## ✅ CHECKLIST DE CORRECCIONES

- [x] Arreglar breadcrumbs (hacer clickeable Almacén)
- [ ] Optimizar doble fetch
- [ ] Filtrar carpetas de documentos generados
- [ ] Verificar recarga después de subir archivo
- [ ] Cambiar estructura de carpetas de juntas (fecha en lugar de ID)
- [ ] Arreglar vista de descargar documentos
- [ ] Documentar en issue (este documento)

---

## 🔗 REFERENCIAS

- Backend V2.5: `docs/backend/repositorio guia 2.5 backend/GUIA-COMPLETA-ENDPOINTS-V2.md`
- Plan de Implementación: `docs/juntas/PLAN-IMPLEMENTACION-ALMACEN.md`

