# Flow System - Implementación Paso a Paso (Objetos Reales)

## 🎯 Tu Objetivo

Crear 3 flujos completamente funcionales:

1. **Registro Societario** (1 nivel - Sequential)
2. **Juntas de Accionistas** (4 niveles - Hierarchical)
3. **Sucursales** (1 nivel - Sequential)

---

## 📦 PASO 1: Los Tipos (TypeScript Interfaces)

### Archivo: `app/types/flow-system.ts`

```typescript
// ============================================
// FLOW ITEM - Un paso del flujo
// ============================================
export interface FlowItem {
  // === IDENTIDAD ===
  id: string; // "datos-sociedad"
  label: string; // "Datos de Sociedad"
  description?: string;
  icon?: string; // "Building" (lucide-vue-next)
  badge?: string; // "Nuevo", "Opcional"

  // === JERARQUÍA ===
  level: 1 | 2 | 3 | 4; // Nivel en el árbol
  order: number; // Posición (1, 2, 3...)
  parentId?: string; // ID del padre
  children?: FlowItem[]; // Items hijos

  // === NAVEGACIÓN ===
  path?: string; // Ruta: "/registro/datos-sociedad"
  href?: string; // Anchor: "#seccion-1"

  // === COMPORTAMIENTO ===
  isOptional?: boolean;
  isLocked?: boolean;
  requiresCompletion?: boolean;

  // === SIDEBAR DERECHO (solo nivel 2) ===
  rightSidebar?: {
    enabled: boolean;
    title?: string;
    items: FlowItem[]; // Niveles 3-4
  };

  // === VALIDACIÓN ===
  validation?: {
    required?: boolean;
    validator?: () => Promise<boolean>;
  };

  // === METADATA ===
  metadata?: Record<string, any>;
}

// ============================================
// FLOW CONFIG - Configuración completa del flujo
// ============================================
export interface FlowConfig {
  // === IDENTIDAD ===
  id: string;
  name: string;
  description?: string;

  // === TIPO ===
  type: "sequential" | "hierarchical" | "mixed";

  // === NAVEGACIÓN (AQUÍ VAN LOS FLOWITEMS) ===
  navigation: FlowItem[];

  // === COMPORTAMIENTO ===
  allowJumpAhead?: boolean;
  persistState?: boolean;

  // === UI - SIDEBARS ===
  sidebarStyle?: {
    width: string;
    position: "left" | "right";
    collapsible: boolean;
    defaultCollapsed?: boolean;
  };

  rightSidebarStyle?: {
    width: string;
    position: "right";
    showByDefault: boolean;
  };

  // === UI - HEADER ===
  header?: {
    show: boolean;
    showProgress: boolean;
    showBreadcrumbs: boolean;
    title?: string;
  };

  // === UI - FOOTER ===
  footer?: {
    show: boolean;
    showNavigation: boolean;
    showSave: boolean;
    actions?: Array<{
      id: string;
      label: string;
      icon?: string;
      onClick: () => void;
    }>;
  };

  // === EVENTOS ===
  events?: {
    onProgressUpdate?: (progress: number) => void;
    onFlowComplete?: () => void;
    onNavigate?: (itemId: string) => void;
  };
}

// ============================================
// FLOW STATE - Estado del flujo
// ============================================
export interface FlowItemState {
  itemId: string;
  status: "pending" | "in-progress" | "completed" | "locked";
  progress: number; // 0-100
  lastVisited?: Date;
  data?: any;
}

export interface FlowState {
  flowId: string;
  currentItemId: string | null;
  itemStates: Map<string, FlowItemState>;
  overallProgress: number;
  isCompleted: boolean;
  startedAt?: Date;
  completedAt?: Date;
}
```

**🎓 Qué hacer:**

1. Crea este archivo
2. Lee cada interface
3. Identifica los grupos de propiedades

---

## 📦 PASO 2: Flujo 1 - Registro Societario (Simple)

### 2.1 Los Objetos FlowItem

```typescript
// config/flows/registro-sociedades.flow.ts

import type { FlowItem, FlowConfig } from "~/types/flow-system";

// ============================================
// PASO 1: CREAR LOS FLOWITEMS (10 pasos)
// ============================================

const item1: FlowItem = {
  id: "datos-sociedad",
  label: "Datos de Sociedad",
  description: "Información básica de la sociedad",
  icon: "Building",
  level: 1,
  order: 1,
  path: "/registro-societario/sociedades/crear/datos-sociedad",
  requiresCompletion: true,
};

const item2: FlowItem = {
  id: "datos-socios",
  label: "Datos de Socios",
  description: "Información de los socios",
  icon: "Users",
  level: 1,
  order: 2,
  path: "/registro-societario/sociedades/crear/datos-socios",
  requiresCompletion: true,
};

const item3: FlowItem = {
  id: "datos-representantes",
  label: "Representantes Legales",
  description: "Información de representantes",
  icon: "UserCheck",
  level: 1,
  order: 3,
  path: "/registro-societario/sociedades/crear/datos-representantes",
  requiresCompletion: true,
};

const item4: FlowItem = {
  id: "capital-social",
  label: "Capital Social",
  description: "Información del capital",
  icon: "DollarSign",
  level: 1,
  order: 4,
  path: "/registro-societario/sociedades/crear/capital-social",
  requiresCompletion: true,
};

const item5: FlowItem = {
  id: "domicilio",
  label: "Domicilio Social",
  description: "Dirección de la sociedad",
  icon: "MapPin",
  level: 1,
  order: 5,
  path: "/registro-societario/sociedades/crear/domicilio",
  requiresCompletion: true,
};

const item6: FlowItem = {
  id: "objeto-social",
  label: "Objeto Social",
  description: "Actividad de la sociedad",
  icon: "FileText",
  level: 1,
  order: 6,
  path: "/registro-societario/sociedades/crear/objeto-social",
  requiresCompletion: true,
};

const item7: FlowItem = {
  id: "administracion",
  label: "Administración",
  description: "Forma de administración",
  icon: "Settings",
  level: 1,
  order: 7,
  path: "/registro-societario/sociedades/crear/administracion",
  requiresCompletion: true,
};

const item8: FlowItem = {
  id: "duracion",
  label: "Duración",
  description: "Plazo de duración",
  icon: "Clock",
  level: 1,
  order: 8,
  path: "/registro-societario/sociedades/crear/duracion",
  requiresCompletion: true,
};

const item9: FlowItem = {
  id: "resumen",
  label: "Resumen",
  description: "Revisión de datos",
  icon: "FileCheck",
  level: 1,
  order: 9,
  path: "/registro-societario/sociedades/crear/resumen",
  requiresCompletion: false,
};

const item10: FlowItem = {
  id: "confirmacion",
  label: "Confirmación",
  description: "Confirmar registro",
  icon: "CheckCircle",
  level: 1,
  order: 10,
  path: "/registro-societario/sociedades/crear/confirmacion",
  requiresCompletion: false,
};

// ============================================
// PASO 2: AGRUPAR EN ARRAY
// ============================================

const registroNavigationItems: FlowItem[] = [
  item1,
  item2,
  item3,
  item4,
  item5,
  item6,
  item7,
  item8,
  item9,
  item10,
];

// ============================================
// PASO 3: CREAR FLOWCONFIG
// ============================================

export function getRegistroFlowConfig(mode: "nueva" | "editar" = "nueva"): FlowConfig {
  return {
    // === IDENTIDAD ===
    id: `registro-sociedades-${mode}`,
    name: mode === "nueva" ? "Registro de Nueva Sociedad" : "Editar Sociedad",
    description: "Proceso de registro de sociedad",

    // === TIPO ===
    type: "sequential", // ← Pasos lineales

    // === NAVEGACIÓN ===
    navigation: registroNavigationItems, // ← AQUÍ VAN LOS FLOWITEMS

    // === COMPORTAMIENTO ===
    allowJumpAhead: false, // NO puede saltar pasos
    persistState: true, // Guarda en localStorage

    // === UI - SIDEBAR IZQUIERDO ===
    sidebarStyle: {
      width: "280px",
      position: "left",
      collapsible: true,
      defaultCollapsed: false,
    },

    // === UI - HEADER ===
    header: {
      show: true,
      showProgress: true,
      showBreadcrumbs: false, // Sequential no necesita breadcrumbs
    },

    // === UI - FOOTER ===
    footer: {
      show: true,
      showNavigation: true, // Botones Anterior/Siguiente
      showSave: true, // Botón Guardar Borrador
    },
  };
}
```

**🎓 Qué hacer:**

1. Crea este archivo
2. Lee cada FlowItem (10 items)
3. Ve cómo se agrupan en array
4. Ve cómo el FlowConfig los contiene

---

## 📦 PASO 3: Flujo 2 - Juntas de Accionistas (Complejo)

### 3.1 Los Objetos FlowItem (Con 4 niveles)

```typescript
// config/flows/juntas.flow.ts

import type { FlowItem, FlowConfig } from "~/types/flow-system";

// ============================================
// NIVEL 1: Pasos principales
// ============================================

const nivel1_seleccionPuntos: FlowItem = {
  id: "seleccion-puntos",
  label: "Selección de Puntos",
  description: "Selecciona los puntos de la junta",
  icon: "ListChecks",
  level: 1,
  order: 1,
  path: "/juntas/seleccion-puntos",

  // TIENE HIJOS (nivel 2)
  children: [
    // ============================================
    // NIVEL 2: Secciones
    // ============================================
    {
      id: "acuerdos",
      label: "Acuerdos",
      icon: "FileText",
      level: 2,
      order: 1,
      parentId: "seleccion-puntos",
      path: "/juntas/seleccion-puntos/acuerdos",

      // *** ACTIVA SIDEBAR DERECHO ***
      rightSidebar: {
        enabled: true,
        title: "Tipos de Acuerdos",

        // ============================================
        // NIVEL 3: Tipos de acuerdos
        // ============================================
        items: [
          {
            id: "acuerdo-directorio",
            label: "Elección de Directorio",
            icon: "Users",
            level: 3,
            order: 1,
            parentId: "acuerdos",
            href: "#eleccion-directorio", // ← ANCHOR (no path)

            // ============================================
            // NIVEL 4: Detalles del acuerdo
            // ============================================
            children: [
              {
                id: "director-1",
                label: "Director 1",
                icon: "User",
                level: 4,
                order: 1,
                parentId: "acuerdo-directorio",
                href: "#director-1",
              },
              {
                id: "director-2",
                label: "Director 2",
                icon: "User",
                level: 4,
                order: 2,
                parentId: "acuerdo-directorio",
                href: "#director-2",
              },
              {
                id: "director-3",
                label: "Director 3",
                icon: "User",
                level: 4,
                order: 3,
                parentId: "acuerdo-directorio",
                href: "#director-3",
              },
            ],
          },
          {
            id: "acuerdo-capital",
            label: "Aumento de Capital",
            icon: "DollarSign",
            level: 3,
            order: 2,
            parentId: "acuerdos",
            href: "#aumento-capital",
          },
          {
            id: "acuerdo-estatutos",
            label: "Modificación de Estatutos",
            icon: "FileEdit",
            level: 3,
            order: 3,
            parentId: "acuerdos",
            href: "#modificacion-estatutos",
          },
        ],
      },
    },
    {
      id: "otros-puntos",
      label: "Otros Puntos",
      icon: "MoreHorizontal",
      level: 2,
      order: 2,
      parentId: "seleccion-puntos",
      path: "/juntas/seleccion-puntos/otros",
    },
  ],
};

const nivel1_detallesJunta: FlowItem = {
  id: "detalles-junta",
  label: "Detalles de Junta",
  description: "Información de la junta",
  icon: "Calendar",
  level: 1,
  order: 2,
  path: "/juntas/detalles-junta",
};

const nivel1_instalacion: FlowItem = {
  id: "instalacion-junta",
  label: "Instalación de Junta",
  description: "Proceso de instalación",
  icon: "Play",
  level: 1,
  order: 3,
  path: "/juntas/instalacion-junta",
};

const nivel1_resumen: FlowItem = {
  id: "resumen",
  label: "Resumen",
  description: "Revisión final",
  icon: "FileCheck",
  level: 1,
  order: 4,
  path: "/juntas/resumen",
};

const nivel1_descargar: FlowItem = {
  id: "descargar",
  label: "Descargar Documentos",
  description: "Descarga acta y documentos",
  icon: "Download",
  level: 1,
  order: 5,
  path: "/juntas/descargar",
};

// ============================================
// AGRUPAR EN ARRAY
// ============================================

const juntasNavigationItems: FlowItem[] = [
  nivel1_seleccionPuntos, // ← Tiene children (nivel 2) con rightSidebar (nivel 3-4)
  nivel1_detallesJunta,
  nivel1_instalacion,
  nivel1_resumen,
  nivel1_descargar,
];

// ============================================
// CREAR FLOWCONFIG
// ============================================

export function getJuntasFlowConfig(): FlowConfig {
  return {
    // === IDENTIDAD ===
    id: "juntas-accionistas",
    name: "Juntas de Accionistas",
    description: "Proceso de creación de junta",

    // === TIPO ===
    type: "hierarchical", // ← Árbol jerárquico

    // === NAVEGACIÓN ===
    navigation: juntasNavigationItems, // ← 4 NIVELES DE JERARQUÍA

    // === COMPORTAMIENTO ===
    allowJumpAhead: true, // SÍ puede saltar (jerarquía flexible)
    persistState: true,

    // === UI - SIDEBAR IZQUIERDO ===
    sidebarStyle: {
      width: "280px",
      position: "left",
      collapsible: true,
      defaultCollapsed: false,
    },

    // === UI - SIDEBAR DERECHO ===
    rightSidebarStyle: {
      width: "240px",
      position: "right",
      showByDefault: false, // ← Solo si FlowItem.rightSidebar.enabled = true
    },

    // === UI - HEADER ===
    header: {
      show: true,
      showProgress: true,
      showBreadcrumbs: true, // ← Jerarquía necesita breadcrumbs
    },

    // === UI - FOOTER ===
    footer: {
      show: true,
      showNavigation: true,
      showSave: true,
    },
  };
}
```

**🎓 Qué hacer:**

1. Crea este archivo
2. Ve cómo nivel 1 tiene `children` (nivel 2)
3. Ve cómo nivel 2 tiene `rightSidebar` con items (nivel 3-4)
4. Ve cómo nivel 3 tiene `children` (nivel 4)
5. Identifica: `path` vs `href` (página vs anchor)

---

## 📦 PASO 4: Flujo 3 - Sucursales (Simple)

### 4.1 Los Objetos FlowItem

```typescript
// config/flows/sucursales.flow.ts

import type { FlowItem, FlowConfig } from "~/types/flow-system";

// ============================================
// CREAR LOS FLOWITEMS (4 pasos)
// ============================================

const item1: FlowItem = {
  id: "datos-sucursal",
  label: "Datos de Sucursal",
  description: "Información básica",
  icon: "Store",
  level: 1,
  order: 1,
  path: "/operaciones/sucursales/crear/datos-sucursal",
};

const item2: FlowItem = {
  id: "ubicacion",
  label: "Ubicación",
  description: "Dirección de la sucursal",
  icon: "MapPin",
  level: 1,
  order: 2,
  path: "/operaciones/sucursales/crear/ubicacion",
};

const item3: FlowItem = {
  id: "representante",
  label: "Representante",
  description: "Representante legal",
  icon: "UserCheck",
  level: 1,
  order: 3,
  path: "/operaciones/sucursales/crear/representante",
};

const item4: FlowItem = {
  id: "resumen",
  label: "Resumen",
  description: "Confirmar datos",
  icon: "FileCheck",
  level: 1,
  order: 4,
  path: "/operaciones/sucursales/crear/resumen",
};

// ============================================
// AGRUPAR EN ARRAY
// ============================================

const sucursalesNavigationItems: FlowItem[] = [item1, item2, item3, item4];

// ============================================
// CREAR FLOWCONFIG
// ============================================

export function getSucursalesFlowConfig(): FlowConfig {
  return {
    // === IDENTIDAD ===
    id: "sucursales",
    name: "Crear Sucursal",
    description: "Proceso de creación de sucursal",

    // === TIPO ===
    type: "sequential",

    // === NAVEGACIÓN ===
    navigation: sucursalesNavigationItems,

    // === COMPORTAMIENTO ===
    allowJumpAhead: false,
    persistState: true,

    // === UI - SIDEBAR IZQUIERDO ===
    sidebarStyle: {
      width: "280px",
      position: "left",
      collapsible: true,
      defaultCollapsed: false,
    },

    // === UI - HEADER ===
    header: {
      show: true,
      showProgress: true,
      showBreadcrumbs: false,
    },

    // === UI - FOOTER ===
    footer: {
      show: true,
      showNavigation: true,
      showSave: false, // ← No hay guardar borrador
    },
  };
}
```

---

## 📦 PASO 5: Los Layouts (Wrappers)

### 5.1 Layout para Registro

```vue
<!-- app/layouts/registro-flow.vue -->
<template>
  <UniversalFlowLayout :config="flowConfig">
    <template #default="{ flow, currentItem, next, previous, complete }">
      <!-- Slot para las páginas de Registro -->
      <slot
        :flow="flow"
        :current-item="currentItem"
        :next="next"
        :previous="previous"
        :complete="complete"
      />
    </template>
  </UniversalFlowLayout>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import UniversalFlowLayout from "~/components/flow-system/UniversalFlowLayout.vue";
  import { getRegistroFlowConfig } from "~/config/flows/registro-sociedades.flow";

  // Obtener modo desde la ruta
  const route = useRoute();
  const mode = computed(() => {
    const pathMode = route.path.includes("/editar/") ? "editar" : "nueva";
    return pathMode as "nueva" | "editar";
  });

  // Configuración dinámica
  const flowConfig = computed(() => getRegistroFlowConfig(mode.value));
</script>
```

### 5.2 Layout para Juntas

```vue
<!-- app/layouts/juntas-flow.vue -->
<template>
  <UniversalFlowLayout :config="flowConfig">
    <template #default="{ flow, currentItem, next, previous, complete }">
      <!-- Slot para las páginas de Juntas -->
      <slot
        :flow="flow"
        :current-item="currentItem"
        :next="next"
        :previous="previous"
        :complete="complete"
      />
    </template>
  </UniversalFlowLayout>
</template>

<script setup lang="ts">
  import UniversalFlowLayout from "~/components/flow-system/UniversalFlowLayout.vue";
  import { getJuntasFlowConfig } from "~/config/flows/juntas.flow";

  // Configuración estática
  const flowConfig = getJuntasFlowConfig();
</script>
```

### 5.3 Layout para Sucursales

```vue
<!-- app/layouts/sucursales-flow.vue -->
<template>
  <UniversalFlowLayout :config="flowConfig">
    <template #default="{ flow, currentItem, next, previous, complete }">
      <!-- Slot para las páginas de Sucursales -->
      <slot
        :flow="flow"
        :current-item="currentItem"
        :next="next"
        :previous="previous"
        :complete="complete"
      />
    </template>
  </UniversalFlowLayout>
</template>

<script setup lang="ts">
  import UniversalFlowLayout from "~/components/flow-system/UniversalFlowLayout.vue";
  import { getSucursalesFlowConfig } from "~/config/flows/sucursales.flow";

  // Configuración estática
  const flowConfig = getSucursalesFlowConfig();
</script>
```

---

## 📦 PASO 6: Las Páginas (Uso Final)

### 6.1 Página de Registro

```vue
<!-- app/pages/registro-societario/sociedades/crear/datos-sociedad.vue -->
<script setup lang="ts">
  import DatosSociedadStep from "~/modules/registro-sociedades/components/steps/DatosSociedadStep.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  // ← AQUÍ SE SELECCIONA EL LAYOUT
  definePageMeta({
    layout: "registro-flow", // ← Usa app/layouts/registro-flow.vue
  });
</script>

<template>
  <DatosSociedadStep :mode="EntityModeEnum.CREAR" />
</template>
```

### 6.2 Página de Juntas

```vue
<!-- app/pages/juntas/seleccion-puntos/acuerdos.vue -->
<script setup lang="ts">
  import AcuerdosStep from "~/modules/juntas/components/AcuerdosStep.vue";

  // ← AQUÍ SE SELECCIONA EL LAYOUT
  definePageMeta({
    layout: "juntas-flow", // ← Usa app/layouts/juntas-flow.vue
  });
</script>

<template>
  <div class="acuerdos-page">
    <h1>Acuerdos de la Junta</h1>

    <!-- Nivel 3-4 (sidebar derecho) navegan a estos divs -->
    <section id="eleccion-directorio">
      <h2>Elección de Directorio</h2>

      <div id="director-1">
        <h3>Director 1</h3>
        <!-- Contenido -->
      </div>

      <div id="director-2">
        <h3>Director 2</h3>
        <!-- Contenido -->
      </div>
    </section>

    <section id="aumento-capital">
      <h2>Aumento de Capital</h2>
      <!-- Contenido -->
    </section>

    <AcuerdosStep />
  </div>
</template>
```

### 6.3 Página de Sucursales

```vue
<!-- app/pages/operaciones/sucursales/crear/datos-sucursal.vue -->
<script setup lang="ts">
  import DatosSucursalStep from "~/modules/sucursales/components/DatosSucursalStep.vue";

  // ← AQUÍ SE SELECCIONA EL LAYOUT
  definePageMeta({
    layout: "sucursales-flow", // ← Usa app/layouts/sucursales-flow.vue
  });
</script>

<template>
  <DatosSucursalStep />
</template>
```

---

## 🎯 Resumen del Flujo Completo

### De Objeto a Página:

```
┌─────────────────────────────────────────────────────┐
│ 1. FlowItem (Objeto)                                │
│    { id: 'datos-sociedad', level: 1, path: '...' } │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 2. Array de FlowItems                               │
│    [item1, item2, item3, ...]                       │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 3. FlowConfig (Función)                             │
│    getRegistroFlowConfig() {                        │
│      return { navigation: [items...] }              │
│    }                                                │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 4. Layout (registro-flow.vue)                       │
│    <UniversalFlowLayout :config="flowConfig" />     │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 5. Página (datos-sociedad.vue)                      │
│    definePageMeta({ layout: 'registro-flow' })      │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Checklist de Implementación

```
□ 1. Crear tipos: app/types/flow-system.ts
□ 2. Crear config Registro: config/flows/registro-sociedades.flow.ts
□ 3. Crear config Juntas: config/flows/juntas.flow.ts
□ 4. Crear config Sucursales: config/flows/sucursales.flow.ts
□ 5. Crear layout Registro: layouts/registro-flow.vue
□ 6. Crear layout Juntas: layouts/juntas-flow.vue
□ 7. Crear layout Sucursales: layouts/sucursales-flow.vue
□ 8. Actualizar páginas con definePageMeta({ layout: '...' })
□ 9. Probar navegación entre pasos
□ 10. Verificar sidebars se muestran correctamente
```

---

## 🚀 Orden de Creación Recomendado

1. **Tipos** → `app/types/flow-system.ts`
2. **Config más simple** → Sucursales (4 pasos, 1 nivel)
3. **Layout más simple** → `layouts/sucursales-flow.vue`
4. **Probar** → Crear 4 páginas de sucursales
5. **Config medio** → Registro (10 pasos, 1 nivel)
6. **Layout medio** → `layouts/registro-flow.vue`
7. **Probar** → Verificar 10 páginas de registro
8. **Config complejo** → Juntas (4 niveles)
9. **Layout complejo** → `layouts/juntas-flow.vue`
10. **Probar** → Verificar 4 niveles con rightSidebar

---

¿Quieres que ahora te ayude a crear cada archivo uno por uno? 🚀
