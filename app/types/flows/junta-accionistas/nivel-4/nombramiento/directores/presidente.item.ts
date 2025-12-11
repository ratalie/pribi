import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectoresPresidenteItem: FlowItem = {
  identity: {
    id: "nombramiento-directores-presidente",
    type: FlowItemType.STEP,
    label: "Presidente del Directorio",
  },
  hierarchy: {
    level: 4,
    order: 4,
    parentId: "nombramiento-directores-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORES_DETALLE,
    behavior: NavigationBehavior.PUSH,
    hash: "#presidente",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Designación del presidente del directorio",
    tags: ["nivel-4", "nombramiento", "directores"],
    version: "1.0.0",
  },
};

