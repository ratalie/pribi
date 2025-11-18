import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Pronunciamiento de Gestión
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Gestión Social Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Informe
 * - Votación
 * - Acta
 */
export const pronunciamientoGestionItem: FlowItem = {
  identity: {
    id: "pronunciamiento-gestion",
    type: FlowItemType.STEP,
    label: "Pronunciamiento de Gestión",
  },
  hierarchy: {
    level: 2,
    order: 1,
    parentId: "gestion-social-section",
    children: [
      "pronunciamiento-gestion-informe",
      "pronunciamiento-gestion-votacion",
      "pronunciamiento-gestion-acta",
    ],
  },
  navigation: {
    route: JuntaRoutes.PRONUNCIAMIENTO_GESTION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Proceso de Pronunciamiento",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión del pronunciamiento sobre la gestión social",
    tags: ["nivel-2", "gestion-social", "pronunciamiento"],
    version: "1.0.0",
  },
};
