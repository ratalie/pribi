import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../defaults";

/**
 * FlowItem Section: Nombramiento
 *
 * Nivel 1 - SECTION
 * Agrupa los items de Nivel 2 relacionados con nombramientos.
 *
 * Hijos (Nivel 2):
 * - Nombramiento de Apoderados
 * - Nombramiento de Gerente
 * - Nombramiento de Directores
 * - Nombramiento de Directorio
 * - Nombramiento de Auditores
 */
export const nombramientoSection: FlowItem = {
  identity: {
    id: "nombramiento-section",
    type: FlowItemType.SECTION,
    label: "Nombramiento",
    isCategory: true,  // Renderizar como separador visual (sin círculo)
  },
  hierarchy: {
    level: 1,
    order: 2,
    parentId: "puntos-acuerdo",
    children: [
      "nombramiento-apoderados",
      "nombramiento-gerente",
      "nombramiento-directores",
      "nombramiento-directorio",
      "nombramiento-auditores",
    ],
  },
  navigation: {
    behavior: NavigationBehavior.NONE,
  },
  behavior: {
    ...defaultBehavior,
    isCollapsible: true,
    isCollapsed: false,
  },
  rightSidebar: {
    enabled: false,
  },
  validation: defaultValidation,
  metadata: {
    description: "Sección que agrupa los diferentes tipos de nombramientos",
    tags: ["nivel-1", "section", "nombramiento"],
    version: "1.0.0",
  },
};
