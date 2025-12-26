/**
 * DTO de respuesta para Enlace de Documento
 */
export interface EnlaceDocumentoDTO {
  id: string;
  nombre: string;
  tipo: 'societario' | 'generado';
  origen: string;
  fechaEnlace: string;
  documentoId: string;
  carpetaId: string;
}

/**
 * DTO para crear un Enlace de Documento
 */
export interface CreateEnlaceDTO {
  documentoId: string;
  tipo: 'societario' | 'generado';
  origen: string;
  nombre: string;
}

