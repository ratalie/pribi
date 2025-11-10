/**
 * Configuración del layout para el flujo de Juntas de Accionistas
 *
 * Este flujo tiene 3 sidebars:
 * 1. Sidebar izquierdo: Navegación jerárquica (Nivel 0-3)
 *    Muestra: Pasos principales → Categorías → Items
 * 2. Content principal: Formularios del nivel actual
 * 3. Sidebar derecho: Scroll anchors (Nivel 4) - Solo visible en Nivel 3+
 */

import type { FlowLayoutConfig, SidebarConfig } from "~/types/flow-layout";
import { defineFlowLayout } from "~/types/flow-layout/flow-layout-config";
import { buildFlowItemTree } from "~/utils/flowHelpers";
import { juntaAccionistasFlowConfig } from "./junta-accionistas.flow";

// Construir el árbol de items del flow
const flowTree = buildFlowItemTree(juntaAccionistasFlowConfig.items);

/**
 * Sidebar izquierdo: Navegación principal (Nivel 0-3)
 * Muestra pasos principales + categorías + items
 */
const mainSidebar: SidebarConfig = {
  id: "juntas-main-sidebar",
  position: "left",
  mode: "sequential",
  items: flowTree,
  title: "Juntas de Accionistas",

  // Filtro: Mostrar niveles 0, 1 y 2 (pasos principales, categorías e items)
  filter: {
    type: "level",
    criteria: {
      minLevel: 0,
      maxLevel: 2,
    },
  },

  // Opciones de visualización
  collapsible: false,
  collapsed: false,
  persistCollapseState: false,

  // Estilos
  width: "280px",
  collapsedWidth: "60px",
  class: "juntas-main-sidebar",
};

/**
 * Sidebar derecho: Scroll anchors (Nivel 4)
 * Solo visible cuando el item actual es nivel 3 o superior
 * Muestra las sub-secciones (nivel 4) del item actual nivel 3
 */
const stepsSidebar: SidebarConfig = {
  id: "juntas-steps-sidebar",
  position: "right",
  mode: "sequential",
  items: flowTree,
  title: "Secciones",

  // Filtro: Mostrar niveles 3 y 4 (agrupadores + secciones)
  filter: {
    type: "level",
    criteria: {
      minLevel: 3,
      maxLevel: 4,
    },
  },

  // Transformación contextual: Mostrar solo items relevantes al contexto actual
  transformItems: (items) => {
    // Esta función se ejecuta DESPUÉS del filtro de nivel
    // Necesitamos acceso al currentItem para filtrar contextualmente
    // Por ahora retornamos todos, luego implementaremos la lógica contextual
    return items;
  },

  // Regla de visibilidad: Mostrar cuando estamos en nivel 2 (para ver hijos nivel 3) o en nivel 3-4
  visibilityRule: {
    type: "custom",
    fn: (context) => {
      const level = context.currentItem?.hierarchy.level;
      console.log("[DEBUG] RightSidebar visibility check - current level:", level);
      
      // Mostrar sidebar derecho cuando:
      // 1. Estamos en nivel 0-2 y el item tiene children (para mostrar sub-pasos)
      // 2. O estamos en nivel 3-4 (mostrar pasos hermanos / anchors)
      const hasChildren = context.currentItem?.children && context.currentItem.children.length > 0;
      const result = ((level !== undefined && level <= 2) && hasChildren) || (level !== undefined && level >= 3);
      
      console.log("[DEBUG] - Has children:", hasChildren);
      console.log("[DEBUG] RightSidebar should be visible:", result);
      return result;
    },
  },

  // Opciones de visualización
  collapsible: true,
  collapsed: false,
  persistCollapseState: true,

  // Estilos
  width: "320px",
  collapsedWidth: "60px",
  class: "juntas-steps-sidebar",
};

/**
 * Configuración completa del layout de Juntas
 */
export const juntasLayoutConfig: FlowLayoutConfig = defineFlowLayout({
  id: "juntas-accionistas-layout",
  name: "Juntas de Accionistas",
  type: "wizard",

  // FlowConfig base
  flowConfig: juntaAccionistasFlowConfig,

  // Sidebars (en orden de visualización)
  sidebars: [mainSidebar, stepsSidebar],

  // Opciones de navegación
  navigation: {
    allowFreeNavigation: false,
    markPreviousAsCompleted: true,
    scrollToTop: true,
    useTransitions: true,
    transitionName: "fade",
  },

  // Validación
  validation: {
    validateOnNavigate: true,
    validateOnComplete: true,
    showValidationErrors: true,
    allowNavigationWithErrors: false,
  },

  // Persistencia
  persistence: {
    enabled: true,
    localStorage: true,
    backend: false,
    storageKey: "juntas-accionistas-progress",
    autoSaveInterval: 30000,
  },

  // Opciones de UI
  showLoadingSkeleton: true,
  showSaveIndicator: true,
});

/**
 * Exportar default para uso directo
 */
export default juntasLayoutConfig;
