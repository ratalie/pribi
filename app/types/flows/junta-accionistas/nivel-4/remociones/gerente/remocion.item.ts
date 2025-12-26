import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionGerenteRemocionItem: FlowItem = {
  identity: {
    id: "remocion-gerente-remocion",
    type: FlowItemType.STEP,
    label: "Remoción del Gerente General",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "remocion-gerente-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_GERENTE_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Detalle de la remoción del gerente general",
    tags: ["nivel-4", "remociones", "gerente"],
    version: "1.0.0",
  },
};

