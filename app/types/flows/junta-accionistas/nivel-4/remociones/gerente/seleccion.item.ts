import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionGerenteSeleccionItem: FlowItem = {
  identity: {
    id: "remocion-gerente-seleccion",
    type: FlowItemType.STEP,
    label: "Gerente General",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "remocion-gerente-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_GERENTE,
    behavior: NavigationBehavior.PUSH,
    hash: "#seleccion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Selecciona los cargos o personas a evaluar para la remoción",
    tags: ["nivel-4", "remociones", "gerente"],
    version: "1.0.0",
  },
};
