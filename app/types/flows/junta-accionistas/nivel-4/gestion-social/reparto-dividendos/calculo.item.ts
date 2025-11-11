import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const repartoDividendosCalculoItem: FlowItem = {
  identity: {
    id: "reparto-dividendos-calculo",
    type: FlowItemType.STEP,
    label: "Cálculo",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "reparto-dividendos-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REPARTO_DIVIDENDOS,
    behavior: NavigationBehavior.PUSH,
    hash: "#calculo",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Cálculo de los dividendos a repartir",
    tags: ["nivel-4", "gestion-social", "dividendos"],
    version: "1.0.0",
  },
};
