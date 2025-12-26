import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionGerenteGerenteGeneralItem: FlowItem = {
  identity: {
    id: "remocion-gerente-gerente-general",
    type: FlowItemType.STEP,
    label: "Gerente General",
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
    hash: "#gerente-general",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Información del gerente general a remover",
    tags: ["nivel-4", "remociones", "gerente"],
    version: "1.0.0",
  },
};
