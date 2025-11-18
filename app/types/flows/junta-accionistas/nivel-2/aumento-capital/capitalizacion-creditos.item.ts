import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Capitalización de Créditos
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Aumento de Capital Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Acreedores
 * - Créditos
 * - Votación
 * - Acta
 */
export const capitalizacionCreditosItem: FlowItem = {
  identity: {
    id: "capitalizacion-creditos",
    type: FlowItemType.STEP,
    label: "Capitalización de Créditos",
  },
  hierarchy: {
    level: 2,
    order: 2,
    parentId: "aumento-capital-section",
    children: [
      "capitalizacion-creditos-contenido",
      "capitalizacion-creditos-resumen",
    ],
  },
  navigation: {
    route: JuntaRoutes.CAPITALIZACION_CREDITOS,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Proceso de Capitalización",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión del proceso de capitalización de créditos",
    tags: ["nivel-2", "aumento-capital", "capitalizacion"],
    version: "1.0.0",
    category: "Aumento de Capital",
  },
};
