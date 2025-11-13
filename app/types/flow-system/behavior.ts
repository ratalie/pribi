/**
 * FlowItemBehavior
 *
 * Define el comportamiento y estado de un FlowItem.
 *
 * @module FlowItemBehavior
 */

/**
 * Interfaz para el comportamiento de un FlowItem
 *
 * Agrupa todas las propiedades relacionadas con el estado
 * y comportamiento del item en el flujo.
 */
export interface FlowItemBehavior {
  /**
   * Está activo (usuario está en este item)
   *
   * @default false
   */
  isActive: boolean;

  /**
   * Está completado
   *
   * @default false
   */
  isCompleted: boolean;

  /**
   * Está deshabilitado (no se puede navegar)
   *
   * @default false
   */
  isDisabled: boolean;

  /**
   * Está visible en el sidebar
   *
   * @default true
   */
  isVisible: boolean;

  /**
   * Es colapsable (tiene hijos que se pueden ocultar/mostrar)
   *
   * @default false
   */
  isCollapsible: boolean;

  /**
   * Está colapsado (hijos ocultos)
   * Solo aplica si isCollapsible es true
   *
   * @default false
   */
  isCollapsed: boolean;

  /**
   * Es opcional (no bloquea progreso si no se completa)
   *
   * @default false
   */
  isOptional: boolean;

  /**
   * Requiere confirmación antes de navegar fuera
   *
   * @default false
   */
  requiresConfirmation: boolean;

  /**
   * Mensaje de confirmación personalizado
   *
   * @example '¿Desea salir sin guardar los cambios?'
   */
  confirmationMessage?: string;

  /**
   * Descripción breve del comportamiento o contenido del item
   */
  description?: string;

  /**
   * Se puede saltar (navegar sin completar)
   *
   * @default false
   */
  isSkippable: boolean;

  /**
   * Mostrar badge con información adicional
   *
   * @example '3', 'Nuevo', '!'
   */
  badge?: string | number;

  /**
   * Color del badge (Tailwind classes)
   *
   * @example 'bg-red-500', 'bg-green-500'
   */
  badgeColor?: string;

  /**
   * Progreso dentro del item (0-100)
   * Útil para items que tienen sub-tareas
   *
   * @example 75 (75% completado)
   */
  progress?: number;

  /**
   * Tiempo estimado en minutos
   *
   * @example 15 (15 minutos)
   */
  estimatedTime?: number;

  /**
   * Permite edición después de completar
   *
   * @default true
   */
  allowEditAfterComplete?: boolean;

  /**
   * Condición que debe cumplirse para habilitar
   * Función que retorna boolean o Promise<boolean>
   */
  enableCondition?: () => boolean | Promise<boolean>;

  /**
   * Condición que debe cumplirse para mostrar
   * Función que retorna boolean o Promise<boolean>
   */
  visibilityCondition?: () => boolean | Promise<boolean>;
}
