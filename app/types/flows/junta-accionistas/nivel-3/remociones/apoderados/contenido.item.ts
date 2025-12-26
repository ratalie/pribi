import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionApoderadosContenidoItem: FlowItem = {
  identity: {
    id: "remocion-apoderados-contenido",
    type: FlowItemType.STEP,
    label: "Remoción de Apoderados",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "remocion-apoderados",
    children: [
      "remocion-apoderados-remocion",
      "remocion-apoderados-seleccion",
      "remocion-apoderados-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_APODERADOS,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Introducción y configuración del proceso de remoción de apoderados",
    tags: ["nivel-3", "remociones", "apoderados"],
    version: "1.0.0",
  },
};
