import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectoresNombramientoItem: FlowItem = {
  identity: {
    id: "nombramiento-directores-nombramiento",
    type: FlowItemType.STEP,
    label: "Nombramiento de Directores",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "nombramiento-directores-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORES_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Nombramiento de directores",
    tags: ["nivel-4", "nombramiento", "directores"],
    version: "1.0.0",
  },
};

export const nombramientoDirectoresRegistroItem: FlowItem = {
  identity: {
    id: "nombramiento-directores-registro",
    type: FlowItemType.STEP,
    label: "Registro de Directores",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "nombramiento-directores-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORES_DETALLE,
    behavior: NavigationBehavior.PUSH,
    hash: "#registro",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registro de los directores designados",
    tags: ["nivel-4", "nombramiento", "directores"],
    version: "1.0.0",
  },
};
