import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const pronunciamientoGestionInformeItem: FlowItem = {
  identity: {
    id: "pronunciamiento-gestion-informe",
    type: FlowItemType.STEP,
    label: "Pronunciamiento",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "pronunciamiento-gestion-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.PRONUNCIAMIENTO_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registro del informe presentado por la gerencia",
    tags: ["nivel-4", "gestion-social", "pronunciamiento"],
    version: "1.0.0",
  },
};
