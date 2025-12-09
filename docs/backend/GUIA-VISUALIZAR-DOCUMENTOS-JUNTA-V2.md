# Guía: Cómo Visualizar Documentos de una Junta (V2)

## Resumen de Endpoints Disponibles

Después de subir documentos a una carpeta de junta, puedes usar los siguientes endpoints para visualizarlos:

### 1. Obtener un Nodo por ID (incluye hijos si es carpeta)

**Endpoint:** `GET /api/v2/repository/society-profile/nodes/:nodeId`

**Descripción:** Obtiene un nodo específico. Si es una carpeta, incluye sus hijos (documentos y subcarpetas).

**Parámetros:**
- `nodeId` (number): ID del nodo a obtener

**Ejemplo:**
```javascript
// Obtener la carpeta de documentos que acabas de crear
const folderId = 29; // ID de la carpeta "documentos juntas: 8 de diciembre de 2025-2025-12-09T04-33-20"

const response = await fetch(
  `/api/v2/repository/society-profile/nodes/${folderId}`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);

const result = await response.json();
// result.data.children contiene los documentos dentro de la carpeta
```

**Respuesta (carpeta con hijos):**
```json
{
  "success": true,
  "message": "Node retrieved successfully",
  "code": 200,
  "data": {
    "id": 29,
    "code": "bcc10cf9-9b21-43ac-b4bf-fd652ac0bc69",
    "societyId": 1,
    "parentId": 26,
    "name": "documentos juntas: 8 de diciembre de 2025-2025-12-09T04-33-20",
    "type": 1,
    "path": "/core/juntas/1/",
    "children": [
      {
        "id": 30,
        "code": "document-code-uuid",
        "name": "certificado-aporte-00000010.docx",
        "type": 2,
        "path": "/core/juntas/1/documentos juntas: 8 de diciembre de 2025-2025-12-09T04-33-20/certificado-aporte-00000010.docx",
        "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "sizeInBytes": 73728,
        "versions": [
          {
            "versionCode": "aebf4740-d9dd-4199-a717-5071f6fa1dc9",
            "documentCode": "9804ae81-58f4-452f-85de-2a4503d7e5be",
            "createdAt": "2025-12-09T04:33:20.147Z"
          }
        ]
      }
    ]
  }
}
```

### 2. Obtener Carpetas Raíz de la Sociedad

**Endpoint:** `GET /api/v2/repository/society-profile/:structureId/nodes/root`

**Descripción:** Obtiene las carpetas raíz de la sociedad (`core` y `common`).

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)

**Ejemplo:**
```javascript
const structureId = 5;

const response = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/root`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);

const result = await response.json();
// result.data contiene las carpetas raíz (core, common)
```

### 3. Obtener Todos los Nodos Core

**Endpoint:** `GET /api/v2/repository/society-profile/:structureId/nodes/core`

**Descripción:** Obtiene todos los nodos marcados como "core" (incluye carpetas y documentos dentro de `/core/`).

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)

**Ejemplo:**
```javascript
const structureId = 5;

const response = await fetch(
  `/api/v2/repository/society-profile/${structureId}/nodes/core`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);

const result = await response.json();
// result.data contiene todos los nodos core
```

### 4. Obtener Carpeta de Junta (con estructura completa)

**Endpoint:** `GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder`

**Descripción:** Obtiene o crea la carpeta de una junta específica. Retorna la carpeta de la junta con su estructura.

**Parámetros:**
- `structureId` (number): ID de la estructura de la sociedad (V2)
- `flowId` (number): ID del flujo/junta

**Ejemplo:**
```javascript
const structureId = 5;
const flowId = 1;

const response = await fetch(
  `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);

const result = await response.json();
// result.data contiene la carpeta de la junta (id: 26 en tu caso)
```

### 5. Descargar Documento (Versión Específica)

**Endpoint:** `GET /api/v1/repository/society/documents/versions/:documentVersionCode/download`

**Descripción:** Descarga un documento específico por su código de versión.

**Parámetros:**
- `documentVersionCode` (string UUID): Código de la versión del documento

**Ejemplo:**
```javascript
const documentVersionCode = 'aebf4740-d9dd-4199-a717-5071f6fa1dc9';

const response = await fetch(
  `/api/v1/repository/society/documents/versions/${documentVersionCode}/download`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);

// La respuesta es un blob (archivo)
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'certificado-aporte-00000010.docx'; // Nombre del archivo
a.click();
```

### 6. Descargar Carpeta Completa como ZIP

**Endpoint:** `GET /api/v2/repository/society-profile/nodes/:nodeId/download-zip`

**Descripción:** Descarga una carpeta completa con todos sus contenidos como archivo ZIP.

**Parámetros:**
- `nodeId` (number): ID de la carpeta a descargar

**Ejemplo:**
```javascript
const folderId = 29; // ID de la carpeta de documentos

const response = await fetch(
  `/api/v2/repository/society-profile/nodes/${folderId}/download-zip`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);

// La respuesta es un blob (archivo ZIP)
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `folder-${folderId}.zip`;
a.click();
```

## Flujo Completo: Visualizar Documentos de una Junta

### Paso 1: Obtener la carpeta de la junta

```javascript
async function getJuntaFolder(structureId, flowId, token) {
  const response = await fetch(
    `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  const result = await response.json();
  return result.data; // { id: 26, name: "1", path: "/core/juntas/1/", ... }
}
```

### Paso 2: Obtener los hijos de la carpeta de la junta (carpetas de documentos)

```javascript
async function getJuntaDocuments(juntaFolderId, token) {
  const response = await fetch(
    `/api/v2/repository/society-profile/nodes/${juntaFolderId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  const result = await response.json();
  return result.data.children; // Array de carpetas de documentos
}
```

### Paso 3: Obtener los documentos dentro de una carpeta específica

```javascript
async function getDocumentsInFolder(folderId, token) {
  const response = await fetch(
    `/api/v2/repository/society-profile/nodes/${folderId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  const result = await response.json();
  return result.data.children; // Array de documentos
}
```

### Ejemplo Completo (React)

```typescript
import { useState, useEffect } from 'react';

interface Document {
  id: number;
  name: string;
  type: number; // 1 = Folder, 2 = Document
  path: string;
  mimeType?: string;
  sizeInBytes?: number;
  versions?: Array<{
    versionCode: string;
    documentCode: string;
    createdAt: string;
  }>;
}

function JuntaDocumentsViewer({ structureId, flowId, token }: {
  structureId: number;
  flowId: number;
  token: string;
}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadDocuments() {
      try {
        // 1. Obtener carpeta de la junta
        const juntaResponse = await fetch(
          `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );
        const juntaData = await juntaResponse.json();
        const juntaFolderId = juntaData.data.id;
        
        // 2. Obtener carpetas de documentos dentro de la junta
        const foldersResponse = await fetch(
          `/api/v2/repository/society-profile/nodes/${juntaFolderId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );
        const foldersData = await foldersResponse.json();
        const documentFolders = foldersData.data.children || [];
        
        // 3. Obtener documentos de cada carpeta
        const allDocuments: Document[] = [];
        for (const folder of documentFolders) {
          const docsResponse = await fetch(
            `/api/v2/repository/society-profile/nodes/${folder.id}`,
            {
              headers: { 'Authorization': `Bearer ${token}` },
            }
          );
          const docsData = await docsResponse.json();
          if (docsData.data.children) {
            allDocuments.push(...docsData.data.children);
          }
        }
        
        setDocuments(allDocuments);
      } catch (error) {
        console.error('Error al cargar documentos:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDocuments();
  }, [structureId, flowId, token]);
  
  const handleDownload = async (document: Document) => {
    if (!document.versions || document.versions.length === 0) return;
    
    const versionCode = document.versions[0].versionCode;
    const response = await fetch(
      `/api/v1/repository/society/documents/versions/${versionCode}/download`,
      {
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.name;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  if (loading) return <div>Cargando documentos...</div>;
  
  return (
    <div>
      <h2>Documentos de la Junta {flowId}</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            <span>{doc.name}</span>
            <span> ({doc.sizeInBytes ? (doc.sizeInBytes / 1024).toFixed(2) : 0} KB)</span>
            <button onClick={() => handleDownload(doc)}>Descargar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Estructura de Respuesta

### Nodo Carpeta (con hijos)
```typescript
{
  id: number;
  code: string;
  societyId: number;
  parentId: number | null;
  name: string;
  type: 1; // Folder
  path: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  isCore?: boolean;
  children: Array<Document | Folder>; // ← Aquí están los documentos
}
```

### Nodo Documento
```typescript
{
  id: number;
  code: string;
  societyId: number;
  parentId: number;
  name: string;
  type: 2; // Document
  path: string;
  mimeType: string;
  sizeInBytes: number;
  versions: Array<{
    versionCode: string;
    documentCode: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

## Notas Importantes

1. **Autenticación:** Todos los endpoints requieren el header `Authorization: Bearer <token>`.

2. **Estructura jerárquica:** Los documentos están organizados así:
   ```
   /core/juntas/{flowId}/documentos juntas: {fecha}/{documentos}
   ```

3. **Tipos de nodo:**
   - `type: 1` = Carpeta (Folder)
   - `type: 2` = Documento (Document)

4. **Versiones:** Cada documento puede tener múltiples versiones. La primera versión (`versions[0]`) suele ser la más reciente.

5. **Descarga:** Para descargar un documento, necesitas el `versionCode` de su versión más reciente.

