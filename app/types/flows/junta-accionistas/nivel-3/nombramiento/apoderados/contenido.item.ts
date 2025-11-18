import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoApoderadosContenidoItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados-contenido",
    type: FlowItemType.STEP,
    label: "Nombramiento de Apoderados",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "nombramiento-apoderados",
    children: [
      "nombramiento-apoderados-designacion",
      "nombramiento-apoderados-otorgamiento",
      "nombramiento-apoderados-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Configuración general del nombramiento y otorgamiento de poderes",
    tags: ["nivel-3", "nombramiento", "apoderados"],
    version: "1.0.0",
  },
};
