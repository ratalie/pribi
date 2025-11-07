import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

const baseParentId = "seleccion-agenda";
const baseRoute = JuntaRoutes.SELECCION_AGENDA;

export const seleccionAgendaPasoUnoItem: FlowItem = {
  identity: {
    id: "seleccion-agenda-paso-1",
    type: FlowItemType.STEP,
    label: "Paso 1 · Selección",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: baseParentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#paso-1",
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Preparar la selección inicial de puntos de agenda",
    tags: ["nivel-3", "seleccion-agenda", "paso-1"],
    version: "1.0.0",
  },
};

export const seleccionAgendaPasoDosItem: FlowItem = {
  identity: {
    id: "seleccion-agenda-paso-2",
    type: FlowItemType.STEP,
    label: "Paso 2 · Validación",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: baseParentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#paso-2",
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Validar requisitos y documentación de los puntos elegidos",
    tags: ["nivel-3", "seleccion-agenda", "paso-2"],
    version: "1.0.0",
  },
};

export const seleccionAgendaPasoVotacionItem: FlowItem = {
  identity: {
    id: "seleccion-agenda-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 3,
    order: 3,
    parentId: baseParentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#votacion",
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Registrar la votación sobre la agenda seleccionada",
    tags: ["nivel-3", "seleccion-agenda", "votacion"],
    version: "1.0.0",
  },
};

export const seleccionAgendaPasoResumenItem: FlowItem = {
  identity: {
    id: "seleccion-agenda-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 4,
    parentId: baseParentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#resumen",
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Resumen general de la selección de agenda",
    tags: ["nivel-3", "seleccion-agenda", "resumen"],
    version: "1.0.0",
  },
};


