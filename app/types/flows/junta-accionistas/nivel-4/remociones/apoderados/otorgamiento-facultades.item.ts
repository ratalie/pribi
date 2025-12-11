import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const remocionApoderadosOtorgamientoFacultadesItem: FlowItem = {
  identity: {
    id: "remocion-apoderados-otorgamiento-facultades",
    type: FlowItemType.STEP,
    label: "Otorgamiento de Facultades",
  },
  hierarchy: {
    level: 4,
    order: 3,
    parentId: "remocion-apoderados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.REMOCION_APODERADOS_DETALLE,
    behavior: NavigationBehavior.PUSH,
    hash: "#otorgamiento-facultades",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registro del otorgamiento de facultades para la remoción",
    tags: ["nivel-4", "remociones", "apoderados"],
    version: "1.0.0",
  },
};

