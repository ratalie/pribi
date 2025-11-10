import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoAuditoresResumenItem: FlowItem = {
  identity: {
    id: "nombramiento-auditores-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "nombramiento-auditores",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_AUDITORES_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen del nombramiento de auditores y su aprobación",
    tags: ["nivel-3", "nombramiento", "auditores", "resumen"],
    version: "1.0.0",
  },
};
