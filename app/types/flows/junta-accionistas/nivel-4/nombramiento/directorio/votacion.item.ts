import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectorioVotacionItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-votacion",
    type: FlowItemType.STEP,
    label: "Votación",
  },
  hierarchy: {
    level: 4,
    order: 2,
    parentId: "nombramiento-directorio-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORIO_VOTACION,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resultado de la votación para constituir el directorio",
    tags: ["nivel-4", "nombramiento", "directorio"],
    version: "1.0.0",
  },
};
