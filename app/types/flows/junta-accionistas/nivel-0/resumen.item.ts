import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../defaults";

/**
 * FlowItem: Resumen
 *
 * Nivel 0 - Paso principal del flujo de Junta de Accionistas
 * Vista de resumen consolidado de todos los acuerdos tomados en la junta.
 *
 * RightSidebar: Habilitado con SCROLL ANCHORS
 * El rightSidebar muestra secciones ancladas para navegar rápidamente a cada
 * categoría del resumen usando scroll behavior.
 */
export const resumenItem: FlowItem = {
  identity: {
    id: "resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 0,
    order: 5,
    parentId: null,
    children: [], // Los scroll anchors se agregan aquí cuando se creen
  },
  navigation: {
    route: JuntaRoutes.RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Secciones del Resumen",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Resumen consolidado de todos los acuerdos y votaciones de la junta",
    tags: ["nivel-0", "resumen", "scroll-anchors"],
    version: "1.0.0",
    notes: "Usa scroll anchors en rightSidebar para navegación rápida",
  },
};
