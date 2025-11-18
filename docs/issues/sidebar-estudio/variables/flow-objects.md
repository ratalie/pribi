# 📦 Objetos TypeScript Base - Flow System (Estructura Agrupada)

## 🎯 Objetivo

Definir los objetos TypeScript para los 3 flujos principales usando la **estructura agrupada** correcta:

1. **Registro Sociedades** (10+ pasos secuenciales)
2. **Sucursales** (5 pasos simples)
3. **Junta de Accionistas** (jerárquico con sidebar derecho)

---

## 🏗️ FlowItem Base (Estructura Agrupada)

```typescript
interface FlowItem {
  // === IDENTIDAD ===
  // ¿Quién soy? ¿Cómo me identifico?
  identity: {
    id: string; // Único: "datos-sociedad"
    label: string; // UI: "Datos de Sociedad"
    description?: string; // Ayuda extra
    icon?: string; // Icono visual
    badge?: string; // Badge "Nuevo", "Opcional"
  };

  // === JERARQUÍA ===
  // ¿Dónde estoy en el árbol? ¿Quién es mi padre/hijos?
  hierarchy: {
    level: 1 | 2 | 3 | 4; // Mi nivel en el árbol
    order: number; // Mi posición (1, 2, 3...)
    parentId?: string; // ID de mi padre
    children?: FlowItem[]; // Mis hijos
  };

  // === NAVEGACIÓN ===
  // ¿A dónde voy cuando me clickean?
  navigation?: {
    path?: string; // Ruta de página: "/registro/datos-sociedad"
    href?: string; // Anchor o externa: "#seccion-1"
  };

  // === COMPORTAMIENTO ===
  // ¿Cómo me comporto? ¿Puedo saltarme? ¿Estoy bloqueado?
  behavior?: {
    isOptional?: boolean; // ¿Puedo saltarme?
    isLocked?: boolean; // ¿Estoy bloqueado?
    requiresCompletion?: boolean; // ¿Debo completarme?
  };

  // === SIDEBAR DERECHO ===
  // ¿Activo el sidebar derecho? (solo nivel 2)
  rightSidebar?: {
    enabled: boolean; // ¿Mostrar?
    title?: string; // Título del sidebar
    items: FlowItem[]; // Items nivel 3-4
  };

  // === VALIDACIÓN ===
  // ¿Necesito validación antes de avanzar?
  validation?: {
    required?: boolean; // ¿Es obligatoria?
    validator?: () => Promise<boolean>; // Función custom
  };

  // === METADATA ===
  // Cualquier data extra que necesites
  metadata?: Record<string, any>;
}
```

---

## 📋 1. Registro Sociedades (10 items secuenciales)

```typescript
const registroSociedadesFlow: FlowItem[] = [
  {
    identity: {
      id: "datos-sociedad",
      label: "Datos principales",
      description: "Completa todos los datos de la Sociedad",
      icon: "building",
    },
    hierarchy: {
      level: 1,
      order: 1,
    },
    navigation: {
      path: "/registro-societario/sociedades/crear/datos-sociedad",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "accionistas",
      label: "Accionistas",
      description: "Agrega los accionistas de la Sociedad",
      icon: "users",
    },
    hierarchy: {
      level: 1,
      order: 2,
    },
    navigation: {
      path: "/registro-societario/sociedades/crear/accionistas",
    },
    behavior: {
      requiresCompletion: true,
      isLocked: true, // Bloqueado hasta completar datos-sociedad
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "capital-acciones",
      label: "Capital Social y Acciones",
      description: "Completa información sobre las acciones",
      icon: "coins",
    },
    hierarchy: {
      level: 1,
      order: 3,
    },
    navigation: {
      path: "/registro-societario/sociedades/crear/acciones",
    },
    behavior: {
      requiresCompletion: true,
      isLocked: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "asignacion-acciones",
      label: "Asignación de Acciones",
      description: "Distribuye Tipos de Acciones entre los Accionistas",
      icon: "percent",
    },
    hierarchy: {
      level: 1,
      order: 4,
    },
    navigation: {
      path: "/registro-societario/sociedades/crear/asignacion-acciones",
    },
    behavior: {
      requiresCompletion: true,
      isLocked: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "directorio",
      label: "Directorio",
      description: "Configura el directorio y designa directores",
      icon: "briefcase",
    },
    hierarchy: {
      level: 1,
      order: 5,
    },
    navigation: {
      path: "/registro-societario/sociedades/crear/directorio",
    },
    behavior: {
      requiresCompletion: true,
      isLocked: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "registro-apoderados",
      label: "Registro de Apoderados",
      description: "Define quiénes serán los apoderados",
      icon: "user-check",
    },
    hierarchy: {
      level: 1,
      order: 6,
    },
    navigation: {
      path: "/registro-societario/sociedades/crear/registro-apoderados",
    },
    behavior: {
      requiresCompletion: true,
      isLocked: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "regimen-poderes",
      label: "Régimen General de Poderes",
      description: "Configura reglas para el ejercicio de poderes",
      icon: "shield",
    },
    hierarchy: {
      level: 1,
      order: 7,
    },
    navigation: {
      path: "/registro-societario/sociedades/crear/regimen-poderes",
    },
    behavior: {
      requiresCompletion: true,
      isLocked: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "quorums-mayorias",
      label: "Quorums y Mayorías",
      description: "Asigna porcentajes para ambos casos según corresponda",
      icon: "percent-circle",
    },
    hierarchy: {
      level: 1,
      order: 8,
    },
    navigation: {
      path: "/registro-societario/sociedades/crear/quorums-mayorias",
    },
    behavior: {
      requiresCompletion: true,
      isLocked: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "acuerdos-societarios",
      label: "Acuerdos Societarios Especiales",
      description: "Completa la información según corresponda",
      icon: "file-text",
    },
    hierarchy: {
      level: 1,
      order: 9,
    },
    navigation: {
      path: "/registro-societario/sociedades/crear/acuerdos-societarios",
    },
    behavior: {
      requiresCompletion: true,
      isLocked: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "resumen",
      label: "Resumen",
      description: "Visualiza un resumen de los datos",
      icon: "file-check",
    },
    hierarchy: {
      level: 1,
      order: 10,
    },
    navigation: {
      path: "/registro-societario/sociedades/crear/resumen",
    },
    behavior: {
      requiresCompletion: true,
      isLocked: true,
    },
    validation: {
      required: true,
    },
  },
];
```

---

## 🏢 2. Sucursales (5 items simples)

```typescript
const sucursalesFlow: FlowItem[] = [
  {
    identity: {
      id: "datos-sucursal",
      label: "Datos de la Sucursal",
      description: "Información básica de la nueva sucursal",
      icon: "map-pin",
    },
    hierarchy: {
      level: 1,
      order: 1,
    },
    navigation: {
      path: "/operaciones/sucursales/datos-sucursal",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "ubicacion-direccion",
      label: "Ubicación y Dirección",
      description: "Dirección completa y geolocalización",
      icon: "navigation",
    },
    hierarchy: {
      level: 1,
      order: 2,
    },
    navigation: {
      path: "/operaciones/sucursales/ubicacion-direccion",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "representante-legal",
      label: "Representante Legal",
      description: "Designa el representante de la sucursal",
      icon: "user-check",
    },
    hierarchy: {
      level: 1,
      order: 3,
    },
    navigation: {
      path: "/operaciones/sucursales/representante-legal",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "actividad-economica",
      label: "Actividad Económica",
      description: "Define las actividades de la sucursal",
      icon: "briefcase",
    },
    hierarchy: {
      level: 1,
      order: 4,
    },
    navigation: {
      path: "/operaciones/sucursales/actividad-economica",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "documentos-sucursal",
      label: "Documentos y Registro",
      description: "Documentación final y registro oficial",
      icon: "file-check",
    },
    hierarchy: {
      level: 1,
      order: 5,
    },
    navigation: {
      path: "/operaciones/sucursales/documentos-sucursal",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },
];
```

---

## 🤝 3. Junta de Accionistas (jerárquico con sidebar derecho)

```typescript
const juntaAccionistasFlow: FlowItem[] = [
  {
    identity: {
      id: "seleccion-puntos",
      label: "Selección de Puntos de Agenda",
      description: "Selecciona los puntos que se tratarán en la junta",
      icon: "list-checks",
    },
    hierarchy: {
      level: 1,
      order: 1,
    },
    navigation: {
      path: "/juntas/seleccion-puntos",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "detalles-junta",
      label: "Detalles de la Junta",
      description: "Configura fecha, hora y lugar de la junta",
      icon: "calendar",
    },
    hierarchy: {
      level: 1,
      order: 2,
    },
    navigation: {
      path: "/juntas/detalles-junta",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "instalacion-junta",
      label: "Instalación de la Junta",
      description: "Verifica quórum y abre la junta",
      icon: "users",
    },
    hierarchy: {
      level: 1,
      order: 3,
    },
    navigation: {
      path: "/juntas/instalacion-junta",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "puntos-acuerdo",
      label: "Puntos de Acuerdo",
      description: "Gestiona los puntos de la agenda",
      icon: "folder",
    },
    hierarchy: {
      level: 1,
      order: 4,
    },
    // Sin navigation - es un contenedor
    children: [
      {
        identity: {
          id: "aumento-capital",
          label: "Aumento de Capital",
          description: "Aumentos de capital por diferentes métodos",
          icon: "trending-up",
        },
        hierarchy: {
          level: 2,
          order: 1,
          parentId: "puntos-acuerdo",
        },
        // Sin navigation - es un contenedor nivel 2
        children: [
          {
            identity: {
              id: "aporte-dinerario",
              label: "Aporte Dinerario",
              description: "Aumento por aporte en efectivo",
              icon: "dollar-sign",
            },
            hierarchy: {
              level: 3,
              order: 1,
              parentId: "aumento-capital",
            },
            navigation: {
              path: "/juntas/puntos-acuerdo/aumento-capital/aporte-dinerario/aportantes",
            },
            rightSidebar: {
              enabled: true,
              title: "Pasos del Aporte Dinerario",
              items: [
                {
                  identity: {
                    id: "aportantes",
                    label: "Aportantes",
                    description: "Selecciona quiénes aportarán",
                    icon: "users",
                  },
                  hierarchy: {
                    level: 4,
                    order: 1,
                  },
                  navigation: {
                    path: "/juntas/puntos-acuerdo/aumento-capital/aporte-dinerario/aportantes",
                  },
                },
                {
                  identity: {
                    id: "aportes",
                    label: "Aportes",
                    description: "Define montos y participaciones",
                    icon: "coins",
                  },
                  hierarchy: {
                    level: 4,
                    order: 2,
                  },
                  navigation: {
                    path: "/juntas/puntos-acuerdo/aumento-capital/aporte-dinerario/aportes",
                  },
                },
                {
                  identity: {
                    id: "votacion-aporte",
                    label: "Votación",
                    description: "Vota sobre el aumento de capital",
                    icon: "vote",
                  },
                  hierarchy: {
                    level: 4,
                    order: 3,
                  },
                  navigation: {
                    path: "/juntas/puntos-acuerdo/aumento-capital/aporte-dinerario/votacion",
                  },
                },
              ],
            },
          },
          {
            identity: {
              id: "capitalizacion-creditos",
              label: "Capitalización de Créditos",
              description: "Aumento por capitalización de deudas",
              icon: "file-badge",
            },
            hierarchy: {
              level: 3,
              order: 2,
              parentId: "aumento-capital",
            },
            navigation: {
              path: "/juntas/puntos-acuerdo/aumento-capital/capitalizacion-creditos/acreedores",
            },
            rightSidebar: {
              enabled: true,
              title: "Pasos de Capitalización",
              items: [
                {
                  identity: {
                    id: "acreedores",
                    label: "Acreedores",
                    description: "Define quiénes son los acreedores",
                    icon: "user-dollar",
                  },
                  hierarchy: {
                    level: 4,
                    order: 1,
                  },
                  navigation: {
                    path: "/juntas/puntos-acuerdo/aumento-capital/capitalizacion-creditos/acreedores",
                  },
                },
                {
                  identity: {
                    id: "creditos",
                    label: "Créditos",
                    description: "Especifica créditos a capitalizar",
                    icon: "receipt",
                  },
                  hierarchy: {
                    level: 4,
                    order: 2,
                  },
                  navigation: {
                    path: "/juntas/puntos-acuerdo/aumento-capital/capitalizacion-creditos/creditos",
                  },
                },
                {
                  identity: {
                    id: "votacion-capitalizacion",
                    label: "Votación",
                    description: "Vota sobre la capitalización",
                    icon: "vote",
                  },
                  hierarchy: {
                    level: 4,
                    order: 3,
                  },
                  navigation: {
                    path: "/juntas/puntos-acuerdo/aumento-capital/capitalizacion-creditos/votacion",
                  },
                },
              ],
            },
          },
        ],
      },
      {
        identity: {
          id: "nombramiento",
          label: "Nombramiento",
          description: "Nombrar directores, gerentes y apoderados",
          icon: "user-plus",
        },
        hierarchy: {
          level: 2,
          order: 2,
          parentId: "puntos-acuerdo",
        },
        children: [
          {
            identity: {
              id: "nombramiento-apoderados",
              label: "Nombramiento de Apoderados",
              description: "Nombrar nuevos apoderados",
              icon: "user-check",
            },
            hierarchy: {
              level: 3,
              order: 1,
              parentId: "nombramiento",
            },
            navigation: {
              path: "/juntas/puntos-acuerdo/nombramiento/apoderados",
            },
          },
          {
            identity: {
              id: "nombramiento-gerente",
              label: "Nombramiento de Gerente General",
              description: "Nombrar gerente general",
              icon: "crown",
            },
            hierarchy: {
              level: 3,
              order: 2,
              parentId: "nombramiento",
            },
            navigation: {
              path: "/juntas/puntos-acuerdo/nombramiento/gerente-general",
            },
          },
        ],
      },
    ],
  },

  {
    identity: {
      id: "resumen",
      label: "Resumen",
      description: "Revisa los acuerdos tomados",
      icon: "file-text",
    },
    hierarchy: {
      level: 1,
      order: 5,
    },
    navigation: {
      path: "/juntas/resumen",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },

  {
    identity: {
      id: "descargar",
      label: "Descargar",
      description: "Descarga el acta de la junta",
      icon: "download",
    },
    hierarchy: {
      level: 1,
      order: 6,
    },
    navigation: {
      path: "/juntas/descargar",
    },
    behavior: {
      requiresCompletion: true,
    },
    validation: {
      required: true,
    },
  },
];
```

---

## 🔄 FlowConfig (Configuración de Flujo)

```typescript
interface FlowConfig {
  // === IDENTIDAD DEL FLUJO ===
  identity: {
    id: string; // "registro-sociedades"
    name: string; // "Registro de Sociedades"
    description?: string; // Descripción larga
  };

  // === TIPO Y ESTRUCTURA ===
  structure: {
    type: "sequential" | "hierarchical" | "mixed";
    maxLevels: number; // 1, 2, 3, 4
    navigation: FlowItem[]; // ← AQUÍ ESTÁN TODOS LOS ITEMS
  };

  // === REGLAS DE NAVEGACIÓN ===
  navigationRules?: {
    allowJumpAhead?: boolean; // ¿Puedo saltar pasos?
    requireSequential?: boolean; // ¿Debo ir en orden?
    autoUnlock?: boolean; // ¿Desbloquear automático?
  };

  // === UI - SIDEBARS ===
  ui: {
    leftSidebar: {
      width: string; // "280px"
      position: "left";
      collapsible: boolean;
      defaultCollapsed?: boolean;
      levels: number[]; // [1, 2] ← Qué niveles mostrar
    };

    rightSidebar?: {
      width: string; // "240px"
      position: "right";
      showByDefault: boolean;
      levels: number[]; // [3, 4] ← Qué niveles mostrar
    };

    header?: {
      show: boolean;
      showProgress: boolean;
      showBreadcrumbs: boolean;
      title?: string;
    };

    footer?: {
      show: boolean;
      showNavigation: boolean; // Botones Anterior/Siguiente
      showSave: boolean; // Botón Guardar
      actions?: Array<{
        // Acciones custom
        id: string;
        label: string;
        icon?: string;
        onClick: () => void;
      }>;
    };
  };

  // === PERSISTENCIA ===
  persistence?: {
    enabled: boolean; // localStorage?
    key?: string; // Clave custom
    autosave?: boolean; // ¿Auto-guardar?
  };

  // === EVENTOS ===
  events?: {
    onProgressUpdate?: (progress: number) => void;
    onFlowComplete?: () => void;
    onNavigate?: (itemId: string) => void;
    onValidationError?: (itemId: string, error: string) => void;
  };
}

// Ejemplo de uso - Registro Sociedades
const registroSociedadesConfig: FlowConfig = {
  identity: {
    id: "registro-sociedades",
    name: "Registro de Sociedades",
    description: "Proceso completo para registrar una nueva sociedad",
  },

  structure: {
    type: "sequential",
    maxLevels: 1,
    navigation: registroSociedadesFlow,
  },

  ui: {
    leftSidebar: {
      width: "300px",
      position: "left",
      collapsible: true,
      levels: [1],
    },
    header: {
      show: true,
      showProgress: true,
      showBreadcrumbs: false,
    },
    footer: {
      show: true,
      showNavigation: true,
      showSave: true,
    },
  },

  navigationRules: {
    allowJumpAhead: false,
    requireSequential: true,
    autoUnlock: true,
  },

  persistence: {
    enabled: true,
    autosave: true,
  },
};

// Ejemplo de uso - Juntas Accionistas
const juntasAccionistasConfig: FlowConfig = {
  identity: {
    id: "juntas-accionistas",
    name: "Junta de Accionistas",
    description: "Gestión completa de juntas de accionistas",
  },

  structure: {
    type: "hierarchical",
    maxLevels: 4,
    navigation: juntaAccionistasFlow,
  },

  ui: {
    leftSidebar: {
      width: "280px",
      position: "left",
      collapsible: true,
      levels: [1, 2, 3],
    },
    rightSidebar: {
      width: "240px",
      position: "right",
      showByDefault: false,
      levels: [4],
    },
    header: {
      show: false,
    },
    footer: {
      show: false,
    },
  },

  navigationRules: {
    allowJumpAhead: true,
    requireSequential: false,
    autoUnlock: false,
  },

  persistence: {
    enabled: true,
    autosave: true,
  },
};
```

---

## 📊 Resumen de Objetos (Estructura Agrupada)

| Flujo                   | Items        | Niveles | Tipo         | Sidebar Derecho | Estimado  |
| ----------------------- | ------------ | ------- | ------------ | --------------- | --------- |
| **Registro Sociedades** | 10           | 1       | Sequential   | No              | 45-60 min |
| **Sucursales**          | 5            | 1       | Sequential   | No              | 15-20 min |
| **Junta Accionistas**   | 6 + anidados | 1-4     | Hierarchical | Sí (nivel 4)    | 30-40 min |

---

## 🎯 Ventajas de la Estructura Agrupada

### ✅ **Mental Model Claro**

```typescript
// Fácil de entender qué hace cada grupo
item.identity.label; // ¿Cómo se llama?
item.hierarchy.level; // ¿En qué nivel está?
item.navigation.path; // ¿A dónde va?
item.behavior.isLocked; // ¿Está bloqueado?
```

### ✅ **Autocompletado Inteligente**

```typescript
// IDE te ayuda con autocompletado semántico
item.identity.   // → id, label, description, icon, badge
item.hierarchy.  // → level, order, parentId, children
item.navigation. // → path, href
```

### ✅ **Validación en Constructor**

```typescript
// Cada grupo puede tener su propia validación
class FlowIdentity {
  constructor(id: string, label: string) {
    if (!id) throw new Error("ID requerido");
    if (!/^[a-z0-9-]+$/.test(id)) throw new Error("ID debe ser kebab-case");
    this.id = id;
    this.label = label;
  }
}
```

### ✅ **Extensibilidad**

```typescript
// Fácil agregar nuevos grupos sin romper existentes
interface FlowItem {
  identity: FlowIdentity;
  hierarchy: FlowHierarchy;
  navigation: FlowNavigation;
  behavior: FlowBehavior;
  rightSidebar: FlowRightSidebar;
  validation: FlowValidation;
  // 🆕 Nuevo grupo
  analytics?: FlowAnalytics;
}
```

---

## 🎯 Próximos Pasos

Con estos objetos reformulados usando estructura agrupada:

1. ✅ **Estructura semánticamente correcta** ✅
2. ✅ **3 flujos completos definidos** ✅
3. ✅ **FlowConfig con ejemplos** ✅
4. ✅ **Listo para definir issues** ⏳

**Estado:** ✅ Objetos base reformulados con estructura agrupada  
**Próximo:** Definir lista completa de issues para implementación
