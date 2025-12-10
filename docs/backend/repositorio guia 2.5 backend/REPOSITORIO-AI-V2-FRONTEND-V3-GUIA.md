# 📚 Repositorio AI V2 - Guía de Integración Frontend V3

**Versión:** 2.0  
**Fecha:** 2025-01-XX  
**Estado:** ✅ **100% Implementado** - Listo para producción

---

## 📋 ÍNDICE

1. [Configuración Base](#configuracion-base)
2. [Autenticación](#autenticacion)
3. [Endpoints Completos](#endpoints-completos)
4. [Estructura de Respuestas](#estructura-respuestas)
5. [Ejemplos de Uso](#ejemplos-uso)
6. [Manejo de Errores](#manejo-errores)
7. [Tipos TypeScript](#tipos-typescript)

---

## 1️⃣ <a id="configuracion-base"></a>CONFIGURACIÓN BASE

### **Base URL**

```typescript
const BASE_URL = '/api/v2/repository/society-profile';
```

### **Headers Requeridos**

```typescript
const headers = {
  'Authorization': `Bearer ${token}`, // Token JWT V2 (UUID)
  'Content-Type': 'application/json', // Para requests JSON
  // Para uploads:
  'x-file-size': file.size.toString(), // Tamaño del archivo en bytes
  'Content-Type': 'multipart/form-data', // Para FormData
};
```

### **Estructura de Parámetros**

- **`structureId`**: ID numérico de la estructura de la sociedad (V2)
- **`nodeId`**: ID numérico del nodo (archivo/carpeta)
- **`documentCode`**: UUID del documento
- **`versionCode`**: UUID de la versión del documento
- **`virtualNodeId`**: ID numérico del nodo virtual (carpeta personalizada)

---

## 2️⃣ <a id="autenticacion"></a>AUTENTICACIÓN

### **Token V2**

El frontend V3 debe usar tokens JWT V2 que contienen:
- `userId`: UUID del usuario (V2)
- `email`: Email del usuario

### **Mapeo Automático**

El backend realiza mapeo automático:
- `userId` (V2 UUID) → `userId` (V1 number)
- `structureId` (V2) → `societyId` (V1)

**No necesitas hacer mapeo en el frontend**, el backend lo maneja automáticamente.

---

## 3️⃣ <a id="endpoints-completos"></a>ENDPOINTS COMPLETOS

### **A. ARCHIVOS Y CARPETAS**

#### **1. Subir Archivo**

```typescript
POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/documents
Content-Type: multipart/form-data
x-file-size: {fileSize}
Authorization: Bearer {token}

Body: FormData
  - {uuid}: File
```

**Ejemplo:**

```typescript
const uploadFile = async (
  structureId: number,
  parentNodeId: number,
  file: File
): Promise<UploadFileResponse> => {
  const formData = new FormData();
  const fileFieldUUID = crypto.randomUUID();
  formData.append(fileFieldUUID, file);

  const response = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/documents`,
    {
      method: 'POST',
      headers: {
        'x-file-size': file.size.toString(),
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return response.json();
};
```

**Response:**

```typescript
{
  success: true,
  message: "Documentos cargados y creados correctamente.",
  code: 201,
  data: {
    node: {
      id: number,
      name: string,
      parentId: number,
      type: 0, // 0 = documento
      code: string, // UUID
      // ... más campos
    },
    documentVersion: {
      id: number,
      versionCode: string, // UUID
      versionNumber: number,
      title: string,
      mimeType: string,
      sizeInBytes: number,
      // ... más campos
    }
  }
}
```

---

#### **2. Subir Múltiples Archivos**

```typescript
POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/core?name={folderName}
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body: FormData
  - {fileSize1}: File1
  - {fileSize2}: File2
  - ...
```

**Ejemplo:**

```typescript
const uploadMultipleFiles = async (
  structureId: number,
  parentNodeId: number,
  files: File[],
  folderName?: string
): Promise<UploadFilesResponse> => {
  const formData = new FormData();
  
  for (const file of files) {
    formData.append(file.size.toString(), file, file.name);
  }

  const url = `/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/core`;
  const params = folderName ? `?name=${encodeURIComponent(folderName)}` : '';

  const response = await fetch(`${url}${params}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

---

#### **3. Obtener Nodo (Archivo/Carpeta)**

```typescript
GET /api/v2/repository/nodes/{nodeId}
Authorization: Bearer {token}
```

**Ejemplo:**

```typescript
const getNode = async (nodeId: number): Promise<NodeResponse> => {
  const response = await fetch(
    `/api/v2/repository/nodes/${nodeId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
```

**Response:**

```typescript
{
  success: true,
  message: "Node retrieved successfully",
  code: 200,
  data: {
    id: number,
    name: string,
    type: 0 | 1, // 0 = documento, 1 = carpeta
    code: string, // UUID
    parentId: number | null,
    path: string,
    // Si es documento:
    documentVersions?: Array<{
      versionCode: string,
      title: string,
      sizeInBytes: number,
      mimeType: string,
      createdAt: string,
      // ... más campos
    }>,
    // Si es carpeta:
    children?: NodeResponse[],
  }
}
```

---

#### **4. Actualizar Nodo (Renombrar/Editar Metadata)**

```typescript
PATCH /api/v2/repository/nodes/{nodeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name?: string,
  description?: string,
  parentId?: number, // Para mover archivo/carpeta
}
```

**Ejemplo:**

```typescript
const updateNode = async (
  nodeId: number,
  updates: {
    name?: string;
    description?: string;
    parentId?: number;
  }
): Promise<NodeResponse> => {
  const response = await fetch(
    `/api/v2/repository/nodes/${nodeId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    }
  );

  return response.json();
};
```

---

#### **5. Eliminar Nodo**

```typescript
DELETE /api/v2/repository/nodes/{nodeId}
Authorization: Bearer {token}
```

**Ejemplo:**

```typescript
const deleteNode = async (nodeId: number): Promise<void> => {
  const response = await fetch(
    `/api/v2/repository/nodes/${nodeId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 204) {
    throw new Error('Error al eliminar nodo');
  }
};
```

---

#### **6. Crear Carpeta**

```typescript
POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/folder
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name: string,
  description?: string
}
```

**Ejemplo:**

```typescript
const createFolder = async (
  structureId: number,
  parentNodeId: number,
  name: string,
  description?: string
): Promise<FolderResponse> => {
  const response = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/folder`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    }
  );

  return response.json();
};
```

---

#### **7. Descargar Carpeta como ZIP**

```typescript
GET /api/v2/repository/nodes/{nodeId}/download-zip
Authorization: Bearer {token}
Response-Type: blob
```

**Ejemplo:**

```typescript
const downloadFolderZip = async (
  nodeId: number,
  folderName: string
): Promise<void> => {
  const response = await fetch(
    `/api/v2/repository/nodes/${nodeId}/download-zip`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${folderName}.zip`;
  link.click();
  window.URL.revokeObjectURL(url);
};
```

---

### **B. VERSIONES DE DOCUMENTOS**

#### **8. Subir Nueva Versión**

```typescript
POST /api/v2/repository/documents/{documentCode}/versions
Content-Type: multipart/form-data
x-file-size: {fileSize}
Authorization: Bearer {token}

Body: FormData
  - {uuid}: File
```

**Ejemplo:**

```typescript
const uploadNewVersion = async (
  documentCode: string,
  file: File
): Promise<VersionResponse> => {
  const formData = new FormData();
  const fileFieldUUID = crypto.randomUUID();
  formData.append(fileFieldUUID, file);

  const response = await fetch(
    `/api/v2/repository/documents/${documentCode}/versions`,
    {
      method: 'POST',
      headers: {
        'x-file-size': file.size.toString(),
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return response.json();
};
```

---

#### **9. Descargar Versión**

```typescript
GET /api/v2/repository/documents/versions/{versionCode}/download
Authorization: Bearer {token}
Response-Type: blob
```

**Ejemplo:**

```typescript
const downloadVersion = async (
  versionCode: string,
  fileName: string
): Promise<void> => {
  const response = await fetch(
    `/api/v2/repository/documents/versions/${versionCode}/download`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};
```

---

#### **10. Restaurar Versión**

```typescript
POST /api/v2/repository/documents/{documentCode}/versions/{versionCode}/restore
Content-Type: application/json
Authorization: Bearer {token}
```

**Ejemplo:**

```typescript
const restoreVersion = async (
  documentCode: string,
  versionCode: string
): Promise<VersionResponse> => {
  const response = await fetch(
    `/api/v2/repository/documents/${documentCode}/versions/${versionCode}/restore`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
```

**Response:**

```typescript
{
  success: true,
  code: 200,
  message: "reversion properly made",
  data: {
    versionCode: string, // UUID de la nueva versión creada
    documentCode: string,
    userId: number,
    mimeType: string,
    sizeInBytes: number,
    createdAt: string,
    updatedAt: string,
    title: string,
  }
}
```

---

### **C. BÚSQUEDA**

#### **11. Búsqueda Simple (Match)**

```typescript
GET /api/v2/repository/society-profile/{structureId}/documents/search?search={query}&page=1&limit=10&order=name&sort=asc&mimeType={mimeType}
Authorization: Bearer {token}
```

**Query Parameters:**

- `search` (opcional): Texto para búsqueda parcial en título
- `page` (opcional, default: 1): Número de página
- `limit` (opcional, default: 20, max: 100): Resultados por página
- `order` (opcional, default: 'createdAt'): Campo para ordenar ('name' | 'createdAt')
- `sort` (opcional, default: 'desc'): Dirección ('asc' | 'desc')
- `mimeType` (opcional): Filtrar por tipo MIME (ej: 'application/pdf')
- `updatedFrom` (opcional): Fecha desde (ISO 8601)
- `updatedTo` (opcional): Fecha hasta (ISO 8601)

**Ejemplo:**

```typescript
const searchDocuments = async (
  structureId: number,
  params: {
    search?: string;
    page?: number;
    limit?: number;
    order?: 'name' | 'createdAt';
    sort?: 'asc' | 'desc';
    mimeType?: string;
    updatedFrom?: string;
    updatedTo?: string;
  }
): Promise<SearchResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.order) queryParams.append('order', params.order);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.mimeType) queryParams.append('mimeType', params.mimeType);
  if (params.updatedFrom) queryParams.append('updatedFrom', params.updatedFrom);
  if (params.updatedTo) queryParams.append('updatedTo', params.updatedTo);

  const response = await fetch(
    `/api/v2/repository/society-profile/${structureId}/documents/search?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
```

**Response:**

```typescript
{
  success: true,
  code: 200,
  message: "Search completed successfully",
  data: Array<{
    versionCode: string,
    documentCode: string,
    userId: number,
    mimeType: string,
    sizeInBytes: number,
    createdAt: string,
    updatedAt: string,
    title: string,
    proximity: number | null, // null para búsqueda match
    user: {
      id: number,
      email: string
    },
    node: {
      id: number,
      code: string,
      name: string,
      parentId: number | null,
      path: string,
      type: 0 | 1,
      createdAt: string,
      updatedAt: string
    }
  }>,
  pagination: {
    total: number,
    page: number,
    perPage: number,
    totalPages: number
  }
}
```

---

#### **12. Búsqueda Semántica (IA)**

```typescript
POST /api/v2/repository/society-profile/{structureId}/documents/search
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  semanticInput?: string,
  searchID?: string, // Para reutilizar búsqueda anterior
  filters?: {
    page: number,
    limit: number,
    scopedFolderNodeID?: number,
    mimeType?: string
  }
}
```

**Ejemplo:**

```typescript
const semanticSearch = async (
  structureId: number,
  params: {
    semanticInput?: string;
    searchID?: string;
    filters?: {
      page?: number;
      limit?: number;
      scopedFolderNodeID?: number;
      mimeType?: string;
    };
  }
): Promise<SemanticSearchResponse> => {
  const response = await fetch(
    `/api/v2/repository/society-profile/${structureId}/documents/search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        semanticInput: params.semanticInput,
        searchID: params.searchID,
        filters: {
          page: params.filters?.page || 1,
          limit: params.filters?.limit || 20,
          scopedFolderNodeID: params.filters?.scopedFolderNodeID,
          mimeType: params.filters?.mimeType,
        },
      }),
    }
  );

  return response.json();
};
```

**Response:**

```typescript
{
  success: true,
  code: 200,
  message: "Semantic search completed successfully",
  data: {
    searchId: string, // UUID para reutilizar la búsqueda
    documents: Array<{
      versionCode: string,
      documentCode: string,
      proximity: number, // 0-1, más alto = más relevante
      // ... mismos campos que búsqueda match
    }>
  },
  pagination: {
    total: number,
    page: number,
    perPage: number,
    totalPages: number
  }
}
```

---

### **D. ALMACENAMIENTO**

#### **13. Ver Uso de Almacenamiento**

```typescript
GET /api/v2/repository/society-profile/{structureId}/documents/storage-usage
Authorization: Bearer {token}
```

**Ejemplo:**

```typescript
const getStorageUsage = async (
  structureId: number
): Promise<StorageUsageResponse> => {
  const response = await fetch(
    `/api/v2/repository/society-profile/${structureId}/documents/storage-usage`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
```

**Response:**

```typescript
{
  success: true,
  code: 200,
  message: "Storage usage for the society provided",
  data: {
    societyId: number,
    limitInBytes: number,
    currentUsedInBytes: number,
    currentDocumentCount: number,
    summaries: Array<{
      mimeType: string,
      currentCount: number,
      currentSizeInBytes: number
    }>,
    expireAt: string | null
  }
}
```

---

### **E. CARPETAS PERSONALIZADAS (Virtual Nodes)**

#### **14. Crear Carpeta Personalizada Raíz**

```typescript
POST /api/v2/repository/society-profile/{structureId}/virtual-nodes
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name: string,
  description?: string,
  isChatIA?: boolean,
  isHidden?: boolean
}
```

**Ejemplo:**

```typescript
const createVirtualFolder = async (
  structureId: number,
  params: {
    name: string;
    description?: string;
    isChatIA?: boolean;
    isHidden?: boolean;
  }
): Promise<VirtualFolderResponse> => {
  const response = await fetch(
    `/api/v2/repository/society-profile/${structureId}/virtual-nodes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    }
  );

  return response.json();
};
```

---

#### **15. Crear Carpeta Personalizada Hija**

```typescript
POST /api/v2/repository/virtual-nodes/{virtualNodeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name: string,
  description?: string,
  isHidden?: boolean
}
```

---

#### **16. Listar Carpetas Personalizadas Raíz**

```typescript
GET /api/v2/repository/society-profile/{structureId}/virtual-nodes
Authorization: Bearer {token}
```

---

#### **17. Obtener Carpeta Personalizada**

```typescript
GET /api/v2/repository/virtual-nodes/{virtualNodeId}
Authorization: Bearer {token}
```

---

#### **18. Actualizar Carpeta Personalizada**

```typescript
PATCH /api/v2/repository/virtual-nodes/{virtualNodeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name?: string,
  description?: string,
  isChatIA?: boolean
}
```

---

#### **19. Eliminar Carpeta Personalizada**

```typescript
DELETE /api/v2/repository/virtual-nodes/{virtualNodeId}
Authorization: Bearer {token}
```

---

#### **20. Linkear Documento a Carpeta Personalizada**

```typescript
POST /api/v2/repository/virtual-nodes/{virtualNodeId}/nodes/{documentNodeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  description?: string
}
```

**Ejemplo:**

```typescript
const linkDocumentToVirtualFolder = async (
  virtualNodeId: number,
  documentNodeId: number,
  description?: string
): Promise<void> => {
  const response = await fetch(
    `/api/v2/repository/virtual-nodes/${virtualNodeId}/nodes/${documentNodeId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ description }),
    }
  );

  if (!response.ok) {
    throw new Error('Error al linkear documento');
  }
};
```

---

### **F. PERMISOS Y COMPARTIR**

#### **21. Crear Permiso (Compartir Carpeta)**

```typescript
POST /api/v2/repository/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  expireAt?: string // ISO 8601 date (opcional)
}
```

**Ejemplo:**

```typescript
const shareFolder = async (
  virtualNodeId: number,
  userAssigneeId: number,
  expireAt?: Date
): Promise<void> => {
  const response = await fetch(
    `/api/v2/repository/virtual-nodes/${virtualNodeId}/users/${userAssigneeId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        expireAt: expireAt?.toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Error al compartir carpeta');
  }
};
```

---

#### **22. Listar Usuarios con Acceso**

```typescript
GET /api/v2/repository/virtual-nodes/{virtualNodeId}/users
Authorization: Bearer {token}
```

**Ejemplo:**

```typescript
const getUsersWithAccess = async (
  virtualNodeId: number
): Promise<UsersWithAccessResponse> => {
  const response = await fetch(
    `/api/v2/repository/virtual-nodes/${virtualNodeId}/users`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
```

**Response:**

```typescript
{
  success: true,
  code: 200,
  message: "Users retrieved successfully",
  data: Array<{
    id: string,
    userId: string,
    email: string,
    expireAt: string | null,
    daysRemaining: number | null
  }>
}
```

---

#### **23. Eliminar Permiso (Dejar de Compartir)**

```typescript
DELETE /api/v2/repository/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}
Authorization: Bearer {token}
```

**Ejemplo:**

```typescript
const removeAccess = async (
  virtualNodeId: number,
  userAssigneeId: number
): Promise<void> => {
  const response = await fetch(
    `/api/v2/repository/virtual-nodes/${virtualNodeId}/users/${userAssigneeId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 204) {
    throw new Error('Error al remover acceso');
  }
};
```

---

### **G. NAVEGACIÓN**

#### **24. Obtener Nodos Raíz**

```typescript
GET /api/v2/repository/society-profile/{structureId}/nodes/root
Authorization: Bearer {token}
```

**Ejemplo:**

```typescript
const getRootNodes = async (
  structureId: number
): Promise<RootNodesResponse> => {
  const response = await fetch(
    `/api/v2/repository/society-profile/${structureId}/nodes/root`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
```

---

#### **25. Obtener Nodos Core**

```typescript
GET /api/v2/repository/society-profile/{structureId}/nodes/core
Authorization: Bearer {token}
```

---

### **H. PREVIEW**

#### **26. Subir Preview de Documento**

```typescript
PUT /api/v2/repository/nodes/{nodeCode}/preview
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body: FormData
  - preview: File (máx 256 KB)
```

---

#### **27. Descargar Preview**

```typescript
GET /api/v2/repository/nodes/{nodeCode}/preview
Authorization: Bearer {token}
Response-Type: blob
```

---

## 4️⃣ <a id="estructura-respuestas"></a>ESTRUCTURA DE RESPUESTAS

### **Respuesta Estándar**

Todas las respuestas siguen este formato:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: number;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
```

### **Códigos de Estado HTTP**

- `200` - OK (GET, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 5️⃣ <a id="ejemplos-uso"></a>EJEMPLOS DE USO COMPLETOS

### **Ejemplo 1: Subir y Organizar Documentos**

```typescript
// 1. Crear carpeta
const folder = await createFolder(
  structureId,
  parentNodeId,
  'Documentos Legales 2025'
);

// 2. Subir archivo a la carpeta
const document = await uploadFile(
  structureId,
  folder.data.id,
  file
);

// 3. Subir nueva versión del documento
const newVersion = await uploadNewVersion(
  document.data.node.code,
  updatedFile
);

// 4. Descargar la versión anterior
await downloadVersion(
  oldVersionCode,
  'documento-anterior.pdf'
);
```

---

### **Ejemplo 2: Búsqueda y Filtrado**

```typescript
// Búsqueda simple
const simpleResults = await searchDocuments(structureId, {
  search: 'contrato',
  page: 1,
  limit: 20,
  order: 'createdAt',
  sort: 'desc',
  mimeType: 'application/pdf',
});

// Búsqueda semántica
const semanticResults = await semanticSearch(structureId, {
  semanticInput: 'documentos relacionados con arrendamiento comercial',
  filters: {
    page: 1,
    limit: 10,
    mimeType: 'application/pdf',
  },
});

// Reutilizar búsqueda anterior (más rápido)
const cachedResults = await semanticSearch(structureId, {
  searchID: semanticResults.data.searchId,
  filters: {
    page: 2, // Siguiente página
    limit: 10,
  },
});
```

---

### **Ejemplo 3: Carpetas Personalizadas y Compartir**

```typescript
// 1. Crear carpeta personalizada
const virtualFolder = await createVirtualFolder(structureId, {
  name: 'Proyecto Alpha',
  description: 'Documentos del proyecto Alpha',
  isChatIA: true,
  isHidden: false,
});

// 2. Linkear documentos existentes
await linkDocumentToVirtualFolder(
  virtualFolder.data.id,
  documentNodeId1
);
await linkDocumentToVirtualFolder(
  virtualFolder.data.id,
  documentNodeId2
);

// 3. Compartir con otros usuarios
await shareFolder(
  virtualFolder.data.id,
  otherUserId,
  new Date('2025-12-31') // Expira el 31 de diciembre
);

// 4. Ver quién tiene acceso
const users = await getUsersWithAccess(virtualFolder.data.id);

// 5. Remover acceso
await removeAccess(virtualFolder.data.id, otherUserId);
```

---

### **Ejemplo 4: Gestión de Versiones**

```typescript
// 1. Obtener documento con todas sus versiones
const node = await getNode(documentNodeId);
const versions = node.data.documentVersions || [];

// 2. Ver versión actual (primera en el array)
const currentVersion = versions[0];

// 3. Restaurar versión anterior
const restoredVersion = await restoreVersion(
  node.data.code,
  oldVersion.versionCode
);

// 4. Descargar versión específica
await downloadVersion(
  restoredVersion.data.versionCode,
  'documento-restaurado.pdf'
);
```

---

## 6️⃣ <a id="manejo-errores"></a>MANEJO DE ERRORES

### **Estructura de Error**

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  code: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
```

### **Ejemplo de Manejo**

```typescript
const handleApiCall = async <T>(
  apiCall: () => Promise<Response>
): Promise<T> => {
  try {
    const response = await apiCall();

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.message, error.code, error.errors);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new ApiError(data.message, data.code);
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Error de red', 0);
  }
};

class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### **Errores Comunes**

| Código | Mensaje | Solución |
|--------|---------|----------|
| `400` | Invalid file size provided | Verificar header `x-file-size` |
| `400` | Invalid documentCode provided | Verificar que el UUID sea válido |
| `401` | Unauthorized access | Verificar token JWT |
| `403` | Access denied | Usuario no tiene permisos |
| `404` | Document not found | Verificar que el documento exista |
| `409` | fileIdentifier property is already taken | UUID de archivo duplicado |

---

## 7️⃣ <a id="tipos-typescript"></a>TIPOS TYPESCRIPT

### **Tipos Principales**

```typescript
// Node Types
type NodeType = 0 | 1; // 0 = documento, 1 = carpeta

interface Node {
  id: number;
  name: string;
  type: NodeType;
  code: string; // UUID
  parentId: number | null;
  path: string;
  createdAt: string;
  updatedAt: string;
  documentVersions?: DocumentVersion[];
  children?: Node[];
}

interface DocumentVersion {
  versionCode: string; // UUID
  documentCode: string; // UUID
  versionNumber: number;
  title: string;
  mimeType: string;
  sizeInBytes: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    id: number;
    email: string;
  };
}

interface VirtualFolder {
  id: number;
  name: string;
  description: string | null;
  isChatIA: boolean;
  isHidden: boolean;
  owner: {
    id: string; // UUID
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface StorageUsage {
  societyId: number;
  limitInBytes: number;
  currentUsedInBytes: number;
  currentDocumentCount: number;
  summaries: Array<{
    mimeType: string;
    currentCount: number;
    currentSizeInBytes: number;
  }>;
  expireAt: string | null;
}

interface SearchResult {
  versionCode: string;
  documentCode: string;
  title: string;
  mimeType: string;
  sizeInBytes: number;
  proximity: number | null; // null para match, 0-1 para semántica
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    email: string;
  };
  node: {
    id: number;
    code: string;
    name: string;
    path: string;
    type: NodeType;
  };
}
```

---

## 8️⃣ <a id="guia-integracion"></a>GUÍA DE INTEGRACIÓN PASO A PASO

### **Paso 1: Configurar Cliente HTTP**

```typescript
// src/infrastructure/http/repository-client.ts
export class RepositoryClient {
  private baseUrl = '/api/v2/repository';
  
  constructor(private token: string) {}

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }

    return response.json();
  }

  // Métodos para cada endpoint...
}
```

---

### **Paso 2: Crear Composable (Nuxt 4)**

```typescript
// composables/useRepository.ts
export const useRepository = () => {
  const { token } = useAuth();
  const route = useRoute();
  const structureId = computed(() => 
    Number(route.params.structureId)
  );

  const client = new RepositoryClient(token.value);

  const uploadFile = async (
    parentNodeId: number,
    file: File
  ) => {
    return client.uploadFile(structureId.value, parentNodeId, file);
  };

  const getNode = async (nodeId: number) => {
    return client.getNode(nodeId);
  };

  const searchDocuments = async (params: SearchParams) => {
    return client.searchDocuments(structureId.value, params);
  };

  // ... más métodos

  return {
    structureId,
    uploadFile,
    getNode,
    searchDocuments,
    // ... más métodos
  };
};
```

---

### **Paso 3: Usar en Componentes**

```vue
<script setup lang="ts">
const { uploadFile, getNode } = useRepository();
const isUploading = ref(false);

const handleFileUpload = async (file: File) => {
  try {
    isUploading.value = true;
    const result = await uploadFile(parentNodeId.value, file);
    toast.success('Archivo subido correctamente');
    await refreshFiles();
  } catch (error) {
    toast.error('Error al subir archivo');
  } finally {
    isUploading.value = false;
  }
};
</script>
```

---

## 9️⃣ <a id="checklist-integracion"></a>CHECKLIST DE INTEGRACIÓN

### **Pre-requisitos**

- [ ] Token JWT V2 configurado
- [ ] `structureId` disponible en el contexto
- [ ] Cliente HTTP configurado con base URL correcta
- [ ] Manejo de errores implementado

### **Endpoints a Integrar**

- [ ] Archivos: Subir, obtener, actualizar, eliminar
- [ ] Carpetas: Crear, obtener, actualizar, eliminar
- [ ] Versiones: Subir, descargar, restaurar
- [ ] Búsqueda: Simple y semántica
- [ ] Almacenamiento: Ver uso
- [ ] Carpetas Personalizadas: CRUD completo
- [ ] Permisos: Crear, listar, eliminar

---

## 🔟 <a id="notas-importantes"></a>NOTAS IMPORTANTES

### **Diferencias V1 vs V2**

1. **Rutas:**
   - V1: `/v1/repository/society/{societyId}`
   - V2: `/v2/repository/society-profile/{structureId}`

2. **Autenticación:**
   - V1: `userId` (number)
   - V2: `userId` (UUID)

3. **Parámetros:**
   - V1: `societyId` (number)
   - V2: `structureId` (number)

### **Mejores Prácticas**

1. **Cache de Búsquedas Semánticas:**
   - Guarda el `searchId` para reutilizar búsquedas
   - Reduce costos de embedding

2. **Paginación:**
   - Usa límites razonables (10-20 por página)
   - Implementa scroll infinito o paginación

3. **Uploads:**
   - Valida tamaño antes de subir
   - Muestra progreso para archivos grandes
   - Maneja cancelación de uploads

4. **Errores:**
   - Muestra mensajes amigables al usuario
   - Log errores para debugging
   - Implementa retry para errores de red

---

## ✅ RESUMEN

**Estado:** ✅ **100% Implementado**  
**Endpoints V2:** 26/26 funcionalidades  
**Listo para:** Frontend V3 (Nuxt 4)

**Base URL:** `/api/v2/repository/society-profile/{structureId}`

**Autenticación:** `Authorization: Bearer {token}` (JWT V2)

**Documentación Swagger:** Disponible en `/api/docs` (Swagger UI)

---

**¡Listo para integrar, mi rey!** 🚀💪

