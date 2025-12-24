import type { UserOverride } from '../../domain/entities/user-override.entity';
import { FlowCodeEnum } from '../../domain/enums/flow-code.enum';
import { PermissionActionEnum } from '../../domain/enums/permission-action.enum';

/**
 * Validador de permisos
 * 
 * Contiene validaciones de negocio para permisos.
 */
export class PermissionsValidator {
  /**
   * Valida que un override de usuario sea válido
   * 
   * @param override Override a validar
   * @throws Error si el override no es válido
   */
  static validateUserOverride(override: UserOverride): void {
    if (!override.userId || override.userId.trim().length === 0) {
      throw new Error('El ID del usuario es requerido');
    }

    if (!Object.values(FlowCodeEnum).includes(override.flowCode as FlowCodeEnum)) {
      throw new Error(`Código de flujo inválido: ${override.flowCode}`);
    }

    if (!override.module || override.module.trim().length === 0) {
      throw new Error('El nombre del módulo es requerido');
    }

    if (!override.actions || override.actions.length === 0) {
      throw new Error('Debe especificar al menos una acción');
    }

    for (const action of override.actions) {
      if (!Object.values(PermissionActionEnum).includes(action.action as PermissionActionEnum)) {
        throw new Error(`Acción inválida: ${action.action}`);
      }
    }
  }

  /**
   * Valida múltiples overrides
   * 
   * @param overrides Overrides a validar
   * @throws Error si algún override no es válido
   */
  static validateUserOverrides(overrides: UserOverride[]): void {
    if (!overrides || overrides.length === 0) {
      throw new Error('Debe especificar al menos un override');
    }

    for (const override of overrides) {
      this.validateUserOverride(override);
    }
  }

  /**
   * Valida que una lista de módulos sea válida
   * 
   * @param modules Lista de módulos
   * @throws Error si la lista no es válida
   */
  static validateModuleList(modules: string[]): void {
    if (!Array.isArray(modules)) {
      throw new Error('Los módulos deben ser un array');
    }

    for (const module of modules) {
      if (!module || module.trim().length === 0) {
        throw new Error('El nombre del módulo no puede estar vacío');
      }

      if (module.length > 100) {
        throw new Error('El nombre del módulo no puede exceder 100 caracteres');
      }
    }
  }
}






