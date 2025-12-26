import type { FlowCodeEnum } from '../../domain/enums/flow-code.enum';
import type { PermissionActionEnum } from '../../domain/enums/permission-action.enum';

/**
 * DTO para enviar overrides de permisos al backend
 * 
 * Estructura que espera el endpoint PUT /v1/access-management/users/:id/access
 * 
 * El backend espera overrides en formato:
 * - flowCode: Código del flujo
 * - module: Nombre del módulo
 * - actions: Array de acciones con isOverride
 */
export interface UserOverrideDto {
  /** Overrides a aplicar */
  overrides: Array<{
    /** Código del flujo */
    flowCode: FlowCodeEnum | string;
    
    /** Nombre del módulo */
    module: string;
    
    /** Acciones a agregar o quitar */
    actions: Array<{
      /** Tipo de acción */
      action: PermissionActionEnum | string;
      
      /** Si es override negativo (quitar permiso) */
      isOverride: boolean;
    }>;
  }>;
}




