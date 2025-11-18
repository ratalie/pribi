import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionGerenteResumenItem: FlowItem = {
  identity: {
    id: "remocion-gerente-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "remocion-gerente",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_GERENTE_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen del proceso de remoción del gerente general",
    tags: ["nivel-3", "remociones", "gerente", "resumen"],
    version: "1.0.0",
  },
};
