import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const aporteDinerarioActaItem: FlowItem = {
  identity: {
    id: "aporte-dinerario-acta",
    type: FlowItemType.STEP,
    label: "Acta",
  },
  hierarchy: {
    level: 3,
    order: 4,
    parentId: "aporte-dinerario",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO,
    behavior: NavigationBehavior.PUSH,
    hash: "#acta",
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Acta del acuerdo de aporte dinerario",
    tags: ["nivel-3", "aumento-capital", "acta"],
    version: "1.0.0",
  },
};
