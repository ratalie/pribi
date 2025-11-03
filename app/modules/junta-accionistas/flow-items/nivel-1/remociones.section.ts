import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../defaults";

/**
 * FlowItem Section: Remociones
 *
 * Nivel 1 - SECTION
 * Agrupa los items de Nivel 2 relacionados con remociones.
 *
 * Hijos (Nivel 2):
 * - Remoción de Apoderados
 * - Remoción de Gerente
 * - Remoción de Directores
 */
export const remocionesSection: FlowItem = {
  identity: {
    id: "remociones-section",
    type: FlowItemType.SECTION,
    label: "Remociones",
  },
  hierarchy: {
    level: 1,
    order: 3,
    parentId: "puntos-acuerdo",
    children: ["remocion-apoderados", "remocion-gerente", "remocion-directores"],
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
    description: "Sección que agrupa los diferentes tipos de remociones",
    tags: ["nivel-1", "section", "remociones"],
    version: "1.0.0",
  },
};
