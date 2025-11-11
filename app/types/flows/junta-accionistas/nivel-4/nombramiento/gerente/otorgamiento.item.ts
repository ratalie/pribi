import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoGerenteOtorgamientoItem: FlowItem = {
  identity: {
    id: "nombramiento-gerente-otorgamiento",
    type: FlowItemType.STEP,
    label: "Otorgamiento de Poderes",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "nombramiento-gerente-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_GERENTE_OTORGAMIENTO,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Delegación de facultades, limitaciones y vigencia del gerente designado",
    tags: ["nivel-4", "nombramiento", "gerente"],
    version: "1.0.0",
  },
};
