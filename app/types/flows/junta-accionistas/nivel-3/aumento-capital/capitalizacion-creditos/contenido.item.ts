import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const capitalizacionCreditosContenidoItem: FlowItem = {
  identity: {
    id: "capitalizacion-creditos-contenido",
    type: FlowItemType.STEP,
    label: "Capitalización de Créditos",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "capitalizacion-creditos",
    children: [
      "capitalizacion-creditos-acreedores",
      "capitalizacion-creditos-creditos",
      "capitalizacion-creditos-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.CAPITALIZACION_CREDITOS,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Introducción y configuración general de la capitalización de créditos",
    tags: ["nivel-3", "aumento-capital", "capitalizacion"],
    version: "1.0.0",
  },
};
