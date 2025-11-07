import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Aporte Dinerario
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Puntos de Acuerdo
 * Category: Aumento de Capital (separador visual)
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Aportantes
 * - Aportes
 * - Votación
 * - Acta
 */
export const aporteDinerarioItem: FlowItem = {
  identity: {
    id: "aporte-dinerario",
    type: FlowItemType.STEP,
    label: "Aporte Dinerario",
  },
  hierarchy: {
    level: 2,
    order: 1,
    parentId: "aumento-capital-section",  // Cambiado de "aumento-capital-section"
    children: [
      "aporte-dinerario-aportantes",
      "aporte-dinerario-aportes",
      "aporte-dinerario-votacion",
      "aporte-dinerario-acta",
    ],
  },
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Proceso de Aporte Dinerario",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión del proceso de aumento de capital por aporte dinerario",
    tags: ["nivel-2", "aumento-capital", "aporte-dinerario"],
    version: "1.0.0",
    category: "Aumento de Capital",
  },
};
