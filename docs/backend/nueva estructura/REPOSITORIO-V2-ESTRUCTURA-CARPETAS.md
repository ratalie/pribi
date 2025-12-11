# 📁 Estructura de Carpetas V2 - Documentación Completa

**Versión:** 2.0  
**Fecha:** 2025-12-11  
**Estado:** ✅ **Implementado**

---

## 🎯 VISIÓN GENERAL

Cada sociedad tiene automáticamente una estructura de carpetas que funciona como un **Google Drive clone**. La estructura se crea automáticamente cuando se crea una nueva sociedad.

---

## 📂 ESTRUCTURA COMPLETA

```
/ (raíz)
│
├── /core/                                    ← Google Drive principal
│   │
│   ├── documentos-generados/                 ← Carpeta para docs generados automáticamente
│   │   │
│   │   ├── registros/                        ← Nivel 1: Registros
│   │   │   └── sociedades/                   ← Nivel 2: Sociedades
│   │   │       ├── registro sociedades/
│   │   │       │   ├── datos principales
│   │   │       │   ├── capital social y acciones
│   │   │       │   ├── accionistas
│   │   │       │   ├── asignación de acciones
│   │   │       │   ├── directorio
│   │   │       │   ├── régimen de facultades
│   │   │       │   ├── registro de apoderados
│   │   │       │   ├── quorums y mayoría
│   │   │       │   └── estatutos
│   │   │       ├── historial de registro
│   │   │       ├── ficha de la sociedad
│   │   │       ├── registro de acciones
│   │   │       ├── acuerdos especiales
│   │   │       └── derecho y gravamenes sobre acciones
│   │   │
│   │   └── operaciones/                      ← Nivel 1: Operaciones
│   │       ├── directorio/                  ← Nivel 2: Directorio
│   │       └── juntas-accionistas/          ← Nivel 2: Juntas de accionistas
│   │           └── (carpetas dinámicas por fecha)
│   │               ├── junta 20 de Diciembre del 2024
│   │               ├── junta 15 de Enero del 2025
│   │               └── ... (más juntas)
│   │
│   ├── acta.docx                             ← Archivos sueltos (mismo nivel)
│   ├── acta.pdf
│   └── ... (más archivos subidos manualmente)
│
└── /common/                                  ← Carpeta común (vacía por defecto, para uso futuro)
```

---

## 🔄 MIGRACIÓN DESDE ESTRUCTURA ANTIGUA

### **Estructura Antigua (V1)**

```
/core/
  ├── sociedades/          ← ELIMINADA
  ├── juntas/              ← ELIMINADA
  └── directorio/          ← ELIMINADA
```

### **Nueva Estructura (V2)**

```
/core/
  └── documentos-generados/
      ├── registros/sociedades/    ← Reemplaza /core/sociedades/
      └── operaciones/
          ├── directorio/          ← Reemplaza /core/directorio/
          └── juntas-accionistas/  ← Reemplaza /core/juntas/
```

---

## 📍 UBICACIONES ESPECÍFICAS

### **1. Documentos de Registro de Sociedades**

**Path:** `/core/documentos-generados/registros/sociedades/`

**Subcarpetas:**
- `registro sociedades/` → Documentos del registro
- `historial de registro`
- `ficha de la sociedad`
- `registro de acciones`
- `acuerdos especiales`
- `derecho y gravamenes sobre acciones`

### **2. Documentos de Directorio**

**Path:** `/core/documentos-generados/operaciones/directorio/`

**Uso:** Documentos relacionados con el directorio de la sociedad.

### **3. Documentos de Juntas de Accionistas**

**Path:** `/core/documentos-generados/operaciones/juntas-accionistas/`

**Carpetas Dinámicas:**
- Se crean automáticamente cuando se necesita
- Nombre por defecto: `{flowId}` (ej: "123")
- Nombre personalizado: `{folderName}` (ej: "junta 20 de Diciembre del 2024")

**Ejemplo:**
```
/core/documentos-generados/operaciones/juntas-accionistas/
  ├── 123/                              ← flowId
  ├── junta 20 de Diciembre del 2024/  ← folderName personalizado
  └── junta 15 de Enero del 2025/
```

### **4. Archivos Sueltos (Google Drive Clone)**

**Path:** `/core/`

**Uso:** Archivos subidos manualmente por el usuario, sin estructura específica.

**Ejemplo:**
```
/core/
  ├── acta.docx
  ├── acta.pdf
  ├── contrato.pdf
  └── ... (más archivos)
```

---

## 🚀 CREACIÓN AUTOMÁTICA

### **Cuándo se Crea**

La estructura se crea automáticamente cuando:
1. Se crea una nueva sociedad (`CreateSocietyProfileUseCase`)
2. Se llama a `createSocietyRootFolders()` por primera vez

### **Qué se Crea**

- ✅ Carpeta `/core/` (raíz)
- ✅ Carpeta `/common/` (raíz, vacía)
- ✅ Toda la estructura de `/core/documentos-generados/` con todas sus subcarpetas

### **Qué NO se Crea Automáticamente**

- ❌ Carpetas de juntas por fecha (se crean dinámicamente cuando se necesita)
- ❌ Archivos (se suben manualmente)

---

## 📝 ENDPOINTS PARA ACCEDER

### **1. Obtener Carpetas Raíz**

```http
GET /api/v2/repository/society-profile/:structureId/nodes/root
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "core",
      "type": 1,
      "path": "/core/"
    },
    {
      "id": 2,
      "name": "common",
      "type": 1,
      "path": "/common/"
    }
  ]
}
```

### **2. Obtener Estructura Core Completa**

```http
GET /api/v2/repository/society-profile/:structureId/nodes/core
```

**Response:** Lista todas las carpetas dentro de `/core/`, incluyendo `documentos-generados/` y sus subcarpetas.

### **3. Obtener o Crear Carpeta de Junta**

```http
GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder?folderName={nombre}
```

**Nueva Ubicación:** Crea/obtiene carpeta en:
```
/core/documentos-generados/operaciones/juntas-accionistas/{folderName}/
```

### **4. Subir Archivo a Carpeta Específica**

```http
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents
```

**Ejemplos de `parentNodeId`:**
- Para subir a "documentos-generados": ID de la carpeta `documentos-generados`
- Para subir a "juntas-accionistas": ID de la carpeta `juntas-accionistas`
- Para subir a una junta específica: ID de la carpeta de la junta (ej: "junta 20 de Diciembre del 2024")
- Para subir directamente a `/core/`: ID de la carpeta `core`

---

## 🔍 CÓMO ENCONTRAR CARPETAS DESDE EL FRONTEND

### **Ejemplo: Encontrar "documentos-generados"**

```typescript
// 1. Obtener carpetas raíz
const rootFolders = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/root`
);
const { data: roots } = await rootFolders.json();

// 2. Encontrar carpeta "core"
const coreFolder = roots.find((f: any) => f.name === 'core');

// 3. Obtener hijos de "core"
const coreNode = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/${coreFolder.id}`
);
const { data: coreData } = await coreNode.json();

// 4. Encontrar "documentos-generados"
const documentosGenerados = coreData.children?.find(
  (f: any) => f.name === 'documentos-generados'
);

console.log('ID de documentos-generados:', documentosGenerados.id);
```

### **Ejemplo: Encontrar "juntas-accionistas"**

```typescript
// Usando el endpoint de juntas (recomendado)
const juntaFolder = await fetch(
  `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder?folderName=${encodeURIComponent('junta 20 de Diciembre del 2024')}`
);
const { data } = await juntaFolder.json();

// El endpoint automáticamente:
// 1. Crea /core/documentos-generados/ si no existe
// 2. Crea /core/documentos-generados/operaciones/ si no existe
// 3. Crea /core/documentos-generados/operaciones/juntas-accionistas/ si no existe
// 4. Crea la carpeta de la junta específica
// 5. Retorna el ID de la carpeta de la junta

console.log('ID de carpeta de junta:', data.id);
```

---

## ✅ PERMISOS DE SUBIDA

### **Carpetas donde SÍ se puede subir:**

- ✅ `/core/` (archivos sueltos)
- ✅ `/core/documentos-generados/` y todas sus subcarpetas
- ✅ `/core/documentos-generados/operaciones/juntas-accionistas/` y subcarpetas

### **Carpetas donde NO se puede subir:**

- ❌ Otras carpetas dentro de `/core/` que no sean `documentos-generados/`
- ❌ Carpetas del sistema antiguo (si aún existen)

---

## 🔄 COMPATIBILIDAD CON SOCIEDADES EXISTENTES

### **Sociedades Nuevas**

✅ Se crean automáticamente con la nueva estructura.

### **Sociedades Existentes**

⚠️ **IMPORTANTE:** Las sociedades que ya tienen la estructura antigua (`/core/sociedades/`, `/core/juntas/`, `/core/directorio/`) **NO se migran automáticamente**.

**Opciones:**

1. **Usar endpoint de juntas:** El endpoint `GET /juntas/:flowId/folder` crea automáticamente la nueva estructura si no existe.

2. **Migración manual:** (Futuro) Crear script de migración para mover documentos de la estructura antigua a la nueva.

3. **Crear estructura faltante:** Si falta `documentos-generados/`, se crea automáticamente la primera vez que se usa el endpoint de juntas.

---

## 📋 RESUMEN DE CAMBIOS

| Antes (V1) | Ahora (V2) |
|------------|------------|
| `/core/sociedades/` | `/core/documentos-generados/registros/sociedades/` |
| `/core/juntas/` | `/core/documentos-generados/operaciones/juntas-accionistas/` |
| `/core/directorio/` | `/core/documentos-generados/operaciones/directorio/` |
| No existía | `/core/documentos-generados/` (nueva estructura) |
| No existía | Archivos sueltos en `/core/` (Google Drive clone) |

---

## 🎯 CASOS DE USO

### **Caso 1: Subir Documentos a Junta**

```typescript
// 1. Obtener o crear carpeta de junta
const folder = await getOrCreateJuntaFolder(
  structureId,
  flowId,
  'junta 20 de Diciembre del 2024'
);

// 2. Subir documentos
await uploadFile(structureId, folder.id, file);
// Los documentos van a: /core/documentos-generados/operaciones/juntas-accionistas/junta 20 de Diciembre del 2024/
```

### **Caso 2: Subir Archivos Sueltos (Google Drive)**

```typescript
// 1. Obtener carpeta "core"
const rootFolders = await getRootFolders(structureId);
const coreFolder = rootFolders.find(f => f.name === 'core');

// 2. Subir directamente a /core/
await uploadFile(structureId, coreFolder.id, file);
// El archivo va a: /core/acta.docx
```

### **Caso 3: Subir a "Documentos Generados"**

```typescript
// 1. Navegar hasta documentos-generados
const coreNode = await getNodeById(coreFolderId);
const documentosGenerados = coreNode.children.find(
  f => f.name === 'documentos-generados'
);

// 2. Subir a documentos-generados
await uploadFile(structureId, documentosGenerados.id, file);
```

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- [Guía Frontend V3](./REPOSITORIO-AI-V2-FRONTEND-V3-GUIA.md)
- [Enviar Documentos a Junta](./REPOSITORIO-AI-V2-ENVIAR-DOCUMENTOS-JUNTA.md)
- [Verificar Duplicados](./REPOSITORIO-AI-V2-VERIFICAR-DUPLICADOS-FRONTEND.md)

---

**¡Estructura lista, mi rey!** 🚀💪

