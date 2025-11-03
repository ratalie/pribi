import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const remocionDirectoresSeleccionItem: FlowItem = {
  identity: {
    id: "remocion-directores-seleccion",
    type: FlowItemType.STEP,
    label: "Selección",
  },
  hierarchy: { level: 3, order: 1, parentId: "remocion-directores", children: [] },
  navigation: {
    route: JuntaRoutes.REMOCION_DIRECTORES,
    behavior: NavigationBehavior.PUSH,
    hash: "#seleccion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Selección de directores a remover",
    tags: ["nivel-3", "remocion"],
    version: "1.0.0",
  },
};

export const remocionDirectoresRevocatoriaItem: FlowItem = {
  identity: {
    id: "remocion-directores-revocatoria",
    type: FlowItemType.STEP,
    label: "Revocatoria",
  },
  hierarchy: { level: 3, order: 2, parentId: "remocion-directores", children: [] },
  navigation: {
    route: JuntaRoutes.REMOCION_DIRECTORES_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Revocatoria de nombramientos",
    tags: ["nivel-3", "remocion"],
    version: "1.0.0",
  },
};

export const remocionDirectoresVotacionItem: FlowItem = {
  identity: { id: "remocion-directores-votacion", type: FlowItemType.STEP, label: "Votación" },
  hierarchy: { level: 3, order: 3, parentId: "remocion-directores", children: [] },
  navigation: {
    route: JuntaRoutes.REMOCION_DIRECTORES_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación de remoción",
    tags: ["nivel-3", "remocion"],
    version: "1.0.0",
  },
};
