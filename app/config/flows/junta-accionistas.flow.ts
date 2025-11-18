/**
 * FlowConfig - Junta de Accionistas
 *
 * Configuración completa del flujo de Junta de Accionistas.
 * Ensambla todos los FlowItems de Nivel 0-4 en una estructura jerárquica.
 *
 * @module junta-accionistas.flow
 */

import type { FlowConfig } from "@/types/flow-system";
import { RenderMode, SidebarPosition } from "@/types/flow-system";

// Imports de todos los niveles
import * as nivel0 from "@/types/flows/junta-accionistas/nivel-0";
import * as nivel1 from "@/types/flows/junta-accionistas/nivel-1";
import * as nivel2 from "@/types/flows/junta-accionistas/nivel-2";
import * as nivel3 from "@/types/flows/junta-accionistas/nivel-3";
import * as nivel4 from "@/types/flows/junta-accionistas/nivel-4";

/**
 * FlowConfig principal para Junta de Accionistas
 *
 * Incluye TODOS los items de Nivel 0-4.
 * La jerarquía se construye dinámicamente en runtime
 * usando los parentId y children de cada FlowItem mediante buildFlowItemTree().
 */
export const juntaAccionistasFlowConfig: FlowConfig = {
  id: "junta-accionistas-flow",
  name: "Junta de Accionistas",
  description: "Flujo completo para la gestión de juntas de accionistas",
  version: "1.0.0",

  // TODOS los items (Nivel 0-4) - buildFlowItemTree() construirá la jerarquía
  items: [
    // Nivel 0 (6 items principales)
    ...Object.values(nivel0),

    // Nivel 1 (4 sections)
    ...Object.values(nivel1),

    // Nivel 2 (items con rightSidebar)
    ...Object.values(nivel2),

    // Nivel 3 (sub-items en rightSidebar)
    ...Object.values(nivel3),

    // Nivel 4 (scroll anchors)
    ...Object.values(nivel4),
  ],

  renderOptions: {
    mode: RenderMode.HIERARCHICAL,
    mobileMode: RenderMode.ACCORDION,
    showProgress: true,
    showCompletionStatus: true,
    showIcons: true,
    showBadges: true,
    showStepNumbers: false,
    allowFreeNavigation: false,
    animateTransitions: true,
    animationDuration: 300,
    highlightActive: true,
    themeColor: "blue",
  },

  sidebarOptions: {
    position: SidebarPosition.LEFT,
    width: 280,
    minWidth: 240,
    maxWidth: 400,
    collapsible: true,
    startCollapsed: false,
    startCollapsedMobile: true,
    resizable: true,
    sticky: true,
    stickyOffset: 0,
    showHeader: true,
    headerTitle: "Junta de Accionistas",
    showFooter: false,
    mobileVariant: "drawer",
  },

  rightSidebarOptions: {
    enabled: true,
    defaultWidth: 320,
    sticky: true,
    stickyOffset: 0,
    allowItemOverride: true,
  },

  metadata: {
    tags: ["junta-accionistas", "flow", "operaciones"],
    category: "operaciones",
    author: "ProboV3 System",
  },

  createdAt: new Date(),
};
