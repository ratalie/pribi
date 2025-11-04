/**
 * FlowItems Nivel 4 - Nombramiento Apoderados > Otorgamiento de Poderes
 *
 * Items de scroll anchors para cada sección dentro de la página
 * de Otorgamiento de Poderes.
 *
 * NIVEL 4: Scroll anchors dentro de una página (hash navigation)
 */

import { JuntaRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "../../defaults";

/**
 * Padre: nombramiento-apoderados-otorgamiento (Nivel 3)
 * Comportamiento: SCROLL (navegación por hash #)
 * Página: otorgamiento-poderes.vue
 */

// Anchor 1: Apoderado 1
export const apoderado1OtorgamientoItem: FlowItem = {
  identity: { id: "otorgamiento-apoderado-1", type: FlowItemType.STEP, label: "Apoderado 1" },
  hierarchy: { level: 4, order: 1, parentId: "nombramiento-apoderados-otorgamiento", children: [] },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO,
    behavior: NavigationBehavior.SCROLL,
    hash: "#apoderado-1",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Otorgamiento de poderes para el primer apoderado",
    tags: ["nombramiento", "apoderados", "otorgamiento", "anchor"],
    version: "1.0.0",
  },
};

// Anchor 2: Apoderado 2
export const apoderado2OtorgamientoItem: FlowItem = {
  identity: { id: "otorgamiento-apoderado-2", type: FlowItemType.STEP, label: "Apoderado 2" },
  hierarchy: { level: 4, order: 2, parentId: "nombramiento-apoderados-otorgamiento", children: [] },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO,
    behavior: NavigationBehavior.SCROLL,
    hash: "#apoderado-2",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Otorgamiento de poderes para el segundo apoderado",
    tags: ["nombramiento", "apoderados", "otorgamiento", "anchor"],
    version: "1.0.0",
  },
};

// Anchor 3: Apoderado 3
export const apoderado3OtorgamientoItem: FlowItem = {
  identity: { id: "otorgamiento-apoderado-3", type: FlowItemType.STEP, label: "Apoderado 3" },
  hierarchy: { level: 4, order: 3, parentId: "nombramiento-apoderados-otorgamiento", children: [] },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO,
    behavior: NavigationBehavior.SCROLL,
    hash: "#apoderado-3",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Otorgamiento de poderes para el tercer apoderado",
    tags: ["nombramiento", "apoderados", "otorgamiento", "anchor"],
    version: "1.0.0",
  },
};

// Anchor 4: Apoderado 4
export const apoderado4OtorgamientoItem: FlowItem = {
  identity: { id: "otorgamiento-apoderado-4", type: FlowItemType.STEP, label: "Apoderado 4" },
  hierarchy: { level: 4, order: 4, parentId: "nombramiento-apoderados-otorgamiento", children: [] },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO,
    behavior: NavigationBehavior.SCROLL,
    hash: "#apoderado-4",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Otorgamiento de poderes para el cuarto apoderado",
    tags: ["nombramiento", "apoderados", "otorgamiento", "anchor"],
    version: "1.0.0",
  },
};

// Anchor 5: Apoderado 5
export const apoderado5OtorgamientoItem: FlowItem = {
  identity: { id: "otorgamiento-apoderado-5", type: FlowItemType.STEP, label: "Apoderado 5" },
  hierarchy: { level: 4, order: 5, parentId: "nombramiento-apoderados-otorgamiento", children: [] },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO,
    behavior: NavigationBehavior.SCROLL,
    hash: "#apoderado-5",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Otorgamiento de poderes para el quinto apoderado",
    tags: ["nombramiento", "apoderados", "otorgamiento", "anchor"],
    version: "1.0.0",
  },
};

// Anchor 6: Facultades Generales
export const facultadesGeneralesItem: FlowItem = {
  identity: {
    id: "otorgamiento-facultades-generales",
    type: FlowItemType.STEP,
    label: "Facultades Generales",
  },
  hierarchy: { level: 4, order: 6, parentId: "nombramiento-apoderados-otorgamiento", children: [] },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO,
    behavior: NavigationBehavior.SCROLL,
    hash: "#facultades-generales",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Facultades generales aplicables a todos los apoderados",
    tags: ["nombramiento", "apoderados", "otorgamiento", "anchor", "facultades"],
    version: "1.0.0",
  },
};

// Anchor 7: Limitaciones
export const limitacionesItem: FlowItem = {
  identity: {
    id: "otorgamiento-limitaciones",
    type: FlowItemType.STEP,
    label: "Limitaciones",
  },
  hierarchy: { level: 4, order: 7, parentId: "nombramiento-apoderados-otorgamiento", children: [] },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO,
    behavior: NavigationBehavior.SCROLL,
    hash: "#limitaciones",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Limitaciones a los poderes otorgados",
    tags: ["nombramiento", "apoderados", "otorgamiento", "anchor", "limitaciones"],
    version: "1.0.0",
  },
};

// Anchor 8: Vigencia
export const vigenciaItem: FlowItem = {
  identity: { id: "otorgamiento-vigencia", type: FlowItemType.STEP, label: "Vigencia" },
  hierarchy: { level: 4, order: 8, parentId: "nombramiento-apoderados-otorgamiento", children: [] },
  navigation: {
    route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO,
    behavior: NavigationBehavior.SCROLL,
    hash: "#vigencia",
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Vigencia temporal de los poderes otorgados",
    tags: ["nombramiento", "apoderados", "otorgamiento", "anchor", "vigencia"],
    version: "1.0.0",
  },
};
