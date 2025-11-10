import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoGerenteDesignacionItem: FlowItem = {
  identity: {
    id: "nombramiento-gerente-designacion",
    type: FlowItemType.STEP,
    label: "Designación",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "nombramiento-gerente-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_GERENTE_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Designación del gerente general y sus responsabilidades",
    tags: ["nivel-4", "nombramiento", "gerente"],
    version: "1.0.0",
  },
};
