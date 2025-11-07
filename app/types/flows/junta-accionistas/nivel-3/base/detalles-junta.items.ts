import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

const baseParentId = "detalles";
const baseRoute = JuntaRoutes.DETALLES;

export const detallesJuntaPasoUnoItem: FlowItem = {
  identity: {
    id: "detalles-junta-paso-1",
    type: FlowItemType.STEP,
    label: "Paso 1 · Datos Generales",
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
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Completar los datos generales de la junta",
    tags: ["nivel-3", "detalles", "paso-1"],
    version: "1.0.0",
  },
};

export const detallesJuntaPasoDosItem: FlowItem = {
  identity: {
    id: "detalles-junta-paso-2",
    type: FlowItemType.STEP,
    label: "Paso 2 · Participantes",
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
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registrar participantes y representación",
    tags: ["nivel-3", "detalles", "paso-2"],
    version: "1.0.0",
  },
};

export const detallesJuntaPasoVotacionItem: FlowItem = {
  identity: {
    id: "detalles-junta-votacion",
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
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registrar acuerdos sobre los detalles de la junta",
    tags: ["nivel-3", "detalles", "votacion"],
    version: "1.0.0",
  },
};

export const detallesJuntaPasoResumenItem: FlowItem = {
  identity: {
    id: "detalles-junta-resumen",
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
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen del registro de detalles de la junta",
    tags: ["nivel-3", "detalles", "resumen"],
    version: "1.0.0",
  },
};


