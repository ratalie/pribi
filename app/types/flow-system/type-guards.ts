/**
 * Type Guards
 *
 * Guardias de tipo para verificación en runtime.
 *
 * @module TypeGuards
 */

import type { FlowItemBehavior } from "./behavior";
import { FlowItemType } from "./enums";
import type { FlowConfig } from "./flow-config";
import type { FlowItem, FlowItemTree } from "./flow-item";
import type { FlowItemHierarchy } from "./hierarchy";
import type { FlowItemIdentity } from "./identity";
import type { FlowItemNavigation } from "./navigation";
import type { FlowItemRightSidebar } from "./right-sidebar";
import type { FlowItemValidation, ValidationResult } from "./validation";

// ============================================================================
// INTERFACES TYPE GUARDS
// ============================================================================

/**
 * Verificar si un objeto es un FlowItemIdentity válido
 */
export function isFlowItemIdentity(value: unknown): value is FlowItemIdentity {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    Object.values(FlowItemType).includes(obj.type as FlowItemType) &&
    typeof obj.label === "string"
  );
}

/**
 * Verificar si un objeto es un FlowItemHierarchy válido
 */
export function isFlowItemHierarchy(value: unknown): value is FlowItemHierarchy {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    (typeof obj.parentId === "string" || obj.parentId === null) &&
    typeof obj.level === "number" &&
    typeof obj.order === "number"
  );
}

/**
 * Verificar si un objeto es un FlowItemNavigation válido
 */
export function isFlowItemNavigation(value: unknown): value is FlowItemNavigation {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.behavior === "string" &&
    (obj.route === undefined || typeof obj.route === "string")
  );
}

/**
 * Verificar si un objeto es un FlowItemBehavior válido
 */
export function isFlowItemBehavior(value: unknown): value is FlowItemBehavior {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.isActive === "boolean" &&
    typeof obj.isCompleted === "boolean" &&
    typeof obj.isDisabled === "boolean" &&
    typeof obj.isVisible === "boolean"
  );
}

/**
 * Verificar si un objeto es un FlowItemRightSidebar válido
 */
export function isFlowItemRightSidebar(value: unknown): value is FlowItemRightSidebar {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return typeof obj.enabled === "boolean";
}

/**
 * Verificar si un objeto es un FlowItemValidation válido
 */
export function isFlowItemValidation(value: unknown): value is FlowItemValidation {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.required === "boolean" &&
    typeof obj.validateOnExit === "boolean" &&
    typeof obj.validateOnEnter === "boolean"
  );
}

/**
 * Verificar si un objeto es un ValidationResult válido
 */
export function isValidationResult(value: unknown): value is ValidationResult {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return typeof obj.valid === "boolean" && Array.isArray(obj.messages);
}

// ============================================================================
// ENTITIES TYPE GUARDS
// ============================================================================

/**
 * Verificar si un objeto es un FlowItem válido
 *
 * @example
 * ```typescript
 * if (isFlowItem(data)) {
 *   // TypeScript sabe que data es FlowItem
 *   console.log(data.identity.label);
 * }
 * ```
 */
export function isFlowItem(value: unknown): value is FlowItem {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    isFlowItemIdentity(obj.identity) &&
    isFlowItemHierarchy(obj.hierarchy) &&
    isFlowItemNavigation(obj.navigation) &&
    isFlowItemBehavior(obj.behavior) &&
    isFlowItemRightSidebar(obj.rightSidebar) &&
    isFlowItemValidation(obj.validation)
  );
}

/**
 * Verificar si un objeto es un FlowItemTree válido
 */
export function isFlowItemTree(value: unknown): value is FlowItemTree {
  if (!isFlowItem(value)) return false;

  const obj = value as unknown as Record<string, unknown>;

  if (obj.children !== undefined) {
    return Array.isArray(obj.children) && obj.children.every(isFlowItemTree);
  }

  return true;
}

/**
 * Verificar si un objeto es un FlowConfig válido
 *
 * @example
 * ```typescript
 * if (isFlowConfig(data)) {
 *   // TypeScript sabe que data es FlowConfig
 *   console.log(data.name);
 * }
 * ```
 */
export function isFlowConfig(value: unknown): value is FlowConfig {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    Array.isArray(obj.items) &&
    obj.items.every(isFlowItem) &&
    typeof obj.renderOptions === "object" &&
    typeof obj.sidebarOptions === "object"
  );
}

// ============================================================================
// SPECIFIC STATE CHECKS
// ============================================================================

/**
 * Verificar si un FlowItem es una sección
 */
export function isSection(item: FlowItem): boolean {
  return item.identity.type === FlowItemType.SECTION;
}

/**
 * Verificar si un FlowItem es un paso
 */
export function isStep(item: FlowItem): boolean {
  return item.identity.type === FlowItemType.STEP;
}

/**
 * Verificar si un FlowItem es una subsección
 */
export function isSubsection(item: FlowItem): boolean {
  return item.identity.type === FlowItemType.SUBSECTION;
}

/**
 * Verificar si un FlowItem es una acción
 */
export function isAction(item: FlowItem): boolean {
  return item.identity.type === FlowItemType.ACTION;
}

/**
 * Verificar si un FlowItem es un separador
 */
export function isDivider(item: FlowItem): boolean {
  return item.identity.type === FlowItemType.DIVIDER;
}

/**
 * Verificar si un FlowItem es un encabezado
 */
export function isHeader(item: FlowItem): boolean {
  return item.identity.type === FlowItemType.HEADER;
}

/**
 * Verificar si un FlowItem es un elemento customizado
 */
export function isCustom(item: FlowItem): boolean {
  return item.identity.type === FlowItemType.CUSTOM;
}

/**
 * Verificar si un FlowItem es raíz (no tiene padre)
 */
export function isRootItem(item: FlowItem): boolean {
  return item.hierarchy.parentId === null && item.hierarchy.level === 0;
}

/**
 * Verificar si un FlowItem tiene hijos
 */
export function hasChildren(item: FlowItem): boolean {
  return item.hierarchy.children !== undefined && item.hierarchy.children.length > 0;
}

/**
 * Verificar si un FlowItem está activo
 */
export function isActiveItem(item: FlowItem): boolean {
  return item.behavior.isActive;
}

/**
 * Verificar si un FlowItem está completado
 */
export function isCompletedItem(item: FlowItem): boolean {
  return item.behavior.isCompleted;
}

/**
 * Verificar si un FlowItem está deshabilitado
 */
export function isDisabledItem(item: FlowItem): boolean {
  return item.behavior.isDisabled;
}

/**
 * Verificar si un FlowItem es visible
 */
export function isVisibleItem(item: FlowItem): boolean {
  return item.behavior.isVisible;
}

/**
 * Verificar si un FlowItem es opcional
 */
export function isOptionalItem(item: FlowItem): boolean {
  return item.behavior.isOptional;
}

/**
 * Verificar si un FlowItem es colapsable
 */
export function isCollapsibleItem(item: FlowItem): boolean {
  return item.behavior.isCollapsible;
}

/**
 * Verificar si un FlowItem está colapsado
 */
export function isCollapsedItem(item: FlowItem): boolean {
  return item.behavior.isCollapsed;
}

/**
 * Verificar si un FlowItem requiere confirmación
 */
export function requiresConfirmation(item: FlowItem): boolean {
  return item.behavior.requiresConfirmation;
}

/**
 * Verificar si un FlowItem es salteable
 */
export function isSkippableItem(item: FlowItem): boolean {
  return item.behavior.isSkippable;
}

/**
 * Verificar si un FlowItem tiene badge
 */
export function hasBadge(item: FlowItem): boolean {
  return item.behavior.badge !== undefined && item.behavior.badge !== "";
}

/**
 * Verificar si un FlowItem tiene right sidebar habilitado
 */
export function hasRightSidebar(item: FlowItem): boolean {
  return item.rightSidebar.enabled;
}

/**
 * Verificar si un FlowItem requiere validación
 */
export function requiresValidation(item: FlowItem): boolean {
  return item.validation.required;
}

/**
 * Verificar si un FlowItem tiene dependencias
 */
export function hasDependencies(item: FlowItem): boolean {
  return item.validation.dependsOn !== undefined && item.validation.dependsOn.length > 0;
}

// ============================================================================
// ARRAY TYPE GUARDS
// ============================================================================

/**
 * Verificar si un array contiene solo FlowItems válidos
 */
export function isFlowItemArray(value: unknown): value is FlowItem[] {
  return Array.isArray(value) && value.every(isFlowItem);
}

/**
 * Verificar si un array contiene solo FlowItemTree válidos
 */
export function isFlowItemTreeArray(value: unknown): value is FlowItemTree[] {
  return Array.isArray(value) && value.every(isFlowItemTree);
}

/**
 * Verificar si un array contiene solo FlowConfigs válidos
 */
export function isFlowConfigArray(value: unknown): value is FlowConfig[] {
  return Array.isArray(value) && value.every(isFlowConfig);
}
