import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const capitalizacionVotacionItem: FlowItem = {
  identity: {
    id: "capitalizacion-creditos-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 3,
    order: 3,
    parentId: "capitalizacion-creditos",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.CAPITALIZACION_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Proceso de votación para capitalización de créditos",
    tags: ["nivel-3", "aumento-capital", "votacion"],
    version: "1.0.0",
  },
};
