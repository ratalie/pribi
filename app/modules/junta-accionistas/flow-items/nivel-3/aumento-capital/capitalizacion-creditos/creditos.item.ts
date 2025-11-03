import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const capitalizacionCreditosDetalleItem: FlowItem = {
  identity: {
    id: "capitalizacion-creditos-creditos",
    type: FlowItemType.STEP,
    label: "Créditos",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "capitalizacion-creditos",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.CAPITALIZACION_CREDITOS_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Detalle de los créditos a capitalizar",
    tags: ["nivel-3", "aumento-capital", "creditos"],
    version: "1.0.0",
  },
};
