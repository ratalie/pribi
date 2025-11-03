import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const nombramientoGerenteDesignacionItem: FlowItem = {
  identity: {
    id: "nombramiento-gerente-designacion",
    type: FlowItemType.STEP,
    label: "Designación",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "nombramiento-gerente",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_GERENTE_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Designación de gerente",
    tags: ["nivel-3", "nombramiento", "gerente"],
    version: "1.0.0",
  },
};

export const nombramientoGerenteVotacionItem: FlowItem = {
  identity: {
    id: "nombramiento-gerente-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "nombramiento-gerente",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_GERENTE_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación del nombramiento de gerente",
    tags: ["nivel-3", "nombramiento", "votacion"],
    version: "1.0.0",
  },
};
