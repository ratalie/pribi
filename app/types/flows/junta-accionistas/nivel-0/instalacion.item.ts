import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../defaults";

/**
 * FlowItem: Instalación de la Junta
 *
 * Nivel 0 - Paso principal del flujo de Junta de Accionistas
 * Proceso de instalación de la junta (convocatoria, asistencia, constitución de mesa)
 *
 * RightSidebar: Habilitado para mostrar sub-etapas del proceso de instalación
 */
export const instalacionItem: FlowItem = {
  identity: {
    id: "instalacion",
    type: FlowItemType.STEP,
    label: "Instalación",
  },
  hierarchy: {
    level: 0,
    order: 3,
    parentId: null,
    children: [
      "instalacion-paso-1",
      "instalacion-paso-2",
      "instalacion-votacion",
      "instalacion-resumen",
    ],
  },
  navigation: {
    route: JuntaRoutes.INSTALACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Proceso de Instalación",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description:
      "Instalación de la junta: convocatoria, registro de asistencia, constitución de mesa directiva",
    tags: ["nivel-0", "instalacion", "proceso"],
    version: "1.0.0",
  },
};
