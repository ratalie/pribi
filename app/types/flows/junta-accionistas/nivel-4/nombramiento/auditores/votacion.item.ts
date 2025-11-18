import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoAuditoresVotacionItem: FlowItem = {
  identity: {
    id: "nombramiento-auditores-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "nombramiento-auditores-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_AUDITORES_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registro del resultado de la votación sobre los auditores propuestos",
    tags: ["nivel-4", "nombramiento", "auditores"],
    version: "1.0.0",
  },
};
