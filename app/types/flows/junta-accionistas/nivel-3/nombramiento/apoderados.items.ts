import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const nombramientoApoderadosDesignacionItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados-designacion",
    type: FlowItemType.STEP,
    label: "Designación",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "nombramiento-apoderados",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Designación de apoderados",
    tags: ["nivel-3", "nombramiento", "apoderados"],
    version: "1.0.0",
  },
};

export const nombramientoApoderadosOtorgamientoItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados-otorgamiento",
    type: FlowItemType.STEP,
    label: "Otorgamiento",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "nombramiento-apoderados",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Otorgamiento de poderes",
    tags: ["nivel-3", "nombramiento", "otorgamiento"],
    version: "1.0.0",
  },
};

export const nombramientoApoderadosVotacionItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 3,
    order: 3,
    parentId: "nombramiento-apoderados",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación del nombramiento de apoderados",
    tags: ["nivel-3", "nombramiento", "votacion"],
    version: "1.0.0",
  },
};
