/**
 * Entidad RoutePermission - Representa un permiso de acceso a una ruta específica
 * 
 * Según ESPECIFICACION-FINAL-SISTEMA-PERMISOS.md:
 * - Los permisos por ruta son globales (no granular por sociedad por ahora)
 * - Cada ruta tiene un estado de permitido/no permitido
 */
export interface RoutePermission {
  route: string;
  allowed: boolean;
}

/**
 * Lista de permisos de rutas para un usuario
 */
export type UserRoutePermissions = RoutePermission[];

