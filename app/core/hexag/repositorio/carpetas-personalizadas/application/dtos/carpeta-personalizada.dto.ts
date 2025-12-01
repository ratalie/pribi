/**
 * DTO de respuesta para Carpeta Personalizada
 */
export interface CarpetaPersonalizadaDTO {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaCreacion: string;
  fechaModificacion: string;
  creadorId: string;
  creadorNombre: string;
  totalEnlaces: number;
}

/**
 * DTO para crear una Carpeta Personalizada
 */
export interface CreateCarpetaDTO {
  nombre: string;
  descripcion?: string;
}

/**
 * DTO para actualizar una Carpeta Personalizada
 */
export interface UpdateCarpetaDTO {
  nombre: string;
  descripcion?: string;
}

