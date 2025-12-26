import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoApoderadosNombramientoItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados-nombramiento",
    type: FlowItemType.STEP,
    label: "Nombramiento de Apoderados",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId: "nombramiento-apoderados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_DETALLE,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Nombramiento de apoderados",
    tags: ["nivel-4", "nombramiento", "apoderados"],
    version: "1.0.0",
  },
};

export const nombramientoApoderadosSeleccionItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados-seleccion",
    type: FlowItemType.STEP,
    label: "Selección de Apoderados",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "nombramiento-apoderados-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_DETALLE,
    behavior: NavigationBehavior.PUSH,
    hash: "#seleccion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Selección de los apoderados a designar",
    tags: ["nivel-4", "nombramiento", "apoderados"],
    version: "1.0.0",
  },
};
