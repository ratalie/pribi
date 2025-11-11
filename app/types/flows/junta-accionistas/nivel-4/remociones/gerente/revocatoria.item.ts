import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionGerenteRevocatoriaItem: FlowItem = {
  identity: {
    id: "remocion-gerente-revocatoria",
    type: FlowItemType.STEP,
    label: "Revocatoria",
  },
  hierarchy: {
    level: 4,
    order: 2,
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
    description: "Registra los fundamentos de la revocatoria del gerente",
    tags: ["nivel-4", "remociones", "gerente"],
    version: "1.0.0",
  },
};
