import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const nombramientoDirectorioDesignacionItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-designacion",
    type: FlowItemType.STEP,
    label: "Designación",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "nombramiento-directorio",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORIO_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Designación de directorio completo",
    tags: ["nivel-3", "nombramiento", "directorio"],
    version: "1.0.0",
  },
};

export const nombramientoDirectorioVotacionItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "nombramiento-directorio",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORIO_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación del nombramiento de directorio",
    tags: ["nivel-3", "nombramiento", "votacion"],
    version: "1.0.0",
  },
};
