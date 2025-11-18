import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../defaults";

/**
 * FlowItem Section: Aumento de Capital
 *
 * Nivel 1 - SECTION
 * Agrupa los items de Nivel 2 relacionados con aumento de capital.
 *
 * Hijos (Nivel 2):
 * - Aporte Dinerario
 * - Capitalización de Créditos
 *
 * IMPORTANTE: Las SECTIONS no navegan (behavior: NONE), solo agrupan visualmente.
 */
export const aumentoCapitalSection: FlowItem = {
  identity: {
    id: "aumento-capital-section",
    type: FlowItemType.SECTION,
    label: "Aumento de Capital",
    isCategory: true,  // Renderizar como separador visual (sin círculo)
  },
  hierarchy: {
    level: 1,
    order: 1,
    parentId: "puntos-acuerdo",
    children: ["aporte-dinerario", "capitalizacion-creditos"],
  },
  navigation: {
    behavior: NavigationBehavior.NONE, // Las sections no navegan
  },
  behavior: {
    ...defaultBehavior,
    isCollapsible: true, // Las sections son colapsables
    isCollapsed: false,
  },
  rightSidebar: {
    enabled: false, // Las sections no tienen rightSidebar
  },
  validation: defaultValidation,
  metadata: {
    description: "Sección que agrupa los diferentes tipos de aumento de capital",
    tags: ["nivel-1", "section", "aumento-capital"],
    version: "1.0.0",
  },
};
