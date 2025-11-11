import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Estados Financieros
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Gestión Social Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Presentación
 * - Aprobación
 * - Votación
 */
export const estadosFinancierosItem: FlowItem = {
  identity: {
    id: "estados-financieros",
    type: FlowItemType.STEP,
    label: "Estados Financieros",
  },
  hierarchy: {
    level: 2,
    order: 3,
    parentId: "gestion-social-section",
    children: [
      "estados-financieros-contenido",
      "estados-financieros-resumen",
    ],
  },
  navigation: {
    route: JuntaRoutes.ESTADOS_FINANCIEROS,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Proceso de Aprobación",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión de la aprobación de estados financieros",
    tags: ["nivel-2", "gestion-social", "estados-financieros"],
    version: "1.0.0",
    category: "Gestión Social y Resultados Económicos",
  },
};
