/**
 * Configuración del layout para el flujo de Sucursales
 *
 * Este flujo tiene 2 sidebars:
 * 1. Sidebar izquierdo: Navegación plana (todas las sucursales al mismo nivel)
 * 2. Content principal: Formularios de la sucursal activa
 */

import type { FlowLayoutConfig, SidebarConfig } from "~/types/flow-layout";
import { defineFlowLayout } from "~/types/flow-layout/flow-layout-config";
import { buildFlowItemTree } from "~~/docs/utils/flowHelpers";
import { sucursalesFlowConfig } from "./sucursales.flow";

// Construir el árbol de items del flow
const flowTree = buildFlowItemTree(sucursalesFlowConfig.items);

/**
 * Sidebar izquierdo: Navegación de sucursales (lista plana)
 */
const mainSidebar: SidebarConfig = {
  id: "sucursales-main-sidebar",
  position: "left",
  mode: "flat",
  items: flowTree,
  title: "Sucursales",

  // Sin filtro: Mostrar todos los items (todos están en el mismo nivel)

  // Opciones de visualización
  collapsible: true,
  collapsed: false,
  persistCollapseState: true,

  // Estilos
  width: "280px",
  collapsedWidth: "60px",
  class: "sucursales-main-sidebar",
};

/**
 * Configuración completa del layout de Sucursales
 */
export const sucursalesLayoutConfig: FlowLayoutConfig = defineFlowLayout({
  id: "sucursales-layout",
  name: "Gestión de Sucursales",
  type: "documentation",

  // FlowConfig base
  flowConfig: sucursalesFlowConfig,

  // Sidebars (solo 1)
  sidebars: [mainSidebar],

  // Opciones de navegación
  navigation: {
    allowFreeNavigation: true,
    markPreviousAsCompleted: false,
    scrollToTop: true,
    useTransitions: true,
    transitionName: "fade",
  },

  // Validación
  validation: {
    validateOnNavigate: false,
    validateOnComplete: false,
    showValidationErrors: true,
    allowNavigationWithErrors: true,
  },

  // Persistencia
  persistence: {
    enabled: true,
    localStorage: true,
    backend: false,
    storageKey: "sucursales-progress",
    autoSaveInterval: 30000,
  },

  // Opciones de UI
  showLoadingSkeleton: true,
  showSaveIndicator: true,
});

/**
 * Exportar default para uso directo
 */
export default sucursalesLayoutConfig;
