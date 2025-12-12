# 📍 Repositorio V2 - ¿Dónde Enviar Documentos?

**Versión:** 2.0  
**Fecha:** 2025-12-11  
**Estado:** ✅ **Documentación clara para frontend**

---

## 🎯 RESUMEN RÁPIDO

| Tipo de Documento | Path | Endpoint |
|-------------------|------|----------|
| **Documentos de Junta** | `/core/documentos-generados/operaciones/juntas-accionistas/{fecha}/` | `GET /juntas/:flowId/folder` |
| **Documentos al Almacén** | `/core/` | `GET /nodes/root` → buscar "core" |

---

## 1️⃣ DOCUMENTOS GENERADOS DE JUNTA

### **Ubicación:**
```
/core/documentos-generados/operaciones/juntas-accionistas/{fecha-junta}/
```

### **Ejemplos de Paths:**
- `/core/documentos-generados/operaciones/juntas-accionistas/junta 20 de Diciembre del 2024/`
- `/core/documentos-generados/operaciones/juntas-accionistas/junta 15 de Enero del 2025/`
- `/core/documentos-generados/operaciones/juntas-accionistas/20-12-2024/`

### **Cuándo usar:**
- ✅ Actas de junta generadas automáticamente
- ✅ Documentos relacionados con una junta específica
- ✅ Cualquier documento que se genere desde el flujo de junta

### **Cómo obtener la carpeta:**

```typescript
// Endpoint: GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder?folderName={fecha}

const response = await fetch(
  `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder?folderName=${encodeURIComponent('junta 20 de Diciembre del 2024')}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const { data: juntaFolder } = await response.json();
const folderId = juntaFolder.id; // ← Usar este ID para subir documentos
```

### **Subir documento:**

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

### **✅ Ventajas:**
- ✅ La estructura completa se crea automáticamente si no existe
- ✅ No necesitas navegar manualmente por las carpetas
- ✅ El endpoint maneja toda la lógica de creación

---

## 2️⃣ DOCUMENTOS AL ALMACÉN (Google Drive Clone)

### **Ubicación:**
```
/core/
```

### **Cuándo usar:**
- ✅ Archivos subidos manualmente por el usuario
- ✅ Documentos que no pertenecen a una junta específica
- ✅ Cualquier archivo que el usuario quiera almacenar (como Google Drive)

### **Cómo obtener la carpeta:**

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
const coreFolderId = coreFolder.id; // ← Usar este ID para subir documentos
```

### **Subir documento:**

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

### **✅ Ventajas:**
- ✅ Simple: solo necesitas el ID de la carpeta "core"
- ✅ Funciona como Google Drive: archivos sueltos en la raíz
- ✅ No requiere estructura específica

---

## 🔄 COMPARACIÓN

| Aspecto | Documentos de Junta | Documentos al Almacén |
|---------|---------------------|----------------------|
| **Path** | `/core/documentos-generados/operaciones/juntas-accionistas/{fecha}/` | `/core/` |
| **Endpoint para obtener carpeta** | `GET /juntas/:flowId/folder` | `GET /nodes/root` |
| **Creación automática** | ✅ Sí (estructura completa) | ✅ Sí (ya existe) |
| **Navegación manual** | ❌ No necesaria | ✅ Necesaria (buscar "core") |
| **Uso** | Documentos generados automáticamente | Archivos subidos manualmente |

---

## 📝 EJEMPLOS COMPLETOS

### **Ejemplo 1: Enviar Documento de Junta**

```typescript
async function enviarDocumentoJunta(
  structureId: number,
  flowId: number,
  fechaJunta: string, // ej: "junta 20 de Diciembre del 2024"
  file: File
) {
  const token = getAuthToken();

  // 1. Obtener o crear carpeta de junta
  const folderResponse = await fetch(
    `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder?folderName=${encodeURIComponent(fechaJunta)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const { data: juntaFolder } = await folderResponse.json();
  const folderId = juntaFolder.id;

  // 2. Subir documento
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

  return await uploadResponse.json();
}

// Uso:
await enviarDocumentoJunta(
  5, // structureId
  123, // flowId
  'junta 20 de Diciembre del 2024', // fechaJunta
  file // File object
);
```

### **Ejemplo 2: Enviar Documento al Almacén**

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

  const { data: rootFolders } = await rootResponse.json();
  const coreFolder = rootFolders.find((f: any) => f.name === 'core');
  const coreFolderId = coreFolder.id;

  // 2. Subir documento
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

  return await uploadResponse.json();
}

// Uso:
await enviarDocumentoAlmacen(
  5, // structureId
  file // File object
);
```

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- [Guía Rápida Frontend](./REPOSITORIO-V2-FRONTEND-GUIA-RAPIDA.md) - Guía completa con ejemplos
- [Estructura de Carpetas](./REPOSITORIO-V2-ESTRUCTURA-CARPETAS.md) - Estructura completa del sistema
- [Enviar Documentos a Junta](./REPOSITORIO-AI-V2-ENVIAR-DOCUMENTOS-JUNTA.md) - Documentación detallada

---

**¡Listo para implementar, mi rey!** 🚀💪

