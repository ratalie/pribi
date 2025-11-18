/**
 * Sistema Universal de Flow Layouts
 *
 * Este módulo proporciona tipos TypeScript para crear layouts
 * dinámicos con sidebars configurables.
 *
 * @module flow-layout
 *
 * @example
 * ```typescript
 * import { defineFlowLayout, type SidebarConfig } from '~/types/flow-layout';
 *
 * const leftSidebar: SidebarConfig = {
 *   id: 'main-nav',
 *   position: 'left',
 *   mode: 'hierarchical',
 *   items: myItems,
 * };
 *
 * const layout = defineFlowLayout({
 *   id: 'my-layout',
 *   name: 'Mi Layout',
 *   type: 'wizard',
 *   sidebars: [leftSidebar],
 * });
 * ```
 */

// ============================================
// SIDEBAR CONFIGURATION
// ============================================

export type {
  CustomFilterCriteria,
  FilterConfig,
  FilterCriteria,
  FilterType,
  LevelFilterCriteria,
  PropertyFilterCriteria,
  SidebarConfig,
  SidebarConfigWithState,
  SidebarFooterConfig,
  SidebarPosition,
  SidebarRenderMode,
  VisibilityContext,
  VisibilityRule,
  VisibilityRuleType,
} from "./sidebar-config";

// ============================================
// LAYOUT CONFIGURATION
// ============================================

export type {
  AnimationOptions,
  FlowLayoutConfig,
  FlowLayoutConfigResolved,
  FlowLayoutType,
  LayoutFooterConfig,
  LayoutHeaderConfig,
  NavigationOptions,
  PersistenceOptions,
  ValidationOptions,
} from "./flow-layout-config";

export { defineFlowLayout } from "./flow-layout-config";

// ============================================
// RENDERER TYPES
// ============================================

export type { RendererContext, RendererEmits, RendererProps } from "./renderer-types";

// ============================================
// NAVIGATION TYPES
// ============================================

export type {
  NavigationEvent,
  NavigationEventType,
  NavigationResult,
} from "./navigation-types";
