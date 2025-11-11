import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const aplicacionResultadosResumenItem: FlowItem = {
  identity: {
    id: "aplicacion-resultados-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "aplicacion-resultados",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.APLICACION_RESULTADOS_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen de decisiones sobre la aplicación de resultados",
    tags: ["nivel-3", "gestion-social", "aplicacion-resultados", "resumen"],
    version: "1.0.0",
  },
};
