import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const estadosFinancierosPresentacionItem: FlowItem = {
  identity: {
    id: "estados-financieros-presentacion",
    type: FlowItemType.STEP,
    label: "Presentación",
  },
  hierarchy: { level: 3, order: 1, parentId: "estados-financieros", children: [] },
  navigation: {
    route: JuntaRoutes.ESTADOS_FINANCIEROS,
    behavior: NavigationBehavior.PUSH,
    hash: "#presentacion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Presentación de estados financieros",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};

export const estadosFinancierosAprobacionItem: FlowItem = {
  identity: {
    id: "estados-financieros-aprobacion",
    type: FlowItemType.STEP,
    label: "Aprobación",
  },
  hierarchy: { level: 3, order: 2, parentId: "estados-financieros", children: [] },
  navigation: {
    route: JuntaRoutes.ESTADOS_FINANCIEROS,
    behavior: NavigationBehavior.PUSH,
    hash: "#aprobacion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Aprobación de estados financieros",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};

export const estadosFinancierosVotacionItem: FlowItem = {
  identity: { id: "estados-financieros-votacion", type: FlowItemType.STEP, label: "Votación" },
  hierarchy: { level: 3, order: 3, parentId: "estados-financieros", children: [] },
  navigation: {
    route: JuntaRoutes.ESTADOS_FINANCIEROS,
    behavior: NavigationBehavior.PUSH,
    hash: "#votacion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación de estados financieros",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};
