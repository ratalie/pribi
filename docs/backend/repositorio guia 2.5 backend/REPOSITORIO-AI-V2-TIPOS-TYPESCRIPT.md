# 📘 Repositorio AI V2 - Tipos TypeScript para Frontend V3

**Versión:** 2.0  
**Fecha:** 2025-01-XX

---

## 📋 ÍNDICE

1. [Tipos Base](#tipos-base)
2. [Tipos de Nodos](#tipos-nodos)
3. [Tipos de Respuestas](#tipos-respuestas)
4. [Tipos de Requests](#tipos-requests)
5. [Tipos de Búsqueda](#tipos-busqueda)
6. [Tipos de Almacenamiento](#tipos-almacenamiento)

---

## 1️⃣ <a id="tipos-base"></a>TIPOS BASE

```typescript
// Respuesta estándar de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  code: number;
  data?: T;
  pagination?: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Tipos de nodo
export type NodeType = 0 | 1; // 0 = documento, 1 = carpeta

// Tipos MIME soportados
export type SupportedMimeType =
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif';
```

---

## 2️⃣ <a id="tipos-nodos"></a>TIPOS DE NODOS

```typescript
// Nodo base (archivo o carpeta)
export interface Node {
  id: number;
  name: string;
  type: NodeType;
  code: string; // UUID
  parentId: number | null;
  path: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  societyId: number;
  isCore?: boolean;
}

// Nodo documento
export interface DocumentNode extends Node {
  type: 0;
  documentVersions?: DocumentVersion[];
}

// Nodo carpeta
export interface FolderNode extends Node {
  type: 1;
  children?: Node[];
}

// Versión de documento
export interface DocumentVersion {
  versionCode: string; // UUID
  documentCode: string; // UUID
  versionNumber: number;
  title: string;
  mimeType: SupportedMimeType;
  sizeInBytes: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  isActive: boolean;
  user?: {
    id: number;
    email: string;
  };
}

// Respuesta de nodo
export type NodeResponse = DocumentNode | FolderNode;
```

---

## 3️⃣ <a id="tipos-respuestas"></a>TIPOS DE RESPUESTAS

```typescript
// Respuesta de subir archivo
export interface UploadFileResponse {
  node: DocumentNode;
  documentVersion: DocumentVersion;
}

// Respuesta de subir múltiples archivos
export interface UploadFilesResponse {
  successes: Array<{
    node: DocumentNode;
    documentVersion: DocumentVersion;
  }>;
  failures: Array<{
    filename: string;
    error: string;
  }>;
}

// Respuesta de crear carpeta
export interface CreateFolderResponse {
  id: number;
  name: string;
  type: 1;
  code: string;
  parentId: number;
  path: string;
  createdAt: string;
  updatedAt: string;
}

// Respuesta de búsqueda
export interface SearchResult {
  versionCode: string;
  documentCode: string;
  title: string;
  mimeType: SupportedMimeType;
  sizeInBytes: number;
  proximity: number | null; // null para match, 0-1 para semántica
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    id: number;
    email: string;
  };
  node: {
    id: number;
    code: string;
    name: string;
    parentId: number | null;
    path: string;
    type: NodeType;
    createdAt: string;
    updatedAt: string;
  };
}

// Respuesta de búsqueda semántica
export interface SemanticSearchResponse {
  searchId: string; // UUID para reutilizar búsqueda
  documents: SearchResult[];
}

// Respuesta de almacenamiento
export interface StorageUsageResponse {
  societyId: number;
  limitInBytes: number;
  currentUsedInBytes: number;
  currentDocumentCount: number;
  summaries: Array<{
    mimeType: SupportedMimeType;
    currentCount: number;
    currentSizeInBytes: number;
  }>;
  expireAt: string | null;
}

// Respuesta de versión restaurada
export interface RestoreVersionResponse {
  versionCode: string;
  documentCode: string;
  userId: number;
  mimeType: SupportedMimeType;
  sizeInBytes: number;
  createdAt: string;
  updatedAt: string;
  title: string;
}
```

---

## 4️⃣ <a id="tipos-requests"></a>TIPOS DE REQUESTS

```typescript
// Request para crear carpeta
export interface CreateFolderRequest {
  name: string;
  description?: string;
}

// Request para actualizar nodo
export interface UpdateNodeRequest {
  name?: string;
  description?: string;
  parentId?: number; // Para mover archivo/carpeta
}

// Request para crear carpeta personalizada
export interface CreateVirtualFolderRequest {
  name: string;
  description?: string;
  isChatIA?: boolean;
  isHidden?: boolean;
}

// Request para actualizar carpeta personalizada
export interface UpdateVirtualFolderRequest {
  name?: string;
  description?: string;
  isChatIA?: boolean;
}

// Request para linkear documento
export interface LinkDocumentRequest {
  description?: string;
}

// Request para compartir carpeta
export interface ShareFolderRequest {
  expireAt?: string; // ISO 8601 date
}
```

---

## 5️⃣ <a id="tipos-busqueda"></a>TIPOS DE BÚSQUEDA

```typescript
// Parámetros de búsqueda simple (match)
export interface MatchSearchParams {
  search?: string;
  page?: number;
  limit?: number;
  order?: 'name' | 'createdAt';
  sort?: 'asc' | 'desc';
  mimeType?: SupportedMimeType;
  updatedFrom?: string; // ISO 8601
  updatedTo?: string; // ISO 8601
}

// Parámetros de búsqueda semántica
export interface SemanticSearchParams {
  semanticInput?: string;
  searchID?: string; // Para reutilizar búsqueda anterior
  filters?: {
    page?: number;
    limit?: number;
    scopedFolderNodeID?: number;
    mimeType?: SupportedMimeType;
  };
}

// Respuesta de búsqueda match
export interface MatchSearchResponse extends ApiResponse<SearchResult[]> {
  pagination: Pagination;
}

// Respuesta de búsqueda semántica
export interface SemanticSearchResponseData extends ApiResponse<SemanticSearchResponse> {
  pagination: Pagination;
}
```

---

## 6️⃣ <a id="tipos-almacenamiento"></a>TIPOS DE ALMACENAMIENTO

```typescript
// Resumen de almacenamiento por tipo MIME
export interface StorageSummary {
  mimeType: SupportedMimeType;
  currentCount: number;
  currentSizeInBytes: number;
}

// Uso de almacenamiento completo
export interface StorageUsage {
  societyId: number;
  limitInBytes: number;
  currentUsedInBytes: number;
  currentDocumentCount: number;
  summaries: StorageSummary[];
  expireAt: string | null;
}

// Cálculos útiles
export interface StorageCalculations {
  usedPercentage: number; // 0-100
  remainingBytes: number;
  remainingPercentage: number; // 0-100
  canUpload: (fileSize: number) => boolean;
}
```

---

## 7️⃣ <a id="tipos-virtual-nodes"></a>TIPOS DE CARPETAS PERSONALIZADAS

```typescript
// Carpeta personalizada (Virtual Node)
export interface VirtualFolder {
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
  children?: VirtualFolder[];
  documents?: Array<{
    id: number;
    nodeId: number;
    description: string | null;
    node: DocumentNode;
  }>;
}

// Usuario con acceso a carpeta personalizada
export interface UserWithAccess {
  id: string;
  userId: string;
  email: string;
  expireAt: string | null;
  daysRemaining: number | null;
}
```

---

## 8️⃣ <a id="tipos-utilidades"></a>TIPOS DE UTILIDADES

```typescript
// Estado de upload
export interface UploadState {
  file: File;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  result?: UploadFileResponse;
}

// Filtros de búsqueda avanzada
export interface AdvancedSearchFilters {
  mimeTypes?: SupportedMimeType[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  sizeRange?: {
    min: number; // bytes
    max: number; // bytes
  };
  scopedFolder?: number; // nodeId
}

// Opciones de ordenamiento
export type SortField = 'name' | 'createdAt' | 'updatedAt' | 'size';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}
```

---

## 9️⃣ <a id="ejemplo-completo"></a>EJEMPLO COMPLETO DE USO

```typescript
// src/types/repository.ts
export * from './repository.types';

// src/services/repository.service.ts
import type {
  ApiResponse,
  NodeResponse,
  UploadFileResponse,
  SearchResult,
  StorageUsage,
  // ... más tipos
} from '@/types/repository';

export class RepositoryService {
  async uploadFile(
    structureId: number,
    parentNodeId: number,
    file: File
  ): Promise<ApiResponse<UploadFileResponse>> {
    // Implementación...
  }

  async getNode(nodeId: number): Promise<ApiResponse<NodeResponse>> {
    // Implementación...
  }

  async searchDocuments(
    structureId: number,
    params: MatchSearchParams
  ): Promise<ApiResponse<SearchResult[]>> {
    // Implementación...
  }
}
```

---

**¡Tipos listos para usar en V3, mi rey!** 🚀💪

