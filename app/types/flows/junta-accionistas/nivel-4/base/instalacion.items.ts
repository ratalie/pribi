import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

const parentId = "instalacion-proceso";
const baseRoute = JuntaRoutes.INSTALACION;

export const instalacionConvocatoriaRealizadaItem: FlowItem = {
  identity: {
    id: "instalacion-convocatoria-realizada",
    type: FlowItemType.STEP,
    label: "Convocatoria Realizada",
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
    hash: "#convocatoria-realizada",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Detalle de la convocatoria emitida, medios y plazos",
    tags: ["nivel-4", "instalacion", "convocatoria"],
    version: "1.0.0",
  },
};

export const instalacionAsistenciaRepresentacionItem: FlowItem = {
  identity: {
    id: "instalacion-asistencia-representacion",
    type: FlowItemType.STEP,
    label: "Asistencia y Representación",
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
    hash: "#asistencia-representacion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Registro de asistentes, poderes otorgados y quórum",
    tags: ["nivel-4", "instalacion", "asistencia"],
    version: "1.0.0",
  },
};

export const instalacionMesaDirectivaItem: FlowItem = {
  identity: {
    id: "instalacion-mesa-directiva",
    type: FlowItemType.STEP,
    label: "Mesa Directiva",
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
    hash: "#mesa-directiva",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Designación de presidente, secretario y comités de apoyo",
    tags: ["nivel-4", "instalacion", "mesa-directiva"],
    version: "1.0.0",
  },
};
