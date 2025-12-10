# 📚 V2.5: Repositorio AI - Funcionalidades Completas

**Fecha**: 2 de Diciembre 2025  
**Enfoque**: Mapeo completo de todas las funcionalidades del repositorio AI  
**Estado**: ✅ Documentación completa | ⏳ Implementación V3 pendiente

---

## 📋 ÍNDICE

1. [Funcionalidades por Módulo](#funcionalidades-modulo)
2. [Endpoints Completos](#endpoints-completos)
3. [Código Vue.js - Cómo Funciona](#codigo-vuejs)
4. [Mapeo para V3](#mapeo-v3)
5. [Checklist de Endpoints para Backend V3](#checklist-backend)

---

## 1️⃣ <a id="funcionalidades-modulo"></a>FUNCIONALIDADES POR MÓDULO

### 📊 Tabla Resumen de Funcionalidades

| Funcionalidad | Módulo | Componente | Endpoint V1 | Endpoint V2 |
|---------------|--------|------------|-------------|-------------|
| **Subir archivo** | Documentos Societarios | `UploadDocumentsModal` | `POST /repository/society/nodes/{folderId}/documents` | `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/documents` |
| **Subir múltiples archivos** | Documentos Societarios | `UploadDocumentsModal` | `POST /repository/society/nodes/{folderId}/core` | `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/core` |
| **Listar archivos** | Documentos Societarios | `FileList` | `GET /repository/society/nodes/{nodeId}` | `GET /api/v2/repository/nodes/{nodeId}` |
| **Previsualizar documento** | Preview | `DocumentPreviewModal` | `GET /repository/society/documents/versions/{versionCode}/download` | `GET /api/v2/repository/documents/versions/{versionCode}/download` |
| **Descargar archivo** | Documentos Societarios | `FileCard` | `GET /repository/society/documents/versions/{versionCode}/download` | `GET /api/v2/repository/documents/versions/{versionCode}/download` |
| **Eliminar archivo** | Documentos Societarios | `FileCard` | `DELETE /repository/society/nodes/{nodeId}` | `DELETE /api/v2/repository/nodes/{nodeId}` |
| **Editar metadata** | Documentos Societarios | `EditMetadataModal` | `PUT /repository/society/nodes/{nodeId}` | `PATCH /api/v2/repository/nodes/{nodeId}` |
| **Renombrar archivo** | Documentos Societarios | `EditMetadataModal` | `PATCH /repository/society/nodes/{nodeId}` | `PATCH /api/v2/repository/nodes/{nodeId}` |
| **Subir nueva versión** | Versiones | `UploadNewVersionModal` | `POST /repository/society/documents/{documentCode}/versions` | `POST /api/v2/repository/documents/{documentCode}/versions` |
| **Ver versiones** | Versiones | `HistoryTab` | `GET /repository/society/nodes/{nodeId}` | `GET /api/v2/repository/nodes/{nodeId}` |
| **Restaurar versión** | Versiones | `CardDocumentVersion` | `POST /repository/society/documents/{documentCode}/versions/{versionCode}/restore` | `POST /api/v2/repository/documents/{documentCode}/versions/{versionCode}/restore` |
| **Crear carpeta** | Carpetas | `AddFolderModal` | `POST /repository/society/nodes` | `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/folder` |
| **Renombrar carpeta** | Carpetas | `RenameFolderModal` | `PATCH /repository/society/nodes/{nodeId}` | `PATCH /api/v2/repository/nodes/{nodeId}` |
| **Eliminar carpeta** | Carpetas | `DeleteFolderModal` | `DELETE /repository/society/nodes/{nodeId}` | `DELETE /api/v2/repository/nodes/{nodeId}` |
| **Descargar carpeta ZIP** | Carpetas | `FolderCard` | `GET /repository/society/nodes/{nodeId}/download-zip` | `GET /api/v2/repository/nodes/{nodeId}/download-zip` |
| **Navegar carpeta** | Navegación | `OtherFiles.vue` | `GET /repository/society/nodes/{nodeId}` | `GET /api/v2/repository/nodes/{nodeId}` |
| **Breadcrumbs** | Navegación | `RepositoryLayout` | `GET /repository/society/nodes/{nodeId}` (recursivo) | `GET /api/v2/repository/nodes/{nodeId}` |
| **Buscar documentos** | Búsqueda | `SearchBar` | `GET /repository/society/{societyId}/documents/search` | `GET /api/v2/repository/society-profile/{structureId}/documents/search` |
| **Búsqueda semántica** | Búsqueda | `SearchBar` | `POST /repository/society/{societyId}/documents/search` | `POST /api/v2/repository/society-profile/{structureId}/documents/search` |
| **Crear carpeta personalizada** | Carpetas Personalizadas | `AddPersonalizedFolderModal` | `POST /repository/society/{societyId}/virtual-nodes` | `POST /api/v2/repository/society-profile/{structureId}/virtual-nodes` |
| **Linkear documento** | Carpetas Personalizadas | `AddToPersonalizedFolderModal` | `POST /repository/society/virtual-nodes/{virtualNodeId}/nodes/{documentNodeId}` | `POST /api/v2/repository/virtual-nodes/{virtualNodeId}/nodes/{documentNodeId}` |
| **Compartir carpeta** | Compartir | `ShareFolderModal` | `POST /repository/society/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}` | `POST /api/v2/repository/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}` |
| **Ver permisos** | Compartir | `UsersWithAccess` | `GET /repository/society/virtual-nodes/{virtualNodeId}/users` | `GET /api/v2/repository/virtual-nodes/{virtualNodeId}/users` |
| **Eliminar permiso** | Compartir | `UsersWithAccess` | `DELETE /repository/society/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}` | `DELETE /api/v2/repository/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}` |
| **Ver almacenamiento** | Storage | `StorageDashboard` | `GET /repository/society/{societyId}/documents/storage-usage` | `GET /api/v2/repository/society-profile/{structureId}/storage-usage` |

---

## 2️⃣ <a id="endpoints-completos"></a>ENDPOINTS COMPLETOS

### **A. GESTIÓN DE ARCHIVOS**

#### **1. Subir Archivo**

**V1**:
```typescript
POST /repository/society/nodes/{folderId}/documents
Content-Type: multipart/form-data
x-file-size: {fileSize}
Authorization: Bearer {token}

Body: FormData
  - {uuid}: File
```

**V2**:
```typescript
POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/documents
Content-Type: multipart/form-data
x-file-size: {fileSize}
Authorization: Bearer {token}

Body: FormData
  - {uuid}: File
```

**Código**:
```typescript
// src/modules/probo-ai/services/fileService.ts
static async uploadFile(file: File, folderId: string): Promise<UploadFileResponse> {
  const formData = new FormData();
  const fileFieldUUID = window.crypto.randomUUID();
  formData.append(fileFieldUUID, file);
  
  const endpoint = `/repository/society/nodes/${folderId}/documents`;
  const headers = {
    "x-file-size": file.size.toString(),
    Authorization: `Bearer ${token}`,
  };
  
  const response = await apiClient.post(endpoint, formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
}
```

---

#### **2. Subir Múltiples Archivos**

**V1**:
```typescript
POST /repository/society/nodes/{folderId}/core?name={folderName}
Content-Type: multipart/form-data

Body: FormData
  - {fileSize1}: File1
  - {fileSize2}: File2
  - ...
```

**V2**:
```typescript
POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/core?name={folderName}
Content-Type: multipart/form-data

Body: FormData
  - {fileSize1}: File1
  - {fileSize2}: File2
  - ...
```

**Código**:
```typescript
// src/api/connection-probo-ai/postFilesToNode.ts
export const postFilesToNode = async (
  fileList: File[],
  nodeId: string,
  folderName?: string
) => {
  const url = `${API_PROBO}repository/society/nodes/${nodeId}/core`;
  const formData = new FormData();
  
  for (const file of fileList) {
    formData.append(file.size.toString(), file, file.name);
  }
  
  const response = await axios.post(url, formData, {
    params: {
      ...(folderName && { name: folderName }),
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};
```

---

#### **3. Listar Archivos de Carpeta**

**V1**:
```typescript
GET /repository/society/nodes/{nodeId}
Authorization: Bearer {token}

Response:
{
  success: true,
  data: {
    id: number,
    name: string,
    type: 0 | 1, // 0 = documento, 1 = carpeta
    children?: NodeResponseDto[], // Si es carpeta
    documentVersions?: DocumentVersionDto[], // Si es documento
    // ... más campos
  }
}
```

**V2**:
```typescript
GET /api/v2/repository/nodes/{nodeId}
Authorization: Bearer {token}

Response: (igual que V1)
```

**Código**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async getNode(nodeId: number | string): Promise<NodeResponseDto> {
  const response = await apiClient.get<ApiResponse<NodeResponseDto>>(
    `/repository/society/nodes/${nodeId}`
  );
  
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  
  return response.data.data;
}
```

---

#### **4. Previsualizar Documento**

**V1**:
```typescript
GET /repository/society/documents/versions/{documentVersionCode}/download
Authorization: Bearer {token}
Response-Type: blob
```

**V2**:
```typescript
GET /api/v2/repository/documents/versions/{documentVersionCode}/download
Authorization: Bearer {token}
Response-Type: blob
```

**Código**:
```typescript
// src/modules/probo-ai/services/fileVersionService.ts
export async function downloadFileVersion(documentVersionCode: string): Promise<Blob> {
  const endpoint = `/repository/society/documents/versions/${documentVersionCode}/download`;
  
  const response = await apiClient.get(endpoint, {
    responseType: "blob",
  });
  
  return response.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/documentPreview/DocumentViewer.vue -->
<script setup lang="ts">
import { FilePreviewService } from "@/modules/probo-ai/services/filePreviewService";

const preview = ref<string | null>(null);

const loadPreview = async (file: File) => {
  try {
    preview.value = await FilePreviewService.generateFilePreview(file, {
      width: 800,
      height: 1000,
      quality: 0.8,
    });
  } catch (error) {
    console.error("Error generando preview:", error);
  }
};
</script>
```

---

#### **5. Descargar Archivo**

**Endpoint**: Igual que previsualizar

**Código**:
```typescript
// src/modules/probo-ai/services/fileVersionService.ts
export async function downloadFileVersionWithName(
  documentVersionCode: string,
  fileName: string
): Promise<void> {
  const blob = await downloadFileVersion(documentVersionCode);
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/common/files/FileCard.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  download: [file: FileWithPreview];
}>();

const handleDownload = async () => {
  const { downloadFileVersionWithName } = await import("@/modules/probo-ai/services/fileVersionService");
  await downloadFileVersionWithName(
    props.file.documentVersionCode,
    props.file.name
  );
};
</script>
```

---

#### **6. Eliminar Archivo**

**V1**:
```typescript
DELETE /repository/society/nodes/{nodeId}
Authorization: Bearer {token}

Response: 204 No Content
```

**V2**:
```typescript
DELETE /api/v2/repository/nodes/{nodeId}
Authorization: Bearer {token}

Response: 204 No Content
```

**Código**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async deleteNode(nodeId: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/repository/society/nodes/${nodeId}`
  );
  
  if (response.status !== 204) {
    throw new Error(response.data.message);
  }
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/pages/repository/otherDocuments/OtherFiles.vue -->
<script setup lang="ts">
const onDeleteFile = async (file: FileWithPreview) => {
  const confirmed = await alertToConfirmDelete(
    `¿Estás seguro de eliminar "${file.name}"?`
  );
  
  if (!confirmed) return;
  
  try {
    await NodeService.deleteNode(file.nodeId);
    toastMessage("success", "Archivo eliminado correctamente");
    await filesStore.fetchFiles(currentNodeId.value.toString());
  } catch (error) {
    toastMessage("error", "Error al eliminar archivo");
  }
};
</script>
```

---

#### **7. Editar Metadata (Nombre, Año, Tipo)**

**V1**:
```typescript
PATCH /repository/society/nodes/{nodeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name: string,
  // ... otros campos
}
```

**V2**:
```typescript
PATCH /api/v2/repository/nodes/{nodeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name: string,
  // ... otros campos
}
```

**Código**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async updateDocumentName(nodeId: number, name: string): Promise<NodeResponseDto> {
  return await this.updateNode(nodeId, {
    name: name,
  });
}

static async updateNode(
  nodeId: number,
  updateData: {
    name?: string;
    parentId?: number;
    description?: string;
  }
): Promise<NodeResponseDto> {
  const url = `repository/society/nodes/${nodeId}`;
  
  const response = await apiClient.patch<ApiResponse<NodeResponseDto>>(url, updateData);
  
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  
  return response.data.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/modals/EditMetadataModal.vue -->
<script setup lang="ts">
const handleSave = async () => {
  try {
    await NodeService.updateDocumentName(
      props.file.nodeId,
      metadata.value.name
    );
    
    emit("save", metadata.value);
    emit("close");
    toastMessage("success", "Metadata actualizada correctamente");
  } catch (error) {
    toastMessage("error", "Error al actualizar metadata");
  }
};
</script>
```

---

### **B. GESTIÓN DE VERSIONES**

#### **8. Subir Nueva Versión**

**V1**:
```typescript
POST /repository/society/documents/{documentCode}/versions
Content-Type: multipart/form-data
x-file-size: {fileSize}
Authorization: Bearer {token}

Body: FormData
  - {uuid}: File
```

**V2**:
```typescript
POST /api/v2/repository/documents/{documentCode}/versions
Content-Type: multipart/form-data
x-file-size: {fileSize}
Authorization: Bearer {token}

Body: FormData
  - {uuid}: File
```

**Código**:
```typescript
// src/modules/probo-ai/services/fileVersionService.ts
export async function uploadNewVersion(documentCode: string, file: File): Promise<any> {
  const formData = new FormData();
  const fileFieldUUID = window.crypto.randomUUID();
  formData.append(fileFieldUUID, file);
  
  const endpoint = `/repository/society/documents/${documentCode}/versions`;
  
  const response = await apiClient.post(endpoint, formData, {
    headers: {
      "x-file-size": file.size.toString(),
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/modals/UploadNewVersionModal.vue -->
<script setup lang="ts">
const handleUpload = async () => {
  try {
    const { uploadNewVersionByNodeId } = await import("@/modules/probo-ai/services/fileVersionService");
    
    await uploadNewVersionByNodeId(props.file.nodeId, selectedFile.value);
    
    toastMessage("success", "Nueva versión subida correctamente");
    emit("version-uploaded");
    emit("close");
  } catch (error) {
    toastMessage("error", "Error al subir nueva versión");
  }
};
</script>
```

---

#### **9. Ver Versiones de Documento**

**V1**:
```typescript
GET /repository/society/nodes/{nodeId}
Authorization: Bearer {token}

Response:
{
  success: true,
  data: {
    type: 0, // Documento
    documentVersions: [
      {
        versionCode: string,
        title: string,
        sizeInBytes: number,
        createdAt: string,
        userId: number,
        // ... más campos
      },
      // ... más versiones
    ]
  }
}
```

**V2**:
```typescript
GET /api/v2/repository/nodes/{nodeId}
Authorization: Bearer {token}

Response: (igual que V1)
```

**Código**:
```typescript
// src/modules/probo-ai/services/fileVersionService.ts
export async function getDocumentVersionsFromNode(
  nodeId: number | string
): Promise<GetVersionsResponse> {
  const { NodeService } = await import("./nodeService");
  const node = await NodeService.getNode(nodeId);
  
  if (node.type !== 0) {
    throw new Error("El nodo seleccionado no es un documento");
  }
  
  const documentNode = node as any;
  const documentVersions = documentNode.documentVersions || [];
  
  const versions: FileVersion[] = documentVersions.map((version: any, index: number) => {
    return {
      id: version.versionCode || `version-${index}`,
      fileId: documentNode.code || nodeId.toString(),
      version: documentVersions.length - index,
      name: version.title || documentNode.name,
      size: version.sizeInBytes || 0,
      uploadDate: version.createdAt,
      uploadedBy: {
        id: version.userId?.toString() || "user-1",
        name: localStorage.getItem("nameUser") || "Usuario",
        email: localStorage.getItem("emailUser") || "usuario@probo.com",
      },
      preview: "",
      isCurrentVersion: index === 0,
    };
  });
  
  return {
    success: true,
    data: versions,
  };
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/documentPreview/HistoryTab.vue -->
<script setup lang="ts">
const versions = ref<FileVersion[]>([]);

onMounted(async () => {
  try {
    const { getDocumentVersionsFromNode } = await import("@/modules/probo-ai/services/fileVersionService");
    const result = await getDocumentVersionsFromNode(props.file.nodeId);
    versions.value = result.data;
  } catch (error) {
    console.error("Error obteniendo versiones:", error);
  }
});
</script>

<template>
  <div class="space-y-4">
    <CardDocumentVersion
      v-for="version in versions"
      :key="version.id"
      :version="version"
      @restore="handleRestoreVersion"
      @download="handleDownloadVersion"
    />
  </div>
</template>
```

---

#### **10. Restaurar Versión**

**V1**:
```typescript
POST /repository/society/documents/{documentCode}/versions/{versionCode}/restore
Authorization: Bearer {token}

Response:
{
  success: true,
  message: "Versión restaurada exitosamente"
}
```

**V2**:
```typescript
POST /api/v2/repository/documents/{documentCode}/versions/{versionCode}/restore
Authorization: Bearer {token}

Response: (igual que V1)
```

**Código**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async revertDocumentVersion(
  documentCode: string,
  versionCode: string
): Promise<void> {
  const endpoint = `/repository/society/documents/${documentCode}/versions/${versionCode}/restore`;
  
  const response = await apiClient.post<ApiResponse<void>>(endpoint);
  
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/documentPreview/CardDocumentVersion.vue -->
<script setup lang="ts">
const handleRestore = async () => {
  const confirmed = await alertToConfirm(
    `¿Restaurar esta versión? Se creará una nueva versión con este contenido.`
  );
  
  if (!confirmed) return;
  
  try {
    const { revertDocumentVersionToRestore } = await import("@/modules/probo-ai/services/fileVersionService");
    await revertDocumentVersionToRestore(
      props.version.fileId,
      props.version.id
    );
    
    toastMessage("success", "Versión restaurada correctamente");
    emit("restored");
  } catch (error) {
    toastMessage("error", "Error al restaurar versión");
  }
};
</script>
```

---

### **C. GESTIÓN DE CARPETAS**

#### **11. Crear Carpeta**

**V1**:
```typescript
POST /repository/society/nodes
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name: string,
  parentId: number,
  type: 1 // 1 = carpeta
}
```

**V2**:
```typescript
POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/folder
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name: string
}
```

**Código**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async createFolder(request: CreateFolderRequest): Promise<FolderNode> {
  const url = `/repository/society/nodes`;
  
  const response = await apiClient.post<CreateFolderResponse>(url, request);
  
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  
  return response.data.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/modals/AddFolderModal.vue -->
<script setup lang="ts">
const handleAdd = async () => {
  try {
    const folder = await NodeService.createFolder({
      name: folderName.value,
      parentId: props.parentId || currentNodeId.value,
    });
    
    emit("add", folder);
    emit("close");
    toastMessage("success", "Carpeta creada correctamente");
  } catch (error) {
    toastMessage("error", "Error al crear carpeta");
  }
};
</script>
```

---

#### **12. Renombrar Carpeta**

**V1**:
```typescript
PATCH /repository/society/nodes/{nodeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name: string
}
```

**V2**:
```typescript
PATCH /api/v2/repository/nodes/{nodeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name: string
}
```

**Código**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async updateNode(
  nodeId: number,
  updateData: {
    name?: string;
    parentId?: number;
    description?: string;
  }
): Promise<NodeResponseDto> {
  const url = `repository/society/nodes/${nodeId}`;
  
  const response = await apiClient.patch<ApiResponse<NodeResponseDto>>(url, updateData);
  
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  
  return response.data.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/modals/RenameFolderModal.vue -->
<script setup lang="ts">
const handleRename = async () => {
  try {
    await NodeService.updateNode(props.folderId, {
      name: newName.value,
    });
    
    emit("rename", newName.value);
    emit("close");
    toastMessage("success", "Carpeta renombrada correctamente");
  } catch (error) {
    toastMessage("error", "Error al renombrar carpeta");
  }
};
</script>
```

---

#### **13. Eliminar Carpeta**

**V1**:
```typescript
DELETE /repository/society/nodes/{nodeId}
Authorization: Bearer {token}

Response: 204 No Content
```

**V2**:
```typescript
DELETE /api/v2/repository/nodes/{nodeId}
Authorization: Bearer {token}

Response: 204 No Content
```

**Código**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async deleteNode(nodeId: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/repository/society/nodes/${nodeId}`
  );
  
  if (response.status !== 204) {
    throw new Error(response.data.message);
  }
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/pages/repository/otherDocuments/OtherFiles.vue -->
<script setup lang="ts">
const onDeleteFolder = async (folder: Folder) => {
  const confirmed = await alertToConfirmDelete(
    `¿Estás seguro de eliminar "${folder.name}"? Se eliminarán todos los archivos dentro.`
  );
  
  if (!confirmed) return;
  
  try {
    await NodeService.deleteNode(parseInt(folder.id.toString()));
    toastMessage("success", "Carpeta eliminada correctamente");
    await loadFolders();
  } catch (error) {
    toastMessage("error", "Error al eliminar carpeta");
  }
};
</script>
```

---

#### **14. Descargar Carpeta como ZIP**

**V1**:
```typescript
GET /repository/society/nodes/{nodeId}/download-zip
Authorization: Bearer {token}
Response-Type: blob
```

**V2**:
```typescript
GET /api/v2/repository/nodes/{nodeId}/download-zip
Authorization: Bearer {token}
Response-Type: blob
```

**Código**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async downloadFolderZip(nodeId: number): Promise<Blob> {
  const endpoint = `/repository/society/nodes/${nodeId}/download-zip`;
  
  const response = await apiClient.get(endpoint, {
    responseType: "blob",
  });
  
  return response.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/common/folder/FolderCard.vue -->
<script setup lang="ts">
const handleDownload = async () => {
  try {
    const blob = await NodeService.downloadFolderZip(props.folder.id);
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${props.folder.name}.zip`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toastMessage("success", "Carpeta descargada correctamente");
  } catch (error) {
    toastMessage("error", "Error al descargar carpeta");
  }
};
</script>
```

---

#### **15. Navegar Carpeta (Abrir)**

**Endpoint**: Igual que "Listar archivos"

**Código**:
```vue
<!-- src/modules/probo-ai/pages/repository/otherDocuments/OtherFiles.vue -->
<script setup lang="ts">
const onOpenFolder = async (folder: Folder) => {
  try {
    // Navegar a la carpeta
    router.push(`/probo-ai/repository/other-files/${folder.id}`);
    
    // Cargar contenido
    await loadFolderContent(folder.id.toString());
  } catch (error) {
    toastMessage("error", "Error al abrir carpeta");
  }
};

const loadFolderContent = async (folderId: string) => {
  try {
    isLoadingFolders.value = true;
    isLoadingFiles.value = true;
    
    // Cargar carpetas hijas
    const childNodes = await NodeService.getChildNodes(parseInt(folderId));
    folders.value = childNodes
      .filter((node) => node.type === 1)
      .map((node) => ({
        id: node.id.toString(),
        name: node.name,
        count: (node as FolderNode).children?.length || 0,
        lastModified: formatFileDate(node.updatedAt),
        // ... más campos
      }));
    
    // Cargar archivos
    await filesStore.fetchFiles(folderId);
    
    // Actualizar breadcrumbs
    breadcrumbs.value = await NodeService.getBreadcrumbs(
      parseInt(folderId),
      selectedCompany.value
    );
  } catch (error) {
    toastMessage("error", "Error al cargar contenido");
  } finally {
    isLoadingFolders.value = false;
    isLoadingFiles.value = false;
  }
};
</script>
```

---

#### **16. Breadcrumbs (Navegación)**

**Endpoint**: `GET /repository/society/nodes/{nodeId}` (recursivo hacia arriba)

**Código**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async getBreadcrumbs(
  nodeId: number,
  companyName: string
): Promise<Array<{ id: number; name: string }>> {
  const breadcrumbs = [{ id: 0, name: companyName }];
  
  if (nodeId === 0) {
    return breadcrumbs;
  }
  
  const buildBreadcrumbs = async (currentNodeId: number) => {
    const path: Array<{ id: number; name: string }> = [];
    let currentId = currentNodeId;
    
    while (currentId !== 0) {
      const node = await this.getNode(currentId);
      
      let displayName = node.name;
      if (node.name.toLowerCase() === "common") {
        displayName = "Documentos Societarios de la Empresa";
      } else if (node.name.toLowerCase() === "core") {
        displayName = "Documentos Generados en Probo";
      } else {
        displayName = capitalizeFirst(formatDateInFolderName(node.name));
      }
      
      path.unshift({ id: node.id, name: displayName });
      
      if (node.parentId && node.parentId !== 0) {
        currentId = node.parentId;
      } else {
        currentId = 0;
      }
    }
    
    return path;
  };
  
  const nodePath = await buildBreadcrumbs(nodeId);
  breadcrumbs.push(...nodePath);
  
  return breadcrumbs;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/layouts/RepositoryLayout.vue -->
<template>
  <div>
    <nav class="breadcrumbs">
      <button
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.id"
        @click="handleBreadcrumbClick(crumb, index)"
        class="breadcrumb-item"
      >
        {{ crumb.name }}
        <span v-if="index < breadcrumbs.length - 1">/</span>
      </button>
    </nav>
  </div>
</template>
```

---

### **D. BÚSQUEDA**

#### **17. Buscar Documentos (Simple)**

**V1**:
```typescript
GET /repository/society/{societyId}/documents/search?search={query}&page=1&limit=10&order=name&sort=asc&mimeType={mimeType}
Authorization: Bearer {token}

Response:
{
  success: true,
  data: {
    documents: [
      {
        id: string,
        name: string,
        mimeType: string,
        sizeInBytes: number,
        nodeId: number,
        folderPath: string,
        // ... más campos
      }
    ],
    total: number,
    page: number,
    limit: number
  }
}
```

**V2**:
```typescript
GET /api/v2/repository/society-profile/{structureId}/documents/search?search={query}&page=1&limit=10&order=name&sort=asc&mimeType={mimeType}
Authorization: Bearer {token}

Response: (igual que V1)
```

**Código**:
```typescript
// src/modules/probo-ai/services/searchService.ts
async searchFilesNew(params: DocumentSemanticSearchDto, societyId: number): Promise<SemanticSearchResponseNew> {
  const endpoint = `/repository/society/${societyId}/documents/search`;
  
  const queryParams: any = {
    search: params.semanticInput || '',
    page: params.filters?.page || 1,
    limit: params.filters?.limit || 10,
    order: 'name',
    sort: 'asc'
  };
  
  if (params.filters?.mimeType) {
    queryParams.mimeType = params.filters.mimeType;
  }
  
  const response = await apiClient.get(endpoint, {
    params: queryParams,
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  
  return response.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/common/SearchBar.vue -->
<script setup lang="ts">
const searchService = new SearchService();

const handleSearch = async () => {
  try {
    isLoading.value = true;
    
    const results = await searchService.searchFilesNew(
      {
        semanticInput: searchQuery.value,
        filters: {
          page: 1,
          limit: 20,
          mimeType: selectedMimeType.value,
        },
      },
      appStore.societySelectId
    );
    
    emit("search-results", results.data.documents);
  } catch (error) {
    toastMessage("error", "Error al buscar documentos");
  } finally {
    isLoading.value = false;
  }
};
</script>
```

---

#### **18. Búsqueda Semántica (IA)**

**V1**:
```typescript
POST /repository/society/{societyId}/documents/search
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  semanticInput: string,
  filters: {
    page: number,
    limit: number,
    mimeType?: string
  }
}

Response:
{
  success: true,
  data: {
    documents: [
      {
        id: string,
        name: string,
        relevance: number, // 0-1
        confidence: number, // 0-1
        matchedSections: string[],
        aiExplanation: string,
        // ... más campos
      }
    ],
    total: number,
    page: number,
    limit: number
  }
}
```

**V2**:
```typescript
POST /api/v2/repository/society-profile/{structureId}/documents/search
Content-Type: application/json
Authorization: Bearer {token}

Body: (igual que V1)
Response: (igual que V1)
```

**Código**:
```typescript
// src/modules/probo-ai/services/searchService.ts
async searchSemanticNew(params: DocumentSemanticSearchDto, societyId: number): Promise<SemanticSearchResponseNew> {
  const endpoint = `/repository/society/${societyId}/documents/search`;
  
  const response = await apiClient.post(endpoint, params, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  
  return response.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/search/DocumentSearchInput.vue -->
<script setup lang="ts">
const handleSemanticSearch = async () => {
  try {
    isLoading.value = true;
    
    const results = await searchService.searchSemanticNew(
      {
        semanticInput: searchQuery.value,
        filters: {
          page: 1,
          limit: 20,
        },
      },
      appStore.societySelectId
    );
    
    emit("semantic-results", results.data.documents);
  } catch (error) {
    toastMessage("error", "Error en búsqueda semántica");
  } finally {
    isLoading.value = false;
  }
};
</script>
```

---

### **E. CARPETAS PERSONALIZADAS**

#### **19. Crear Carpeta Personalizada**

**V1**:
```typescript
POST /repository/society/{societyId}/virtual-nodes
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  name: string,
  description: string,
  isChatIA: boolean,
  isHidden: boolean
}

Response:
{
  success: true,
  data: {
    id: string,
    name: string,
    description: string,
    hasAIChatAccess: boolean,
    owner: {
      id: string,
      name: string,
      email: string
    },
    // ... más campos
  }
}
```

**V2**:
```typescript
POST /api/v2/repository/society-profile/{structureId}/virtual-nodes
Content-Type: application/json
Authorization: Bearer {token}

Body: (igual que V1)
Response: (igual que V1)
```

**Código**:
```typescript
// src/modules/probo-ai/services/folderService.ts
static async createPersonalizedFolder(request: {
  name: string;
  description?: string;
  hasAIChatAccess?: boolean;
  isPersonalizedFolder?: boolean;
  isHidden?: boolean;
}): Promise<VirtualFolder> {
  const societyId = this.getSocietyId();
  const url = `/repository/society/${societyId}/virtual-nodes`;
  
  const response = await apiClient.post(url, {
    name: request.name,
    description: request.description || "",
    isChatIA: request.hasAIChatAccess || false,
    isHidden: request.isHidden || false,
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  
  return response.data.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/modals/AddPersonalizedFolderModal.vue -->
<script setup lang="ts">
const handleCreate = async () => {
  try {
    const folder = await FolderService.createPersonalizedFolder({
      name: folderName.value,
      description: description.value,
      hasAIChatAccess: hasAIChatAccess.value,
    });
    
    emit("created", folder);
    emit("close");
    toastMessage("success", "Carpeta personalizada creada correctamente");
  } catch (error) {
    toastMessage("error", "Error al crear carpeta personalizada");
  }
};
</script>
```

---

#### **20. Linkear Documento a Carpeta Personalizada**

**V1**:
```typescript
POST /repository/society/virtual-nodes/{virtualNodeId}/nodes/{documentNodeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  description: string
}

Response:
{
  success: true,
  message: "Documento linkeado correctamente"
}
```

**V2**:
```typescript
POST /api/v2/repository/virtual-nodes/{virtualNodeId}/nodes/{documentNodeId}
Content-Type: application/json
Authorization: Bearer {token}

Body: (igual que V1)
Response: (igual que V1)
```

**Código**:
```typescript
// src/modules/probo-ai/services/folderService.ts
static async linkDocumentToVirtualFolder(
  parentVirtualNodeId: string,
  documentNodeId: string
): Promise<void> {
  const url = `/repository/society/virtual-nodes/${parentVirtualNodeId}/nodes/${documentNodeId}`;
  
  const response = await apiClient.post<ApiResponse<void>>(url, { description: "" });
  
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/modals/AddToPersonalizedFolderModal.vue -->
<script setup lang="ts">
const handleLink = async () => {
  try {
    await FolderService.linkDocumentToVirtualFolder(
      props.folderId.toString(),
      selectedDocumentNodeId.value.toString()
    );
    
    emit("link", selectedDocumentNodeId.value);
    emit("close");
    toastMessage("success", "Documento agregado a la carpeta personalizada");
  } catch (error) {
    toastMessage("error", "Error al agregar documento");
  }
};
</script>
```

---

#### **21. Linkear Múltiples Archivos**

**Endpoint**: Mismo que linkear uno, pero se llama múltiples veces

**Código**:
```vue
<!-- src/modules/probo-ai/components/repository/modals/AddMultipleFilesToPersonalizedFolderModal.vue -->
<script setup lang="ts">
const handleLink = async () => {
  try {
    const linkPromises = props.selectedFileIds.map((fileId) =>
      FolderService.linkDocumentToVirtualFolder(
        selectedFolderId.value.toString(),
        fileId.toString()
      )
    );
    
    await Promise.all(linkPromises);
    
    emit("link", selectedFolderId.value);
    emit("close");
    toastMessage("success", `${props.selectedFileIds.length} archivos agregados correctamente`);
  } catch (error) {
    toastMessage("error", "Error al agregar archivos");
  }
};
</script>
```

---

### **F. COMPARTIR Y PERMISOS**

#### **22. Compartir Carpeta (Crear Permiso)**

**V1**:
```typescript
POST /repository/society/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  expireAt?: string // ISO date (opcional)
}

Response:
{
  success: true,
  message: "Permiso creado correctamente",
  code: 200
}
```

**V2**:
```typescript
POST /api/v2/repository/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}
Content-Type: application/json
Authorization: Bearer {token}

Body: (igual que V1)
Response: (igual que V1)
```

**Código**:
```typescript
// src/modules/probo-ai/services/shareService.ts
static async createVirtualNodePermission(
  request: CreateVirtualNodePermissionRequest
): Promise<CreateVirtualNodePermissionResponse> {
  const url = `/repository/society/virtual-nodes/${request.virtualNodeId}/users/${request.userAssigneeId}`;
  
  const body: any = {};
  if (request.expireAt) {
    body.expireAt = request.expireAt.toISOString();
  }
  
  const response = await apiClient.post<CreateVirtualNodePermissionResponse>(url, body);
  
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  
  return response.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/modals/ShareFolderModal.vue -->
<script setup lang="ts">
const handleShare = async () => {
  try {
    const sharePromises = selectedUsers.value.map((user) =>
      ShareService.createVirtualNodePermission({
        virtualNodeId: props.folderId.toString(),
        userAssigneeId: user.id,
        expireAt: expireAt.value ? new Date(expireAt.value) : undefined,
      })
    );
    
    await Promise.all(sharePromises);
    
    emit("shared");
    emit("close");
    toastMessage("success", "Carpeta compartida correctamente");
  } catch (error) {
    toastMessage("error", "Error al compartir carpeta");
  }
};
</script>
```

---

#### **23. Ver Usuarios con Acceso**

**V1**:
```typescript
GET /repository/society/virtual-nodes/{virtualNodeId}/users
Authorization: Bearer {token}

Response:
{
  success: true,
  code: 200,
  data: [
    {
      id: string,
      userId: string,
      email: string,
      expireAt: string | null,
      daysRemaining: number | null
    }
  ]
}
```

**V2**:
```typescript
GET /api/v2/repository/virtual-nodes/{virtualNodeId}/users
Authorization: Bearer {token}

Response: (igual que V1)
```

**Código**:
```typescript
// src/modules/probo-ai/services/shareService.ts
static async getVirtualNodeUsers(
  virtualNodeId: string
): Promise<VirtualNodeUsersResponse> {
  const url = `/repository/society/virtual-nodes/${virtualNodeId}/users`;
  
  const response = await apiClient.get<VirtualNodeUsersResponse>(url);
  
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  
  return response.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/access/UsersWithAccess.vue -->
<script setup lang="ts">
const users = ref<User[]>([]);

onMounted(async () => {
  try {
    const result = await ShareService.getVirtualNodeUsers(props.folderId);
    users.value = result.data;
  } catch (error) {
    toastMessage("error", "Error al obtener usuarios");
  }
});
</script>

<template>
  <div class="space-y-2">
    <UserChip
      v-for="user in users"
      :key="user.id"
      :user="user"
      @remove="handleRemoveUser"
    />
  </div>
</template>
```

---

#### **24. Eliminar Permiso (Dejar de Compartir)**

**V1**:
```typescript
DELETE /repository/society/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}
Authorization: Bearer {token}

Response: 204 No Content
```

**V2**:
```typescript
DELETE /api/v2/repository/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}
Authorization: Bearer {token}

Response: 204 No Content
```

**Código**:
```typescript
// src/modules/probo-ai/services/shareService.ts
static async deleteVirtualNodePermission(
  request: DeleteVirtualNodePermissionRequest
): Promise<DeleteVirtualNodePermissionResponse> {
  const url = `/repository/society/virtual-nodes/${request.virtualNodeId}/users/${request.userAssigneeId}`;
  
  const response = await apiClient.delete<DeleteVirtualNodePermissionResponse>(url);
  
  if (response.status !== 204 && !response.data.success) {
    throw new Error(response.data.message);
  }
  
  return response.data;
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/components/repository/access/UsersWithAccess.vue -->
<script setup lang="ts">
const handleRemoveUser = async (user: User) => {
  const confirmed = await alertToConfirm(
    `¿Remover acceso de ${user.email}?`
  );
  
  if (!confirmed) return;
  
  try {
    await ShareService.deleteVirtualNodePermission({
      virtualNodeId: props.folderId,
      userAssigneeId: user.userId,
    });
    
    users.value = users.value.filter((u) => u.id !== user.id);
    toastMessage("success", "Acceso removido correctamente");
  } catch (error) {
    toastMessage("error", "Error al remover acceso");
  }
};
</script>
```

---

### **G. ALMACENAMIENTO**

#### **25. Ver Uso de Almacenamiento**

**V1**:
```typescript
GET /repository/society/{societyId}/documents/storage-usage
Authorization: Bearer {token}

Response:
{
  success: true,
  data: {
    societyId: number,
    limitInBytes: number,
    currentUsedInBytes: number,
    summaries: [
      {
        mimeType: string,
        currentSizeInBytes: number,
        currentCount: number
      }
    ]
  }
}
```

**V2**:
```typescript
GET /api/v2/repository/society-profile/{structureId}/storage-usage
Authorization: Bearer {token}

Response: (igual que V1)
```

**Código**:
```typescript
// src/modules/probo-ai/services/storageService.ts
static async getStorageData(societyId: number): Promise<StorageData> {
  const endpoint = `/repository/society/${societyId}/documents/storage-usage`;
  
  const response = await apiClient.get<ApiStorageUsageApiResponse>(endpoint);
  
  if (!response.data.success) {
    throw new Error(`API Error: ${response.data.code || "Unknown error"}`);
  }
  
  const backendData = this.convertApiResponseToBackendData(response.data.data);
  return this.processBackendData(backendData);
}
```

**Componente**:
```vue
<!-- src/modules/probo-ai/pages/repository/storage/StorageDashboard.vue -->
<script setup lang="ts">
const storageData = ref<StorageData | null>(null);

onMounted(async () => {
  try {
    storageData.value = await StorageService.getStorageData(appStore.societySelectId);
  } catch (error) {
    toastMessage("error", "Error al obtener datos de almacenamiento");
  }
});
</script>

<template>
  <div>
    <StorageChart :data="storageData" />
    <StorageBreakdown :fileTypes="storageData?.fileTypes || []" />
  </div>
</template>
```

---

## 3️⃣ <a id="codigo-vuejs"></a>CÓDIGO VUE.JS - CÓMO FUNCIONA

### **A. ESTRUCTURA SIN STORES**

El repositorio AI **NO usa Pinia stores** (excepto `files.store.ts` para estado local). Todo funciona con:

1. **Servicios** (`services/`) - Llamadas HTTP
2. **Composables** (`composables/`) - Lógica reactiva
3. **Componentes** - UI y eventos

---

### **B. FLUJO DE SUBIDA DE ARCHIVOS**

```typescript
// 1. COMPOSABLE: useFileUpload.ts
export function useFileUpload() {
  const uploadedFiles = ref<UploadedFile[]>([]);
  const isUploading = ref(false);
  
  const uploadFile = async (file: File, folderId: string, metadata: any) => {
    // Crear objeto de archivo
    const uploadedFile: UploadedFile = {
      id: `temp-${Date.now()}`,
      name: file.name,
      size: file.size,
      status: "uploading",
      // ...
    };
    
    uploadedFiles.value.push(uploadedFile);
    
    // Llamar al servicio
    const uploadResponse = await FileService.uploadFile(file, folderId);
    
    // Actualizar estado
    updateFileStatus(uploadedFile.id, uploadedFile.id, "completed", uploadResponse);
  };
  
  return {
    uploadedFiles,
    isUploading,
    uploadFile,
    uploadMultipleFiles,
  };
}

// 2. SERVICIO: fileService.ts
export class FileService {
  static async uploadFile(file: File, folderId: string): Promise<UploadFileResponse> {
    const formData = new FormData();
    const fileFieldUUID = window.crypto.randomUUID();
    formData.append(fileFieldUUID, file);
    
    const endpoint = `/repository/society/nodes/${folderId}/documents`;
    
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        "x-file-size": file.size.toString(),
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  }
}

// 3. COMPONENTE: UploadDocumentsModal.vue
<script setup lang="ts">
const { uploadMultipleFiles } = useFileUpload();

const handleFilesSelected = async (files: File[]) => {
  await uploadMultipleFiles(files, props.folderId, currentCompany.value);
};
</script>
```

---

### **C. FLUJO DE PREVIEW**

```typescript
// 1. SERVICIO: filePreviewService.ts
export class FilePreviewService {
  static async generateFilePreview(
    file: File,
    options: PreviewOptions = {}
  ): Promise<string | null> {
    const mimeType = file.type;
    const fileName = file.name;
    
    // PDF
    if (isPdfFile(mimeType, fileName)) {
      return await this.generatePdfPreview(file, options);
    }
    
    // Word
    if (isWordFile(mimeType, fileName)) {
      return await this.generateWordPreview(file, options);
    }
    
    // Excel
    if (isExcelFile(mimeType, fileName)) {
      return await this.generateExcelPreview(file, options);
    }
    
    // Imágenes
    if (isImageFile(mimeType)) {
      return await this.generateImagePreview(file, options);
    }
    
    return null;
  }
}

// 2. COMPONENTE: DocumentViewer.vue
<script setup lang="ts">
const preview = ref<string | null>(null);

const loadPreview = async () => {
  try {
    // Descargar archivo
    const blob = await downloadFileVersion(props.file.documentVersionCode);
    const file = new File([blob], props.file.name, { type: props.file.mimeType });
    
    // Generar preview
    preview.value = await FilePreviewService.generateFilePreview(file, {
      width: 800,
      height: 1000,
      quality: 0.8,
    });
  } catch (error) {
    console.error("Error generando preview:", error);
  }
};

onMounted(() => {
  loadPreview();
});
</script>

<template>
  <div v-if="preview">
    <img :src="preview" alt="Preview" />
  </div>
</template>
```

---

### **D. FLUJO DE BÚSQUEDA**

```typescript
// 1. SERVICIO: searchService.ts
export class SearchService {
  async searchFilesNew(params: DocumentSemanticSearchDto, societyId: number) {
    const endpoint = `/repository/society/${societyId}/documents/search`;
    
    // Búsqueda simple (GET)
    if (!params.semanticInput || params.semanticInput.length < 10) {
      const response = await apiClient.get(endpoint, {
        params: {
          search: params.semanticInput || '',
          page: params.filters?.page || 1,
          limit: params.filters?.limit || 10,
        },
      });
      return response.data;
    }
    
    // Búsqueda semántica (POST)
    const response = await apiClient.post(endpoint, params);
    return response.data;
  }
}

// 2. COMPONENTE: SearchBar.vue
<script setup lang="ts">
const searchService = new SearchService();
const searchQuery = ref("");
const results = ref([]);

const handleSearch = async () => {
  try {
    const response = await searchService.searchFilesNew(
      {
        semanticInput: searchQuery.value,
        filters: {
          page: 1,
          limit: 20,
        },
      },
      appStore.societySelectId
    );
    
    results.value = response.data.documents;
    emit("search-results", results.value);
  } catch (error) {
    toastMessage("error", "Error al buscar");
  }
};
</script>
```

---

## 4️⃣ <a id="mapeo-v3"></a>MAPEO PARA V3

### **Estructura Propuesta V3**

```
app/core/hexag/repositorio/
├── domain/
│   ├── entities/
│   │   ├── documento.entity.ts
│   │   ├── carpeta.entity.ts
│   │   ├── version.entity.ts
│   │   └── permiso.entity.ts
│   └── ports/
│       ├── documento.repository.ts
│       ├── carpeta.repository.ts
│       ├── busqueda.repository.ts
│       └── permisos.repository.ts
├── application/
│   ├── dtos/
│   │   ├── upload-documento.dto.ts
│   │   ├── buscar-documento.dto.ts
│   │   └── compartir-carpeta.dto.ts
│   └── use-cases/
│       ├── upload-documento.use-case.ts
│       ├── previsualizar-documento.use-case.ts
│       ├── descargar-documento.use-case.ts
│       ├── eliminar-documento.use-case.ts
│       ├── renombrar-documento.use-case.ts
│       ├── subir-version.use-case.ts
│       ├── restaurar-version.use-case.ts
│       ├── crear-carpeta.use-case.ts
│       ├── renombrar-carpeta.use-case.ts
│       ├── eliminar-carpeta.use-case.ts
│       ├── descargar-carpeta-zip.use-case.ts
│       ├── navegar-carpeta.use-case.ts
│       ├── buscar-documentos.use-case.ts
│       ├── crear-carpeta-personalizada.use-case.ts
│       ├── linkear-documento.use-case.ts
│       ├── compartir-carpeta.use-case.ts
│       ├── ver-permisos.use-case.ts
│       └── eliminar-permiso.use-case.ts
└── infrastructure/
    ├── repositories/
    │   ├── documento.http.repository.ts
    │   ├── carpeta.http.repository.ts
    │   ├── busqueda.http.repository.ts
    │   └── permisos.http.repository.ts
    └── mappers/
        ├── documento.mapper.ts
        └── carpeta.mapper.ts
```

---

### **Use Case Ejemplo: Subir Documento**

```typescript
// app/core/hexag/repositorio/application/use-cases/upload-documento.use-case.ts
export class UploadDocumentoUseCase {
  constructor(
    private readonly documentoRepository: DocumentoRepository,
    private readonly storageService: StorageService
  ) {}
  
  async execute(
    structureId: string,
    folderId: number,
    file: File,
    metadata?: DocumentoMetadata
  ): Promise<DocumentoEntity> {
    // 1. Validar límite de almacenamiento
    const storage = await this.storageService.getStorage(structureId);
    if (storage.usedStorage + file.size > storage.totalStorage) {
      throw new Error("No hay suficiente almacenamiento disponible");
    }
    
    // 2. Subir archivo
    const documento = await this.documentoRepository.upload(
      structureId,
      folderId,
      file,
      metadata
    );
    
    return documento;
  }
}
```

---

### **Composable V3 (Nuxt 4)**

```typescript
// app/composables/repositorio/useRepositorio.ts
export const useRepositorio = () => {
  const route = useRoute();
  const structureId = computed(() => route.params.societyId as string);
  
  // Inyectar dependencias
  const documentoRepository = new DocumentoHttpRepository(useHttpClient());
  const uploadUseCase = new UploadDocumentoUseCase(
    documentoRepository,
    new StorageService()
  );
  
  // Estado
  const documentos = ref<DocumentoEntity[]>([]);
  const isUploading = ref(false);
  
  // Subir documento
  const subirDocumento = async (
    folderId: number,
    file: File,
    metadata?: DocumentoMetadata
  ) => {
    try {
      isUploading.value = true;
      
      const documento = await uploadUseCase.execute(
        structureId.value,
        folderId,
        file,
        metadata
      );
      
      documentos.value.push(documento);
      toast.success("Documento subido correctamente");
    } catch (error) {
      toast.error("Error al subir documento");
      throw error;
    } finally {
      isUploading.value = false;
    }
  };
  
  return {
    documentos,
    isUploading,
    subirDocumento,
  };
};
```

---

## 5️⃣ <a id="checklist-backend"></a>CHECKLIST DE ENDPOINTS PARA BACKEND V3

### **Endpoints que DEBEN estar en V2/V3**

#### **A. Archivos**

- [x] `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/documents` - Subir archivo
- [x] `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/core` - Subir múltiples
- [x] `GET /api/v2/repository/nodes/{nodeId}` - Obtener nodo (archivo/carpeta)
- [x] `PATCH /api/v2/repository/nodes/{nodeId}` - Actualizar nombre/metadata
- [x] `DELETE /api/v2/repository/nodes/{nodeId}` - Eliminar archivo

#### **B. Versiones**

- [x] `POST /api/v2/repository/documents/{documentCode}/versions` - Subir nueva versión
- [x] `GET /api/v2/repository/documents/{documentCode}/versions` - Listar versiones
- [x] `GET /api/v2/repository/documents/versions/{versionCode}/download` - Descargar versión
- [ ] `POST /api/v2/repository/documents/{documentCode}/versions/{versionCode}/restore` - ⚠️ **PENDIENTE**

#### **C. Carpetas**

- [x] `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/folder` - Crear carpeta
- [x] `PATCH /api/v2/repository/nodes/{nodeId}` - Renombrar carpeta
- [x] `DELETE /api/v2/repository/nodes/{nodeId}` - Eliminar carpeta
- [x] `GET /api/v2/repository/nodes/{nodeId}/download-zip` - Descargar ZIP

#### **D. Búsqueda**

- [x] `GET /api/v2/repository/society-profile/{structureId}/documents/search` - Búsqueda simple
- [x] `POST /api/v2/repository/society-profile/{structureId}/documents/search` - Búsqueda semántica

#### **E. Carpetas Personalizadas**

- [x] `POST /api/v2/repository/society-profile/{structureId}/virtual-nodes` - Crear carpeta personalizada
- [x] `GET /api/v2/repository/society-profile/{structureId}/virtual-nodes/root` - Listar carpetas raíz
- [x] `GET /api/v2/repository/virtual-nodes/{virtualNodeId}` - Obtener carpeta personalizada
- [x] `PATCH /api/v2/repository/virtual-nodes/{virtualNodeId}` - Actualizar carpeta personalizada
- [x] `DELETE /api/v2/repository/virtual-nodes/{virtualNodeId}` - Eliminar carpeta personalizada
- [x] `POST /api/v2/repository/virtual-nodes/{virtualNodeId}/nodes/{documentNodeId}` - Linkear documento

#### **F. Permisos**

- [x] `POST /api/v2/repository/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}` - Crear permiso
- [x] `GET /api/v2/repository/virtual-nodes/{virtualNodeId}/users` - Listar usuarios con acceso
- [x] `DELETE /api/v2/repository/virtual-nodes/{virtualNodeId}/users/{userAssigneeId}` - Eliminar permiso

#### **G. Almacenamiento**

- [ ] `GET /api/v2/repository/society-profile/{structureId}/storage-usage` - ⚠️ **PENDIENTE**

#### **H. Preview**

- [ ] `PUT /api/v2/repository/nodes/{nodeCode}/preview` - ⚠️ **Ya existe pero verificar**

---

### **Endpoints Faltantes para V3**

1. ❌ **Restaurar versión**: `POST /api/v2/repository/documents/{documentCode}/versions/{versionCode}/restore`
2. ❌ **Storage usage**: `GET /api/v2/repository/society-profile/{structureId}/storage-usage`
3. ❌ **Mover archivo/carpeta**: `PATCH /api/v2/repository/nodes/{nodeId}` con `parentId`
4. ❌ **Copiar archivo/carpeta**: `POST /api/v2/repository/nodes/{nodeId}/copy`

---

## ✅ RESUMEN EJECUTIVO

### Funcionalidades Documentadas

✅ **25 funcionalidades** mapeadas completamente  
✅ **Código Vue.js** documentado para cada funcionalidad  
✅ **Endpoints V1 y V2** mapeados  
✅ **Estructura V3** propuesta  
✅ **Checklist** para Backend

### Próximos Pasos

1. ✅ Revisar endpoints faltantes con Backend
2. ✅ Implementar en V3 con arquitectura hexagonal
3. ✅ Migrar código Vue.js a Nuxt 4 composables
4. ✅ Mantener misma funcionalidad, mejor arquitectura

---

**¡Listo para implementar en V3, mi rey!** 🚀💪



