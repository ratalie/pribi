/**
 * Entidad de dominio que representa una Carpeta Personalizada
 */
export interface CarpetaPersonalizada {
  id: string;
  nombre: string;
  descripcion?: string;
  isChatIA: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date;
  creadorId: string;
  creadorNombre: string;
  totalEnlaces: number;
}

