import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionGerenteContenidoItem: FlowItem = {
  identity: {
    id: "remocion-gerente-contenido",
    type: FlowItemType.STEP,
    label: "Remoción de Gerente",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "remocion-gerente",
    children: [
      "remocion-gerente-seleccion",
      "remocion-gerente-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_GERENTE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Introducción al proceso de remoción del gerente general",
    tags: ["nivel-3", "remociones", "gerente"],
    version: "1.0.0",
  },
};
