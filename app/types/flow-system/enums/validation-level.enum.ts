/**
 * Niveles de validación
 *
 * Define la severidad de las validaciones y cómo afectan
 * la navegación en el flujo.
 *
 * @module ValidationLevel
 */

/**
 * Niveles de severidad de validación
 */
export enum ValidationLevel {
  /** Error crítico - bloquea navegación */
  ERROR = "error",

  /** Advertencia - permite navegación con confirmación */
  WARNING = "warning",

  /** Información - no bloquea navegación */
  INFO = "info",

  /** Sugerencia - hint para mejorar */
  HINT = "hint",

  /** Éxito - validación pasada */
  SUCCESS = "success",
}

/**
 * Type guard para verificar si un string es un ValidationLevel válido
 */
export function isValidationLevel(value: unknown): value is ValidationLevel {
  return Object.values(ValidationLevel).includes(value as ValidationLevel);
}

/**
 * Obtener label legible para UI
 */
export function getValidationLevelLabel(level: ValidationLevel): string {
  const labels: Record<ValidationLevel, string> = {
    [ValidationLevel.ERROR]: "Error",
    [ValidationLevel.WARNING]: "Advertencia",
    [ValidationLevel.INFO]: "Información",
    [ValidationLevel.HINT]: "Sugerencia",
    [ValidationLevel.SUCCESS]: "Éxito",
  };

  return labels[level];
}

/**
 * Obtener color asociado al nivel (Tailwind classes)
 */
export function getValidationLevelColor(level: ValidationLevel): string {
  const colors: Record<ValidationLevel, string> = {
    [ValidationLevel.ERROR]: "text-red-600 dark:text-red-400",
    [ValidationLevel.WARNING]: "text-yellow-600 dark:text-yellow-400",
    [ValidationLevel.INFO]: "text-blue-600 dark:text-blue-400",
    [ValidationLevel.HINT]: "text-gray-600 dark:text-gray-400",
    [ValidationLevel.SUCCESS]: "text-green-600 dark:text-green-400",
  };

  return colors[level];
}

/**
 * Verificar si el nivel bloquea navegación
 */
export function blocksNavigation(level: ValidationLevel): boolean {
  return level === ValidationLevel.ERROR;
}

/**
 * Verificar si el nivel requiere confirmación del usuario
 */
export function requiresConfirmation(level: ValidationLevel): boolean {
  return level === ValidationLevel.WARNING;
}

/**
 * Obtener orden de prioridad (mayor = más crítico)
 */
export function getValidationPriority(level: ValidationLevel): number {
  const priorities: Record<ValidationLevel, number> = {
    [ValidationLevel.ERROR]: 5,
    [ValidationLevel.WARNING]: 4,
    [ValidationLevel.INFO]: 3,
    [ValidationLevel.HINT]: 2,
    [ValidationLevel.SUCCESS]: 1,
  };

  return priorities[level];
}
