import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionDirectoresVotacionItem: FlowItem = {
  identity: {
    id: "remocion-directores-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 4,
    order: 3,
    parentId: "remocion-directores-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_DIRECTORES_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registra el resultado de la votación sobre la remoción de directores",
    tags: ["nivel-4", "remociones", "directores"],
    version: "1.0.0",
  },
};
