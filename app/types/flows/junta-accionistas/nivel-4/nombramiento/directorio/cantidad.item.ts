import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectorioConfigurarItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-configurar",
    type: FlowItemType.STEP,
    label: "Configurar Directorio",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "nombramiento-directorio-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORIO_CANTIDAD,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Configuración del directorio: número de integrantes y alternos",
    tags: ["nivel-4", "nombramiento", "directorio"],
    version: "1.0.0",
  },
};
