import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const estadosFinancierosAprobacionItem: FlowItem = {
  identity: {
    id: "estados-financieros-aprobacion",
    type: FlowItemType.STEP,
    label: "Aprobación",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "estados-financieros-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.ESTADOS_FINANCIEROS,
    behavior: NavigationBehavior.PUSH,
    hash: "#aprobacion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registro de la aprobación de estados financieros",
    tags: ["nivel-4", "gestion-social", "estados-financieros"],
    version: "1.0.0",
  },
};
