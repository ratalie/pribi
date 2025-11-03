import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../defaults";

/**
 * FlowItem: Descargar Documentos
 *
 * Nivel 0 - Paso final del flujo de Junta de Accionistas
 * Descarga de actas y documentos generados durante la junta.
 *
 * RightSidebar: Habilitado para mostrar lista de actas disponibles
 */
export const descargarItem: FlowItem = {
  identity: {
    id: "descargar",
    type: FlowItemType.STEP,
    label: "Descargar",
  },
  hierarchy: {
    level: 0,
    order: 6,
    parentId: null,
    children: [],
  },
  navigation: {
    route: JuntaRoutes.DESCARGAR,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Documentos Disponibles",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Descargar actas y documentos generados durante la junta de accionistas",
    tags: ["nivel-0", "final", "descarga", "documentos"],
    version: "1.0.0",
  },
};
