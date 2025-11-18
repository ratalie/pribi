import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoApoderadosVotacionItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 4,
    order: 3,
    parentId: "nombramiento-apoderados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resultado de la votación para aprobar el nombramiento",
    tags: ["nivel-4", "nombramiento", "apoderados"],
    version: "1.0.0",
  },
};
