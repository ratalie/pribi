import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const estadosFinancierosResumenItem: FlowItem = {
  identity: {
    id: "estados-financieros-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "estados-financieros",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.ESTADOS_FINANCIEROS_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen de la revisión y aprobación de estados financieros",
    tags: ["nivel-3", "gestion-social", "estados-financieros", "resumen"],
    version: "1.0.0",
  },
};
