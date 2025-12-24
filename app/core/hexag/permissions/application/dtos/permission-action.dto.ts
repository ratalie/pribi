import type { PermissionActionEnum } from '../../domain/enums/permission-action.enum';

/**
 * DTO de PermissionAction - Para comunicación con el backend
 * 
 * Representa una acción de permiso en el formato que espera el backend.
 */
export interface PermissionActionDto {
  /** Tipo de acción (view, create, update, delete, file) */
  action: PermissionActionEnum | string;
  
  /** Si la acción está habilitada (formato legacy) */
  enabled?: boolean;
  
  /** Si la acción está deshabilitada explícitamente (override negativo) */
  disabled?: boolean;
  
  /** Estado del permiso (true = habilitado, false = deshabilitado) - formato del backend */
  status?: boolean;
}






