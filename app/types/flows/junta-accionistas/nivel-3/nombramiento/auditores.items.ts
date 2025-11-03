import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const nombramientoAuditoresDesignacionItem: FlowItem = {
  identity: {
    id: "nombramiento-auditores-designacion",
    type: FlowItemType.STEP,
    label: "Designación",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "nombramiento-auditores",
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
    description: "Designación de auditores externos",
    tags: ["nivel-3", "nombramiento", "auditores"],
    version: "1.0.0",
  },
};

export const nombramientoAuditoresVotacionItem: FlowItem = {
  identity: {
    id: "nombramiento-auditores-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "nombramiento-auditores",
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
    description: "Votación del nombramiento de auditores",
    tags: ["nivel-3", "nombramiento", "votacion"],
    version: "1.0.0",
  },
};
