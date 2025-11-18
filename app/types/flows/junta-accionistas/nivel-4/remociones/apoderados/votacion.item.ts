import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionApoderadosVotacionItem: FlowItem = {
  identity: {
    id: "remocion-apoderados-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "remocion-apoderados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_APODERADOS_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registra el resultado de la votación sobre la remoción de apoderados",
    tags: ["nivel-4", "remociones", "apoderados"],
    version: "1.0.0",
  },
};
