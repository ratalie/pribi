import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const capitalizacionAcreedoresItem: FlowItem = {
  identity: {
    id: "capitalizacion-creditos-acreedores",
    type: FlowItemType.STEP,
    label: "Acreedores",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "capitalizacion-creditos-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.CAPITALIZACION_ACREEDORES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión de acreedores cuyos créditos serán capitalizados",
    tags: ["nivel-4", "aumento-capital", "acreedores"],
    version: "1.0.0",
  },
};
