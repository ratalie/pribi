import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoApoderadosResumenItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "nombramiento-apoderados",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen del nombramiento de apoderados y acuerdos asociados",
    tags: ["nivel-3", "nombramiento", "apoderados", "resumen"],
    version: "1.0.0",
  },
};
