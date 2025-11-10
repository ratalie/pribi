import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

const baseParentId = "detalles";

export const detallesJuntaGeneralItem: FlowItem = {
  identity: {
    id: "detalles-junta-general",
    type: FlowItemType.STEP,
    label: "Detalles de la Junta",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: baseParentId,
    children: [
      "detalles-junta-tipo",
      "detalles-junta-modalidad",
      "detalles-junta-convocatoria",
    ],
  },
  navigation: {
    route: JuntaRoutes.DETALLES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Configuración general de tipo, modalidad y convocatoria de la junta",
    tags: ["nivel-3", "detalles", "general"],
    version: "1.0.0",
  },
};

export const detallesJuntaResumenItem: FlowItem = {
  identity: {
    id: "detalles-junta-resumen",
    type: FlowItemType.STEP,
    label: "Resumen",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: baseParentId,
    children: [],
  },
  navigation: {
    route: JuntaRoutes.DETALLES_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen de la configuración registrada en los detalles de la junta",
    tags: ["nivel-3", "detalles", "resumen"],
    version: "1.0.0",
  },
};


