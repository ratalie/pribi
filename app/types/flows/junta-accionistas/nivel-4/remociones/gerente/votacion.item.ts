import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionGerenteVotacionItem: FlowItem = {
  identity: {
    id: "remocion-gerente-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 4,
    order: 3,
    parentId: "remocion-gerente-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_GERENTE_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registra los resultados de la votación de remoción del gerente",
    tags: ["nivel-4", "remociones", "gerente"],
    version: "1.0.0",
  },
};
