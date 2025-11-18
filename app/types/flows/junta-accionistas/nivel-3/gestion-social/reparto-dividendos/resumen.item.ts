import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const repartoDividendosResumenItem: FlowItem = {
  identity: {
    id: "reparto-dividendos-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "reparto-dividendos",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REPARTO_DIVIDENDOS_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen del reparto de dividendos y su votación",
    tags: ["nivel-3", "gestion-social", "dividendos", "resumen"],
    version: "1.0.0",
  },
};
