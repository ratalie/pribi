/**
 * FlowItemValidation
 *
 * Define las reglas de validación de un FlowItem.
 *
 * @module FlowItemValidation
 */

import type { ValidationLevel } from "./enums";

/**
 * Interfaz para la validación de un FlowItem
 *
 * Agrupa todas las propiedades relacionadas con la validación
 * del item antes de permitir navegación.
 */
export interface FlowItemValidation {
  /**
   * Requiere validación antes de marcar como completado
   *
   * @default false
   */
  required: boolean;

  /**
   * Función de validación personalizada
   * Retorna true si es válido, o un array de errores
   */
  validator?: () => boolean | ValidationResult | Promise<boolean | ValidationResult>;

  /**
   * Validar automáticamente al salir del item
   *
   * @default false
   */
  validateOnExit: boolean;

  /**
   * Validar automáticamente al entrar al item
   *
   * @default false
   */
  validateOnEnter: boolean;

  /**
   * Bloquear navegación si hay errores
   *
   * @default true
   */
  blockNavigationOnError: boolean;

  /**
   * Mostrar modal de confirmación en warnings
   *
   * @default true
   */
  confirmOnWarning: boolean;

  /**
   * Mensaje de error por defecto
   *
   * @example 'Debe completar todos los campos obligatorios'
   */
  defaultErrorMessage?: string;

  /**
   * Lista de campos requeridos (IDs)
   *
   * @example ['nombre', 'ruc', 'direccion']
   */
  requiredFields?: string[];

  /**
   * Dependencias de otros items
   * Este item requiere que otros estén completados
   *
   * @example ['paso-1', 'paso-2']
   */
  dependsOn?: string[];

  /**
   * Timeout de validación en milisegundos
   *
   * @default 5000
   */
  validationTimeout?: number;

  /**
   * Reintentos permitidos si falla validación
   *
   * @default 3
   */
  maxRetries?: number;

  /**
   * Debounce de validación en milisegundos
   * Para validaciones en tiempo real
   *
   * @default 300
   */
  debounceMs?: number;
}

/**
 * Resultado de una validación
 */
export interface ValidationResult {
  /**
   * La validación fue exitosa
   */
  valid: boolean;

  /**
   * Mensajes de validación agrupados por nivel
   */
  messages: ValidationMessage[];

  /**
   * Timestamp de la validación
   */
  timestamp?: Date;

  /**
   * Datos adicionales de contexto
   */
  metadata?: Record<string, unknown>;
}

/**
 * Mensaje de validación individual
 */
export interface ValidationMessage {
  /**
   * Nivel de severidad del mensaje
   */
  level: ValidationLevel;

  /**
   * Texto del mensaje
   */
  message: string;

  /**
   * Campo relacionado (opcional)
   */
  field?: string;

  /**
   * Código de error (opcional)
   */
  code?: string;

  /**
   * Path al campo en objeto anidado
   *
   * @example 'socio.datos.nombres'
   */
  path?: string;
}
