import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

export const aplicacionResultadosDetalleItem: FlowItem = {
  identity: {
    id: "aplicacion-resultados-resultados",
    type: FlowItemType.STEP,
    label: "Resultados",
  },
  hierarchy: { level: 3, order: 1, parentId: "aplicacion-resultados", children: [] },
  navigation: {
    route: JuntaRoutes.APLICACION_RESULTADOS,
    behavior: NavigationBehavior.PUSH,
    hash: "#resultados",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resultados del ejercicio",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};

export const aplicacionAplicacionItem: FlowItem = {
  identity: {
    id: "aplicacion-resultados-aplicacion",
    type: FlowItemType.STEP,
    label: "Aplicación",
  },
  hierarchy: { level: 3, order: 2, parentId: "aplicacion-resultados", children: [] },
  navigation: { route: JuntaRoutes.APLICACION_DETALLE, behavior: NavigationBehavior.PUSH },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Aplicación de resultados",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};

export const aplicacionVotacionItem: FlowItem = {
  identity: {
    id: "aplicacion-resultados-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: { level: 3, order: 3, parentId: "aplicacion-resultados", children: [] },
  navigation: { route: JuntaRoutes.APLICACION_VOTACION, behavior: NavigationBehavior.PUSH },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación de aplicación",
    tags: ["nivel-3", "gestion-social"],
    version: "1.0.0",
  },
};
