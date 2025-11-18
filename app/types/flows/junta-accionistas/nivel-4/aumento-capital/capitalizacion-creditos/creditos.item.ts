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
    level: 4,
    order: 2,
    parentId: "capitalizacion-creditos-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.CAPITALIZACION_CREDITOS_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Detalle de los créditos que se capitalizarán",
    tags: ["nivel-4", "aumento-capital", "creditos"],
    version: "1.0.0",
  },
};
