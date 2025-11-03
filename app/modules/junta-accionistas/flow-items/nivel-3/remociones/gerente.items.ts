import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const remocionGerenteSeleccionItem: FlowItem = {
  identity: { id: "remocion-gerente-seleccion", type: FlowItemType.STEP, label: "Selección" },
  hierarchy: { level: 3, order: 1, parentId: "remocion-gerente", children: [] },
  navigation: {
    route: JuntaRoutes.REMOCION_GERENTE,
    behavior: NavigationBehavior.PUSH,
    hash: "#seleccion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Selección de gerente a remover",
    tags: ["nivel-3", "remocion"],
    version: "1.0.0",
  },
};

export const remocionGerenteRevocatoriaItem: FlowItem = {
  identity: {
    id: "remocion-gerente-revocatoria",
    type: FlowItemType.STEP,
    label: "Revocatoria",
  },
  hierarchy: { level: 3, order: 2, parentId: "remocion-gerente", children: [] },
  navigation: {
    route: JuntaRoutes.REMOCION_GERENTE_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Revocatoria de nombramiento",
    tags: ["nivel-3", "remocion"],
    version: "1.0.0",
  },
};

export const remocionGerenteVotacionItem: FlowItem = {
  identity: { id: "remocion-gerente-votacion", type: FlowItemType.STEP, label: "Votación" },
  hierarchy: { level: 3, order: 3, parentId: "remocion-gerente", children: [] },
  navigation: {
    route: JuntaRoutes.REMOCION_GERENTE_VOTACION,
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
