import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoApoderadosDesignacionItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados-designacion",
    type: FlowItemType.STEP,
    label: "Designación",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "nombramiento-apoderados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Designación de los apoderados y alcances del poder",
    tags: ["nivel-4", "nombramiento", "apoderados"],
    version: "1.0.0",
  },
};
