import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const estadosFinancierosContenidoItem: FlowItem = {
  identity: {
    id: "estados-financieros-contenido",
    type: FlowItemType.STEP,
    label: "Estados Financieros",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "estados-financieros",
    children: [
      "estados-financieros-presentacion",
      "estados-financieros-aprobacion",
      "estados-financieros-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.ESTADOS_FINANCIEROS,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Introducción a la presentación, aprobación y votación de estados financieros",
    tags: ["nivel-3", "gestion-social", "estados-financieros"],
    version: "1.0.0",
  },
};
