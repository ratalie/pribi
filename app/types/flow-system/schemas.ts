/**
 * Zod Schemas para validación
 *
 * Define todos los schemas de validación usando Zod para garantizar
 * type-safety en runtime además de compile-time.
 *
 * @module Schemas
 */

import { z } from "zod";
import {
  FlowItemType,
  NavigationBehavior,
  RenderMode,
  SidebarPosition,
  ValidationLevel,
} from "./enums";

// ============================================================================
// ENUMS SCHEMAS
// ============================================================================

export const FlowItemTypeSchema = z.nativeEnum(FlowItemType);
export const RenderModeSchema = z.nativeEnum(RenderMode);
export const NavigationBehaviorSchema = z.nativeEnum(NavigationBehavior);
export const ValidationLevelSchema = z.nativeEnum(ValidationLevel);
export const SidebarPositionSchema = z.nativeEnum(SidebarPosition);
export const RightSidebarContentTypeSchema = z.enum([
  "help",
  "info",
  "preview",
  "actions",
  "history",
  "comments",
  "custom",
]);

// ============================================================================
// IDENTITY SCHEMA
// ============================================================================

export const FlowItemIdentitySchema = z.object({
  id: z.string().min(1, "ID es requerido"),
  type: FlowItemTypeSchema,
  label: z.string().min(1, "Label es requerido"),
  shortLabel: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// ============================================================================
// HIERARCHY SCHEMA
// ============================================================================

export const FlowItemHierarchySchema = z.object({
  parentId: z.string().nullable(),
  level: z.number().int().min(0, "Level debe ser >= 0"),
  order: z.number().int().min(0, "Order debe ser >= 0"),
  children: z.array(z.string()).optional(),
  path: z.array(z.string()).optional(),
  maxDepth: z.number().int().min(0).nullable().optional(),
  sortable: z.boolean().optional(),
  canHaveChildren: z.boolean().optional(),
});

// ============================================================================
// NAVIGATION SCHEMA
// ============================================================================

export const FlowItemNavigationSchema = z
  .object({
    route: z.string().optional(),
    hash: z.string().optional(),
    query: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
    behavior: NavigationBehaviorSchema,
    externalUrl: z.string().url().optional(),
    eventName: z.string().optional(),
    eventPayload: z.record(z.unknown()).optional(),
    autoRedirectOnComplete: z.boolean().optional(),
    nextItemId: z.string().optional(),
    previousItemId: z.string().optional(),
    disableBackNavigation: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Si behavior es EXTERNAL, debe tener externalUrl
      if (data.behavior === NavigationBehavior.EXTERNAL) {
        return !!data.externalUrl;
      }
      // Si behavior es EMIT, debe tener eventName
      if (data.behavior === NavigationBehavior.EMIT) {
        return !!data.eventName;
      }
      // Si behavior es PUSH o REPLACE, debe tener route
      if ([NavigationBehavior.PUSH, NavigationBehavior.REPLACE].includes(data.behavior)) {
        return !!data.route;
      }
      return true;
    },
    {
      message: "Navigation behavior requiere campos específicos",
    }
  );

// ============================================================================
// BEHAVIOR SCHEMA
// ============================================================================

export const FlowItemBehaviorSchema = z.object({
  isActive: z.boolean(),
  isCompleted: z.boolean(),
  isDisabled: z.boolean(),
  isVisible: z.boolean(),
  isCollapsible: z.boolean(),
  isCollapsed: z.boolean(),
  isOptional: z.boolean(),
  requiresConfirmation: z.boolean(),
  confirmationMessage: z.string().optional(),
  isSkippable: z.boolean(),
  badge: z.union([z.string(), z.number()]).optional(),
  badgeColor: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  estimatedTime: z.number().int().min(0).optional(),
  allowEditAfterComplete: z.boolean().optional(),
  enableCondition: z.function().optional(),
  visibilityCondition: z.function().optional(),
});

// ============================================================================
// RIGHT SIDEBAR SCHEMA
// ============================================================================

export const RightSidebarActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string().optional(),
  handler: z.function(),
  variant: z.enum(["default", "outline", "ghost", "destructive"]).optional(),
  disabled: z.boolean().optional(),
});

export const RightSidebarLinkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  icon: z.string().optional(),
  external: z.boolean().optional(),
});

export const FlowItemRightSidebarSchema = z.object({
  enabled: z.boolean(),
  contentType: RightSidebarContentTypeSchema.optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  component: z.string().optional(),
  componentProps: z.record(z.unknown()).optional(),
  width: z.number().int().min(200).optional(),
  minWidth: z.number().int().min(200).optional(),
  maxWidth: z.number().int().min(200).optional(),
  resizable: z.boolean().optional(),
  collapsible: z.boolean().optional(),
  startCollapsed: z.boolean().optional(),
  sticky: z.boolean().optional(),
  actions: z.array(RightSidebarActionSchema).optional(),
  relatedLinks: z.array(RightSidebarLinkSchema).optional(),
  showOnMobile: z.boolean().optional(),
});

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

export const ValidationMessageSchema = z.object({
  level: ValidationLevelSchema,
  message: z.string(),
  field: z.string().optional(),
  code: z.string().optional(),
  path: z.string().optional(),
});

export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  messages: z.array(ValidationMessageSchema),
  timestamp: z.date().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const FlowItemValidationSchema = z.object({
  required: z.boolean(),
  validator: z.function().optional(),
  validateOnExit: z.boolean(),
  validateOnEnter: z.boolean(),
  blockNavigationOnError: z.boolean(),
  confirmOnWarning: z.boolean(),
  defaultErrorMessage: z.string().optional(),
  requiredFields: z.array(z.string()).optional(),
  dependsOn: z.array(z.string()).optional(),
  validationTimeout: z.number().int().min(0).optional(),
  maxRetries: z.number().int().min(0).optional(),
  debounceMs: z.number().int().min(0).optional(),
});

// ============================================================================
// FLOW ITEM SCHEMA
// ============================================================================

export const FlowItemSchema = z.object({
  identity: FlowItemIdentitySchema,
  hierarchy: FlowItemHierarchySchema,
  navigation: FlowItemNavigationSchema,
  behavior: FlowItemBehaviorSchema,
  rightSidebar: FlowItemRightSidebarSchema,
  validation: FlowItemValidationSchema,
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  version: z.number().int().min(1).optional(),
});

// ============================================================================
// FLOW CONFIG SCHEMAS
// ============================================================================

export const FlowRenderOptionsSchema = z.object({
  mode: RenderModeSchema,
  mobileMode: RenderModeSchema.optional(),
  showProgress: z.boolean().optional(),
  showCompletionStatus: z.boolean().optional(),
  showIcons: z.boolean().optional(),
  showBadges: z.boolean().optional(),
  showStepNumbers: z.boolean().optional(),
  allowFreeNavigation: z.boolean().optional(),
  animateTransitions: z.boolean().optional(),
  animationDuration: z.number().int().min(0).optional(),
  highlightActive: z.boolean().optional(),
  themeColor: z.string().optional(),
  customClasses: z.string().optional(),
});

export const FlowSidebarOptionsSchema = z.object({
  position: SidebarPositionSchema,
  width: z.number().int().min(200).optional(),
  minWidth: z.number().int().min(200).optional(),
  maxWidth: z.number().int().min(200).optional(),
  collapsible: z.boolean().optional(),
  startCollapsed: z.boolean().optional(),
  startCollapsedMobile: z.boolean().optional(),
  resizable: z.boolean().optional(),
  sticky: z.boolean().optional(),
  stickyOffset: z.number().int().min(0).optional(),
  showHeader: z.boolean().optional(),
  headerTitle: z.string().optional(),
  showFooter: z.boolean().optional(),
  footerComponent: z.string().optional(),
  customClasses: z.string().optional(),
  mobileVariant: z.enum(["drawer", "bottom-sheet", "hidden"]).optional(),
});

export const FlowRightSidebarOptionsSchema = z.object({
  enabled: z.boolean(),
  defaultWidth: z.number().int().min(200).optional(),
  sticky: z.boolean().optional(),
  stickyOffset: z.number().int().min(0).optional(),
  allowItemOverride: z.boolean().optional(),
});

export const FlowLifecycleHooksSchema = z.object({
  onMount: z.function().optional(),
  onUnmount: z.function().optional(),
  beforeNavigate: z.function().optional(),
  afterNavigate: z.function().optional(),
  onItemComplete: z.function().optional(),
  onFlowComplete: z.function().optional(),
  onProgressChange: z.function().optional(),
});

export const FlowConfigSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
  name: z.string().min(1, "Name es requerido"),
  description: z.string().optional(),
  version: z.string().optional(),
  items: z.array(FlowItemSchema).min(1, "Debe tener al menos un item"),
  renderOptions: FlowRenderOptionsSchema,
  sidebarOptions: FlowSidebarOptionsSchema,
  rightSidebarOptions: FlowRightSidebarOptionsSchema.optional(),
  lifecycle: FlowLifecycleHooksSchema.optional(),
  permissions: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validar FlowItem
 */
export function validateFlowItem(data: unknown) {
  return FlowItemSchema.safeParse(data);
}

/**
 * Validar FlowConfig
 */
export function validateFlowConfig(data: unknown) {
  return FlowConfigSchema.safeParse(data);
}

/**
 * Validar array de FlowItems
 */
export function validateFlowItems(data: unknown) {
  return z.array(FlowItemSchema).safeParse(data);
}

/**
 * Validar parcialmente (útil para updates)
 */
export function validateFlowItemPartial(data: unknown) {
  return FlowItemSchema.partial().safeParse(data);
}

/**
 * Validar FlowItemIdentity standalone
 */
export function validateFlowItemIdentity(data: unknown) {
  return FlowItemIdentitySchema.safeParse(data);
}

/**
 * Validar FlowItemHierarchy standalone
 */
export function validateFlowItemHierarchy(data: unknown) {
  return FlowItemHierarchySchema.safeParse(data);
}

/**
 * Validar FlowItemNavigation standalone
 */
export function validateFlowItemNavigation(data: unknown) {
  return FlowItemNavigationSchema.safeParse(data);
}

/**
 * Validar FlowItemBehavior standalone
 */
export function validateFlowItemBehavior(data: unknown) {
  return FlowItemBehaviorSchema.safeParse(data);
}

/**
 * Validar FlowItemRightSidebar standalone
 */
export function validateFlowItemRightSidebar(data: unknown) {
  return FlowItemRightSidebarSchema.safeParse(data);
}

/**
 * Validar FlowItemValidation standalone
 */
export function validateFlowItemValidation(data: unknown) {
  return FlowItemValidationSchema.safeParse(data);
}
