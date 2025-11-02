## Sistema de Flujos - Construcción Desde Cero

## 📋 ÍNDICE

1. [El Objeto FlowItem - La Pieza Fundamental](#1-el-objeto-flowitem)
2. [Tres Ejemplos de FlowItem](#2-tres-ejemplos-de-flowitem)
3. [De FlowItem a FlowConfig - La Escalera](#3-de-flowitem-a-flowconfig)
4. [El Estado del Flujo - FlowState](#4-el-estado-del-flujo)
5. [¿Cuándo uso Store (Pinia)?](#5-cuándo-uso-store)
6. [Construcción Completa de 4 Flujos](#6-construcción-completa-de-4-flujos)
7. [Resumen: De 0 a Flujo Funcionando](#7-resumen)

---

## 1. El Objeto FlowItem - La Pieza Fundamental

### ¿Qué es?

**Un FlowItem es UN PASO del flujo.** Como una página de un libro.

### Anatomía Completa

```typescript
interface FlowItem {
  // === IDENTIDAD ===
  id: string; // Único en todo el flujo. Ej: "datos-sociedad"
  label: string; // Lo que ve el usuario. Ej: "Datos de Sociedad"

  // === JERARQUÍA ===
  level: 1 | 2 | 3 | 4; // Nivel en el árbol
  order: number; // Orden de aparición (1, 2, 3...)
  parentId?: string; // ID del padre (si tiene)
  children?: FlowItem[]; // Items hijos (si tiene)

  // === NAVEGACIÓN ===
  path?: string; // Ruta de Nuxt. Ej: "/registro/datos-sociedad"
  href?: string; // Alternativa: anchor o URL externa. Ej: "#seccion-1"

  // === UI ===
  icon?: string; // Icono (lucide-vue-next). Ej: "Building"
  description?: string; // Descripción opcional
  badge?: string; // Badge opcional. Ej: "Nuevo"

  // === COMPORTAMIENTO ===
  isOptional?: boolean; // ¿Se puede saltar? Default: false
  isLocked?: boolean; // ¿Está bloqueado? Default: false (se calcula dinámico)
  requiresCompletion?: boolean; // ¿Debe completarse para avanzar? Default: true

  // === SIDEBAR DERECHO (solo para nivel 2) ===
  rightSidebar?: {
    enabled: boolean; // ¿Mostrar sidebar derecho?
    title?: string; // Título del sidebar
    items: FlowItem[]; // Items nivel 3 y 4
  };

  // === VALIDACIÓN ===
  validation?: {
    required: boolean; // ¿Requiere validación?
    validator?: () => Promise<boolean>; // Función de validación custom
  };

  // === METADATA ===
  metadata?: Record<string, any>; // Data extra que necesites
}
```

---

## 2. Tres Ejemplos de FlowItem

### Ejemplo 1: Item Simple (Nivel 1 - Registro)

```javascript
const itemSimple = {
  id: "datos-sociedad",
  label: "Datos de Sociedad",
  level: 1,
  order: 1,
  path: "/registro-societario/sociedades/crear/datos-sociedad",
  icon: "Building",
  description: "Ingresa los datos básicos de la sociedad",
  isOptional: false,
  requiresCompletion: true,
};
```

**¿Qué hace este objeto?**

- Se renderiza en el **sidebar izquierdo** (nivel 1)
- Al hacer click → Navega a la ruta especificada
- **NO tiene hijos**, es un paso simple
- **NO activa sidebar derecho**

---

### Ejemplo 2: Item con Hijos (Nivel 1-2 - Juntas)

```javascript
const itemConHijos = {
  id: "seleccion-puntos",
  label: "Selección de Puntos",
  level: 1,
  order: 1,
  path: "/juntas/seleccion-puntos",
  icon: "ListChecks",

  // TIENE HIJOS (nivel 2)
  children: [
    {
      id: "acuerdos",
      label: "Acuerdos",
      level: 2,
      order: 1,
      parentId: "seleccion-puntos",
      path: "/juntas/seleccion-puntos/acuerdos",
      icon: "FileText",
    },
    {
      id: "otros-puntos",
      label: "Otros Puntos",
      level: 2,
      order: 2,
      parentId: "seleccion-puntos",
      path: "/juntas/seleccion-puntos/otros",
      icon: "MoreHorizontal",
    },
  ],
};
```

**¿Qué hace este objeto?**

- El **nivel 1** se renderiza como **padre expandible** en sidebar izquierdo
- Los **hijos (nivel 2)** se renderizan **indentados** debajo del padre
- Click en padre → Navega a su path
- Click en hijo → Navega a path del hijo
- **Aún NO activa sidebar derecho**

---

### Ejemplo 3: Item con Sidebar Derecho (Niveles 1-2-3-4 - Juntas Completo)

```javascript
const itemCompleto = {
  id: "seleccion-puntos",
  label: "Selección de Puntos",
  level: 1,
  order: 1,
  path: "/juntas/seleccion-puntos",
  icon: "ListChecks",

  children: [
    {
      id: "acuerdos",
      label: "Acuerdos",
      level: 2,
      order: 1,
      parentId: "seleccion-puntos",
      path: "/juntas/seleccion-puntos/acuerdos",
      icon: "FileText",

      // *** ACTIVA SIDEBAR DERECHO ***
      rightSidebar: {
        enabled: true,
        title: "Tipos de Acuerdos",

        // Items NIVEL 3 y 4
        items: [
          {
            id: "acuerdo-directorio",
            label: "Elección de Directorio",
            level: 3,
            order: 1,
            parentId: "acuerdos",
            href: "#eleccion-directorio", // ← ANCHOR, no path
            icon: "Users",

            // Nivel 4 (sub-items del nivel 3)
            children: [
              {
                id: "director-1",
                label: "Director 1",
                level: 4,
                order: 1,
                parentId: "acuerdo-directorio",
                href: "#director-1",
                icon: "User",
              },
              {
                id: "director-2",
                label: "Director 2",
                level: 4,
                order: 2,
                parentId: "acuerdo-directorio",
                href: "#director-2",
                icon: "User",
              },
            ],
          },
          {
            id: "acuerdo-capital",
            label: "Aumento de Capital",
            level: 3,
            order: 2,
            parentId: "acuerdos",
            href: "#aumento-capital",
            icon: "DollarSign",
          },
        ],
      },
    },
  ],
};
```

**¿Qué hace este objeto?**

- **Sidebar Izquierdo**: Muestra "Selección de Puntos" (nivel 1) con hijo "Acuerdos" (nivel 2)
- **Cuando navegas a "Acuerdos"** (`/juntas/seleccion-puntos/acuerdos`):
  - ✅ Se **activa el sidebar derecho**
  - ✅ Muestra "Elección de Directorio" (nivel 3) con sus hijos (nivel 4)
  - ✅ Click en "Elección de Directorio" → Hace **scroll** a `<div id="eleccion-directorio">`
  - ✅ Click en "Director 1" → Hace **scroll** a `<div id="director-1">`
- **Todos los niveles 3-4 apuntan a la MISMA página**, solo cambian el anchor

---

## 3. De FlowItem a FlowConfig - La Escalera

### Paso 1: Tengo mis FlowItems

```javascript
// Paso 1: Datos de Sociedad
const item1 = {
  id: "datos-sociedad",
  label: "Datos de Sociedad",
  level: 1,
  order: 1,
  path: "/registro-societario/sociedades/crear/datos-sociedad",
  icon: "Building",
};

// Paso 2: Datos de Socios
const item2 = {
  id: "datos-socios",
  label: "Datos de Socios",
  level: 1,
  order: 2,
  path: "/registro-societario/sociedades/crear/datos-socios",
  icon: "Users",
};

// ... más items
```

### Paso 2: Los junto en un array

```javascript
const navigationItems = [item1, item2, item3, item4 /* ... */];
```

### Paso 3: Creo el FlowConfig

```typescript
interface FlowConfig {
  // === IDENTIDAD ===
  id: string; // ID único del flujo
  name: string; // Nombre del flujo
  description?: string; // Descripción

  // === TIPO ===
  type: "sequential" | "hierarchical" | "mixed";
  /*
    - sequential: Pasos lineales (1 → 2 → 3)
    - hierarchical: Árbol con niveles (1 → 1.1 → 1.1.1)
    - mixed: Combinación de ambos
  */

  // === NAVEGACIÓN (LOS FLOWITEMS) ===
  navigation: FlowItem[]; // Array de FlowItems

  // === COMPORTAMIENTO ===
  allowJumpAhead?: boolean; // ¿Puede saltar a pasos futuros? Default: false
  persistState?: boolean; // ¿Guardar progreso en localStorage? Default: true

  // === UI - SIDEBAR IZQUIERDO ===
  sidebarStyle?: {
    width: string; // Ancho. Ej: "280px"
    position: "left" | "right"; // Posición (siempre left)
    collapsible: boolean; // ¿Se puede colapsar?
    defaultCollapsed?: boolean; // ¿Empieza colapsado?
  };

  // === UI - SIDEBAR DERECHO ===
  rightSidebarStyle?: {
    width: string; // Ancho. Ej: "240px"
    showByDefault: boolean; // ¿Mostrar siempre? (false = condicional)
    position: "right";
  };

  // === UI - HEADER ===
  header?: {
    show: boolean; // ¿Mostrar header?
    showProgress: boolean; // ¿Mostrar barra de progreso?
    showBreadcrumbs: boolean; // ¿Mostrar breadcrumbs?
    title?: string; // Título custom
  };

  // === UI - FOOTER ===
  footer?: {
    show: boolean; // ¿Mostrar footer?
    showNavigation: boolean; // ¿Mostrar botones Anterior/Siguiente?
    showSave: boolean; // ¿Mostrar botón Guardar?
    actions?: Array<{
      // Acciones custom
      id: string;
      label: string;
      icon?: string;
      onClick: () => void;
    }>;
  };

  // === EVENTOS (opcional) ===
  events?: {
    onProgressUpdate?: (progress: number) => void;
    onFlowComplete?: () => void;
    onNavigate?: (itemId: string) => void;
  };
}
```

### Paso 4: Construyo el FlowConfig completo

```javascript
const registroFlowConfig = {
  // Identidad
  id: "registro-sociedades",
  name: "Registro de Sociedades",
  description: "Proceso de registro de nueva sociedad",

  // Tipo
  type: "sequential", // ← Pasos lineales

  // Navegación (MIS FLOWITEMS)
  navigation: [item1, item2, item3 /* ... */],

  // Comportamiento
  allowJumpAhead: false, // NO puede saltar pasos
  persistState: true, // Guarda progreso en localStorage

  // Sidebar izquierdo
  sidebarStyle: {
    width: "280px",
    position: "left",
    collapsible: true,
    defaultCollapsed: false,
  },

  // Sidebar derecho (NO se usa en registro)
  rightSidebarStyle: {
    width: "240px",
    showByDefault: false, // ← Solo si FlowItem lo activa
  },

  // Header
  header: {
    show: true,
    showProgress: true,
    showBreadcrumbs: true,
  },

  // Footer
  footer: {
    show: true,
    showNavigation: true,
    showSave: true,
  },
};
```

**CON ESTO YA TIENES UN FLUJO COMPLETO** ✅

---

## 4. El Estado del Flujo - FlowState

### ¿Qué es el estado?

**El estado es la información de DÓNDE estás y QUÉ has completado.**

```typescript
interface FlowItemState {
  itemId: string; // ID del FlowItem
  status: "pending" | "in-progress" | "completed" | "locked";
  progress: number; // 0-100
  lastVisited?: Date; // Última vez que estuvo aquí
  data?: any; // Data guardada del paso
}

interface FlowState {
  flowId: string; // ID del flujo
  currentItemId: string | null; // Paso actual
  itemStates: Map<string, FlowItemState>; // Estado de cada paso
  overallProgress: number; // Progreso total (0-100)
  isCompleted: boolean; // ¿Flujo completado?
  startedAt?: Date; // Cuándo empezó
  completedAt?: Date; // Cuándo terminó
}
```

### Ejemplo de Estado

```javascript
const estadoActual = {
  flowId: "registro-sociedades",
  currentItemId: "datos-socios", // ← Usuario está aquí

  itemStates: new Map([
    [
      "datos-sociedad",
      {
        itemId: "datos-sociedad",
        status: "completed", // ← YA completado
        progress: 100,
        lastVisited: new Date("2025-11-01T10:00:00"),
        data: {
          nombreSociedad: "Mi Empresa S.A.",
          rut: "12345678-9",
        },
      },
    ],
    [
      "datos-socios",
      {
        itemId: "datos-socios",
        status: "in-progress", // ← Paso actual
        progress: 50,
        lastVisited: new Date("2025-11-01T10:15:00"),
      },
    ],
    [
      "datos-representantes",
      {
        itemId: "datos-representantes",
        status: "locked", // ← Bloqueado (no ha llegado)
        progress: 0,
      },
    ],
  ]),

  overallProgress: 15, // 1 de 10 completado + 0.5 en progreso
  isCompleted: false,
  startedAt: new Date("2025-11-01T09:45:00"),
};
```

---

## 5. ¿Cuándo uso Store (Pinia)?

### Regla de Oro

```
¿El estado se comparte entre múltiples componentes o páginas?
  SÍ  → Store (Pinia)
  NO  → Composable local (ref/reactive)
```

### Para el Flow System: **SÍ, usamos Store**

**¿Por qué?**

- El estado del flujo se necesita en:
  - Sidebar (para mostrar progreso)
  - Páginas (para saber si puede avanzar)
  - Header (para mostrar breadcrumbs)
  - Footer (para habilitar botones)

### Store del Flow

```typescript
// stores/useFlowNavigationStore.ts
import { defineStore } from "pinia";

export const useFlowNavigationStore = defineStore("flowNavigation", () => {
  // Estado
  const currentFlowId = ref<string | null>(null);
  const currentItemId = ref<string | null>(null);
  const itemStates = ref<Map<string, FlowItemState>>(new Map());

  // Getters
  const currentItem = computed(() => {
    // Lógica para obtener item actual
  });

  const overallProgress = computed(() => {
    // Calcular progreso total
  });

  // Actions
  function setCurrentItem(itemId: string) {
    currentItemId.value = itemId;
    // Actualizar estado
  }

  function completeItem(itemId: string) {
    const state = itemStates.value.get(itemId);
    if (state) {
      state.status = "completed";
      state.progress = 100;
    }
  }

  function persist() {
    // Guardar en localStorage
    localStorage.setItem(
      `flow-state-${currentFlowId.value}`,
      JSON.stringify({
        currentItemId: currentItemId.value,
        itemStates: Array.from(itemStates.value.entries()),
      })
    );
  }

  function restore() {
    // Restaurar desde localStorage
    const saved = localStorage.getItem(`flow-state-${currentFlowId.value}`);
    if (saved) {
      const data = JSON.parse(saved);
      currentItemId.value = data.currentItemId;
      itemStates.value = new Map(data.itemStates);
    }
  }

  return {
    currentFlowId,
    currentItemId,
    itemStates,
    currentItem,
    overallProgress,
    setCurrentItem,
    completeItem,
    persist,
    restore,
  };
});
```

### ¿Qué hace el Store?

1. **Guarda el estado global** del flujo
2. **Persiste en localStorage** automáticamente
3. **Calcula progreso** en tiempo real
4. **Comparte estado** entre todos los componentes

---

## 6. Construcción Completa de 4 Flujos

### Flujo 1: Registro Societario (Sequential - 1 nivel)

```javascript
// config/flows/registro-sociedades.flow.ts

export function getRegistroFlowConfig() {
  const navigation = [
    {
      id: "datos-sociedad",
      label: "Datos de Sociedad",
      level: 1,
      order: 1,
      path: "/registro-societario/sociedades/crear/datos-sociedad",
      icon: "Building",
    },
    {
      id: "datos-socios",
      label: "Datos de Socios",
      level: 1,
      order: 2,
      path: "/registro-societario/sociedades/crear/datos-socios",
      icon: "Users",
    },
    {
      id: "datos-representantes",
      label: "Representantes Legales",
      level: 1,
      order: 3,
      path: "/registro-societario/sociedades/crear/datos-representantes",
      icon: "UserCheck",
    },
    // ... 7 pasos más (total 10)
  ];

  return {
    id: "registro-sociedades",
    name: "Registro de Sociedades",
    type: "sequential",
    navigation,
    allowJumpAhead: false,
    persistState: true,
    sidebarStyle: {
      width: "280px",
      position: "left",
      collapsible: true,
    },
    header: {
      show: true,
      showProgress: true,
      showBreadcrumbs: true,
    },
    footer: {
      show: true,
      showNavigation: true,
      showSave: true,
    },
  };
}
```

---

### Flujo 2: Juntas de Accionistas (Hierarchical - 4 niveles)

```javascript
// config/flows/juntas.flow.ts

export function getJuntasFlowConfig() {
  const navigation = [
    {
      id: "seleccion-puntos",
      label: "Selección de Puntos",
      level: 1,
      order: 1,
      path: "/juntas/seleccion-puntos",
      icon: "ListChecks",

      children: [
        {
          id: "acuerdos",
          label: "Acuerdos",
          level: 2,
          order: 1,
          parentId: "seleccion-puntos",
          path: "/juntas/seleccion-puntos/acuerdos",
          icon: "FileText",

          rightSidebar: {
            enabled: true,
            title: "Tipos de Acuerdos",
            items: [
              {
                id: "acuerdo-directorio",
                label: "Elección de Directorio",
                level: 3,
                order: 1,
                href: "#eleccion-directorio",
                icon: "Users",
                children: [
                  {
                    id: "director-1",
                    label: "Director 1",
                    level: 4,
                    order: 1,
                    href: "#director-1",
                    icon: "User",
                  },
                ],
              },
            ],
          },
        },
        {
          id: "otros-puntos",
          label: "Otros Puntos",
          level: 2,
          order: 2,
          parentId: "seleccion-puntos",
          path: "/juntas/seleccion-puntos/otros",
          icon: "MoreHorizontal",
        },
      ],
    },
    {
      id: "detalles-junta",
      label: "Detalles de Junta",
      level: 1,
      order: 2,
      path: "/juntas/detalles-junta",
      icon: "Calendar",
    },
    // ... más niveles
  ];

  return {
    id: "juntas-accionistas",
    name: "Juntas de Accionistas",
    type: "hierarchical",
    navigation,
    allowJumpAhead: true, // ← Puede saltar en Juntas
    persistState: true,
    sidebarStyle: {
      width: "280px",
      position: "left",
      collapsible: true,
    },
    rightSidebarStyle: {
      width: "240px",
      showByDefault: false, // ← Condicional
    },
    header: {
      show: true,
      showProgress: true,
      showBreadcrumbs: true,
    },
  };
}
```

---

### Flujo 3: Sucursales (Sequential - 1 nivel)

```javascript
// config/flows/sucursales.flow.ts

export function getSucursalesFlowConfig() {
  const navigation = [
    {
      id: "datos-sucursal",
      label: "Datos de Sucursal",
      level: 1,
      order: 1,
      path: "/operaciones/sucursales/crear/datos-sucursal",
      icon: "Store",
    },
    {
      id: "ubicacion",
      label: "Ubicación",
      level: 1,
      order: 2,
      path: "/operaciones/sucursales/crear/ubicacion",
      icon: "MapPin",
    },
    {
      id: "representante",
      label: "Representante",
      level: 1,
      order: 3,
      path: "/operaciones/sucursales/crear/representante",
      icon: "UserCheck",
    },
    {
      id: "resumen",
      label: "Resumen",
      level: 1,
      order: 4,
      path: "/operaciones/sucursales/crear/resumen",
      icon: "FileCheck",
    },
  ];

  return {
    id: "sucursales",
    name: "Crear Sucursal",
    type: "sequential",
    navigation,
    allowJumpAhead: false,
    persistState: true,
    sidebarStyle: {
      width: "280px",
      position: "left",
      collapsible: true,
    },
    header: {
      show: true,
      showProgress: true,
      showBreadcrumbs: false, // ← Sin breadcrumbs (es simple)
    },
    footer: {
      show: true,
      showNavigation: true,
      showSave: false, // ← No hay guardar borrador
    },
  };
}
```

---

### Flujo 4: Ejemplo - Onboarding de Usuario (Mixed - 2 niveles)

```javascript
// config/flows/onboarding.flow.ts

export function getOnboardingFlowConfig() {
  const navigation = [
    {
      id: "bienvenida",
      label: "Bienvenida",
      level: 1,
      order: 1,
      path: "/onboarding/bienvenida",
      icon: "Sparkles",
      isOptional: false, // ← Obligatorio
    },
    {
      id: "configuracion",
      label: "Configuración Inicial",
      level: 1,
      order: 2,
      path: "/onboarding/configuracion",
      icon: "Settings",

      children: [
        {
          id: "perfil",
          label: "Perfil Personal",
          level: 2,
          order: 1,
          parentId: "configuracion",
          path: "/onboarding/configuracion/perfil",
          icon: "User",
        },
        {
          id: "empresa",
          label: "Datos de Empresa",
          level: 2,
          order: 2,
          parentId: "configuracion",
          path: "/onboarding/configuracion/empresa",
          icon: "Building",
        },
        {
          id: "integraciones",
          label: "Integraciones",
          level: 2,
          order: 3,
          parentId: "configuracion",
          path: "/onboarding/configuracion/integraciones",
          icon: "Plug",
          isOptional: true, // ← Puede saltar este
        },
      ],
    },
    {
      id: "completado",
      label: "Todo Listo!",
      level: 1,
      order: 3,
      path: "/onboarding/completado",
      icon: "CheckCircle",
    },
  ];

  return {
    id: "onboarding-usuario",
    name: "Onboarding de Usuario",
    type: "mixed", // ← Mix de sequential (nivel 1) y hierarchical (nivel 2)
    navigation,
    allowJumpAhead: true, // ← Puede saltar (es onboarding)
    persistState: true,
    sidebarStyle: {
      width: "280px",
      position: "left",
      collapsible: false, // ← No colapsable en onboarding
    },
    header: {
      show: true,
      showProgress: true,
      showBreadcrumbs: false,
    },
    footer: {
      show: true,
      showNavigation: true,
      showSave: false,
      actions: [
        {
          id: "skip",
          label: "Saltar por ahora",
          icon: "ArrowRight",
          onClick: () => {
            // Lógica para saltar onboarding
          },
        },
      ],
    },
    events: {
      onFlowComplete: () => {
        // Marcar onboarding como completado
        console.log("Onboarding completado!");
        navigateTo("/dashboard");
      },
    },
  };
}
```

---

## 7. Resumen: De 0 a Flujo Funcionando

### Paso a Paso

```
1. CREAR FLOWITEMS
   ↓
   [{id: 'paso-1', ...}, {id: 'paso-2', ...}]

2. AGRUPAR EN ARRAY
   ↓
   const navigation = [item1, item2, item3]

3. CREAR FLOWCONFIG
   ↓
   {
     id: 'mi-flujo',
     type: 'sequential',
     navigation: navigation,  // ← Aquí van los items
     sidebarStyle: {...},
     header: {...},
     footer: {...}
   }

4. EXPORTAR FUNCIÓN
   ↓
   export function getMiFlowConfig() {
     return flowConfig
   }

5. CREAR LAYOUT
   ↓
   // layouts/mi-flujo.vue
   <UniversalFlowLayout :config="getMiFlowConfig()" />

6. USAR EN PÁGINAS
   ↓
   // pages/mi-flujo/paso-1.vue
   definePageMeta({ layout: 'mi-flujo' })

7. LISTO! 🎉
```

### ¿Qué logras con esto?

✅ **Navegación entre rutas** - FlowItems con `path`  
✅ **Estado actual** - Store guarda dónde estás  
✅ **Progreso** - Calcula automáticamente  
✅ **Persistencia** - localStorage automático  
✅ **Validación** - Bloquea pasos futuros  
✅ **UI adaptable** - 1, 2, 3 o 4 niveles  
✅ **Reutilizable** - Mismo componente para todo

### ¿Puedo migrar a cualquier UI?

**SÍ**, porque:

- El **FlowConfig** es **agnóstico de UI**
- Solo define **estructura y datos**
- El **UniversalFlowLayout** lee el config y renderiza

**Para cambiar UI**:

```javascript
// Mismo FlowConfig
const config = getRegistroFlowConfig()

// Opción 1: Sidebar izquierdo
<UniversalFlowLayout :config="config" />

// Opción 2: Tabs horizontales (nuevo componente)
<TabsFlowLayout :config="config" />

// Opción 3: Wizard vertical (nuevo componente)
<WizardFlowLayout :config="config" />
```

### Store (Pinia): ¿Cuándo?

**SIEMPRE para Flow System**, porque:

1. El estado se comparte entre **sidebar + página + header + footer**
2. Necesitas **persistencia** (localStorage)
3. Necesitas **reactividad global** (cambio en sidebar → actualiza footer)

---

## 8. Pregunta Final Respondida

> "¿En qué momento mi cabeza dice necesito implementar el store?"

**Respuesta**:

```
¿Tu estado se necesita en MÁS DE UN COMPONENTE?
  SÍ  → Store (useFlowNavigationStore)
  NO  → Composable local (ref/computed)

¿Necesitas guardar el estado para después (localStorage)?
  SÍ  → Store con persist()
  NO  → Puede ser local

¿El estado cambia desde varios lugares?
  SÍ  → Store con actions
  NO  → Puede ser local con emit
```

**Para Flow System**: SIEMPRE Store, porque cumple los 3 ✅

---

## 🎯 Conclusión

**Con estos 2 objetos controlas TODO**:

1. **FlowItem** → Define UN paso
2. **FlowConfig** → Define TODO el flujo

**El Store** → Guarda el estado actual

**El Componente** → Lee config + store, renderiza UI

**¿Puedes crear nuevos flujos?** SÍ, solo necesitas:

1. Crear array de FlowItems
2. Crear FlowConfig con ese array
3. Crear layout que use UniversalFlowLayout
4. Crear páginas con ese layout

**Eso es TODO.** 🚀

---

¿Quieres que ahora veamos cómo el **UniversalFlowLayout** lee este config y renderiza? O prefieres crear un flujo nuevo desde cero siguiendo estos pasos? 💪
