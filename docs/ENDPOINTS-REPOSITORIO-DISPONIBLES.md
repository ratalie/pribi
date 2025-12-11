# 📚 Endpoints de Repositorio Disponibles

## ✅ Endpoints YA Implementados

### 1. Crear Carpeta
**Endpoint**: `POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/folder`

**Implementación**: 
- ✅ En `AlmacenamientoHttpRepository.createCarpeta()`
- ❌ **FALTA**: Agregar al `RepositorioDocumentosRepository` para uso general

**Ejemplo de uso**:
```typescript
// Actualmente solo disponible en AlmacenamientoRepository
const repository = new AlmacenamientoHttpRepository();
const carpeta = await repository.createCarpeta(
  structureId, 
  "20 de diciembre del 2025", 
  parentNodeId
);
```

**Body**:
```json
{
  "name": "20 de diciembre del 2025",
  "description": null
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "20 de diciembre del 2025",
    "type": 1,
    "path": "/core/juntas/",
    "parentId": 5
  }
}
```

---

### 2. Subir Archivo a Carpeta
**Endpoint**: `POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents`

**Implementación**: 
- ✅ En `RepositorioDocumentosHttpRepository.subirArchivo()`
- ✅ Ya disponible en el port `RepositorioDocumentosRepository`

**Ejemplo de uso**:
```typescript
const repository = new RepositorioDocumentosHttpRepository();
const file = new File([blob], "documento.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

const documento = await repository.subirArchivo(
  structureId,
  parentNodeId.toString(),
  file
);
```

**Headers**:
```
Authorization: Bearer {token}
x-file-size: {tamaño_en_bytes}
Content-Type: multipart/form-data
```

**Body**: FormData con el archivo

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 456,
    "name": "documento.docx",
    "type": 0,
    "documentVersions": [...]
  }
}
```

---

## 🔧 Lo que FALTA Implementar

### 1. Agregar `crearCarpeta` al RepositorioDocumentosRepository

**Port** (`repositorio-documentos.repository.ts`):
```typescript
crearCarpeta(
  structureId: string,
  parentNodeId: number,
  nombre: string,
  description?: string
): Promise<RepositorioNode>;
```

**Implementación** (`repositorio-documentos-http.repository.ts`):
```typescript
async crearCarpeta(
  structureId: string,
  parentNodeId: number,
  nombre: string,
  description?: string
): Promise<RepositorioNode> {
  const baseUrl = this.resolveBaseUrl();
  const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/folder`;
  
  const response = await $fetch<{
    success: boolean;
    data: RepositorioNodeDTO;
  }>(url, {
    ...withAuthHeaders(),
    method: "POST" as const,
    body: {
      name: nombre,
      description: description || null,
    },
  });

  return RepositorioNodeMapper.toEntity(response.data);
}
```

---

## 📋 Resumen de Endpoints

| Operación | Endpoint | Método | Estado |
|-----------|----------|--------|--------|
| Crear carpeta | `/api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/folder` | POST | ✅ Implementado (solo en Almacenamiento) |
| Subir archivo | `/api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents` | POST | ✅ Implementado |
| Subir múltiples archivos | `/api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/core` | POST | ✅ Implementado |
| Obtener nodo | `/api/v2/repository/nodes/:nodeId` | GET | ✅ Implementado |
| Actualizar nodo | `/api/v2/repository/nodes/:nodeId` | PATCH | ✅ Implementado |
| Eliminar nodo | `/api/v2/repository/nodes/:nodeId` | DELETE | ✅ Implementado |

---

## 🎯 Flujo Recomendado para Juntas

1. **Al entrar a la vista de la junta**:
   ```typescript
   // 1. Obtener ID del nodo "juntas" (parent)
   const nodoJuntas = await obtenerNodoJuntas(structureId);
   
   // 2. Crear carpeta con fecha legible
   const carpeta = await crearCarpeta(
     structureId,
     nodoJuntas.id,
     "20 de diciembre del 2025"
   );
   ```

2. **Al enviar documentos**:
   ```typescript
   // Subir cada documento a la carpeta creada
   for (const documento of documentos) {
     const file = new File([documento.blob], documento.nombre, {
       type: documento.mimeType
     });
     
     await subirArchivo(
       structureId,
       carpeta.id.toString(),
       file
     );
   }
   ```


