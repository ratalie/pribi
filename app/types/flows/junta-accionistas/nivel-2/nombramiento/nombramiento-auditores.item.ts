import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Nombramiento de Auditores
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Nombramiento Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Designación
 * - Votación
 */
export const nombramientoAuditoresItem: FlowItem = {
  identity: {
    id: "nombramiento-auditores",
    type: FlowItemType.STEP,
    label: "Nombramiento de Auditores",
  },
  hierarchy: {
    level: 2,
    order: 5,
    parentId: "nombramiento-section",
    children: ["nombramiento-auditores-designacion", "nombramiento-auditores-votacion"],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_AUDITORES,
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
    description: "Gestión del proceso de nombramiento de auditores externos",
    tags: ["nivel-2", "nombramiento", "auditores"],
    version: "1.0.0",
  },
};
