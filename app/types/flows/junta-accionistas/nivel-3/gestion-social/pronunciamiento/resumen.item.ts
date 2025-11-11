import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const pronunciamientoGestionResumenItem: FlowItem = {
  identity: {
    id: "pronunciamiento-gestion-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "pronunciamiento-gestion",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.PRONUNCIAMIENTO_GESTION_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen ejecutivo del pronunciamiento sobre la gestión",
    tags: ["nivel-3", "gestion-social", "pronunciamiento", "resumen"],
    version: "1.0.0",
  },
};
