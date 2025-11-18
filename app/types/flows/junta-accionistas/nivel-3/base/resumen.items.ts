import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

const baseParentId = "resumen";
const baseRoute = JuntaRoutes.RESUMEN;

export const resumenGeneralItem: FlowItem = {
  identity: {
    id: "resumen-general",
    type: FlowItemType.STEP,
    label: "Resumen General",
  },
  hierarchy: {
    level: 3,
    order: 1,
    parentId: baseParentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#general",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen general de la junta",
    tags: ["nivel-3", "resumen", "general"],
    version: "1.0.0",
  },
};

export const resumenPuntosItem: FlowItem = {
  identity: {
    id: "resumen-puntos-acuerdo",
    type: FlowItemType.STEP,
    label: "Puntos de Acuerdo",
  },
  hierarchy: {
    level: 3,
    order: 2,
    parentId: baseParentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#puntos-acuerdo",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen de los acuerdos aprobados",
    tags: ["nivel-3", "resumen", "puntos-acuerdo"],
    version: "1.0.0",
  },
};

export const resumenVotacionesItem: FlowItem = {
  identity: {
    id: "resumen-votaciones",
    type: FlowItemType.STEP,
    label: "Votaciones",
  },
  hierarchy: {
    level: 3,
    order: 3,
    parentId: baseParentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#votaciones",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Resumen de las votaciones registradas",
    tags: ["nivel-3", "resumen", "votaciones"],
    version: "1.0.0",
  },
};

export const resumenDocumentosItem: FlowItem = {
  identity: {
    id: "resumen-documentos",
    type: FlowItemType.STEP,
    label: "Documentos",
  },
  hierarchy: {
    level: 3,
    order: 4,
    parentId: baseParentId,
    children: [],
  },
  navigation: {
    route: baseRoute,
    behavior: NavigationBehavior.PUSH,
    hash: "#documentos",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Acceso directo a documentos generados",
    tags: ["nivel-3", "resumen", "documentos"],
    version: "1.0.0",
  },
};


