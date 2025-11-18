import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionDirectoresResumenItem: FlowItem = {
  identity: {
    id: "remocion-directores-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "remocion-directores",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_DIRECTORES_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen del proceso de remoción de directores",
    tags: ["nivel-3", "remociones", "directores", "resumen"],
    version: "1.0.0",
  },
};
