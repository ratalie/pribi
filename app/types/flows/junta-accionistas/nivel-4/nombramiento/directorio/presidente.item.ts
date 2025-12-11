import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectorioPresidenteItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-presidente",
    type: FlowItemType.STEP,
    label: "Presidente del Directorio",
  },
  hierarchy: {
    level: 4,
    order: 6,
    parentId: "nombramiento-directorio-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORIO_DETALLE,
    behavior: NavigationBehavior.PUSH,
    hash: "#presidente",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Designación del presidente del directorio",
    tags: ["nivel-4", "nombramiento", "directorio"],
    version: "1.0.0",
  },
};

