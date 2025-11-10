import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const aporteDinerarioResumenItem: FlowItem = {
  identity: {
    id: "aporte-dinerario-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "aporte-dinerario",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Resumen ejecutivo del acuerdo de aporte dinerario",
    tags: ["nivel-3", "aumento-capital", "resumen"],
    version: "1.0.0",
  },
};
