# 🚀 Guía Rápida Frontend - Repositorio V2

**Versión:** 2.0  
**Fecha:** 2025-12-11  
**Estado:** ✅ **Listo para implementar**

---

## 🎯 OBJETIVO

Esta guía explica **exactamente dónde enviar los documentos** desde el frontend según su tipo.

---

## 📍 UBICACIONES PRINCIPALES

### **1. Documentos Generados de Junta**

**Path:** `/core/documentos-generados/operaciones/juntas-accionistas/{fecha-junta}/`

**Ejemplo:**
```
/core/documentos-generados/operaciones/juntas-accionistas/junta 20 de Diciembre del 2024/
```

**Cuándo usar:**
- ✅ Actas de junta generadas automáticamente
- ✅ Documentos relacionados con una junta específica
- ✅ Cualquier documento que se genere desde el flujo de junta

**Cómo obtener la carpeta:**

```typescript
// Opción 1: Usar el endpoint de juntas (RECOMENDADO)
const response = await fetch(
  `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder?folderName=${encodeURIComponent('junta 20 de Diciembre del 2024')}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const { data: juntaFolder } = await response.json();
const folderId = juntaFolder.id; // Usar este ID para subir documentos

// Opción 2: Navegar manualmente (si ya conoces la estructura)
// 1. GET /nodes/root → encontrar "core"
// 2. GET /nodes/{coreId} → encontrar "documentos-generados"
// 3. GET /nodes/{documentosGeneradosId} → encontrar "operaciones"
// 4. GET /nodes/{operacionesId} → encontrar "juntas-accionistas"
// 5. GET /nodes/{juntasId} → encontrar carpeta de la junta específica
```

**Subir documento:**

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('title', 'acta-junta-universal.docx');

const uploadResponse = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  }
);
```

---

### **2. Documentos al Almacén (Google Drive Clone)**

**Path:** `/core/`

**Cuándo usar:**
- ✅ Archivos subidos manualmente por el usuario
- ✅ Documentos que no pertenecen a una junta específica
- ✅ Cualquier archivo que el usuario quiera almacenar (como Google Drive)

**Cómo obtener la carpeta:**

```typescript
// 1. Obtener carpetas raíz
const rootResponse = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/root`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const { data: rootFolders } = await rootResponse.json();

// 2. Encontrar carpeta "core"
const coreFolder = rootFolders.find((f: any) => f.name === 'core');
const coreFolderId = coreFolder.id; // Usar este ID para subir documentos
```

**Subir documento:**

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('title', 'contrato-empresa.pdf');

const uploadResponse = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/${coreFolderId}/documents`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  }
);
```

---

## 📋 RESUMEN DE ENDPOINTS

### **Para Documentos de Junta**

| Acción | Endpoint | Método |
|--------|----------|--------|
| Obtener/crear carpeta de junta | `/api/v2/repository/society-profile/:structureId/juntas/:flowId/folder?folderName={fecha}` | `GET` |
| Subir documento a junta | `/api/v2/repository/society-profile/:structureId/nodes/:folderId/documents` | `POST` |
| Verificar duplicado | `/api/v2/repository/society-profile/:structureId/nodes/:folderId/documents/check?fileName={nombre}` | `GET` |

### **Para Documentos al Almacén**

| Acción | Endpoint | Método |
|--------|----------|--------|
| Obtener carpeta core | `/api/v2/repository/society-profile/:structureId/nodes/root` | `GET` |
| Subir documento a almacén | `/api/v2/repository/society-profile/:structureId/nodes/:coreFolderId/documents` | `POST` |
| Verificar duplicado | `/api/v2/repository/society-profile/:structureId/nodes/:coreFolderId/documents/check?fileName={nombre}` | `GET` |

---

## 🔄 FLUJO COMPLETO: Enviar Documento de Junta

```typescript
async function enviarDocumentoJunta(
  structureId: number,
  flowId: number,
  fechaJunta: string, // ej: "junta 20 de Diciembre del 2024"
  file: File
) {
  const token = getAuthToken(); // Tu función para obtener el token

  // 1. Obtener o crear carpeta de junta
  const folderResponse = await fetch(
    `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder?folderName=${encodeURIComponent(fechaJunta)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (!folderResponse.ok) {
    throw new Error('Error al obtener carpeta de junta');
  }

  const { data: juntaFolder } = await folderResponse.json();
  const folderId = juntaFolder.id;

  // 2. (Opcional) Verificar si ya existe un documento con el mismo nombre
  const checkResponse = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents/check?fileName=${encodeURIComponent(file.name)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const { data: duplicateInfo } = await checkResponse.json();
  if (duplicateInfo.exists) {
    console.warn('⚠️ Ya existe un documento con el mismo nombre:', duplicateInfo.document);
    // Decidir si continuar o cancelar
  }

  // 3. Subir documento
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', file.name);

  const uploadResponse = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }
  );

  if (!uploadResponse.ok) {
    throw new Error('Error al subir documento');
  }

  const { data: uploadedDocument } = await uploadResponse.json();
  return uploadedDocument;
}
```

---

## 🔄 FLUJO COMPLETO: Enviar Documento al Almacén

```typescript
async function enviarDocumentoAlmacen(
  structureId: number,
  file: File
) {
  const token = getAuthToken();

  // 1. Obtener carpeta "core"
  const rootResponse = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/root`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (!rootResponse.ok) {
    throw new Error('Error al obtener carpetas raíz');
  }

  const { data: rootFolders } = await rootResponse.json();
  const coreFolder = rootFolders.find((f: any) => f.name === 'core');
  
  if (!coreFolder) {
    throw new Error('Carpeta "core" no encontrada');
  }

  const coreFolderId = coreFolder.id;

  // 2. (Opcional) Verificar si ya existe un documento con el mismo nombre
  const checkResponse = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/${coreFolderId}/documents/check?fileName=${encodeURIComponent(file.name)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const { data: duplicateInfo } = await checkResponse.json();
  if (duplicateInfo.exists) {
    console.warn('⚠️ Ya existe un documento con el mismo nombre:', duplicateInfo.document);
  }

  // 3. Subir documento
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', file.name);

  const uploadResponse = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/${coreFolderId}/documents`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }
  );

  if (!uploadResponse.ok) {
    throw new Error('Error al subir documento');
  }

  const { data: uploadedDocument } = await uploadResponse.json();
  return uploadedDocument;
}
```

---

## 📝 FORMATO DE FECHA PARA CARPETAS DE JUNTA

**Recomendación:** Usar formato legible en español

**Ejemplos válidos:**
- `"junta 20 de Diciembre del 2024"`
- `"junta 15 de Enero del 2025"`
- `"junta 10 de Febrero del 2025"`
- `"20-12-2024"` (formato corto, también válido)
- `"11 de diciembre del 2025"` (sin "junta" al inicio, también válido)

**Nota:** El backend acepta cualquier string como `folderName`. El frontend puede decidir el formato que prefiera.

---

## ⚠️ IMPORTANTE

### **Permisos de Subida**

- ✅ **SÍ se puede subir a:**
  - `/core/` (almacén)
  - `/core/documentos-generados/` y todas sus subcarpetas
  - `/core/documentos-generados/operaciones/juntas-accionistas/` y subcarpetas

- ❌ **NO se puede subir a:**
  - Otras carpetas dentro de `/core/` que no sean `documentos-generados/`
  - Carpetas del sistema antiguo (si aún existen)

### **Creación Automática**

- El endpoint `/juntas/:flowId/folder` **crea automáticamente** toda la estructura si no existe:
  - `/core/documentos-generados/`
  - `/core/documentos-generados/operaciones/`
  - `/core/documentos-generados/operaciones/juntas-accionistas/`
  - `/core/documentos-generados/operaciones/juntas-accionistas/{fecha-junta}/`

**No necesitas crear estas carpetas manualmente.**

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- [Estructura Completa de Carpetas](./REPOSITORIO-V2-ESTRUCTURA-CARPETAS.md)
- [Guía Frontend V3 Completa](./REPOSITORIO-AI-V2-FRONTEND-V3-GUIA.md)
- [Verificar Duplicados](./REPOSITORIO-AI-V2-VERIFICAR-DUPLICADOS-FRONTEND.md)

---

## ✅ CHECKLIST PARA EL FRONTEND

- [ ] Implementar función `enviarDocumentoJunta()` usando el endpoint de juntas
- [ ] Implementar función `enviarDocumentoAlmacen()` usando la carpeta core
- [ ] Agregar verificación de duplicados antes de subir (opcional pero recomendado)
- [ ] Manejar errores de permisos (400 Bad Request si intentas subir a carpeta incorrecta)
- [ ] Mostrar mensajes de éxito/error al usuario
- [ ] Decidir formato de fecha para carpetas de junta (ej: "junta 20 de Diciembre del 2024")

---

**¡Listo para implementar, mi rey!** 🚀💪

