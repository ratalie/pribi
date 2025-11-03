/**
 * Flow System - Sistema Universal de Flujos de Navegación
 *
 * Exporta todas las interfaces, tipos, enums, helpers y utilidades
 * del sistema de flujos de navegación.
 *
 * @module FlowSystem
 * @version 1.0.0
 */

// ============================================================================
// ENUMS
// ============================================================================

export {
  blocksNavigation,
  changesUrl,
  // Flow Item Type
  FlowItemType,
  getFlowItemTypeLabel,
  getNavigationBehaviorLabel,
  getRenderModeDescription,
  getRenderModeLabel,
  getSidebarPositionClass,
  getSidebarPositionLabel,
  getValidationLevelColor,
  getValidationLevelLabel,
  getValidationPriority,
  isFlowItemType,
  isHorizontalPosition,
  isNavigationBehavior,
  isRenderMode,
  isSidebarPosition,
  isValidationLevel,
  isVerticalPosition,
  // Navigation Behavior
  NavigationBehavior,
  // Render Mode
  RenderMode,
  requiresConfirmation as requiresConfirmationForLevel,
  requiresUrl,
  // Sidebar Position
  SidebarPosition,
  // Validation Level
  ValidationLevel,
} from "./enums";

// ============================================================================
// INTERFACES - Agrupadas
// ============================================================================

export type { FlowItemBehavior } from "./behavior";
export type { FlowItemHierarchy } from "./hierarchy";
export type { FlowItemIdentity } from "./identity";
export type { FlowItemNavigation } from "./navigation";

export type {
  FlowItemRightSidebar,
  RightSidebarAction,
  RightSidebarContentType,
  RightSidebarLink,
} from "./right-sidebar";

export type { FlowItemValidation, ValidationMessage, ValidationResult } from "./validation";

// ============================================================================
// ENTITIES - Principales
// ============================================================================

export type { FlowItem, FlowItemInput, FlowItemTree, FlowItemUpdate } from "./flow-item";

export type {
  FlowConfig,
  FlowConfigInput,
  FlowConfigUpdate,
  FlowLifecycleHooks,
  FlowRenderOptions,
  FlowRightSidebarOptions,
  FlowSidebarOptions,
} from "./flow-config";

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export {
  FlowConfigSchema,
  FlowItemBehaviorSchema,
  FlowItemHierarchySchema,
  // Interface Schemas
  FlowItemIdentitySchema,
  FlowItemNavigationSchema,
  FlowItemRightSidebarSchema,
  // Entity Schemas
  FlowItemSchema,
  // Enum Schemas
  FlowItemTypeSchema,
  FlowItemValidationSchema,
  FlowLifecycleHooksSchema,
  FlowRenderOptionsSchema,
  FlowRightSidebarOptionsSchema,
  FlowSidebarOptionsSchema,
  NavigationBehaviorSchema,
  RenderModeSchema,
  RightSidebarActionSchema,
  RightSidebarContentTypeSchema,
  RightSidebarLinkSchema,
  SidebarPositionSchema,
  validateFlowConfig,
  // Validation Functions
  validateFlowItem,
  validateFlowItemBehavior,
  validateFlowItemHierarchy,
  validateFlowItemIdentity,
  validateFlowItemNavigation,
  validateFlowItemPartial,
  validateFlowItemRightSidebar,
  validateFlowItems,
  validateFlowItemValidation,
  ValidationLevelSchema,
  ValidationMessageSchema,
  ValidationResultSchema,
} from "./schemas";

// ============================================================================
// HELPERS
// ============================================================================

export {
  // Manipulación de Jerarquía
  buildItemTree,
  // Estado y Progreso
  calculateProgress,
  // Validación
  canNavigateToItem,
  cloneFlowConfig,
  // Utilidades
  cloneFlowItem,
  filterItemsByLevel,
  filterItemsByType,
  // Búsqueda y Filtrado
  findItemById,
  findItemsByIds,
  flattenItemTree,
  getActiveItem,
  getAncestors,
  getChildrenOf,
  getDescendants,
  getNextIncompleteItem,
  getRootItems,
  isFlowCompleted,
  mergeFlowItem,
} from "./helpers";

// ============================================================================
// TYPE GUARDS
// ============================================================================

export {
  hasBadge,
  hasChildren,
  hasDependencies,
  hasRightSidebar,
  isAction,
  isActiveItem,
  isCollapsedItem,
  isCollapsibleItem,
  isCompletedItem,
  isCustom,
  isDisabledItem,
  isDivider,
  isFlowConfig,
  isFlowConfigArray,
  // Entity Type Guards
  isFlowItem,
  // Array Type Guards
  isFlowItemArray,
  isFlowItemBehavior,
  isFlowItemHierarchy,
  // Interface Type Guards
  isFlowItemIdentity,
  isFlowItemNavigation,
  isFlowItemRightSidebar,
  isFlowItemTree,
  isFlowItemTreeArray,
  isFlowItemValidation,
  isHeader,
  isOptionalItem,
  isRootItem,
  // Specific State Checks
  isSection,
  isSkippableItem,
  isStep,
  isSubsection,
  isValidationResult,
  isVisibleItem,
  requiresConfirmation,
  requiresValidation,
} from "./type-guards";
