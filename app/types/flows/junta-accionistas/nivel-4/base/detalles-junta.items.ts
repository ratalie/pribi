import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

const parentId = "detalles-junta-general";
const baseRoute = JuntaRoutes.DETALLES;

export const detallesJuntaTipoItem: FlowItem = {
  identity: {
    id: "detalles-junta-tipo",
    type: FlowItemType.STEP,
    label: "Tipo de Junta",
  },
  hierarchy: {
    level: 4,
    order: 1,
    parentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#tipo-junta",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Define si la junta es ordinaria, extraordinaria u otra modalidad estatutaria",
    tags: ["nivel-4", "detalles", "tipo-junta"],
    version: "1.0.0",
  },
};

export const detallesJuntaModalidadItem: FlowItem = {
  identity: {
    id: "detalles-junta-modalidad",
    type: FlowItemType.STEP,
    label: "Modalidad de la Junta",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#modalidad-junta",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registra si la sesión será presencial, virtual o mixta",
    tags: ["nivel-4", "detalles", "modalidad"],
    version: "1.0.0",
  },
};

export const detallesJuntaConvocatoriaItem: FlowItem = {
  identity: {
    id: "detalles-junta-convocatoria",
    type: FlowItemType.STEP,
    label: "Convocatoria",
  },
  hierarchy: {
    level: 4,
    order: 3,
    parentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#convocatoria",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Gestiona la publicación de la convocatoria y los soportes legales",
    tags: ["nivel-4", "detalles", "convocatoria"],
    version: "1.0.0",
  },
};
