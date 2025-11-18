import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Remoción de Directores
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Remociones Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Selección
 * - Revocatoria
 * - Votación
 */
export const remocionDirectoresItem: FlowItem = {
  identity: {
    id: "remocion-directores",
    type: FlowItemType.STEP,
    label: "Remoción de Directores",
  },
  hierarchy: {
    level: 2,
    order: 3,
    parentId: "remociones-section",
    children: [
      "remocion-directores-seleccion",
      "remocion-directores-revocatoria",
      "remocion-directores-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_DIRECTORES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Proceso de Remoción",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión del proceso de remoción de directores",
    tags: ["nivel-2", "remociones", "directores"],
    version: "1.0.0",
  },
};
