import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const repartoDividendosVotacionItem: FlowItem = {
  identity: {
    id: "reparto-dividendos-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 4,
    order: 3,
    parentId: "reparto-dividendos-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REPARTO_DIVIDENDOS_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resultado de la votación sobre el reparto de dividendos",
    tags: ["nivel-4", "gestion-social", "dividendos"],
    version: "1.0.0",
  },
};
