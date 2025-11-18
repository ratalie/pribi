import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../defaults";

/**
 * FlowItem: Detalles de la Junta
 *
 * Nivel 0 - Paso principal del flujo de Junta de Accionistas
 * Configuración de detalles generales de la junta (tipo, modalidad, fecha, etc.)
 *
 * RightSidebar: Habilitado para mostrar sub-opciones de configuración
 */
export const detallesItem: FlowItem = {
  identity: {
    id: "detalles",
    type: FlowItemType.STEP,
    label: "Detalles de la Junta",
  },
  hierarchy: {
    level: 0,
    order: 2,
    parentId: null,
    children: [],
  },
  navigation: {
    route: JuntaRoutes.DETALLES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Ayuda: Detalles de la Junta",
    contentType: "help",
  },
  validation: defaultValidation,
  metadata: {
    description: "Configurar detalles de la junta: tipo, modalidad, fecha, lugar, etc.",
    tags: ["nivel-0", "configuracion", "detalles"],
    version: "1.0.0",
  },
};
