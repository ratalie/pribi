/**
 * FlowItemIdentity
 *
 * Define la identidad única de un FlowItem dentro del sistema.
 *
 * @module FlowItemIdentity
 */

import type { FlowItemType } from "./enums";

/**
 * Interfaz para la identidad de un FlowItem
 *
 * Agrupa todas las propiedades relacionadas con la identificación
 * única de un item dentro del flujo.
 */
export interface FlowItemIdentity {
  /**
   * Identificador único del item
   * Debe ser único dentro del FlowConfig
   *
   * @example 'paso-1', 'seccion-documentos', 'action-guardar'
   */
  id: string;

  /**
   * Tipo del item
   * Determina cómo se renderiza y comporta el elemento
   */
  type: FlowItemType;

  /**
   * Label principal mostrado en el sidebar
   *
   * @example 'Datos Generales', 'Documentación', 'Guardar Borrador'
   */
  label: string;

  /**
   * Label corto para espacios reducidos (opcional)
   *
   * @example 'Datos', 'Docs', 'Guardar'
   */
  shortLabel?: string;

  /**
   * Descripción adicional (opcional)
   * Se puede mostrar como tooltip o texto secundario
   *
   * @example 'Complete los datos básicos de la sociedad'
   */
  description?: string;

  /**
   * Nombre del icono (opcional)
   * Debe corresponder a un icono disponible en el sistema
   *
   * @example 'IconBuilding', 'IconFileText', 'IconSave'
   */
  icon?: string;

  /**
   * Tags para categorización y filtrado (opcional)
   *
   * @example ['obligatorio', 'documentos', 'datos-basicos']
   */
  tags?: string[];

  /**
   * Indica si este item es un separador de categoría
   * Las categorías se renderizan sin círculo, solo como texto header
   * 
   * @example true para "Aumento de Capital", "Remociones", etc.
   */
  isCategory?: boolean;
}
