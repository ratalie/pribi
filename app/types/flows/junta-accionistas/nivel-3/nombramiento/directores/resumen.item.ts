import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectoresResumenItem: FlowItem = {
  identity: {
    id: "nombramiento-directores-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "nombramiento-directores",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORES_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen del proceso de nombramiento de directores",
    tags: ["nivel-3", "nombramiento", "directores", "resumen"],
    version: "1.0.0",
  },
};
