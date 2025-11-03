import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Nombramiento de Directores
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Nombramiento Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Designación
 * - Votación
 */
export const nombramientoDirectoresItem: FlowItem = {
  identity: {
    id: "nombramiento-directores",
    type: FlowItemType.STEP,
    label: "Nombramiento de Directores",
  },
  hierarchy: {
    level: 2,
    order: 3,
    parentId: "nombramiento-section",
    children: ["nombramiento-directores-designacion", "nombramiento-directores-votacion"],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Proceso de Nombramiento",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión del proceso de nombramiento de directores",
    tags: ["nivel-2", "nombramiento", "directores"],
    version: "1.0.0",
  },
};
