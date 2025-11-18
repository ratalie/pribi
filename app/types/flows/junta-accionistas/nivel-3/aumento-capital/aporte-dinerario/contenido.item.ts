import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const aporteDinerarioContenidoItem: FlowItem = {
  identity: {
    id: "aporte-dinerario-contenido",
    type: FlowItemType.STEP,
    label: "Aporte Dinerario",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "aporte-dinerario",
    children: [
      "aporte-dinerario-aportantes",
      "aporte-dinerario-aportes",
      "aporte-dinerario-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
  },
  validation: defaultValidation,
  metadata: {
    description: "Introducción al acuerdo de aporte dinerario y pasos requeridos",
    tags: ["nivel-3", "aumento-capital", "aporte-dinerario"],
    version: "1.0.0",
  },
};
