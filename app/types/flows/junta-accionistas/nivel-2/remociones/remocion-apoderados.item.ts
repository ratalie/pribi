import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Remoción de Apoderados
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Remociones Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Selección
 * - Revocatoria
 * - Votación
 */
export const remocionApoderadosItem: FlowItem = {
  identity: {
    id: "remocion-apoderados",
    type: FlowItemType.STEP,
    label: "Remoción de Apoderados",
  },
  hierarchy: {
    level: 2,
    order: 1,
    parentId: "remociones-section",
    children: [
      "remocion-apoderados-contenido",
      "remocion-apoderados-resumen",
    ],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_APODERADOS,
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
    description: "Gestión del proceso de remoción de apoderados",
    tags: ["nivel-2", "remociones", "apoderados"],
    version: "1.0.0",
    category: "Remociones",
  },
};
