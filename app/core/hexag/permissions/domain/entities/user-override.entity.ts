import type { FlowCodeEnum } from '../enums/flow-code.enum';
import type { PermissionActionEnum } from '../enums/permission-action.enum';

/**
 * Entidad UserOverride - Override de permisos de usuario
 * 
 * Permite agregar o quitar permisos específicos a un usuario.
 * Los overrides se aplican sobre los permisos base del rol.
 * 
 * Lógica de Override:
 * - isOverride = false: Agregar permiso (si el estudio lo permite)
 * - isOverride = true: Quitar permiso (aunque el rol lo tenga)
 */
export interface UserOverride {
  /** ID del usuario */
  userId: string;
  
  /** Código del flujo */
  flowCode: FlowCodeEnum;
  
  /** Nombre del módulo */
  module: string;
  
  /** Acciones a agregar o quitar */
  actions: {
    /** Tipo de acción */
    action: PermissionActionEnum;
    
    /** Si es override negativo (quitar permiso) */
    isOverride: boolean;
  }[];
}








