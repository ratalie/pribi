/**
 * Enum de Acciones de Permiso
 * 
 * Representa las acciones que un usuario puede realizar en el sistema.
 * Mapeo del backend:
 * - read → view
 * - write → create
 * - update → update
 * - delete → delete
 * - file → file
 */
export enum PermissionActionEnum {
  /** Ver/Leer (read) */
  VIEW = 'view',
  
  /** Crear (write) */
  CREATE = 'create',
  
  /** Actualizar */
  UPDATE = 'update',
  
  /** Eliminar */
  DELETE = 'delete',
  
  /** Archivar/Documentar */
  FILE = 'file',
}

/**
 * Nombres legibles de las acciones
 */
export const PermissionActionDisplayNames: Record<PermissionActionEnum, string> = {
  [PermissionActionEnum.VIEW]: 'Ver',
  [PermissionActionEnum.CREATE]: 'Crear',
  [PermissionActionEnum.UPDATE]: 'Actualizar',
  [PermissionActionEnum.DELETE]: 'Eliminar',
  [PermissionActionEnum.FILE]: 'Archivar',
};

/**
 * Mapeo desde el backend (read, write, etc.) al frontend (view, create, etc.)
 */
export const BackendToFrontendActionMap: Record<string, PermissionActionEnum> = {
  read: PermissionActionEnum.VIEW,
  write: PermissionActionEnum.CREATE,
  update: PermissionActionEnum.UPDATE,
  delete: PermissionActionEnum.DELETE,
  file: PermissionActionEnum.FILE,
};

/**
 * Mapeo desde el frontend al backend
 */
export const FrontendToBackendActionMap: Record<PermissionActionEnum, string> = {
  [PermissionActionEnum.VIEW]: 'read',
  [PermissionActionEnum.CREATE]: 'write',
  [PermissionActionEnum.UPDATE]: 'update',
  [PermissionActionEnum.DELETE]: 'delete',
  [PermissionActionEnum.FILE]: 'file',
};








