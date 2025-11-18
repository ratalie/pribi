import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../defaults";

/**
 * FlowItem: Puntos de Acuerdo
 *
 * Nivel 0 - PADRE COMPLEJO
 * Este es el item padre de TODA la estructura jerárquica de Nivel 1-4.
 *
 * IMPORTANTE: Este item NO tiene rightSidebar habilitado porque sus hijos (Nivel 1)
 * son SECTIONS que aparecen en el flujo principal. Los rightSidebar aparecen en Nivel 2.
 *
 * Estructura jerárquica:
 * - Nivel 0: puntos-acuerdo (ESTE ITEM - PADRE)
 *   - Nivel 1: Sections (Aumento Capital, Nombramiento, Remociones, Gestión Social)
 *     - Nivel 2: Items con rightSidebar (Aporte Dinerario, Capitalización, etc.)
 *       - Nivel 3: Sub-items en rightSidebar (Aportantes, Aportes, Votación)
 *         - Nivel 4: Scroll anchors (para casos específicos)
 */
export const puntosAcuerdoItem: FlowItem = {
  identity: {
    id: "puntos-acuerdo",
    type: FlowItemType.STEP,
    label: "Puntos de Acuerdo",
  },
  hierarchy: {
    level: 0,
    order: 4,
    parentId: null,
    children: [
      // Nivel 1 - Sections (se agregarán cuando se creen)
      "aumento-capital-section",
      "nombramiento-section",
      "remociones-section",
      "gestion-social-section",
    ],
  },
  navigation: {
    route: JuntaRoutes.PUNTOS_ACUERDO,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: false, // NO tiene rightSidebar - sus hijos aparecen en flujo principal
  },
  validation: defaultValidation,
  metadata: {
    description: "Vista general de todos los puntos de acuerdo a tratar en la junta",
    tags: ["nivel-0", "padre-complejo", "puntos-acuerdo"],
    version: "1.0.0",
    notes: "PADRE COMPLEJO: Contiene toda la estructura jerárquica de niveles 1-4",
  },
};
