import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const pronunciamientoGestionVotacionItem: FlowItem = {
  identity: {
    id: "pronunciamiento-gestion-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "pronunciamiento-gestion-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.PRONUNCIAMIENTO_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resultado de la votación sobre el pronunciamiento de gestión",
    tags: ["nivel-4", "gestion-social", "pronunciamiento"],
    version: "1.0.0",
  },
};
