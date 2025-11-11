import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionApoderadosResumenItem: FlowItem = {
  identity: {
    id: "remocion-apoderados-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "remocion-apoderados",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_APODERADOS_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen ejecutivo del proceso de remoción de apoderados",
    tags: ["nivel-3", "remociones", "apoderados", "resumen"],
    version: "1.0.0",
  },
};
