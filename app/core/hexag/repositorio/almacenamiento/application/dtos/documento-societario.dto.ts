/**
 * DTO de respuesta para Documento Societario
 */
export interface DocumentoSocietarioDTO {
  id: string;
  nombre: string;
  tipo: 'folder' | 'file';
  mimeType?: string;
  propietario: string;
  fechaModificacion: string;
  tamaño?: number;
  parentId: string | null;
}

/**
 * DTO para crear una carpeta
 */
export interface CreateCarpetaDTO {
  nombre: string;
  parentId: string | null;
}

/**
 * DTO para subir un documento
 */
export interface UploadDocumentoDTO {
  file: File;
  parentId: string | null;
}

