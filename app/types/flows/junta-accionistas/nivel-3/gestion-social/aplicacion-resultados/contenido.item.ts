import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const aplicacionResultadosContenidoItem: FlowItem = {
  identity: {
    id: "aplicacion-resultados-contenido",
    type: FlowItemType.STEP,
    label: "Aplicación de Resultados",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "aplicacion-resultados",
    children: [
      "aplicacion-resultados-aplicacion",
      "aplicacion-resultados-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.APLICACION_RESULTADOS,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Introducción a la distribución y aplicación de los resultados del ejercicio",
    tags: ["nivel-3", "gestion-social", "aplicacion-resultados"],
    version: "1.0.0",
  },
};
