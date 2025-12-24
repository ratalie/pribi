/**
 * Entidad de dominio que representa un Documento Societario
 */
export interface DocumentoSocietario {
  id: string;
  nombre: string;
  tipo: 'folder' | 'file';
  mimeType?: string;
  propietario: string;
  fechaModificacion: Date;
  tamaño?: number; // en bytes
  parentId: string | null; // ID de la carpeta padre, null si está en raíz
  versionCode?: string; // Código de la versión del documento (para descarga y preview)
  code?: string; // UUID del nodo (nodeCode) para previews y operaciones del repositorio
  nodeId?: string; // ID numérico del nodo (para obtener detalles completos)
}

