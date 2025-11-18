/**
 * FlowConfig - Sucursales
 *
 * Configuración completa del flujo de Sucursales.
 * Flujo simple de 6 pasos sin jerarquía.
 *
 * @module sucursales.flow
 */

import type { FlowConfig } from "@/types/flow-system";
import { RenderMode, SidebarPosition } from "@/types/flow-system";

// Imports de items
import {
  sucursalAccionesItem,
  sucursalAccionistasItem,
  sucursalAsignacionItem,
  sucursalCapitalSocialItem,
  sucursalDatosGeneralesItem,
  sucursalDatosSociedadItem,
} from "../flow-items";

/**
 * FlowConfig para Sucursales
 *
 * Flujo flat (sin jerarquía) de 6 pasos.
 */
export const sucursalesFlowConfig: FlowConfig = {
  id: "sucursales-flow",
  name: "Registro de Sucursales",
  description: "Flujo para el registro de nuevas sucursales",
  version: "1.0.0",

  // Items (flujo flat, sin jerarquía)
  items: [
    sucursalDatosSociedadItem,
    sucursalDatosGeneralesItem,
    sucursalCapitalSocialItem,
    sucursalAccionesItem,
    sucursalAccionistasItem,
    sucursalAsignacionItem,
  ],

  renderOptions: {
    mode: RenderMode.SEQUENTIAL,
    mobileMode: RenderMode.STEPPER,
    showProgress: true,
    showCompletionStatus: true,
    showIcons: false,
    showBadges: false,
    showStepNumbers: true,
    allowFreeNavigation: false,
    animateTransitions: true,
    animationDuration: 300,
    highlightActive: true,
    themeColor: "green",
  },

  sidebarOptions: {
    position: SidebarPosition.LEFT,
    width: 280,
    minWidth: 240,
    maxWidth: 400,
    collapsible: true,
    startCollapsed: false,
    startCollapsedMobile: true,
    resizable: false,
    sticky: true,
    stickyOffset: 0,
    showHeader: true,
    headerTitle: "Sucursales",
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
    tags: ["sucursales", "flow", "registro"],
    category: "registro",
    author: "ProboV3 System",
  },

  createdAt: new Date(),
};
