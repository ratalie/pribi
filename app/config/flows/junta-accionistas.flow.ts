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

// Imports de Nivel 0
import * as nivel0 from "@/types/flows/junta-accionistas/nivel-0";

/**
 * FlowConfig principal para Junta de Accionistas
 *
 * Este es un FlowConfig simplificado que exporta los items principales.
 * La jerarquía completa se construye dinámicamente en runtime
 * usando los parentId y children de cada FlowItem.
 */
export const juntaAccionistasFlowConfig: FlowConfig = {
  id: "junta-accionistas-flow",
  name: "Junta de Accionistas",
  description: "Flujo completo para la gestión de juntas de accionistas",
  version: "1.0.0",

  // Items principales (Nivel 0)
  // La jerarquía se resuelve en runtime usando parentId
  items: [
    nivel0.seleccionAgendaItem,
    nivel0.detallesItem,
    nivel0.instalacionItem,
    nivel0.puntosAcuerdoItem,
    nivel0.resumenItem,
    nivel0.descargarItem,
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
