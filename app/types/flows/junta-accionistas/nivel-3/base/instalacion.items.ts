import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

const baseParentId = "instalacion";
const baseRoute = JuntaRoutes.INSTALACION;

export const instalacionPasoUnoItem: FlowItem = {
  identity: {
    id: "instalacion-paso-1",
    type: FlowItemType.STEP,
    label: "Paso 1 · Convocatoria",
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
    description: "Convocatoria y verificación de quórum",
    tags: ["nivel-3", "instalacion", "paso-1"],
    version: "1.0.0",
  },
};

export const instalacionPasoDosItem: FlowItem = {
  identity: {
    id: "instalacion-paso-2",
    type: FlowItemType.STEP,
    label: "Paso 2 · Registro",
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
    description: "Registro de asistentes y poderes",
    tags: ["nivel-3", "instalacion", "paso-2"],
    version: "1.0.0",
  },
};

export const instalacionPasoVotacionItem: FlowItem = {
  identity: {
    id: "instalacion-votacion",
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
    description: "Votación de la agenda de instalación",
    tags: ["nivel-3", "instalacion", "votacion"],
    version: "1.0.0",
  },
};

export const instalacionPasoResumenItem: FlowItem = {
  identity: {
    id: "instalacion-resumen",
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
    description: "Resumen del proceso de instalación",
    tags: ["nivel-3", "instalacion", "resumen"],
    version: "1.0.0",
  },
};


