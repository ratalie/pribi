import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionDirectoresRemocionItem: FlowItem = {
  identity: {
    id: "remocion-directores-remocion",
    type: FlowItemType.STEP,
    label: "Remoción de Directores",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "remocion-directores-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_DIRECTORES_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Detalle de la remoción de directores",
    tags: ["nivel-4", "remociones", "directores"],
    version: "1.0.0",
  },
};

