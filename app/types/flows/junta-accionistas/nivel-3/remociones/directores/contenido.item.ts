import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionDirectoresContenidoItem: FlowItem = {
  identity: {
    id: "remocion-directores-contenido",
    type: FlowItemType.STEP,
    label: "Remoción de Directores",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "remocion-directores",
    children: [
      "remocion-directores-remocion",
      "remocion-directores-directores",
      "remocion-directores-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_DIRECTORES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Introducción al proceso de remoción de directores",
    tags: ["nivel-3", "remociones", "directores"],
    version: "1.0.0",
  },
};
