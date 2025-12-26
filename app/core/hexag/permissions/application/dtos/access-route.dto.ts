import type { PermissionActionDto } from './permission-action.dto';

/**
 * DTO de AccessRoute - Para comunicación con el backend
 * 
 * Representa una ruta de acceso en el formato que espera el backend.
 */
export interface AccessRouteDto {
  /** Clave única de la ruta */
  key: string;
  
  /** Ruta real de la aplicación */
  path: string;
  
  /** Nombre legible de la ruta */
  displayName: string;
  
  /** Descripción de la ruta */
  description?: string;
  
  /** Acciones permitidas en esta ruta */
  actions: PermissionActionDto[];
  
  /** Módulos específicos dentro de esta ruta (opcional) */
  modules?: {
    /** Nombre del módulo */
    module: string;
    
    /** Nombre legible del módulo */
    displayName: string;
    
    /** Acciones permitidas en este módulo */
    actions: PermissionActionDto[];
  }[];
  
  /** Estado del permiso (solo presente en /access/full) */
  status?: boolean;
}








