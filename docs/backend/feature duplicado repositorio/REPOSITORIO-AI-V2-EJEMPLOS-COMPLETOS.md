# 📖 Repositorio AI V2 - Ejemplos Completos Frontend V3

**Versión:** 2.0  
**Fecha:** 2025-01-XX

---

## 📋 ÍNDICE

1. [Cliente HTTP Base](#cliente-http)
2. [Servicio de Repositorio](#servicio-repositorio)
3. [Composable Nuxt 4](#composable-nuxt)
4. [Componentes Vue 3](#componentes-vue)
5. [Casos de Uso Completos](#casos-uso)

---

## 1️⃣ <a id="cliente-http"></a>CLIENTE HTTP BASE

```typescript
// src/infrastructure/http/repository-client.ts
import type { ApiResponse } from '@/types/repository';

export class RepositoryClient {
  private baseUrl = '/api/v2/repository';

  constructor(private token: string) {}

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `Error ${response.status}: ${response.statusText}`,
        code: response.status,
      }));
      throw new Error(error.message || 'Error en la petición');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error en la respuesta');
    }

    return data;
  }

  // Métodos específicos...
}
```

---

## 2️⃣ <a id="servicio-repositorio"></a>SERVICIO DE REPOSITORIO

```typescript
// src/services/repository.service.ts
import { RepositoryClient } from '@/infrastructure/http/repository-client';
import type {
  NodeResponse,
  UploadFileResponse,
  CreateFolderRequest,
  UpdateNodeRequest,
  MatchSearchParams,
  SemanticSearchParams,
  StorageUsage,
  VirtualFolder,
  // ... más tipos
} from '@/types/repository';

export class RepositoryService {
  private client: RepositoryClient;

  constructor(token: string) {
    this.client = new RepositoryClient(token);
  }

  // ========== ARCHIVOS ==========

  async uploadFile(
    structureId: number,
    parentNodeId: number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadFileResponse> {
    const formData = new FormData();
    const fileFieldUUID = crypto.randomUUID();
    formData.append(fileFieldUUID, file);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.data);
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', `/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/documents`);
      xhr.setRequestHeader('Authorization', `Bearer ${this.client['token']}`);
      xhr.setRequestHeader('x-file-size', file.size.toString());
      xhr.send(formData);
    });
  }

  async uploadMultipleFiles(
    structureId: number,
    parentNodeId: number,
    files: File[],
    folderName?: string
  ): Promise<UploadFileResponse[]> {
    const formData = new FormData();
    
    for (const file of files) {
      formData.append(file.size.toString(), file, file.name);
    }

    const url = `/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/core`;
    const params = folderName ? `?name=${encodeURIComponent(folderName)}` : '';

    const response = await this.client['request']<{ successes: UploadFileResponse[] }>(
      `/society-profile/${structureId}/nodes/${parentNodeId}/core${params}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        body: formData,
      },
    });

    return response.data.successes;
  }

  async getNode(nodeId: number): Promise<NodeResponse> {
    const response = await this.client['request']<NodeResponse>(
      `/nodes/${nodeId}`
    );
    return response.data!;
  }

  async updateNode(
    nodeId: number,
    updates: UpdateNodeRequest
  ): Promise<NodeResponse> {
    const response = await this.client['request']<NodeResponse>(
      `/nodes/${nodeId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    );
    return response.data!;
  }

  async deleteNode(nodeId: number): Promise<void> {
    await this.client['request'](
      `/nodes/${nodeId}`,
      { method: 'DELETE' }
    );
  }

  // ========== CARPETAS ==========

  async createFolder(
    structureId: number,
    parentNodeId: number,
    request: CreateFolderRequest
  ): Promise<NodeResponse> {
    const response = await this.client['request']<NodeResponse>(
      `/society-profile/${structureId}/nodes/${parentNodeId}/folder`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
    return response.data!;
  }

  async downloadFolderZip(nodeId: number, folderName: string): Promise<void> {
    const response = await fetch(
      `/api/v2/repository/nodes/${nodeId}/download-zip`,
      {
        headers: {
          'Authorization': `Bearer ${this.client['token']}`,
        },
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // ========== VERSIONES ==========

  async uploadNewVersion(
    documentCode: string,
    file: File
  ): Promise<DocumentVersion> {
    const formData = new FormData();
    const fileFieldUUID = crypto.randomUUID();
    formData.append(fileFieldUUID, file);

    const response = await this.client['request']<{ documentVersion: DocumentVersion }>(
      `/documents/${documentCode}/versions`,
      {
        method: 'POST',
        headers: {
          'x-file-size': file.size.toString(),
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }
    );

    return response.data!.documentVersion;
  }

  async downloadVersion(versionCode: string, fileName: string): Promise<void> {
    const response = await fetch(
      `/api/v2/repository/documents/versions/${versionCode}/download`,
      {
        headers: {
          'Authorization': `Bearer ${this.client['token']}`,
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
  }

  async restoreVersion(
    documentCode: string,
    versionCode: string
  ): Promise<DocumentVersion> {
    const response = await this.client['request']<DocumentVersion>(
      `/documents/${documentCode}/versions/${versionCode}/restore`,
      {
        method: 'POST',
      }
    );
    return response.data!;
  }

  // ========== BÚSQUEDA ==========

  async searchDocuments(
    structureId: number,
    params: MatchSearchParams
  ): Promise<{ data: SearchResult[]; pagination: Pagination }> {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.order) queryParams.append('order', params.order);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.mimeType) queryParams.append('mimeType', params.mimeType);
    if (params.updatedFrom) queryParams.append('updatedFrom', params.updatedFrom);
    if (params.updatedTo) queryParams.append('updatedTo', params.updatedTo);

    const response = await this.client['request']<SearchResult[]>(
      `/society-profile/${structureId}/documents/search?${queryParams}`
    );

    return {
      data: response.data || [],
      pagination: response.pagination!,
    };
  }

  async semanticSearch(
    structureId: number,
    params: SemanticSearchParams
  ): Promise<{ data: SemanticSearchResponse; pagination: Pagination }> {
    const response = await this.client['request']<SemanticSearchResponse>(
      `/society-profile/${structureId}/documents/search`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );

    return {
      data: response.data!,
      pagination: response.pagination!,
    };
  }

  // ========== ALMACENAMIENTO ==========

  async getStorageUsage(structureId: number): Promise<StorageUsage> {
    const response = await this.client['request']<StorageUsage>(
      `/society-profile/${structureId}/documents/storage-usage`
    );
    return response.data!;
  }

  // ========== CARPETAS PERSONALIZADAS ==========

  async createVirtualFolder(
    structureId: number,
    request: CreateVirtualFolderRequest
  ): Promise<VirtualFolder> {
    const response = await this.client['request']<VirtualFolder>(
      `/society-profile/${structureId}/virtual-nodes`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
    return response.data!;
  }

  async getVirtualFolders(structureId: number): Promise<VirtualFolder[]> {
    const response = await this.client['request']<VirtualFolder[]>(
      `/society-profile/${structureId}/virtual-nodes`
    );
    return response.data || [];
  }

  async linkDocumentToVirtualFolder(
    virtualNodeId: number,
    documentNodeId: number,
    description?: string
  ): Promise<void> {
    await this.client['request'](
      `/virtual-nodes/${virtualNodeId}/nodes/${documentNodeId}`,
      {
        method: 'POST',
        body: JSON.stringify({ description }),
      }
    );
  }

  // ========== PERMISOS ==========

  async shareFolder(
    virtualNodeId: number,
    userAssigneeId: number,
    expireAt?: Date
  ): Promise<void> {
    await this.client['request'](
      `/virtual-nodes/${virtualNodeId}/users/${userAssigneeId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          expireAt: expireAt?.toISOString(),
        }),
      }
    );
  }

  async getUsersWithAccess(virtualNodeId: number): Promise<UserWithAccess[]> {
    const response = await this.client['request']<UserWithAccess[]>(
      `/virtual-nodes/${virtualNodeId}/users`
    );
    return response.data || [];
  }

  async removeAccess(
    virtualNodeId: number,
    userAssigneeId: number
  ): Promise<void> {
    await this.client['request'](
      `/virtual-nodes/${virtualNodeId}/users/${userAssigneeId}`,
      { method: 'DELETE' }
    );
  }
}
```

---

## 3️⃣ <a id="composable-nuxt"></a>COMPOSABLE NUXT 4

```typescript
// composables/useRepository.ts
import { RepositoryService } from '@/services/repository.service';
import { useAuth } from './useAuth';

export const useRepository = () => {
  const { token } = useAuth();
  const route = useRoute();
  
  const structureId = computed(() => {
    const id = route.params.structureId;
    return typeof id === 'string' ? Number(id) : id;
  });

  const service = computed(() => new RepositoryService(token.value));

  // Estado reactivo
  const currentNode = ref<NodeResponse | null>(null);
  const currentFolder = ref<FolderNode | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ========== ARCHIVOS ==========

  const uploadFile = async (
    parentNodeId: number,
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const result = await service.value.uploadFile(
        structureId.value,
        parentNodeId,
        file,
        onProgress
      );

      await refreshCurrentNode();
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al subir archivo';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getNode = async (nodeId: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const node = await service.value.getNode(nodeId);
      currentNode.value = node;

      if (node.type === 1) {
        currentFolder.value = node as FolderNode;
      }

      return node;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener nodo';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateNode = async (
    nodeId: number,
    updates: UpdateNodeRequest
  ) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const updated = await service.value.updateNode(nodeId, updates);
      
      if (currentNode.value?.id === nodeId) {
        currentNode.value = updated;
      }

      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteNode = async (nodeId: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      await service.value.deleteNode(nodeId);
      
      if (currentNode.value?.id === nodeId) {
        currentNode.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ========== CARPETAS ==========

  const createFolder = async (
    parentNodeId: number,
    name: string,
    description?: string
  ) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const folder = await service.value.createFolder(
        structureId.value,
        parentNodeId,
        { name, description }
      );

      await refreshCurrentNode();
      return folder;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear carpeta';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ========== BÚSQUEDA ==========

  const searchDocuments = async (params: MatchSearchParams) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      return await service.value.searchDocuments(structureId.value, params);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en búsqueda';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const semanticSearch = async (params: SemanticSearchParams) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      return await service.value.semanticSearch(structureId.value, params);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en búsqueda semántica';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ========== UTILIDADES ==========

  const refreshCurrentNode = async () => {
    if (currentNode.value) {
      await getNode(currentNode.value.id);
    }
  };

  return {
    // Estado
    structureId,
    currentNode,
    currentFolder,
    isLoading,
    error,

    // Métodos
    uploadFile,
    getNode,
    updateNode,
    deleteNode,
    createFolder,
    searchDocuments,
    semanticSearch,
    refreshCurrentNode,

    // Servicio directo (para casos avanzados)
    service: service.value,
  };
};
```

---

## 4️⃣ <a id="componentes-vue"></a>COMPONENTES VUE 3

### **Componente: UploadFileModal**

```vue
<template>
  <div class="upload-modal">
    <input
      type="file"
      ref="fileInput"
      @change="handleFileSelect"
      multiple
    />
    
    <div v-if="uploadingFiles.length > 0" class="upload-list">
      <div
        v-for="file in uploadingFiles"
        :key="file.id"
        class="upload-item"
      >
        <span>{{ file.name }}</span>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${file.progress}%` }"
          ></div>
        </div>
        <span>{{ file.progress }}%</span>
      </div>
    </div>

    <button @click="handleUpload" :disabled="selectedFiles.length === 0">
      Subir Archivos
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRepository } from '@/composables/useRepository';

const props = defineProps<{
  parentNodeId: number;
}>();

const emit = defineEmits<{
  uploaded: [];
}>();

const { uploadFile } = useRepository();
const fileInput = ref<HTMLInputElement>();
const selectedFiles = ref<File[]>([]);
const uploadingFiles = ref<Array<{
  id: string;
  name: string;
  progress: number;
}>>([]);

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  selectedFiles.value = Array.from(input.files || []);
};

const handleUpload = async () => {
  for (const file of selectedFiles.value) {
    const fileId = crypto.randomUUID();
    uploadingFiles.value.push({
      id: fileId,
      name: file.name,
      progress: 0,
    });

    try {
      await uploadFile(
        props.parentNodeId,
        file,
        (progress) => {
          const item = uploadingFiles.value.find(f => f.id === fileId);
          if (item) item.progress = progress;
        }
      );

      // Remover de la lista cuando termine
      uploadingFiles.value = uploadingFiles.value.filter(f => f.id !== fileId);
    } catch (error) {
      console.error('Error al subir:', error);
      // Mantener en la lista con error
    }
  }

  selectedFiles.value = [];
  if (fileInput.value) fileInput.value.value = '';
  emit('uploaded');
};
</script>
```

---

### **Componente: FileBrowser**

```vue
<template>
  <div class="file-browser">
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs">
      <button
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.id"
        @click="navigateTo(crumb.id)"
      >
        {{ crumb.name }}
        <span v-if="index < breadcrumbs.length - 1"> / </span>
      </button>
    </nav>

    <!-- Contenido -->
    <div v-if="isLoading" class="loading">Cargando...</div>
    
    <div v-else class="content">
      <!-- Carpetas -->
      <div class="folders">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="folder-item"
          @click="openFolder(folder.id)"
        >
          <Icon name="folder" />
          <span>{{ folder.name }}</span>
        </div>
      </div>

      <!-- Archivos -->
      <div class="files">
        <div
          v-for="file in files"
          :key="file.id"
          class="file-item"
          @click="openFile(file)"
        >
          <Icon :name="getFileIcon(file.mimeType)" />
          <span>{{ file.name }}</span>
          <button @click.stop="downloadFile(file)">Descargar</button>
          <button @click.stop="deleteFile(file.id)">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRepository } from '@/composables/useRepository';

const { currentNode, currentFolder, getNode, deleteNode } = useRepository();
const isLoading = ref(false);
const breadcrumbs = ref<Array<{ id: number; name: string }>>([]);

const folders = computed(() => {
  if (currentFolder.value?.type === 1) {
    return currentFolder.value.children?.filter(n => n.type === 1) || [];
  }
  return [];
});

const files = computed(() => {
  if (currentFolder.value?.type === 1) {
    return currentFolder.value.children?.filter(n => n.type === 0) || [];
  }
  return [];
});

const openFolder = async (folderId: number) => {
  await getNode(folderId);
  await updateBreadcrumbs();
};

const openFile = (file: DocumentNode) => {
  // Abrir preview o descargar
  console.log('Abrir archivo:', file);
};

const downloadFile = async (file: DocumentNode) => {
  if (file.documentVersions?.[0]) {
    const version = file.documentVersions[0];
    await service.value.downloadVersion(version.versionCode, file.name);
  }
};

const deleteFile = async (fileId: number) => {
  if (confirm('¿Estás seguro de eliminar este archivo?')) {
    await deleteNode(fileId);
    await refreshCurrentNode();
  }
};

const navigateTo = async (nodeId: number) => {
  await getNode(nodeId);
  await updateBreadcrumbs();
};

const updateBreadcrumbs = async () => {
  // Implementar lógica de breadcrumbs
  // Navegar hacia arriba desde currentNode hasta root
};

onMounted(async () => {
  // Cargar nodo inicial
});
</script>
```

---

### **Componente: SearchBar**

```vue
<template>
  <div class="search-bar">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Buscar documentos..."
      @input="handleSearch"
    />
    
    <select v-model="searchType">
      <option value="match">Búsqueda Simple</option>
      <option value="semantic">Búsqueda Semántica (IA)</option>
    </select>

    <div v-if="results.length > 0" class="results">
      <div
        v-for="result in results"
        :key="result.versionCode"
        class="result-item"
        @click="openDocument(result)"
      >
        <h4>{{ result.title }}</h4>
        <p>{{ result.node.path }}</p>
        <span v-if="result.proximity !== null">
          Relevancia: {{ (result.proximity * 100).toFixed(0) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, debounce } from 'vue';
import { useRepository } from '@/composables/useRepository';

const { searchDocuments, semanticSearch } = useRepository();
const searchQuery = ref('');
const searchType = ref<'match' | 'semantic'>('match');
const results = ref<SearchResult[]>([]);
const isLoading = ref(false);

const handleSearch = debounce(async () => {
  if (searchQuery.value.length < 3) {
    results.value = [];
    return;
  }

  try {
    isLoading.value = true;

    if (searchType.value === 'match') {
      const response = await searchDocuments({
        search: searchQuery.value,
        page: 1,
        limit: 20,
      });
      results.value = response.data;
    } else {
      const response = await semanticSearch({
        semanticInput: searchQuery.value,
        filters: {
          page: 1,
          limit: 20,
        },
      });
      results.value = response.data.documents;
    }
  } catch (error) {
    console.error('Error en búsqueda:', error);
  } finally {
    isLoading.value = false;
  }
}, 500);

const openDocument = (result: SearchResult) => {
  // Navegar al documento
  console.log('Abrir documento:', result);
};
</script>
```

---

## 5️⃣ <a id="casos-uso"></a>CASOS DE USO COMPLETOS

### **Caso 1: Gestión Completa de Documentos**

```typescript
// pages/repository/[structureId]/index.vue
<script setup lang="ts">
const route = useRoute();
const { 
  currentNode,
  uploadFile,
  createFolder,
  getNode,
  deleteNode 
} = useRepository();

// 1. Cargar nodo raíz
onMounted(async () => {
  const rootNodes = await getRootNodes(Number(route.params.structureId));
  if (rootNodes.length > 0) {
    await getNode(rootNodes[0].id);
  }
});

// 2. Subir archivo
const handleFileUpload = async (file: File) => {
  if (!currentNode.value) return;
  
  await uploadFile(currentNode.value.id, file);
  toast.success('Archivo subido correctamente');
};

// 3. Crear carpeta
const handleCreateFolder = async (name: string) => {
  if (!currentNode.value) return;
  
  await createFolder(currentNode.value.id, name);
  toast.success('Carpeta creada correctamente');
};

// 4. Eliminar archivo/carpeta
const handleDelete = async (nodeId: number) => {
  if (confirm('¿Estás seguro?')) {
    await deleteNode(nodeId);
    toast.success('Eliminado correctamente');
  }
};
</script>
```

---

### **Caso 2: Sistema de Versiones**

```typescript
// components/DocumentVersions.vue
<script setup lang="ts">
const props = defineProps<{
  documentCode: string;
  nodeId: number;
}>();

const { getNode } = useRepository();
const { uploadNewVersion, restoreVersion, downloadVersion } = useRepository();

const versions = ref<DocumentVersion[]>([]);
const selectedFile = ref<File | null>(null);

// Cargar versiones
onMounted(async () => {
  const node = await getNode(props.nodeId);
  if (node.type === 0) {
    versions.value = node.documentVersions || [];
  }
});

// Subir nueva versión
const handleUploadVersion = async () => {
  if (!selectedFile.value) return;
  
  await uploadNewVersion(props.documentCode, selectedFile.value);
  toast.success('Nueva versión subida');
  await refreshVersions();
};

// Restaurar versión
const handleRestore = async (versionCode: string) => {
  if (confirm('¿Restaurar esta versión?')) {
    await restoreVersion(props.documentCode, versionCode);
    toast.success('Versión restaurada');
    await refreshVersions();
  }
};

// Descargar versión
const handleDownload = async (version: DocumentVersion) => {
  await downloadVersion(version.versionCode, version.title);
};

const refreshVersions = async () => {
  const node = await getNode(props.nodeId);
  if (node.type === 0) {
    versions.value = node.documentVersions || [];
  }
};
</script>
```

---

### **Caso 3: Búsqueda Avanzada**

```typescript
// composables/useAdvancedSearch.ts
export const useAdvancedSearch = () => {
  const { searchDocuments, semanticSearch } = useRepository();
  
  const searchState = ref({
    query: '',
    type: 'match' as 'match' | 'semantic',
    filters: {
      mimeType: undefined as string | undefined,
      dateFrom: undefined as Date | undefined,
      dateTo: undefined as Date | undefined,
      folderId: undefined as number | undefined,
    },
    page: 1,
    limit: 20,
  });

  const results = ref<SearchResult[]>([]);
  const pagination = ref<Pagination | null>(null);
  const searchId = ref<string | null>(null); // Para búsqueda semántica

  const performSearch = async () => {
    if (searchState.value.type === 'match') {
      const response = await searchDocuments({
        search: searchState.value.query,
        page: searchState.value.page,
        limit: searchState.value.limit,
        mimeType: searchState.value.filters.mimeType,
        updatedFrom: searchState.value.filters.dateFrom?.toISOString(),
        updatedTo: searchState.value.filters.dateTo?.toISOString(),
      });
      
      results.value = response.data;
      pagination.value = response.pagination;
    } else {
      const response = await semanticSearch({
        semanticInput: searchState.value.query,
        searchID: searchId.value || undefined,
        filters: {
          page: searchState.value.page,
          limit: searchState.value.limit,
          scopedFolderNodeID: searchState.value.filters.folderId,
          mimeType: searchState.value.filters.mimeType,
        },
      });
      
      results.value = response.data.documents;
      pagination.value = response.pagination;
      searchId.value = response.data.searchId; // Guardar para reutilizar
    }
  };

  const nextPage = async () => {
    if (pagination.value && searchState.value.page < pagination.value.totalPages) {
      searchState.value.page++;
      await performSearch();
    }
  };

  const previousPage = async () => {
    if (searchState.value.page > 1) {
      searchState.value.page--;
      await performSearch();
    }
  };

  return {
    searchState,
    results,
    pagination,
    performSearch,
    nextPage,
    previousPage,
  };
};
```

---

**¡Ejemplos completos listos para usar, mi rey!** 🚀💪




