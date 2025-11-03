import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Nombramiento de Apoderados
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Nombramiento Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Designación de Apoderados
 * - Otorgamiento de Poderes
 * - Votación
 */
export const nombramientoApoderadosItem: FlowItem = {
  identity: {
    id: "nombramiento-apoderados",
    type: FlowItemType.STEP,
    label: "Nombramiento de Apoderados",
  },
  hierarchy: {
    level: 2,
    order: 1,
    parentId: "nombramiento-section",
    children: [
      "nombramiento-apoderados-designacion",
      "nombramiento-apoderados-otorgamiento",
      "nombramiento-apoderados-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS,
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
    description: "Gestión del proceso de nombramiento de apoderados",
    tags: ["nivel-2", "nombramiento", "apoderados"],
    version: "1.0.0",
  },
};
