/**
 * FlowItemNavigation
 *
 * Define las opciones de navegación y routing de un FlowItem.
 *
 * @module FlowItemNavigation
 */

import type { NavigationBehavior } from "./enums";

/**
 * Interfaz para la navegación de un FlowItem
 *
 * Agrupa todas las propiedades relacionadas con cómo navegar
 * hacia/desde este item.
 */
export interface FlowItemNavigation {
  /**
   * Ruta de navegación (Nuxt route)
   *
   * @example '/registro-societario/paso-1'
   */
  route?: string;

  /**
   * Hash para navegación dentro de la página
   *
   * @example '#seccion-datos'
   */
  hash?: string;

  /**
   * Query params para la navegación
   *
   * @example { step: '1', mode: 'edit' }
   */
  query?: Record<string, string | number | boolean>;

  /**
   * Comportamiento de navegación
   * Define cómo se ejecuta la navegación
   *
   * @default NavigationBehavior.PUSH
   */
  behavior: NavigationBehavior;

  /**
   * URL externa completa (para EXTERNAL)
   *
   * @example 'https://ejemplo.com'
   */
  externalUrl?: string;

  /**
   * Nombre del evento a emitir (para EMIT)
   *
   * @example 'open-modal-configuracion'
   */
  eventName?: string;

  /**
   * Payload del evento
   *
   * @example { modalId: 'config', data: {...} }
   */
  eventPayload?: Record<string, unknown>;

  /**
   * Redireccionar automáticamente al completar
   *
   * @default false
   */
  autoRedirectOnComplete?: boolean;

  /**
   * ID del siguiente item al completar
   *
   * @example 'paso-2'
   */
  nextItemId?: string;

  /**
   * ID del item anterior
   *
   * @example 'paso-0'
   */
  previousItemId?: string;

  /**
   * Deshabilitar navegación hacia atrás
   *
   * @default false
   */
  disableBackNavigation?: boolean;
}
