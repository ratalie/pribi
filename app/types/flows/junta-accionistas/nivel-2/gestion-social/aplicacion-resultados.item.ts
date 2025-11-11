import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * FlowItem: Aplicación de Resultados
 *
 * Nivel 2 - Item con RightSidebar
 * Parent: Gestión Social Section
 *
 * Hijos (Nivel 3 - en rightSidebar):
 * - Resultados
 * - Aplicación
 * - Votación
 */
export const aplicacionResultadosItem: FlowItem = {
  identity: {
    id: "aplicacion-resultados",
    type: FlowItemType.STEP,
    label: "Aplicación de Resultados",
  },
  hierarchy: {
    level: 2,
    order: 2,
    parentId: "gestion-social-section",
    children: [
      "aplicacion-resultados-contenido",
      "aplicacion-resultados-resumen",
    ],
  },
  navigation: {
    route: JuntaRoutes.APLICACION_RESULTADOS,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: {
    enabled: true,
    title: "Proceso de Aplicación",
    contentType: "info",
  },
  validation: defaultValidation,
  metadata: {
    description: "Gestión de la aplicación de resultados del ejercicio",
    tags: ["nivel-2", "gestion-social", "aplicacion-resultados"],
    version: "1.0.0",
    category: "Gestión Social y Resultados Económicos",
  },
};
