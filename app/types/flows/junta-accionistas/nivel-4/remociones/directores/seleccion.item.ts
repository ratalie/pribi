import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionDirectoresSeleccionItem: FlowItem = {
  identity: {
    id: "remocion-directores-seleccion",
    type: FlowItemType.STEP,
    label: "Selección",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "remocion-directores-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_DIRECTORES,
    behavior: NavigationBehavior.PUSH,
    hash: "#seleccion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Selecciona los directores cuya remoción será tratada",
    tags: ["nivel-4", "remociones", "directores"],
    version: "1.0.0",
  },
};
