import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const nombramientoDirectoresDesignacionItem: FlowItem = {
  identity: {
    id: "nombramiento-directores-designacion",
    type: FlowItemType.STEP,
    label: "Designación",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "nombramiento-directores",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORES_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Designación de directores",
    tags: ["nivel-3", "nombramiento", "directores"],
    version: "1.0.0",
  },
};

export const nombramientoDirectoresVotacionItem: FlowItem = {
  identity: {
    id: "nombramiento-directores-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "nombramiento-directores",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORES_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación del nombramiento de directores",
    tags: ["nivel-3", "nombramiento", "votacion"],
    version: "1.0.0",
  },
};
