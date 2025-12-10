# 📚 GUÍA COMPLETA: ENDPOINTS V2 - REPOSITORIO

**Fecha**: 8 de Diciembre 2025  
**Versión**: 2.0  
**Propósito**: Documentación completa de TODOS los endpoints V2 para el repositorio

---

## 🎯 CONTEXTO V2

### **IDs que Maneja el Frontend V3**

Cuando trabajas en V2, manejas estos IDs:

1. **`structureId`** (number): ID que devuelve el backend cuando creas una sociedad
   - Endpoint: `POST /api/v2/society-profile`
   - Respuesta: `{ "data": { "structureId": 5 } }`
   - Este es el ID de `SocietyProfileStructureV2.id`

2. **`flowId`** (number): ID que devuelve el backend cuando creas una junta
   - Endpoint: `POST /api/v2/society-profile/:societyId/register-assembly`
   - Respuesta: `{ "data": { "flowId": 123 } }`
   - Este es el ID del flujo/junta

**⚠️ IMPORTANTE:** En V2 NO usas `societyId` directamente. Usas `structureId` que internamente se mapea a `societyId` de V1.

---

## 📋 ENDPOINTS V2 IMPLEMENTADOS ✅

### **1. UPLOADS (Subir Documentos)**

#### **1.1. Subir documento a nodo**
```http
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)
- `parentNodeId` (number): ID del nodo padre donde se subirá el documento

**Headers:**
```
Authorization: Bearer {token}
x-file-size: {tamaño_en_bytes}
Content-Type: multipart/form-data
```

**Body:**
- `file`: Archivo a subir

**Ejemplo:**
```typescript
const formData = new FormData();
formData.append('file', fileBlob, 'documento.pdf');

await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/documents`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-file-size': fileBlob.size.toString(),
    },
    body: formData,
  }
);
```

---

#### **1.2. Subir múltiples documentos core**
```http
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/core
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)
- `parentNodeId` (number): ID del nodo padre

**Query params:**
- `name` (string, opcional): Nombre de la carpeta

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
- Múltiples archivos

**Ejemplo:**
```typescript
const formData = new FormData();
formData.append('file', actaBlob, 'acta.docx');
formData.append('file', convocatoriaBlob, 'convocatoria.docx');

await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/core?name=Documentos%20Junta`,
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  }
);
```

---

#### **1.3. Subir preview de nodo**
```http
PUT /api/v2/repository/nodes/:nodeCode/preview
```

**Parámetros:**
- `nodeCode` (string UUID): Código del nodo

---

### **2. NODES (Gestión de Nodos)**

#### **2.1. Obtener nodos raíz**
```http
GET /api/v2/repository/society-profile/:structureId/nodes/root
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)

**Respuesta:**
```json
{
  "success": true,
  "message": "The root nodes for the society have been successfully retrieved.",
  "data": [
    {
      "id": 123,
      "name": "Documents",
      "parentId": null,
      "societyId": 1,
      "type": 1,
      "path": "/Documents/",
      "createdAt": "2024-08-11T15:30:00Z",
      "updatedAt": "2024-08-11T15:30:00Z"
    }
  ],
  "code": 200
}
```

---

#### **2.2. Obtener nodos core**
```http
GET /api/v2/repository/society-profile/:structureId/nodes/core
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)

**Respuesta:** Lista de nodos core (incluye carpeta `/core/`)

**Uso:** Para obtener la carpeta `/core/` y sus subcarpetas.

---

#### **2.3. Obtener nodo por ID**
```http
GET /api/v2/repository/nodes/:nodeId
```

**Parámetros:**
- `nodeId` (number): ID del nodo

---

#### **2.4. Crear carpeta**
```http
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/folder
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)
- `parentNodeId` (number): ID del nodo padre

**Body:**
```json
{
  "name": "Nueva Carpeta",
  "description": "Descripción opcional"
}
```

---

#### **2.5. Actualizar nodo**
```http
PATCH /api/v2/repository/nodes/:nodeId
```

**Parámetros:**
- `nodeId` (number): ID del nodo a actualizar

**Body:**
```json
{
  "name": "Nuevo Nombre",
  "description": "Nueva descripción",
  "parentId": 456
}
```

---

#### **2.6. Eliminar nodo**
```http
DELETE /api/v2/repository/nodes/:nodeId
```

**Parámetros:**
- `nodeId` (number): ID del nodo a eliminar

---

#### **2.7. Descargar carpeta como ZIP**
```http
GET /api/v2/repository/nodes/:nodeId/download-zip
```

**Parámetros:**
- `nodeId` (number): ID de la carpeta a descargar

---

### **3. JUNTAS (Endpoints Específicos)** ⭐

#### **3.1. Obtener o crear carpeta de junta**
```http
GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)
- `flowId` (number): ID del flujo/junta

**Descripción:**
- Obtiene o crea automáticamente la carpeta `/core/juntas/{flowId}/`
- Si no existe la carpeta `core`, lanza error
- Si no existe la carpeta `juntas`, la crea automáticamente
- Si no existe la carpeta de la junta, la crea automáticamente

**Respuesta:**
```json
{
  "success": true,
  "message": "Carpeta de junta 123 obtenida o creada exitosamente",
  "data": {
    "id": 456,
    "name": "123",
    "parentId": 123,
    "societyId": 1,
    "type": 1,
    "path": "/core/juntas/123/",
    "createdAt": "2024-12-07T15:30:00Z",
    "updatedAt": "2024-12-07T15:30:00Z"
  },
  "code": 200
}
```

---

#### **3.2. Obtener solo el folderId de junta**
```http
GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder-id
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)
- `flowId` (number): ID del flujo/junta

**Respuesta:**
```json
{
  "success": true,
  "message": "Folder ID de junta 123 obtenido exitosamente",
  "data": {
    "folderId": 456
  },
  "code": 200
}
```

---

## ✅ ENDPOINTS V2 IMPLEMENTADOS - VIRTUAL NODES Y CONVERSATIONS

### **4. VIRTUAL NODES (Carpetas Personalizadas con Chat IA)** ✅ **IMPLEMENTADO**

#### **4.1. Obtener nodos virtuales raíz**
```http
GET /api/v2/repository/society-profile/:structureId/virtual-nodes
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)

**Respuesta:** Lista de carpetas virtuales raíz

---

#### **4.2. Crear carpeta virtual raíz**
```http
POST /api/v2/repository/society-profile/:structureId/virtual-nodes
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)

**Body:**
```json
{
  "name": "Mi Carpeta Personalizada",
  "isChatIA": true,
  "isHidden": false,
  "description": "Descripción opcional"
}
```

**Ejemplo:**
```typescript
await fetch(
  `/api/v2/repository/society-profile/${structureId}/virtual-nodes`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Documentos Legales',
      isChatIA: true, // ✅ Habilita chat con IA
      description: 'Carpeta para documentos legales con IA',
    }),
  }
);
```

---

#### **4.3. Crear carpeta virtual dentro de otra**
```http
POST /api/v2/repository/virtual-nodes/:virtualNodeId
```

**Parámetros:**
- `virtualNodeId` (number): ID de la carpeta virtual padre

**Body:**
```json
{
  "name": "Subcarpeta",
  "isChatIA": false,
  "isHidden": false,
  "description": "Descripción opcional"
}
```

---

#### **4.4. Obtener nodo virtual por ID**
```http
GET /api/v2/repository/virtual-nodes/:virtualNodeId
```

**Parámetros:**
- `virtualNodeId` (number): ID del nodo virtual

---

#### **4.5. Crear documento virtual (linkear documento real)**
```http
POST /api/v2/repository/virtual-nodes/:virtualNodeId/nodes/:documentNodeId
```

**Parámetros:**
- `virtualNodeId` (number): ID de la carpeta virtual padre
- `documentNodeId` (number): ID del documento real a linkear

**Body:**
```json
{
  "description": "Descripción opcional"
}
```

**Ejemplo:**
```typescript
// Linkear un documento real a una carpeta virtual
await fetch(
  `/api/v2/repository/virtual-nodes/${virtualFolderId}/nodes/${documentNodeId}`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'Documento importante',
    }),
  }
);
```

---

#### **4.6. Actualizar nodo virtual**
```http
PATCH /api/v2/repository/virtual-nodes/:virtualNodeId
```

**Parámetros:**
- `virtualNodeId` (number): ID del nodo virtual a actualizar

**Body:**
```json
{
  "name": "Nuevo Nombre",
  "isChatIA": true,
  "description": "Nueva descripción"
}
```

---

#### **4.7. Eliminar nodo virtual**
```http
DELETE /api/v2/repository/virtual-nodes/:virtualNodeId
```

**Parámetros:**
- `virtualNodeId` (number): ID del nodo virtual a eliminar

---

#### **4.8. Crear permiso para usuario**
```http
POST /api/v2/repository/virtual-nodes/:virtualNodeId/users/:userAssigneeId
```

**Parámetros:**
- `virtualNodeId` (number): ID del nodo virtual
- `userAssigneeId` (number): ID del usuario al que se le dará acceso

**Body:**
```json
{
  "expireAt": "2025-12-31T23:59:59.000Z" // Opcional, null para acceso permanente
}
```

**Ejemplo:**
```typescript
await fetch(
  `/api/v2/repository/virtual-nodes/${virtualNodeId}/users/${userAssigneeId}`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      expireAt: null, // Acceso permanente
    }),
  }
);
```

---

#### **4.9. Eliminar permiso de usuario**
```http
DELETE /api/v2/repository/virtual-nodes/:virtualNodeId/users/:userAssigneeId
```

**Parámetros:**
- `virtualNodeId` (number): ID del nodo virtual
- `userAssigneeId` (number): ID del usuario al que se le quitará acceso

---

#### **4.10. Obtener usuarios con acceso**
```http
GET /api/v2/repository/virtual-nodes/:virtualNodeId/users
```

**Parámetros:**
- `virtualNodeId` (number): ID del nodo virtual

**Respuesta:** Lista de usuarios con acceso al nodo virtual

---

#### **4.11. Obtener peso de carpeta virtual**
```http
GET /api/v2/repository/virtual-nodes/:virtualNodeId/weight
```

**Parámetros:**
- `virtualNodeId` (number): ID de la carpeta virtual

**Respuesta:** Tamaño total de todos los documentos en la carpeta

---

#### **4.12. Crear árbol de carpetas virtuales**
```http
POST /api/v2/repository/society-profile/:structureId/virtual-nodes/tree
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)

**Body:**
```json
{
  "targetFolderId": 123,
  "isChatIA": true,
  "description": "Descripción opcional"
}
```

**Descripción:** Crea una estructura completa de carpetas virtuales basada en una carpeta real.

---

### **5. CONVERSATIONS (Chat con IA)** ✅ **IMPLEMENTADO**

#### **5.1. Obtener conversación por ID**
```http
GET /api/v2/repository/conversations/:conversationId
```

**Parámetros:**
- `conversationId` (number): ID de la conversación

**Respuesta:** Conversación con todos sus mensajes

---

#### **5.2. Obtener conversaciones por sociedad**
```http
GET /api/v2/repository/society-profile/:structureId/conversations
```

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)

**Query params:**
- `page` (number, opcional): Número de página
- `limit` (number, opcional): Límite de resultados

**Respuesta:** Lista paginada de conversaciones

---

#### **5.3. Crear conversación**
```http
POST /api/v2/repository/conversations/virtual-nodes/:virtualNodeId
```

**Parámetros:**
- `virtualNodeId` (number): ID de la carpeta virtual (debe tener `isChatIA: true`)

**Respuesta:** Conversación creada

**Ejemplo:**
```typescript
// Crear conversación para una carpeta virtual con chat IA
const response = await fetch(
  `/api/v2/repository/conversations/virtual-nodes/${virtualNodeId}`,
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  }
);
const { data: conversation } = await response.json();
const conversationId = conversation.id;
```

---

#### **5.4. Enviar mensaje a conversación (Streaming)**
```http
POST /api/v2/repository/conversations/:conversationId/message
```

**Parámetros:**
- `conversationId` (number): ID de la conversación

**Body:**
```json
{
  "message": "¿Qué documentos tengo en esta carpeta?"
}
```

**Respuesta:** Server-Sent Events (SSE) stream con la respuesta de la IA

**Ejemplo:**
```typescript
// Enviar mensaje y recibir respuesta por streaming
const eventSource = new EventSource(
  `/api/v2/repository/conversations/${conversationId}/message`,
  {
    headers: { 'Authorization': `Bearer ${token}` },
  }
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Respuesta de IA:', data);
};

// Enviar mensaje
await fetch(
  `/api/v2/repository/conversations/${conversationId}/message`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: '¿Qué documentos tengo en esta carpeta?',
    }),
  }
);
```

---

## 🚨 ENDPOINTS V2 QUE FALTAN ❌

### **1. DOWNLOADS (Descargar Documentos)**

**Faltan:**
- `GET /api/v2/repository/nodes/:nodeId/download` - Descargar documento
- `GET /api/v2/repository/documents/:documentCode/versions/:versionNumber/download` - Descargar versión específica

**Estado:** ⏳ **PENDIENTE** - Usar endpoints V1 por ahora o implementar V2

---

### **2. DOCUMENTS (Gestión de Documentos)**

**Faltan:**
- `GET /api/v2/repository/society-profile/:structureId/documents/storage` - Obtener uso de almacenamiento
- `GET /api/v2/repository/documents/search` - Búsqueda semántica
- `GET /api/v2/repository/documents/match-search` - Búsqueda por coincidencia
- `PATCH /api/v2/repository/documents/:documentCode/versions/:versionNumber/revert` - Revertir versión

**Estado:** ⏳ **PENDIENTE** - Usar endpoints V1 por ahora o implementar V2

---

## 📁 ESTRUCTURA DE CARPETAS Y CÓMO USARLAS

### **1. Documentos Generados**

**Ruta:** `/core/documentos-generados/`

**Cómo obtener el folderId:**
```typescript
// 1. Obtener nodos core
const coreResponse = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/core`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const { data: coreNodes } = await coreResponse.json();

// 2. Buscar carpeta "documentos-generados"
const documentosGeneradosFolder = coreNodes.find(
  node => node.name === 'documentos-generados'
);

// 3. Si no existe, crearla
if (!documentosGeneradosFolder) {
  const coreFolder = coreNodes.find(node => node.name === 'core');
  const createResponse = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/${coreFolder.id}/folder`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'documentos-generados',
        description: 'Documentos generados automáticamente',
      }),
    }
  );
  const { data } = await createResponse.json();
  const folderId = data.id;
} else {
  const folderId = documentosGeneradosFolder.id;
}

// 4. Subir documentos
const formData = new FormData();
formData.append('file', fileBlob, 'documento.pdf');

await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-file-size': fileBlob.size.toString(),
    },
    body: formData,
  }
);
```

---

### **2. Registros/Sociedades/Acciones**

**Ruta:** `/core/registros/sociedades/acciones/`

**Cómo crear la estructura:**
```typescript
// 1. Obtener carpeta core
const coreResponse = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/core`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const { data: coreNodes } = await coreResponse.json();
const coreFolder = coreNodes.find(node => node.name === 'core');

// 2. Crear carpeta "registros" si no existe
let registrosFolder = coreNodes.find(node => node.name === 'registros');
if (!registrosFolder) {
  const createRegistros = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/${coreFolder.id}/folder`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'registros' }),
    }
  );
  const { data } = await createRegistros.json();
  registrosFolder = data;
}

// 3. Crear carpeta "sociedades" dentro de "registros"
// (similar proceso)

// 4. Crear carpeta "acciones" dentro de "sociedades"
// (similar proceso)

// 5. Subir documentos a la carpeta final
```

---

### **3. Registros/Sociedades/Acuerdos**

**Ruta:** `/core/registros/sociedades/acuerdos/`

**Proceso:** Similar al anterior, pero creando carpeta "acuerdos" en lugar de "acciones".

---

### **4. Operaciones/Juntas/Junta 24-12-2024**

**Ruta:** `/core/juntas/{flowId}/` (o `/core/operaciones/juntas/junta-24-12-2024/` si prefieres otra estructura)

**Cómo usar:**
```typescript
// Opción 1: Usar el endpoint específico de juntas (RECOMENDADO)
const folderResponse = await fetch(
  `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const { data: folder } = await folderResponse.json();
const folderId = folder.id;

// Opción 2: Crear estructura personalizada
// Si quieres `/core/operaciones/juntas/junta-24-12-2024/`:
// 1. Crear carpeta "operaciones" en core
// 2. Crear carpeta "juntas" en operaciones
// 3. Crear carpeta "junta-24-12-2024" en juntas
// 4. Usar ese folderId para subir documentos
```

---

## 🔄 MAPEO AUTOMÁTICO

### **Cómo Funciona**

El backend maneja automáticamente el mapeo de IDs:

1. **Frontend envía:** `structureId` (number de V2)
2. **Backend recibe:** `structureId`
3. **Backend mapea:** `structureId` → `societyId` (number de V1) usando `SocietyV2MapperService`
4. **Backend usa:** `societyId` (V1) para todas las operaciones del repositorio

**Todo es transparente para el frontend.** Solo envía `structureId` y el backend maneja el resto.

---

## ⚠️ CARPETAS PERSONALIZADAS Y CHAT IA

### **Estado Actual**

**❌ NO IMPLEMENTADO EN V2:** Los endpoints para Virtual Nodes (carpetas personalizadas) y Conversations (chat IA) **NO están migrados a V2**.

### **Qué Hacer**

**Opción 1: Usar endpoints V1 temporalmente** (NO RECOMENDADO)
- Puedes usar los endpoints V1, pero necesitarías mapear `structureId` → `societyId` en el frontend
- No es ideal porque mezclas V1 y V2

**Opción 2: Implementar endpoints V2** (RECOMENDADO) ✅
- Crear controllers V2 para Virtual Nodes
- Crear controllers V2 para Conversations
- Usar los mismos use cases de V1 pero con mapeo automático

### **Endpoints que Necesitas para Carpetas Personalizadas**

```typescript
// Virtual Nodes V2 (FALTAN)
GET    /api/v2/repository/society-profile/:structureId/virtual-nodes
POST   /api/v2/repository/society-profile/:structureId/virtual-nodes
GET    /api/v2/repository/virtual-nodes/:virtualNodeId
POST   /api/v2/repository/virtual-nodes/:virtualNodeId
POST   /api/v2/repository/virtual-nodes/:virtualNodeId/documents
PATCH  /api/v2/repository/virtual-nodes/:virtualNodeId
DELETE /api/v2/repository/virtual-nodes/:virtualNodeId
POST   /api/v2/repository/virtual-nodes/:virtualNodeId/permissions
DELETE /api/v2/repository/virtual-nodes/:virtualNodeId/permissions/:userId
GET    /api/v2/repository/virtual-nodes/:virtualNodeId/users

// Conversations V2 (FALTAN)
GET    /api/v2/repository/society-profile/:structureId/conversations
GET    /api/v2/repository/conversations/:conversationId
POST   /api/v2/repository/virtual-nodes/:virtualNodeId/conversations
POST   /api/v2/repository/conversations/:conversationId/messages
```

---

## ✅ RESUMEN: QUÉ ESTÁ LISTO Y QUÉ FALTA

### **✅ IMPLEMENTADO (Listo para usar)**

1. ✅ **Uploads V2** - Subir documentos
2. ✅ **Nodes V2** - Gestión de nodos/carpetas
3. ✅ **Juntas V2** - Endpoints específicos para juntas
4. ✅ **Virtual Nodes V2** - Carpetas personalizadas con chat IA ⭐ **NUEVO**
5. ✅ **Conversations V2** - Chat con IA ⭐ **NUEVO**

### **❌ FALTA IMPLEMENTAR**

1. ❌ **Downloads V2** - Descargar documentos (Prioridad MEDIA)
2. ❌ **Documents V2** - Gestión de documentos (búsqueda, versiones, etc.) (Prioridad BAJA)

---

## 🚀 PRÓXIMOS PASOS RECOMENDADOS

1. ✅ **Virtual Nodes V2** - **COMPLETADO**
2. ✅ **Conversations V2** - **COMPLETADO**
3. **Implementar Downloads V2** (Prioridad MEDIA)
   - Útil pero puedes usar V1 temporalmente
4. **Implementar Documents V2** (Prioridad BAJA)
   - Puedes usar V1 temporalmente

---

## 📝 NOTAS IMPORTANTES

1. **V1 sigue funcionando:** Todos los endpoints V1 siguen funcionando para el frontend 2.5.

2. **Mapeo automático:** El frontend V3 solo necesita enviar `structureId`, el backend maneja el resto.

3. **Carpetas personalizadas:** Actualmente NO están disponibles en V2. Necesitas implementar Virtual Nodes V2.

4. **Chat IA:** Actualmente NO está disponible en V2. Necesitas implementar Conversations V2.

5. **Estructura de carpetas:** Puedes crear cualquier estructura de carpetas usando los endpoints de Nodes V2.

---

**¿Quieres que implemente los endpoints V2 que faltan?** Solo avísame y los creo siguiendo el mismo patrón. 🙏

