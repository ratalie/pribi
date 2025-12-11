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
}

