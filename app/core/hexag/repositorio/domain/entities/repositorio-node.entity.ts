/**
 * Entidad de dominio que representa un nodo del repositorio
 * 
 * Un nodo puede ser:
 * - type: 1 = Carpeta (Folder)
 * - type: 2 = Documento (Document)
 */
export interface RepositorioNode {
  id: string;
  code: string;
  societyId: string;
  parentId: string | null;
  name: string;
  type: "folder" | "document"; // "folder" = carpeta, "document" = documento
  path: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  isCore?: boolean;
  children?: RepositorioNode[];
  
  // Para archivos (type === "document")
  mimeType?: string;
  sizeInBytes?: number;
  versions?: Array<{
    versionCode: string;
    documentCode: string;
    createdAt: string;
    updatedAt: string;
    userId?: number | null;
    userIdV2?: string | null;
    userName?: string | null;
  }>;
}

