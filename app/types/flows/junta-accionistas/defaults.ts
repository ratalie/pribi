/**
 * Default Values Helper - FlowItems
 *
 * Provee valores por defecto para las interfaces de FlowItem
 * para facilitar la creación de items sin tener que especificar
 * todos los campos obligatorios.
 */

import type { FlowItemBehavior, FlowItemValidation } from "@/types/flow-system";

/**
 * Comportamiento por defecto de un FlowItem
 *
 * Todos los flags en false excepto isVisible
 */
export const defaultBehavior: FlowItemBehavior = {
  isActive: false,
  isCompleted: false,
  isDisabled: false,
  isVisible: true,
  isCollapsible: false,
  isCollapsed: false,
  isOptional: false,
  requiresConfirmation: false,
  isSkippable: false,
  allowEditAfterComplete: true,
};

/**
 * Validación por defecto de un FlowItem
 *
 * Sin validaciones activas por defecto
 */
export const defaultValidation: FlowItemValidation = {
  required: false,
  validateOnExit: false,
  validateOnEnter: false,
  blockNavigationOnError: true,
  confirmOnWarning: true,
  validationTimeout: 5000,
  maxRetries: 3,
  debounceMs: 300,
};

/**
 * Helper para crear behavior con overrides
 */
export function createBehavior(overrides?: Partial<FlowItemBehavior>): FlowItemBehavior {
  return {
    ...defaultBehavior,
    ...overrides,
  };
}

/**
 * Helper para crear validation con overrides
 */
export function createValidation(overrides?: Partial<FlowItemValidation>): FlowItemValidation {
  return {
    ...defaultValidation,
    ...overrides,
  };
}
