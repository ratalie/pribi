import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoAuditoresContenidoItem: FlowItem = {
  identity: {
    id: "nombramiento-auditores-contenido",
    type: FlowItemType.STEP,
    label: "Nombramiento de Auditores",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "nombramiento-auditores",
    children: [
      "nombramiento-auditores-designacion",
      "nombramiento-auditores-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_AUDITORES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Configuración general del nombramiento de auditores externos",
    tags: ["nivel-3", "nombramiento", "auditores"],
    version: "1.0.0",
  },
};
