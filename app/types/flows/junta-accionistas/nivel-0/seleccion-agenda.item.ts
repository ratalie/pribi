import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../defaults";

/**
 * FlowItem: Selección de Puntos de Agenda
 *
 * Nivel 0 - Paso principal del flujo de Junta de Accionistas
 * Página donde se seleccionan los puntos que se tratarán en la junta.
 */
export const seleccionAgendaItem: FlowItem = {
  identity: {
    id: "seleccion-agenda",
    type: FlowItemType.STEP,
    label: "Selección de Agenda",
  },
  hierarchy: {
    level: 0,
    order: 1,
    parentId: null,
    children: [],
  },
  navigation: {
    route: JuntaRoutes.SELECCION_AGENDA,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
    title: "Selección de Agenda",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Selecciona los puntos de agenda que se tratarán en la junta de accionistas",
    tags: ["nivel-0", "seleccion-agenda", "configuracion"],
    version: "1.0.0",
  },
};
