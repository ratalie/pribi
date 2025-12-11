# 🐛 ISSUE: No se encuentra la carpeta "Documentos Societarios" en Almacén

**Fecha**: 11 de Diciembre 2025  
**Estado**: 🔴 **BLOQUEANTE** - El almacén no funciona  
**Ruta afectada**: `/storage/almacen`

---

## 📋 Problema

Cuando el usuario entra a `/storage/almacen`, el frontend necesita encontrar la carpeta "Documentos Societarios" para:

1. **Cargar su contenido** (mostrar documentos y carpetas)
2. **Subir archivos** (necesita el `parentNodeId`)
3. **Crear carpetas** (necesita el `parentNodeId`)

**Actualmente**: No se encuentra la carpeta y todo falla.

---

## 🔍 Lo que estamos buscando

El frontend busca una carpeta con estas características:

- **Nombre**: Que contenga "documentos societarios" (case-insensitive)
- **Código**: `SOCIETARIO_ROOT`
- **ID**: `32` (mencionado por el usuario, pero retorna 404)

---

## 📊 Endpoints que estamos usando

### 1. GET `/api/v2/repository/society-profile/:structureId/nodes/root`
- **Resultado**: Retorna 2 nodos raíz
- **Log**: `🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2`
- **Estado**: ✅ Funciona, pero no encontramos la carpeta ahí

### 2. GET `/api/v2/repository/society-profile/:structureId/nodes/core`
- **Resultado**: Retorna 24 nodos core
- **Log**: `🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 24`
- **Estado**: ✅ Funciona, pero no encontramos la carpeta ahí

### 3. GET `/api/v2/repository/society-profile/nodes/32`
- **Resultado**: **404 Not Found**
- **Log**: `🔴 [GET] "http://localhost:3000/api/v2/repository/society-profile/nodes/32": 404 Not Found`
- **Estado**: ❌ El ID 32 no existe para esta sociedad

---

## ❓ Preguntas para el Backend

### 1. ¿Existe la carpeta "Documentos Societarios"?

- ¿Se crea automáticamente cuando se crea una sociedad?
- ¿O debe crearse manualmente?
- ¿Tiene un nombre específico o código que debamos buscar?

### 2. ¿Dónde está ubicada en la estructura?

- ¿Está en `/nodes/root`?
- ¿Está en `/nodes/core`?
- ¿O necesita un endpoint diferente?

### 3. ¿Cómo identificarla?

- ¿Qué `code` tiene? (¿es `SOCIETARIO_ROOT`?)
- ¿Qué `name` tiene exactamente?
- ¿Qué `path` tiene?
- ¿Qué `parentId` tiene?

### 4. ¿El ID 32 es correcto?

- El usuario mencionó que el ID es 32, pero retorna 404
- ¿Es un ID diferente por sociedad?
- ¿O el ID 32 es de otra sociedad?

---

## 🔧 Lo que necesitamos del Backend

### Opción A: Endpoint específico (RECOMENDADO)

Crear un endpoint que retorne directamente la carpeta "Documentos Societarios":

```
GET /api/v2/repository/society-profile/:structureId/nodes/documentos-societarios
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "Documentos Societarios",
    "code": "SOCIETARIO_ROOT",
    "path": "/documentos-societarios/",
    "parentId": null,
    "type": 1
  }
}
```

### Opción B: Crear si no existe

Si la carpeta no existe, crearla automáticamente:

```
POST /api/v2/repository/society-profile/:structureId/nodes/documentos-societarios
```

### Opción C: Información sobre la estructura

Si la carpeta ya existe, necesitamos saber:
- ¿En qué endpoint está?
- ¿Cómo identificarla?
- ¿Qué datos tiene?

---

## 📝 Logs actuales

```
🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos: 2
🔵 [RepositorioDocumentosHttp] Nodos obtenidos: 24
⚠️ [useObtenerCarpetaDocumentosSocietarios] No se encontró la carpeta 'Documentos Societarios'
⚠️ [useObtenerCarpetaDocumentosSocietarios] TODOS los nodos disponibles (carpetas): (24) [{…}, ...]
```

**Nota**: Los logs muestran que hay 24 nodos, pero no se muestran los detalles completos. Necesitamos ver qué nodos son para identificar cuál es "Documentos Societarios".

---

## 🎯 Comportamiento esperado

1. Usuario entra a `/storage/almacen`
2. Frontend busca carpeta "Documentos Societarios"
3. Si existe: Carga su contenido y permite subir/crear
4. Si no existe: Muestra vacío o crea la carpeta automáticamente

---

## 🚨 Impacto

- ❌ **No se pueden subir archivos** (botón deshabilitado)
- ❌ **No se pueden crear carpetas** (error: "No se pudo obtener la carpeta padre")
- ❌ **No se muestran documentos** (si los hay)

---

## 📞 Contacto

**Frontend**: Probo Frontend v3 Area 2  
**Ruta afectada**: `app/core/presentation/repositorio/composables/useObtenerCarpetaDocumentosSocietarios.ts`  
**Sociedad de prueba**: ID `5` (structureId: `5`)

