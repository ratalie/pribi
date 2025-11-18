import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const aporteDinerarioVotacionItem: FlowItem = {
  identity: {
    id: "aporte-dinerario-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 3,
    order: 3,
    parentId: "aporte-dinerario",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Proceso de votación para el aporte dinerario",
    tags: ["nivel-3", "aumento-capital", "votacion"],
    version: "1.0.0",
  },
};
