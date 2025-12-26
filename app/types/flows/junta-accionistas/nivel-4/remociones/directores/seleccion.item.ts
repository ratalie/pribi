import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionDirectoresDirectoresItem: FlowItem = {
  identity: {
    id: "remocion-directores-directores",
    type: FlowItemType.STEP,
    label: "Directores",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "remocion-directores-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_DIRECTORES_DETALLE,
    behavior: NavigationBehavior.PUSH,
    hash: "#directores",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Información de los directores a remover",
    tags: ["nivel-4", "remociones", "directores"],
    version: "1.0.0",
  },
};
