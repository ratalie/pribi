# 🔧 Corrección: Usar `/documents` en lugar de `/core`

## ❌ Problema Identificado

El endpoint `/core` **SIEMPRE crea una subcarpeta**, incluso sin el parámetro `name`:

```json
{
  "data": {
    "folder": {
      "id": 63,
      "name": "9 de diciembre del 2025-2025-12-11T03-45-34",  // ← Subcarpeta creada automáticamente
      "parentId": 58,  // ← Carpeta de junta
      "path": "/core/juntas/9 de diciembre del 2025/",
      "type": 1
    }
  }
}
```

**Resultado**: Se crea una estructura incorrecta:
```
/core/juntas/9 de diciembre del 2025/  ← Carpeta de junta (correcta)
  └── 9 de diciembre del 2025-2025-12-11T03-45-34/  ← Subcarpeta innecesaria (incorrecta)
      └── documentos.docx
```

---

## ✅ Solución

Usar el endpoint `/documents` que sube archivos **directamente** sin crear subcarpetas:

```
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents
```

**Resultado esperado**:
```
/core/juntas/9 de diciembre del 2025/  ← Carpeta de junta (correcta)
  ├── acta-junta-universal.docx  ← Documento directamente (correcto)
  ├── minuta-aumento-capital.docx  ← Documento directamente (correcto)
  └── certificado-aporte.docx  ← Documento directamente (correcto)
```

---

## 🔄 Cambios Realizados

### 1. URL del Endpoint

**ANTES**:
```typescript
const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/core`;
```

**AHORA**:
```typescript
const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents`;
```

### 2. FormData Key

**ANTES** (endpoint `/core`):
```typescript
formData.append(file.size.toString(), file, file.name);  // Key = tamaño del archivo
```

**AHORA** (endpoint `/documents`):
```typescript
formData.append("file", file, file.name);  // Key = "file"
```

---

## 📋 Diferencias entre Endpoints

| Característica | `/core` | `/documents` |
|---------------|---------|--------------|
| **Crea subcarpeta** | ✅ Siempre (con o sin `name`) | ❌ No |
| **Sube archivos directamente** | ❌ No | ✅ Sí |
| **FormData key** | `file.size.toString()` | `"file"` |
| **Query param `name`** | Opcional (crea subcarpeta con ese nombre) | No aplica |
| **Uso recomendado** | Crear subcarpetas con archivos | Subir archivos directamente |

---

## ✅ Resultado Esperado

Después de esta corrección:

1. ✅ Se crea/obtiene la carpeta de junta con nombre legible: "9 de diciembre del 2025"
2. ✅ Los documentos se suben **directamente** a esa carpeta
3. ✅ **NO se crean subcarpetas** adicionales
4. ✅ Estructura final correcta: `/core/juntas/9 de diciembre del 2025/documentos.docx`

---

## 🧪 Prueba

1. Enviar documentos desde el flujo de junta
2. Verificar que NO se crea subcarpeta con timestamp
3. Verificar que los documentos aparecen directamente en la carpeta de junta
4. Verificar que la estructura en `/storage/documentos-generados/5/operaciones/junta-accionistas` muestra correctamente la carpeta "9 de diciembre del 2025" con los documentos dentro


