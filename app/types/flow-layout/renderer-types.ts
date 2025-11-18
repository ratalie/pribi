/**
 * Tipos para componentes de renderizado
 *
 * Define la interfaz común para todos los renderers
 * (Hierarchical, Sequential, Flat, Custom)
 */

import type { FlowItemTree } from "../flow-system/flow-item";

/**
 * Props comunes para todos los renderers
 */
export interface RendererProps {
  /**
   * Items a renderizar
   */
  items: FlowItemTree[];

  /**
   * Ruta actual (para destacar item activo)
   */
  currentPath?: string;

  /**
   * Nivel inicial (para renderizado recursivo)
   * @default 0
   */
  level?: number;

  /**
   * ¿Mostrar iconos de estado?
   * @default true
   */
  showStatusIcons?: boolean;

  /**
   * ¿Mostrar descripciones?
   * @default false
   */
  showDescriptions?: boolean;

  /**
   * ¿Permitir navegación?
   * @default true
   */
  allowNavigation?: boolean;

  /**
   * Clases CSS adicionales
   */
  class?: string | string[] | Record<string, boolean>;
}

/**
 * Eventos emitidos por los renderers
 */
export interface RendererEmits {
  /**
   * Emitido cuando el usuario hace clic en un item
   */
  navigate: (item: FlowItemTree) => void;

  /**
   * Emitido cuando se expande/colapsa un item (solo hierarchical)
   */
  toggle: (item: FlowItemTree, expanded: boolean) => void;

  /**
   * Emitido cuando se hace hover sobre un item
   */
  hover: (item: FlowItemTree | null) => void;
}

/**
 * Contexto disponible para todos los renderers
 */
export interface RendererContext {
  /**
   * Item actualmente activo
   */
  currentItem?: FlowItemTree;

  /**
   * Todos los items del flujo
   */
  allItems: FlowItemTree[];

  /**
   * Función para verificar si un item está activo
   */
  isActive: (item: FlowItemTree) => boolean;

  /**
   * Función para verificar si un item es navegable
   */
  isNavigable: (item: FlowItemTree) => boolean;

  /**
   * Función para obtener las clases CSS de un item
   */
  getItemClasses: (item: FlowItemTree) => Record<string, boolean>;
}
