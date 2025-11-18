import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoAuditoresDesignacionItem: FlowItem = {
  identity: {
    id: "nombramiento-auditores-designacion",
    type: FlowItemType.STEP,
    label: "Designación",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "nombramiento-auditores-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_AUDITORES_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Designación de auditores externos y alcance del encargo",
    tags: ["nivel-4", "nombramiento", "auditores"],
    version: "1.0.0",
  },
};
