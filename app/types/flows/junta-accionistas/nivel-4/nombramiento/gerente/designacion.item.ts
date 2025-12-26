import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoGerenteNombramientoItem: FlowItem = {
  identity: {
    id: "nombramiento-gerente-nombramiento",
    type: FlowItemType.STEP,
    label: "Nombramiento de Gerente General",
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
    description: "Nombramiento del gerente general",
    tags: ["nivel-4", "nombramiento", "gerente"],
    version: "1.0.0",
  },
};

export const nombramientoGerenteGerenteGeneralItem: FlowItem = {
  identity: {
    id: "nombramiento-gerente-gerente-general",
    type: FlowItemType.STEP,
    label: "Gerente General",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "nombramiento-gerente-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_GERENTE_DETALLE,
    behavior: NavigationBehavior.PUSH,
    hash: "#gerente-general",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Información del gerente general designado",
    tags: ["nivel-4", "nombramiento", "gerente"],
    version: "1.0.0",
  },
};
