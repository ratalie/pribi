/**
 * Configuración completa para un sidebar en el sistema universal
 *
 * Este tipo permite definir cualquier sidebar de forma declarativa,
 * desde navegación jerárquica hasta listas secuenciales.
 *
 * @example
 * ```typescript
 * const leftSidebar: SidebarConfig = {
 *   id: 'juntas-left',
 *   position: 'left',
 *   title: 'Navegación',
 *   mode: 'hierarchical',
 *   items: juntasItems,
 *   width: '280px',
 * };
 * ```
 */

import type { Component } from "vue";
import type { FlowItemTree } from "../flow-system/flow-item";

/**
 * Posición del sidebar en el layout
 */
export type SidebarPosition = "left" | "right";

/**
 * Modos de renderizado disponibles
 *
 * - hierarchical: Árbol colapsable con niveles anidados
 * - sequential: Lista numerada (wizard steps)
 * - flat: Lista simple sin jerarquía
 * - custom: Renderizado personalizado
 */
export type SidebarRenderMode = "hierarchical" | "sequential" | "flat" | "custom";

/**
 * Tipos de filtros soportados
 */
export type FilterType = "level" | "property" | "custom";

/**
 * Tipos de reglas de visibilidad
 */
export type VisibilityRuleType = "property" | "route" | "custom";

/**
 * Configuración de filtro para items
 *
 * @example
 * ```typescript
 * // Filtrar solo niveles 0-2
 * filter: {
 *   type: 'level',
 *   criteria: { minLevel: 0, maxLevel: 2 }
 * }
 *
 * // Filtrar por propiedad
 * filter: {
 *   type: 'property',
 *   criteria: { path: 'rightSidebar.enabled', equals: true }
 * }
 * ```
 */
export interface FilterConfig {
  type: FilterType;
  criteria: FilterCriteria;
}

/**
 * Criterios de filtrado
 */
export type FilterCriteria =
  | LevelFilterCriteria
  | PropertyFilterCriteria
  | CustomFilterCriteria;

/**
 * Filtrar por nivel jerárquico
 */
export interface LevelFilterCriteria {
  minLevel?: number;
  maxLevel?: number;
}

/**
 * Filtrar por valor de propiedad
 */
export interface PropertyFilterCriteria {
  path: string; // e.g., 'rightSidebar.enabled'
  equals?: any;
  notEquals?: any;
  contains?: any;
}

/**
 * Filtro personalizado con función
 */
export interface CustomFilterCriteria {
  fn: (item: FlowItemTree) => boolean;
}

/**
 * Regla de visibilidad del sidebar
 *
 * @example
 * ```typescript
 * // Visible solo si item activo tiene rightSidebar habilitado
 * visibilityRule: {
 *   type: 'property',
 *   path: 'currentItem.rightSidebar.enabled',
 *   equals: true
 * }
 *
 * // Visible solo en ciertas rutas
 * visibilityRule: {
 *   type: 'route',
 *   pattern: '/operaciones/junta-accionistas/**'
 * }
 * ```
 */
export interface VisibilityRule {
  type: VisibilityRuleType;
  path?: string;
  pattern?: string;
  equals?: any;
  notEquals?: any;
  fn?: (context: VisibilityContext) => boolean;
}

/**
 * Contexto para evaluar reglas de visibilidad
 */
export interface VisibilityContext {
  currentPath: string;
  currentItem?: FlowItemTree;
  allItems: FlowItemTree[];
  params?: Record<string, string>;
}

/**
 * Configuración del footer del sidebar
 */
export interface SidebarFooterConfig {
  component: Component;
  props?: Record<string, any>;
}

/**
 * Configuración completa de un sidebar
 *
 * Esta es la estructura principal que define todo el comportamiento
 * de un sidebar en el sistema universal.
 */
export interface SidebarConfig {
  // ============================================
  // IDENTIFICACIÓN
  // ============================================

  /**
   * ID único del sidebar
   * @example 'juntas-left', 'sucursales-right'
   */
  id: string;

  /**
   * Posición en el layout
   */
  position: SidebarPosition;

  // ============================================
  // CONTENIDO
  // ============================================

  /**
   * Título del sidebar (opcional)
   * @example 'Navegación', 'Pasos del Proceso'
   */
  title?: string;

  /**
   * Items a mostrar en el sidebar
   */
  items: FlowItemTree[];

  /**
   * Modo de renderizado
   */
  mode: SidebarRenderMode;

  // ============================================
  // FILTROS Y TRANSFORMACIONES
  // ============================================

  /**
   * Filtro para seleccionar qué items mostrar
   * @example
   * ```typescript
   * filter: {
   *   type: 'level',
   *   criteria: { maxLevel: 2 }
   * }
   * ```
   */
  filter?: FilterConfig;

  /**
   * Función de transformación de items (opcional)
   * Permite modificar items antes de renderizarlos
   */
  transformItems?: (items: FlowItemTree[]) => FlowItemTree[];

  // ============================================
  // COMPORTAMIENTO
  // ============================================

  /**
   * Regla de visibilidad del sidebar
   * Si se omite, el sidebar siempre es visible
   */
  visibilityRule?: VisibilityRule;

  /**
   * ¿El sidebar se puede colapsar?
   * @default true
   */
  collapsible?: boolean;

  /**
   * ¿Está colapsado por defecto?
   * @default false
   */
  collapsed?: boolean;

  /**
   * ¿Sincronizar estado colapsado con localStorage?
   * @default true
   */
  persistCollapseState?: boolean;

  // ============================================
  // ESTILOS
  // ============================================

  /**
   * Ancho del sidebar
   * @default '280px'
   * @example '320px', '25%', 'auto'
   */
  width?: string;

  /**
   * Ancho cuando está colapsado
   * @default '60px'
   */
  collapsedWidth?: string;

  /**
   * Clases CSS adicionales
   */
  class?: string | string[] | Record<string, boolean>;

  // ============================================
  // FOOTER (OPCIONAL)
  // ============================================

  /**
   * Configuración del footer del sidebar
   * @example
   * ```typescript
   * footer: {
   *   component: CollapseTrigger,
   *   props: { label: 'Colapsar' }
   * }
   * ```
   */
  footer?: SidebarFooterConfig;
}

/**
 * Configuración extendida con estado reactivo
 * (usado internamente por el componente FlowSidebar)
 */
export interface SidebarConfigWithState extends SidebarConfig {
  /**
   * Estado actual de colapsado (reactivo)
   */
  isCollapsed: boolean;

  /**
   * Items filtrados y transformados
   */
  filteredItems: FlowItemTree[];

  /**
   * ¿El sidebar está visible actualmente?
   */
  isVisible: boolean;
}
