import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectoresCantidadItem: FlowItem = {
  identity: {
    id: "nombramiento-directores-cantidad",
    type: FlowItemType.STEP,
    label: "Cantidad de Directores",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "nombramiento-directores-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORES_CANTIDAD,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Define el número de directores titulares y alternos a designar",
    tags: ["nivel-4", "nombramiento", "directores"],
    version: "1.0.0",
  },
};
