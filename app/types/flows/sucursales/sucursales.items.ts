import { SucursalesRoutes } from "@/config/routes";
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { defaultBehavior, defaultValidation } from "./defaults";

// 6 FlowItems flat para Sucursales
export const sucursalDatosSociedadItem: FlowItem = {
  identity: {
    id: "sucursal-datos-sociedad",
    type: FlowItemType.STEP,
    label: "Datos de la Sociedad",
  },
  hierarchy: { level: 0, order: 1, parentId: null, children: [] },
  navigation: { route: SucursalesRoutes.DATOS_SOCIEDAD, behavior: NavigationBehavior.PUSH },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Datos de la sociedad matriz",
    tags: ["sucursales"],
    version: "1.0.0",
  },
};

export const sucursalDatosGeneralesItem: FlowItem = {
  identity: {
    id: "sucursal-datos-generales",
    type: FlowItemType.STEP,
    label: "Datos Generales",
  },
  hierarchy: { level: 0, order: 2, parentId: null, children: [] },
  navigation: { route: SucursalesRoutes.DATOS_GENERALES, behavior: NavigationBehavior.PUSH },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true, title: "Ayuda: Datos Generales", contentType: "help" },
  validation: defaultValidation,
  metadata: {
    description: "Datos generales de la sucursal",
    tags: ["sucursales"],
    version: "1.0.0",
  },
};

export const sucursalCapitalSocialItem: FlowItem = {
  identity: {
    id: "sucursal-capital-social",
    type: FlowItemType.STEP,
    label: "Capital Social",
  },
  hierarchy: { level: 0, order: 3, parentId: null, children: [] },
  navigation: { route: SucursalesRoutes.CAPITAL_SOCIAL, behavior: NavigationBehavior.PUSH },
  behavior: defaultBehavior,
  rightSidebar: { enabled: true, title: "Ayuda: Capital Social", contentType: "help" },
  validation: defaultValidation,
  metadata: {
    description: "Capital social de la sucursal",
    tags: ["sucursales"],
    version: "1.0.0",
  },
};

export const sucursalAccionesItem: FlowItem = {
  identity: { id: "sucursal-acciones", type: FlowItemType.STEP, label: "Acciones" },
  hierarchy: { level: 0, order: 4, parentId: null, children: [] },
  navigation: { route: SucursalesRoutes.ACCIONES, behavior: NavigationBehavior.PUSH },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Configuración de acciones",
    tags: ["sucursales"],
    version: "1.0.0",
  },
};

export const sucursalAccionistasItem: FlowItem = {
  identity: { id: "sucursal-accionistas", type: FlowItemType.STEP, label: "Accionistas" },
  hierarchy: { level: 0, order: 5, parentId: null, children: [] },
  navigation: { route: SucursalesRoutes.ACCIONISTAS, behavior: NavigationBehavior.PUSH },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Accionistas de la sucursal",
    tags: ["sucursales"],
    version: "1.0.0",
  },
};

export const sucursalAsignacionItem: FlowItem = {
  identity: {
    id: "sucursal-asignacion",
    type: FlowItemType.STEP,
    label: "Asignación de Acciones",
  },
  hierarchy: { level: 0, order: 6, parentId: null, children: [] },
  navigation: {
    route: SucursalesRoutes.ASIGNACION_ACCIONES,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: defaultBehavior,
  rightSidebar: { enabled: false },
  validation: defaultValidation,
  metadata: {
    description: "Asignación de acciones a accionistas",
    tags: ["sucursales"],
    version: "1.0.0",
  },
};
