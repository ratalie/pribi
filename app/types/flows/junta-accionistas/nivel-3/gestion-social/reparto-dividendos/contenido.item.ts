import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const repartoDividendosContenidoItem: FlowItem = {
  identity: {
    id: "reparto-dividendos-contenido",
    type: FlowItemType.STEP,
    label: "Reparto de Dividendos",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "reparto-dividendos",
    children: [
      "reparto-dividendos-calculo",
      "reparto-dividendos-distribucion",
      "reparto-dividendos-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.REPARTO_DIVIDENDOS,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Introducción al cálculo y distribución de dividendos",
    tags: ["nivel-3", "gestion-social", "dividendos"],
    version: "1.0.0",
  },
};
