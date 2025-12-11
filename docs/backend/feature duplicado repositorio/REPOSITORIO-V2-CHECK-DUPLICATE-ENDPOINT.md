# 📋 Endpoint: Verificación de Documentos Duplicados

## 🎯 Descripción

Endpoint para verificar si un documento con un nombre específico ya existe en una carpeta determinada. Útil para detectar duplicados antes de subir nuevos documentos.

---

## 📍 Endpoint

```
GET /api/v2/repository/society-profile/:structureId/nodes/:folderId/documents/check
```

### Parámetros de Ruta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `structureId` | `number` | ✅ Sí | ID de la estructura de la sociedad (V2) |
| `folderId` | `number` | ✅ Sí | ID del nodo de carpeta donde buscar duplicados |

### Query Parameters

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `fileName` | `string` | ✅ Sí | Nombre exacto del archivo a verificar (case-sensitive) |

---

## 📤 Request

### Ejemplo de Request

```http
GET /api/v2/repository/society-profile/20/nodes/26/documents/check?fileName=acta-junta-universal.docx
Authorization: Bearer <JWT_TOKEN>
```

### Headers Requeridos

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 📥 Response

### Respuesta Exitosa (Documento Existe)

**Status Code:** `200 OK`

```json
{
  "success": true,
  "code": 200,
  "message": "Document duplicate check completed successfully",
  "data": {
    "exists": true,
    "document": {
      "versionCode": "123e4567-e89b-12d3-a456-426614174000",
      "documentCode": "123e4567-e89b-12d3-a456-426614174001",
      "userId": 1,
      "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "sizeInBytes": 79784,
      "createdAt": "2025-12-11T10:00:00.000Z",
      "updatedAt": "2025-12-11T10:00:00.000Z",
      "title": "acta-junta-universal.docx",
      "node": {
        "id": 123,
        "code": "abc-123-def",
        "name": "acta-junta-universal.docx",
        "parentId": 26,
        "path": "/core/juntas/11 de diciembre del 2025/",
        "type": 0,
        "createdAt": "2025-12-11T10:00:00.000Z",
        "updatedAt": "2025-12-11T10:00:00.000Z"
      },
      "user": {
        "id": 1,
        "email": "user@example.com"
      },
      "latestVersion": {
        "versionCode": "123e4567-e89b-12d3-a456-426614174000",
        "versionNumber": 1,
        "createdAt": "2025-12-11T10:00:00.000Z",
        "sizeInBytes": 79784
      }
    }
  }
}
```

### Respuesta Exitosa (Documento NO Existe)

**Status Code:** `200 OK`

```json
{
  "success": true,
  "code": 200,
  "message": "Document duplicate check completed successfully",
  "data": {
    "exists": false,
    "document": null
  }
}
```

### Errores

#### 400 Bad Request

**Causas:**
- `fileName` está vacío o no es válido
- `folderId` no es una carpeta (es un documento)

```json
{
  "statusCode": 400,
  "message": "fileName cannot be empty",
  "error": "Bad Request"
}
```

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 403 Forbidden

**Causas:**
- Usuario no tiene acceso a la sociedad
- Usuario inactivo o sin rol

```json
{
  "statusCode": 403,
  "message": "User account is inactive",
  "error": "Forbidden"
}
```

#### 404 Not Found

**Causas:**
- `structureId` no existe
- `folderId` no existe

```json
{
  "statusCode": 404,
  "message": "Folder not found",
  "error": "Not Found"
}
```

---

## 🔍 Detalles Técnicos

### Comportamiento

1. **Búsqueda Exacta**: El endpoint busca documentos cuyo `title` coincida **exactamente** con el `fileName` proporcionado (case-sensitive).

2. **Ámbito de Búsqueda**: La búsqueda se realiza dentro de la carpeta especificada y sus subcarpetas (recursivamente).

3. **Última Versión**: Si se encuentra un documento, se retorna información sobre la última versión del mismo.

4. **Validaciones**:
   - El usuario debe estar autenticado
   - El usuario debe tener acceso a la sociedad
   - El `folderId` debe ser una carpeta (no un documento)
   - El `fileName` no puede estar vacío

### Casos de Uso

#### 1. Verificar Antes de Subir

```typescript
// Frontend: Verificar antes de subir
const checkResult = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents/check?fileName=${encodeURIComponent(fileName)}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const { data } = await checkResult.json();

if (data.exists) {
  // Mostrar modal: "El documento ya existe. ¿Crear nueva versión?"
  showDuplicateModal(data.document);
} else {
  // Proceder con la subida normal
  uploadDocument(file);
}
```

#### 2. Verificar Múltiples Documentos

```typescript
// Verificar múltiples documentos en paralelo
const documents = ['acta.docx', 'minuta.docx', 'resolucion.pdf'];

const checks = await Promise.all(
  documents.map(fileName =>
    fetch(
      `/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents/check?fileName=${encodeURIComponent(fileName)}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    ).then(r => r.json())
  )
);

const duplicates = checks.filter(check => check.data.exists);
const newDocuments = checks.filter(check => !check.data.exists);
```

---

## 🏗️ Arquitectura

### Componentes

1. **Controller**: `DocumentsV2Controller.checkDocumentDuplicateHandler`
2. **Use Case**: `CheckDocumentDuplicateUseCase`
3. **Repository**: `DocumentVersionRepository.checkDocumentDuplicateByFileName`
4. **DTOs**:
   - `CheckDocumentDuplicateQueryDto` (Request)
   - `DocumentDuplicateInfoDto` (Response)

### Flujo de Ejecución

```
Request → Controller
  ↓
Mapear IDs (V2 → V1)
  ↓
Use Case
  ↓
Validar Usuario
  ↓
Validar Carpeta
  ↓
Validar Acceso a Sociedad
  ↓
Repository (SQL Query)
  ↓
Response
```

---

## 📝 Notas Importantes

1. **Case-Sensitive**: La búsqueda es case-sensitive. `"Acta.docx"` y `"acta.docx"` son considerados diferentes.

2. **Búsqueda Recursiva**: La búsqueda incluye subcarpetas. Si buscas en `/core/juntas/`, también buscará en `/core/juntas/subcarpeta/`.

3. **Última Versión**: Si un documento tiene múltiples versiones, se retorna información de la última versión (más reciente).

4. **Performance**: La consulta SQL usa CTEs recursivos para buscar en subcarpetas. Para carpetas con muchos documentos, puede tomar algunos milisegundos.

---

## 🔗 Endpoints Relacionados

- `POST /api/v2/repository/society-profile/:structureId/nodes/:folderId/documents` - Subir nuevo documento
- `POST /api/v2/repository/documents/:documentCode/versions` - Crear nueva versión de documento existente
- `GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder` - Obtener carpeta de junta

---

## ✅ Checklist de Implementación

- [x] Método en repositorio (`checkDocumentDuplicateByFileName`)
- [x] Caso de uso (`CheckDocumentDuplicateUseCase`)
- [x] DTOs (Request y Response)
- [x] Endpoint en controller
- [x] Registro en módulo
- [x] Documentación Swagger
- [x] Validaciones de seguridad
- [x] Manejo de errores

---

## 📚 Referencias

- [Arquitectura Hexagonal](../general/ARCHITECTURE.md)
- [Documentación Repositorio V2](./REPOSITORIO-AI-V2-FRONTEND-V3-GUIA.md)
- [Ejemplos de Uso](./REPOSITORIO-AI-V2-EJEMPLOS-COMPLETOS.md)

