import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const aplicacionResultadosAplicacionItem: FlowItem = {
  identity: {
    id: "aplicacion-resultados-aplicacion",
    type: FlowItemType.STEP,
    label: "Aplicación",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "aplicacion-resultados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.APLICACION_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Define la aplicación específica de los resultados",
    tags: ["nivel-4", "gestion-social", "aplicacion-resultados"],
    version: "1.0.0",
  },
};
