import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectorioVotacionConfiguracionItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-votacion-configuracion",
    type: FlowItemType.STEP,
    label: "Votación de la Configuración del Directorio",
  },
  hierarchy: {
    level: 4,
    order: 3,
    parentId: "nombramiento-directorio-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORIO_VOTACION,
    behavior: NavigationBehavior.PUSH,
    hash: "#configuracion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación sobre la configuración del directorio",
    tags: ["nivel-4", "nombramiento", "directorio"],
    version: "1.0.0",
  },
};

