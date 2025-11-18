import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectorioContenidoItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-contenido",
    type: FlowItemType.STEP,
    label: "Nombramiento de Directorio",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: "nombramiento-directorio",
    children: [
      "nombramiento-directorio-designacion",
      "nombramiento-directorio-cantidad",
      "nombramiento-directorio-votacion",
    ],
  },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_DIRECTORIO,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true },
  validation: defaultValidation,
  metadata: {
    description: "Configuración general del nombramiento del directorio",
    tags: ["nivel-3", "nombramiento", "directorio"],
    version: "1.0.0",
  },
};
