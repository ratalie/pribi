import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

const baseParentId = "instalacion";

export const instalacionProcesoItem: FlowItem = {
  identity: {
    id: "instalacion-proceso",
    type: FlowItemType.STEP,
    label: "Instalación de la Junta",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: baseParentId,
    children: [
      "instalacion-convocatoria-realizada",
      "instalacion-asistencia-representacion",
      "instalacion-mesa-directiva",
    ],
  },
  navigation: {
    route: JuntaRoutes.INSTALACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Proceso integral de instalación: convocatoria, asistencia y mesa directiva",
    tags: ["nivel-3", "instalacion", "proceso"],
    version: "1.0.0",
  },
};

export const instalacionResumenItem: FlowItem = {
  identity: {
    id: "instalacion-resumen",
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
    route: JuntaRoutes.INSTALACION_RESUMEN,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen de acuerdos y verificaciones realizadas durante la instalación",
    tags: ["nivel-3", "instalacion", "resumen"],
    version: "1.0.0",
  },
};


