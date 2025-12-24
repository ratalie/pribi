import type { PermissionActionEnum } from '../enums/permission-action.enum';

/**
 * Entidad PermissionAction - Representa una acción de permiso
 * 
 * Representa una acción específica que puede realizar un usuario.
 * 
 * Mapeo del backend:
 * - read → view
 * - write → create
 * - update → update
 * - delete → delete
 * - file → file
 */
export interface PermissionAction {
  /** Tipo de acción (view, create, update, delete, file) */
  action: PermissionActionEnum;
  
  /** Si la acción está habilitada */
  enabled: boolean;
  
  /** Si la acción está deshabilitada explícitamente (override negativo) */
  disabled?: boolean;
}




