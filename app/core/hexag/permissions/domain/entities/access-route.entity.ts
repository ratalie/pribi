import type { PermissionAction } from './permission-action.entity';

/**
 * Entidad AccessRoute - Representa una ruta de acceso del sistema
 * 
 * Representa una página/pantalla específica con sus permisos.
 * Puede tener módulos específicos dentro de la ruta con permisos granulares.
 */
export interface AccessRoute {
  /** Clave única de la ruta (ej: "society", "crear", "dashboard") */
  key: string;
  
  /** Ruta real de la aplicación (ej: "/registros/sociedades/dashboard") */
  path: string;
  
  /** Nombre legible de la ruta */
  displayName: string;
  
  /** Descripción de la ruta */
  description?: string;
  
  /** Acciones permitidas en esta ruta */
  actions: PermissionAction[];
  
  /** Módulos específicos dentro de esta ruta (opcional) */
  modules?: {
    /** Nombre del módulo */
    module: string;
    
    /** Nombre legible del módulo */
    displayName: string;
    
    /** Acciones permitidas en este módulo */
    actions: PermissionAction[];
  }[];
  
  /** Estado del permiso (solo presente en /access/full) */
  status?: boolean;
}




