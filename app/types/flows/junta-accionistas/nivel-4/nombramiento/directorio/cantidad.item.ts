import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../../defaults";

export const nombramientoDirectorioCantidadItem: FlowItem = {
  identity: {
    id: "nombramiento-directorio-cantidad",
    type: FlowItemType.STEP,
    label: "Cantidad de Directores",
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
    description: "Define el número de integrantes para el nuevo directorio",
    tags: ["nivel-4", "nombramiento", "directorio"],
    version: "1.0.0",
  },
};
