import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectorioDesignacionItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-designacion",
    type: FlowItemType.STEP,
    label: "Designación de Directores",
  },
  hierarchy: {
    level: 4,
    order: 4,
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
    description: "Designación de los directores del nuevo directorio",
    tags: ["nivel-4", "nombramiento", "directorio"],
    version: "1.0.0",
  },
};
