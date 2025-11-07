import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Remoción de Gerente
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Remociones Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Selección
 * - Revocatoria
 * - Votación
 */
export const remocionGerenteItem: FlowItem = {
  identity: {
    id: "remocion-gerente",
    type: FlowItemType.STEP,
    label: "Remoción de Gerente",
  },
  hierarchy: {
    level: 2,
    order: 2,
    parentId: "remociones-section",
    children: [
      "remocion-gerente-seleccion",
      "remocion-gerente-revocatoria",
      "remocion-gerente-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_GERENTE,
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
    description: "Gestión del proceso de remoción de gerente",
    tags: ["nivel-2", "remociones", "gerente"],
    version: "1.0.0",
    category: "Remociones",
  },
};
