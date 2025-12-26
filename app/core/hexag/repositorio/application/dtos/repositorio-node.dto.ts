/**
 * DTO que representa un nodo del repositorio desde el backend
 * 
 * Mapea la respuesta de los endpoints:
 * - GET /api/v2/repository/society-profile/:structureId/nodes/core
 * - GET /api/v2/repository/society-profile/nodes/:nodeId
 */
export interface RepositorioNodeDTO {
  id: number;
  code: string;
  societyId: number;
  parentId: number | null;
  name: string;
  type: 0 | 1; // 0 = documento, 1 = carpeta
  path: string;
  description: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isCore: boolean;
  children?: RepositorioNodeDTO[];
  
  // Para archivos (type === 0)
  mimeType?: string;
  sizeInBytes?: number;
  versions?: Array<{
    versionCode: string;
    documentCode: string;
    createdAt: string;
    updatedAt: string;
  }>;
  // El backend puede devolver documentVersions en lugar de versions
  documentVersions?: Array<{
    versionCode: string;
    documentCode?: string;
    title?: string;
    mimeType?: string;
    sizeInBytes?: number;
    createdAt: string;
    updatedAt: string;
    userId?: number | null;
    userIdV2?: string | null;
    userName?: string | null;
  }>;
  versions?: Array<{
    versionCode: string;
    documentCode: string;
    title?: string;
    mimeType?: string;
    sizeInBytes?: number;
    createdAt: string;
    updatedAt: string;
    userId?: number | null;
    userIdV2?: string | null;
    userName?: string | null;
  }>;
}



