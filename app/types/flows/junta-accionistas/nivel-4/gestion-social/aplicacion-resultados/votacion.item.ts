import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const aplicacionResultadosVotacionItem: FlowItem = {
  identity: {
    id: "aplicacion-resultados-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 4,
    order: 3,
    parentId: "aplicacion-resultados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.APLICACION_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registra el resultado de la votación sobre la aplicación de resultados",
    tags: ["nivel-4", "gestion-social", "aplicacion-resultados"],
    version: "1.0.0",
  },
};
