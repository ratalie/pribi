import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

/**
 * FlowItem Nivel 4: Aportantes (Aporte Dinerario)
 * Sub-item que aparece en rightSidebar agrupado bajo "Aporte Dinerario"
 */
export const aporteDinerarioAportantesItem: FlowItem = {
  identity: {
    id: "aporte-dinerario-aportantes",
    type: FlowItemType.STEP,
    label: "Aportantes",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "aporte-dinerario-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO_APORTANTES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión de aportantes en el aumento de capital por aporte dinerario",
    tags: ["nivel-4", "aumento-capital", "aportantes"],
    version: "1.0.0",
  },
};
