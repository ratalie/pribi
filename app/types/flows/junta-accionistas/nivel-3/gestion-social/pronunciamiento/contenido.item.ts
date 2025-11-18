import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const pronunciamientoGestionContenidoItem: FlowItem = {
  identity: {
    id: "pronunciamiento-gestion-contenido",
    type: FlowItemType.STEP,
    label: "Pronunciamiento de Gestión",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "pronunciamiento-gestion",
    children: [
      "pronunciamiento-gestion-informe",
      "pronunciamiento-gestion-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.PRONUNCIAMIENTO_GESTION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Introducción y lineamientos del pronunciamiento sobre la gestión",
    tags: ["nivel-3", "gestion-social", "pronunciamiento"],
    version: "1.0.0",
  },
};
