import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const repartoDividendosCalculoItem: FlowItem = {
  identity: { id: "reparto-dividendos-calculo", type: FlowItemType.STEP, label: "Cálculo" },
  hierarchy: { level: 3, order: 1, parentId: "reparto-dividendos", children: [] },
  navigation: {
    route: JuntaRoutes.REPARTO_DIVIDENDOS,
    behavior: NavigationBehavior.PUSH,
    hash: "#calculo",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Cálculo de dividendos",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};

export const repartoDividendosDistribucionItem: FlowItem = {
  identity: {
    id: "reparto-dividendos-distribucion",
    type: FlowItemType.STEP,
    label: "Distribución",
  },
  hierarchy: { level: 3, order: 2, parentId: "reparto-dividendos", children: [] },
  navigation: {
    route: JuntaRoutes.REPARTO_DIVIDENDOS,
    behavior: NavigationBehavior.PUSH,
    hash: "#distribucion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Distribución de dividendos",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};

export const repartoDividendosVotacionItem: FlowItem = {
  identity: { id: "reparto-dividendos-votacion", type: FlowItemType.STEP, label: "Votación" },
  hierarchy: { level: 3, order: 3, parentId: "reparto-dividendos", children: [] },
  navigation: {
    route: JuntaRoutes.REPARTO_DIVIDENDOS,
    behavior: NavigationBehavior.PUSH,
    hash: "#votacion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación de reparto de dividendos",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};
