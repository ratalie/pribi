import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Reparto de Dividendos
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Gestión Social Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Cálculo
 * - Distribución
 * - Votación
 */
export const repartoDividendosItem: FlowItem = {
  identity: {
    id: "reparto-dividendos",
    type: FlowItemType.STEP,
    label: "Reparto de Dividendos",
  },
  hierarchy: {
    level: 2,
    order: 4,
    parentId: "gestion-social-section",
    children: [
      "reparto-dividendos-calculo",
      "reparto-dividendos-distribucion",
      "reparto-dividendos-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.REPARTO_DIVIDENDOS,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Proceso de Reparto",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión del reparto de dividendos a accionistas",
    tags: ["nivel-2", "gestion-social", "dividendos"],
    version: "1.0.0",
  },
};
