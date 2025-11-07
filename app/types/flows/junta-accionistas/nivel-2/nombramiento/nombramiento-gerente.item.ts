import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Nombramiento de Gerente
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Nombramiento Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Designación
 * - Votación
 */
export const nombramientoGerenteItem: FlowItem = {
  identity: {
    id: "nombramiento-gerente",
    type: FlowItemType.STEP,
    label: "Nombramiento de Gerente",
  },
  hierarchy: {
    level: 2,
    order: 2,
    parentId: "nombramiento-section",
    children: ["nombramiento-gerente-designacion", "nombramiento-gerente-votacion"],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_GERENTE,
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
    description: "Gestión del proceso de nombramiento de gerente",
    tags: ["nivel-2", "nombramiento", "gerente"],
    version: "1.0.0",
    category: "Nombramiento",
  },
};
