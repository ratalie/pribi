import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const estadosFinancierosPresentacionItem: FlowItem = {
  identity: {
    id: "estados-financieros-presentacion",
    type: FlowItemType.STEP,
    label: "Presentación",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "estados-financieros-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.ESTADOS_FINANCIEROS,
    behavior: NavigationBehavior.PUSH,
    hash: "#presentacion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Presentación de los estados financieros ante la junta",
    tags: ["nivel-4", "gestion-social", "estados-financieros"],
    version: "1.0.0",
  },
};
