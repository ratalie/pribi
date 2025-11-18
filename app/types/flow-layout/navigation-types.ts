/**
 * Tipos para navegación en el sistema de flow layouts
 */

import type { FlowItemTree } from "../flow-system/flow-item";

/**
 * Tipos de eventos de navegación
 */
export type NavigationEventType =
  | "item-click"
  | "next-step"
  | "previous-step"
  | "goto-step"
  | "complete-flow";

/**
 * Evento de navegación
 */
export interface NavigationEvent {
  /**
   * Tipo de evento
   */
  type: NavigationEventType;

  /**
   * Item de origen
   */
  from?: FlowItemTree;

  /**
   * Item de destino
   */
  to: FlowItemTree;

  /**
   * Timestamp del evento
   */
  timestamp: number;

  /**
   * Metadata adicional
   */
  meta?: Record<string, any>;
}

/**
 * Resultado de una navegación
 */
export interface NavigationResult {
  /**
   * ¿La navegación fue exitosa?
   */
  success: boolean;

  /**
   * Item al que se navegó (si fue exitoso)
   */
  item?: FlowItemTree;

  /**
   * Error (si falló)
   */
  error?: Error;

  /**
   * Validaciones que fallaron (si aplica)
   */
  validationErrors?: string[];
}
