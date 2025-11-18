import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Nombramiento de Directorio
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Nombramiento Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Designación
 * - Votación
 */
export const nombramientoDirectorioItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio",
    type: FlowItemType.STEP,
    label: "Nombramiento de Directorio",
  },
  hierarchy: {
    level: 2,
    order: 4,
    parentId: "nombramiento-section",
    children: [
      "nombramiento-directorio-contenido",
      "nombramiento-directorio-resumen",
    ],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORIO,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Proceso de Nombramiento",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión del proceso de nombramiento de directorio completo",
    tags: ["nivel-2", "nombramiento", "directorio"],
    version: "1.0.0",
    category: "Nombramiento",
  },
};
