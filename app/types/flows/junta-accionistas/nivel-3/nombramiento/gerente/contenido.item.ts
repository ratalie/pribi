import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoGerenteContenidoItem: FlowItem = {
  identity: {
    id: "nombramiento-gerente-contenido",
    type: FlowItemType.STEP,
    label: "Nombramiento de Gerente",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "nombramiento-gerente",
    children: [
      "nombramiento-gerente-nombramiento",
      "nombramiento-gerente-gerente-general",
      "nombramiento-gerente-otorgamiento",
      "nombramiento-gerente-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_GERENTE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Configuración general del nombramiento de gerente general",
    tags: ["nivel-3", "nombramiento", "gerente"],
    version: "1.0.0",
  },
};
