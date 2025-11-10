import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoApoderadosOtorgamientoItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados-otorgamiento",
    type: FlowItemType.STEP,
    label: "Otorgamiento",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "nombramiento-apoderados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registro del otorgamiento de poderes y facultades delegadas",
    tags: ["nivel-4", "nombramiento", "apoderados"],
    version: "1.0.0",
  },
};
