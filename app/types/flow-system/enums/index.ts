/**
 * Enums centralizados del sistema de flujos
 *
 * Este archivo exporta todos los enums utilizados en el sistema,
 * permitiendo separar el contenido y facilitar el mantenimiento.
 *
 * @module FlowSystemEnums
 */

// Flow Item Type
export { FlowItemType, getFlowItemTypeLabel, isFlowItemType } from "./flow-item-type.enum";

// Render Mode
export {
  getRenderModeDescription,
  getRenderModeLabel,
  isRenderMode,
  RenderMode,
} from "./render-mode.enum";

// Navigation Behavior
export {
  changesUrl,
  getNavigationBehaviorLabel,
  isNavigationBehavior,
  NavigationBehavior,
  requiresUrl,
} from "./navigation-behavior.enum";

// Validation Level
export {
  blocksNavigation,
  getValidationLevelColor,
  getValidationLevelLabel,
  getValidationPriority,
  isValidationLevel,
  requiresConfirmation,
  ValidationLevel,
} from "./validation-level.enum";

// Sidebar Position
export {
  getSidebarPositionClass,
  getSidebarPositionLabel,
  isHorizontalPosition,
  isSidebarPosition,
  isVerticalPosition,
  SidebarPosition,
} from "./sidebar-position.enum";
