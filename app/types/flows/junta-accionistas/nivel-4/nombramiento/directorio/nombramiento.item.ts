import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectorioNombramientoItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-nombramiento",
    type: FlowItemType.STEP,
    label: "Nombramiento de Nuevo Directorio",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "nombramiento-directorio-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORIO_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Nombramiento de nuevo directorio",
    tags: ["nivel-4", "nombramiento", "directorio"],
    version: "1.0.0",
  },
};

