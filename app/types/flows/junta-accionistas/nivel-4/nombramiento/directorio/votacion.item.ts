import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectorioVotacionDesignacionItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-votacion-designacion",
    type: FlowItemType.STEP,
    label: "Votación de la Designación",
  },
  hierarchy: {
    level: 4,
    order: 5,
    parentId: "nombramiento-directorio-contenido",
    children: [],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORIO_VOTACION,
    behavior: NavigationBehavior.PUSH,
    hash: "#designacion",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Votación sobre la designación de directores",
    tags: ["nivel-4", "nombramiento", "directorio"],
    version: "1.0.0",
  },
};
