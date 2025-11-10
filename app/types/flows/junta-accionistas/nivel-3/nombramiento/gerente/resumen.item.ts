import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoGerenteResumenItem: FlowItem = {
  identity: {
    id: "nombramiento-gerente-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: "nombramiento-gerente",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_GERENTE_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen del nombramiento y aprobación del gerente general",
    tags: ["nivel-3", "nombramiento", "gerente", "resumen"],
    version: "1.0.0",
  },
};
