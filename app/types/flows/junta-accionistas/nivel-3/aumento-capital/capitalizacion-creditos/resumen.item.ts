import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const capitalizacionCreditosResumenItem: FlowItem = {
  identity: {
    id: "capitalizacion-creditos-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "capitalizacion-creditos",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.CAPITALIZACION_CREDITOS_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen ejecutivo del acuerdo de capitalización de créditos",
    tags: ["nivel-3", "aumento-capital", "capitalizacion", "resumen"],
    version: "1.0.0",
  },
};
