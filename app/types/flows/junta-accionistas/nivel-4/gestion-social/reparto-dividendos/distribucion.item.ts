import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const repartoDividendosDistribucionItem: FlowItem = {
  identity: {
    id: "reparto-dividendos-distribucion",
    type: FlowItemType.STEP,
    label: "Distribución",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "reparto-dividendos-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REPARTO_DIVIDENDOS,
    behavior: NavigationBehavior.PUSH,
    hash: "#distribucion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Distribución acordada de dividendos",
    tags: ["nivel-4", "gestion-social", "dividendos"],
    version: "1.0.0",
  },
};
