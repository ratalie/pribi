import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionApoderadosRemocionItem: FlowItem = {
  identity: {
    id: "remocion-apoderados-remocion",
    type: FlowItemType.STEP,
    label: "Remoción de Apoderados",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "remocion-apoderados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_APODERADOS_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Detalle de la remoción de apoderados",
    tags: ["nivel-4", "remociones", "apoderados"],
    version: "1.0.0",
  },
};

export const remocionApoderadosSeleccionItem: FlowItem = {
  identity: {
    id: "remocion-apoderados-seleccion",
    type: FlowItemType.STEP,
    label: "Selección de Apoderados",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "remocion-apoderados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_APODERADOS_DETALLE,
    behavior: NavigationBehavior.PUSH,
    hash: "#seleccion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Selecciona los apoderados cuya remoción será discutida",
    tags: ["nivel-4", "remociones", "apoderados"],
    version: "1.0.0",
  },
};
