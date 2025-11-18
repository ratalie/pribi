import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const capitalizacionActaItem: FlowItem = {
  identity: {
    id: "capitalizacion-creditos-acta",
    type: FlowItemType.STEP,
    label: "Acta",
  },
  hierarchy: {
    level: 3,
    order: 4,
    parentId: "capitalizacion-creditos",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.CAPITALIZACION_CREDITOS,
    behavior: NavigationBehavior.PUSH,
    hash: "#acta",
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Acta del acuerdo de capitalización de créditos",
    tags: ["nivel-3", "aumento-capital", "acta"],
    version: "1.0.0",
  },
};
