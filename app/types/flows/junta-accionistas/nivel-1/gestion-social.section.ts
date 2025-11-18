import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../defaults";

/**
 * FlowItem Section: Gestión Social
 *
 * Nivel 1 - SECTION
 * Agrupa los items de Nivel 2 relacionados con gestión social.
 *
 * Hijos (Nivel 2):
 * - Pronunciamiento de Gestión
 * - Aplicación de Resultados
 * - Estados Financieros
 * - Reparto de Dividendos
 */
export const gestionSocialSection: FlowItem = {
  identity: {
    id: "gestion-social-section",
    type: FlowItemType.SECTION,
    label: "Gestión Social y Resultados Económicos",
    isCategory: true,  // Renderizar como separador visual (sin círculo)
  },
  hierarchy: {
    level: 1,
    order: 4,
    parentId: "puntos-acuerdo",
    children: [
      "pronunciamiento-gestion",
      "aplicacion-resultados",
      "estados-financieros",
      "reparto-dividendos",
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
    description: "Sección que agrupa los diferentes aspectos de gestión social",
    tags: ["nivel-1", "section", "gestion-social"],
    version: "1.0.0",
  },
};
