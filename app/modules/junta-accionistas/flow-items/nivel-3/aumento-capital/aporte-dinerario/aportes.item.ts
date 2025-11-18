import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const aporteDinerarioAportesItem: FlowItem = {
  identity: {
    id: "aporte-dinerario-aportes",
    type: FlowItemType.STEP,
    label: "Aportes",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "aporte-dinerario",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO_APORTES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Detalle de los aportes dinerarios realizados",
    tags: ["nivel-3", "aumento-capital", "aportes"],
    version: "1.0.0",
  },
};
