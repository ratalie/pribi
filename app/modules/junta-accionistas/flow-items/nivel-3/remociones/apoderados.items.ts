import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const remocionApoderadosSeleccionItem: FlowItem = {
  identity: {
    id: "remocion-apoderados-seleccion",
    type: FlowItemType.STEP,
    label: "Selección",
  },
  hierarchy: { level: 3, order: 1, parentId: "remocion-apoderados", children: [] },
  navigation: {
    route: JuntaRoutes.REMOCION_APODERADOS,
    behavior: NavigationBehavior.PUSH,
    hash: "#seleccion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Selección de apoderados a remover",
    tags: ["nivel-3", "remocion"],
    version: "1.0.0",
  },
};

export const remocionApoderadosRevocatoriaItem: FlowItem = {
  identity: {
    id: "remocion-apoderados-revocatoria",
    type: FlowItemType.STEP,
    label: "Revocatoria",
  },
  hierarchy: { level: 3, order: 2, parentId: "remocion-apoderados", children: [] },
  navigation: {
    route: JuntaRoutes.REMOCION_APODERADOS_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Revocatoria de poderes",
    tags: ["nivel-3", "remocion"],
    version: "1.0.0",
  },
};

export const remocionApoderadosVotacionItem: FlowItem = {
  identity: { id: "remocion-apoderados-votacion", type: FlowItemType.STEP, label: "Votación" },
  hierarchy: { level: 3, order: 3, parentId: "remocion-apoderados", children: [] },
  navigation: {
    route: JuntaRoutes.REMOCION_APODERADOS_VOTACION,
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
