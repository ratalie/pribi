import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectoresContenidoItem: FlowItem = {
  identity: {
    id: "nombramiento-directores-contenido",
    type: FlowItemType.STEP,
    label: "Nombramiento de Directores",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "nombramiento-directores",
    children: [
      "nombramiento-directores-designacion",
      "nombramiento-directores-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Configuración general del nombramiento de directores",
    tags: ["nivel-3", "nombramiento", "directores"],
    version: "1.0.0",
  },
};
