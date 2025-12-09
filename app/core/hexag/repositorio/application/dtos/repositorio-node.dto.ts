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
  type: 1 | 2; // 1 = folder, 2 = file
  path: string;
  description: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isCore: boolean;
  children?: RepositorioNodeDTO[];
  
  // Para archivos (type === 2)
  mimeType?: string;
  sizeInBytes?: number;
  versions?: Array<{
    versionCode: string;
    documentCode: string;
    createdAt: string;
    updatedAt: string;
  }>;
}



