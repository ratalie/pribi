import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const estadosFinancierosVotacionItem: FlowItem = {
  identity: {
    id: "estados-financieros-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 4,
    order: 3,
    parentId: "estados-financieros-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.ESTADOS_FINANCIEROS,
    behavior: NavigationBehavior.PUSH,
    hash: "#votacion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resultado de la votación sobre los estados financieros",
    tags: ["nivel-4", "gestion-social", "estados-financieros"],
    version: "1.0.0",
  },
};
