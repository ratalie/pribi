import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const pronunciamientoInformeItem: FlowItem = {
  identity: {
    id: "pronunciamiento-gestion-informe",
    type: FlowItemType.STEP,
    label: "Informe",
  },
  hierarchy: { level: 3, order: 1, parentId: "pronunciamiento-gestion", children: [] },
  navigation: {
    route: JuntaRoutes.PRONUNCIAMIENTO_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Informe de gestión",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};

export const pronunciamientoVotacionItem: FlowItem = {
  identity: {
    id: "pronunciamiento-gestion-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: { level: 3, order: 2, parentId: "pronunciamiento-gestion", children: [] },
  navigation: {
    route: JuntaRoutes.PRONUNCIAMIENTO_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación de pronunciamiento",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};

export const pronunciamientoActaItem: FlowItem = {
  identity: { id: "pronunciamiento-gestion-acta", type: FlowItemType.STEP, label: "Acta" },
  hierarchy: { level: 3, order: 3, parentId: "pronunciamiento-gestion", children: [] },
  navigation: {
    route: JuntaRoutes.PRONUNCIAMIENTO_GESTION,
    behavior: NavigationBehavior.PUSH,
    hash: "#acta",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Acta de pronunciamiento",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};
