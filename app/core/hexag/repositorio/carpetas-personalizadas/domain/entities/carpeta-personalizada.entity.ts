/**
 * Entidad de dominio que representa una Carpeta Personalizada
 */
export interface CarpetaPersonalizada {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  creadorId: string;
  creadorNombre: string;
  totalEnlaces: number;
}

