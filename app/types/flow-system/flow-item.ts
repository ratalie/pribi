/**
 * FlowItem - Entidad Principal
 *
 * Representa un elemento individual dentro de un flujo de navegación.
 * Combina todas las interfaces agrupadas en una entidad cohesiva.
 *
 * @module FlowItem
 */

import type { FlowItemBehavior } from "./behavior";
import type { FlowItemHierarchy } from "./hierarchy";
import type { FlowItemIdentity } from "./identity";
import type { FlowItemNavigation } from "./navigation";
import type { FlowItemRightSidebar } from "./right-sidebar";
import type { FlowItemValidation } from "./validation";

/**
 * FlowItem - Entidad completa
 *
 * Un FlowItem representa cualquier elemento interactivo en el sistema
 * de navegación: secciones, pasos, acciones, divisores, etc.
 *
 * Esta entidad agrupa 6 interfaces principales para mantener
 * el código organizado y facilitar el mantenimiento.
 *
 * @example
 * ```typescript
 * const flowItem: FlowItem = {
 *   identity: {
 *     id: 'paso-datos-generales',
 *     type: FlowItemType.STEP,
 *     label: 'Datos Generales',
 *     icon: 'IconBuilding'
 *   },
 *   hierarchy: {
 *     parentId: 'seccion-registro',
 *     level: 1,
 *     order: 0
 *   },
 *   navigation: {
 *     route: '/registro-societario/datos-generales',
 *     behavior: NavigationBehavior.PUSH
 *   },
 *   behavior: {
 *     isActive: false,
 *     isCompleted: false,
 *     isDisabled: false,
 *     isVisible: true,
 *     isCollapsible: false,
 *     isCollapsed: false,
 *     isOptional: false,
 *     requiresConfirmation: false,
 *     isSkippable: false
 *   },
 *   rightSidebar: {
 *     enabled: true,
 *     contentType: 'help',
 *     title: 'Ayuda: Datos Generales'
 *   },
 *   validation: {
 *     required: true,
 *     validateOnExit: true,
 *     validateOnEnter: false,
 *     blockNavigationOnError: true,
 *     confirmOnWarning: true
 *   }
 * };
 * ```
 */
export interface FlowItem {
  /**
   * Identidad del item
   * Define id, type, label, descripción, icono, etc.
   */
  identity: FlowItemIdentity;

  /**
   * Jerarquía del item
   * Define parentId, level, order, children, path, etc.
   */
  hierarchy: FlowItemHierarchy;

  /**
   * Navegación del item
   * Define route, hash, query, behavior, eventos, etc.
   */
  navigation: FlowItemNavigation;

  /**
   * Comportamiento del item
   * Define estados (active, completed, disabled, visible, etc.)
   */
  behavior: FlowItemBehavior;

  /**
   * Right sidebar contextual
   * Define configuración del sidebar auxiliar
   */
  rightSidebar: FlowItemRightSidebar;

  /**
   * Validación del item
   * Define reglas de validación y dependencias
   */
  validation: FlowItemValidation;

  /**
   * Metadata adicional personalizada
   * Permite extender la entidad sin modificar la estructura
   */
  metadata?: Record<string, unknown>;

  /**
   * Timestamp de creación
   */
  createdAt?: Date;

  /**
   * Timestamp de última actualización
   */
  updatedAt?: Date;

  /**
   * Versión del item (para control de cambios)
   */
  version?: number;
}

/**
 * FlowItem parcial para creación
 * Solo requiere los campos mínimos necesarios
 */
export type FlowItemInput = Pick<FlowItem, "identity" | "hierarchy" | "navigation"> &
  Partial<Omit<FlowItem, "identity" | "hierarchy" | "navigation">>;

/**
 * FlowItem para actualización
 * Todos los campos son opcionales excepto el id
 */
export type FlowItemUpdate = Partial<FlowItem> & {
  identity: { id: string } & Partial<FlowItemIdentity>;
};

/**
 * FlowItem con hijos resueltos (árbol completo)
 */
export interface FlowItemTree extends FlowItem {
  /**
   * Items hijos resueltos (no solo IDs)
   */
  children?: FlowItemTree[];
}
