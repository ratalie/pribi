# 📚 Arquitectura de Sidebars - Documentación Completa

**Fecha:** 3 de Noviembre, 2025  
**Autor:** AI Assistant  
**Versión:** 1.0.0

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura Actual (TODO 1)](#arquitectura-actual-todo-1)
3. [ProboSidebar Existente (TODO 2)](#probosidebar-existente-todo-2)
4. [Arquitectura Propuesta (TODO 3)](#arquitectura-propuesta-todo-3)
5. [Plan de Implementación](#plan-de-implementación)

---

## 🎯 Resumen Ejecutivo

### Contexto

Se crearon componentes para visualizar FlowConfigs en un sidebar navegable. Sin embargo, estos componentes son independientes y no se integran con el ProboSidebar principal que ya existe en la aplicación.

### Problema

- **FlowSidebar** funciona de forma aislada (layout `flow-with-sidebar.vue`)
- **ProboSidebar** es el sidebar principal usado en `default.vue` layout
- No hay integración entre ambos
- Registro de Sociedades usa ProboSidebar sin FlowSidebar
- Juntas y Sucursales necesitan **ambos** sidebars

### Solución

Crear **SidebarGeneral** que:

1. Sea una versión mejorada de ProboSidebar
2. Permita incluir un **SidebarFlow** (versión simplificada) dentro
3. Mantenga compatibilidad con Registro de Sociedades
4. Funcione para Juntas y Sucursales

---

## 📦 Arquitectura Actual (TODO 1)

### 1.1. FlowSidebar.vue

**Ubicación:** `app/components/flow/FlowSidebar.vue`

**Propósito:** Componente contenedor para el sidebar de navegación de flujos.

**Características:**

```vue
<template>
  <aside class="flow-sidebar border-r bg-background">
    <!-- Header: Muestra nombre y descripción del flujo -->
    <div v-if="config.sidebarOptions.showHeader" class="p-4 border-b">
      <h2>{{ config.sidebarOptions.headerTitle || config.name }}</h2>
      <p>{{ config.description }}</p>
    </div>

    <!-- Navigation: Lista de FlowItems -->
    <nav class="p-4 space-y-2 overflow-y-auto">
      <FlowSidebarItem v-for="item in config.items" :item="item" :level="0" />
    </nav>
  </aside>
</template>
```

**Props:**

```typescript
interface Props {
  config: FlowConfigWithTree; // FlowConfig con items de tipo FlowItemTree[]
}

type FlowConfigWithTree = Omit<FlowConfig, "items"> & {
  items: FlowItemTree[];
};
```

**Estilos:**

- `height: 100vh` - Altura completa de la pantalla
- `position: sticky` - Se mantiene fijo al hacer scroll
- `top: 0` - Pegado al top
- `overflow-y: auto` - Scroll vertical si es necesario

**Dependencias:**

- `FlowSidebarItem` - Renderiza cada item
- `FlowConfig` - Tipo de configuración del flujo
- `FlowItemTree` - Tipo de item con children

---

### 1.2. FlowSidebarItem.vue

**Ubicación:** `app/components/flow/FlowSidebarItem.vue`

**Propósito:** Componente recursivo para renderizar items del flujo con jerarquía.

**Características:**

#### **Caso 1: Item con ruta (navegable)**

```vue
<NuxtLink :to="item.navigation.route">
  <!-- Icono de expansión (si tiene hijos) -->
  <button @click.prevent="toggleExpand">
    <ChevronRightIcon :class="{ 'rotate-90': isExpanded }" />
  </button>
  
  <!-- Icono del item -->
  <span>{{ item.identity.icon }}</span>
  
  <!-- Título -->
  <span>{{ item.identity.label }}</span>
  
  <!-- Badge de completado -->
  <span v-if="item.behavior.isCompleted" class="bg-green-500" />
</NuxtLink>
```

#### **Caso 2: Item sin ruta (sección/categoría)**

```vue
<button @click="toggleExpand">
  <!-- Solo sirve para expandir/colapsar hijos -->
</button>
```

#### **Recursión: Items hijos**

```vue
<Transition name="expand">
  <div v-if="hasChildren && isExpanded">
    <FlowSidebarItem
      v-for="child in item.children"
      :item="child"
      :level="level + 1"  <!-- Aumenta nivel para indentación -->
    />
  </div>
</Transition>
```

**Props:**

```typescript
interface Props {
  item: FlowItemTree; // Item a renderizar
  level: number; // Nivel de profundidad (0, 1, 2, ...)
}
```

**Estado:**

```typescript
const isExpanded = ref(false); // Controla expansión/colapso

// Auto-expande si algún hijo está activo
if (hasChildren.value && checkIfChildActive(props.item)) {
  isExpanded.value = true;
}
```

**Computeds:**

```typescript
// Tiene hijos?
const hasChildren = computed(() => props.item.children && props.item.children.length > 0);

// Está activo? (coincide con ruta actual)
const isActive = computed(() => route.path === props.item.navigation.route);
```

**Métodos:**

```typescript
// Alternar expansión
const toggleExpand = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value;
  }
};

// Click en item: navega y expande si tiene hijos
const handleClick = () => {
  if (hasChildren.value) {
    toggleExpand();
  }
};

// Verifica si algún hijo está activo (recursivo)
const checkIfChildActive = (item: FlowItemTree): boolean => {
  if (item.navigation.route === route.path) return true;
  if (item.children) {
    return item.children.some(checkIfChildActive);
  }
  return false;
};
```

**Indentación:**

```vue
<div :style="{ paddingLeft: `${level * 12}px` }">
  <!-- Cada nivel adicional agrega 12px de padding -->
</div>
```

**Animaciones:**

```css
/* Transición suave para expansión */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}
```

---

### 1.3. Layout flow-with-sidebar.vue

**Ubicación:** `app/layouts/flow-with-sidebar.vue`

**Propósito:** Layout que detecta la ruta actual y renderiza el FlowSidebar correspondiente.

**Estructura:**

```vue
<template>
  <div class="flex min-h-screen">
    <!-- Sidebar (solo si hay FlowConfig detectado) -->
    <FlowSidebar v-if="currentFlowConfigWithTree" :config="currentFlowConfigWithTree" />

    <!-- Contenido principal -->
    <main class="flex-1 overflow-x-hidden">
      <slot />
    </main>
  </div>
</template>
```

**Lógica de detección:**

```typescript
// 1. Detectar FlowConfig según ruta
const currentFlowConfig = computed(() => {
  const path = route.path;

  if (path.startsWith("/operaciones/junta-accionistas")) {
    return juntaAccionistasFlowConfig;
  }

  if (path.startsWith("/registro-societario/sucursales")) {
    return sucursalesFlowConfig;
  }

  return null; // Sin sidebar
});

// 2. Convertir FlowItem[] a FlowItemTree[]
const currentFlowConfigWithTree = computed(() => {
  if (!currentFlowConfig.value) return null;

  return {
    ...currentFlowConfig.value,
    items: buildFlowItemTree(currentFlowConfig.value.items),
  };
});
```

**Flujo de trabajo:**

```
Usuario navega → route.path cambia
                ↓
    currentFlowConfig detecta FlowConfig
                ↓
    buildFlowItemTree convierte items
                ↓
    FlowSidebar renderiza
```

**Limitaciones actuales:**

- Solo muestra items de Nivel 0 (los children están vacíos)
- No construye árbol jerárquico completo
- `buildFlowItemTree()` solo agrega `children: []` a cada item

---

### 1.4. flowHelpers.ts

**Ubicación:** `app/utils/flowHelpers.ts`

**Propósito:** Utilidades para trabajar con FlowConfigs y FlowItems.

#### **Función: buildFlowItemTree()**

**Estado actual:**

```typescript
export function buildFlowItemTree(items: FlowItem[]): FlowItemTree[] {
  return items.map((item) => ({
    ...item,
    children: [] as FlowItemTree[],
  }));
}
```

**Problema:** No construye el árbol jerárquico real.

**TODO futuro:**

```typescript
// Construcción jerárquica completa basada en parentId
export function buildFlowItemTree(items: FlowItem[]): FlowItemTree[] {
  const itemMap = new Map<string, FlowItemTree>();
  const rootItems: FlowItemTree[] = [];

  // 1. Crear mapa de items
  items.forEach((item) => {
    itemMap.set(item.identity.id, { ...item, children: [] });
  });

  // 2. Construir jerarquía
  itemMap.forEach((item) => {
    if (item.hierarchy.parentId === null) {
      rootItems.push(item);
    } else {
      const parent = itemMap.get(item.hierarchy.parentId);
      if (parent) {
        parent.children!.push(item);
      }
    }
  });

  // 3. Ordenar por hierarchy.order
  const sortItems = (items: FlowItemTree[]) => {
    items.sort((a, b) => a.hierarchy.order - b.hierarchy.order);
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        sortItems(item.children);
      }
    });
  };

  sortItems(rootItems);
  return rootItems;
}
```

#### **Función: findItemByRoute()**

```typescript
export function findItemByRoute(items: FlowItem[], route: string): FlowItem | undefined {
  return items.find((item) => item.navigation.route === route);
}
```

**Uso:** Encontrar item específico por su ruta.

#### **Función: calculateFlowProgress()**

```typescript
export function calculateFlowProgress(items: FlowItem[]): number {
  if (items.length === 0) return 0;

  const completedCount = items.filter((item) => item.behavior.isCompleted).length;
  return Math.round((completedCount / items.length) * 100);
}
```

**Uso:** Calcular porcentaje de completación del flujo.

---

### 1.5. Cómo se usa actualmente

#### **Páginas que usan flow-with-sidebar:**

**1. seleccion-agenda.vue (Junta de Accionistas)**

```vue
<script setup lang="ts">
  definePageMeta({
    layout: "flow-with-sidebar",
  });
</script>
```

**Resultado:**

- Ruta: `/operaciones/junta-accionistas/seleccion-agenda`
- Layout detecta: `juntaAccionistasFlowConfig`
- Sidebar muestra: 6 items de nivel 0

**2. datos-sociedad.vue (Sucursales)**

```vue
<script setup lang="ts">
  definePageMeta({
    layout: "flow-with-sidebar",
  });
</script>
```

**Resultado:**

- Ruta: `/registro-societario/sucursales/datos-sociedad`
- Layout detecta: `sucursalesFlowConfig`
- Sidebar muestra: 6 items de nivel 0

---

### 1.6. FlowConfigs actuales

**Ubicación:** `app/config/flows/`

#### **junta-accionistas.flow.ts**

```typescript
export const juntaAccionistasFlowConfig: FlowConfig = {
  id: "junta-accionistas-flow",
  name: "Junta de Accionistas",
  description: "Flujo completo para la gestión de juntas de accionistas",

  items: [
    seleccionAgendaItem, // Nivel 0
    detallesItem, // Nivel 0
    instalacionItem, // Nivel 0
    puntosAcuerdoItem, // Nivel 0
    resumenItem, // Nivel 0
    descargarItem, // Nivel 0
  ],

  renderOptions: {
    mode: RenderMode.HIERARCHICAL,
    showProgress: true,
    showIcons: true,
    // ...
  },

  sidebarOptions: {
    position: SidebarPosition.LEFT,
    width: 280,
    showHeader: true,
    // ...
  },
};
```

**Nota:** Solo incluye items de Nivel 0. Los niveles 1-4 existen en `app/types/flows/` pero no están importados en el FlowConfig.

#### **sucursales.flow.ts**

```typescript
export const sucursalesFlowConfig: FlowConfig = {
  id: "sucursales-flow",
  name: "Sucursales",
  description: "Flujo de registro de sucursales",

  items: [
    sucursalDatosSociedadItem, // Nivel 0
    sucursalDomicilioItem, // Nivel 0
    sucursalRepresentanteItem, // Nivel 0
    sucursalDocumentacionItem, // Nivel 0
    sucursalResumenItem, // Nivel 0
    sucursalEnviarItem, // Nivel 0
  ],

  renderOptions: {
    mode: RenderMode.SEQUENTIAL, // NO jerárquico
    showProgress: true,
    // ...
  },

  sidebarOptions: {
    position: SidebarPosition.LEFT,
    width: 280,
    // ...
  },
};
```

---

## 🏗️ ProboSidebar Existente (TODO 2)

### 2.1. ProboSidebar.vue

**Ubicación:** `app/components/ProboSidebar.vue`

**Propósito:** Sidebar principal de navegación de la aplicación (usado en `default.vue` layout).

**Características principales:**

#### **Estructura visual:**

```
┌─────────────────────────────────┐
│ 🏢 Logo Probo          [X]      │ ← Header
├─────────────────────────────────┤
│                                 │
│ ▼ Registro Societario           │ ← Sección expandible
│   📄 Sociedades                 │
│   📍 Sucursales                 │
│                                 │
│ ▼ Operaciones de Órgano...     │
│   > 👥 Directorio               │ ← Item con submenu
│     📊 Dashboard                │
│     ✓ Directores                │
│     📜 Histórico                │
│   > 💼 Gerencia General         │
│   > 👑 Junta de Accionistas     │
│                                 │
│ ▼ Storage                       │
│   📦 Almacén                    │
│   📄 Documentos Generados       │
│                                 │
│ ▼ Features                      │
│   💬 Chat IA                    │
│   🔍 Documentos IA              │
│   📊 Reportería                 │
│                                 │
│ 🧩 Componentes                  │
│ 📁 Sidebars                     │
│                                 │
├─────────────────────────────────┤
│ 👤 User Profile                 │ ← Footer
└─────────────────────────────────┘
```

#### **Componentes usados:**

```typescript
import {
  Sidebar, // shadcn/ui base
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  Collapsible, // Para secciones expandibles
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
```

#### **Props:**

```typescript
defineProps<{
  isCollapsed: boolean; // Estado de colapso
  toggleSidebar: () => void; // Función para colapsar/expandir
}>();
```

#### **Estado interno:**

```typescript
// Estados de expansión de secciones principales
const expandedSections = ref<Record<string, boolean>>({
  "Registro Societario": true,
  "Operaciones de Órgano de Control": true,
  Storage: true,
  Features: true,
});

// Estados de expansión de items con submenu
const expandedItems = ref<Record<string, boolean>>({});
```

#### **Métodos:**

```typescript
// Alternar expansión de sección
const toggleSection = (section: string, value: boolean) => {
  expandedSections.value[section] = value;
};

// Alternar expansión de item
const toggleItem = (itemId: string, value: boolean) => {
  expandedItems.value[itemId] = value;
};

// Verificar si ruta está activa
const isActive = (href?: string): boolean => {
  if (!href) return false;
  return route.path === href || route.path.startsWith(href + "/");
};
```

#### **Renderizado de navegación:**

```vue
<!-- Iterar secciones -->
<div v-for="section in navigationSections" :key="section.id">
  <template v-if="canViewModule(section.id)">
    <Collapsible :open="expandedSections[section.title]">
      <!-- Trigger: Botón de la sección -->
      <CollapsibleTrigger>
        <span>{{ t(section.translationKey) }}</span>
        <ChevronDown />
      </CollapsibleTrigger>
      
      <!-- Content: Items de la sección -->
      <CollapsibleContent>
        <template v-for="item in section.items" :key="item.id">
          
          <!-- Item con submenu -->
          <template v-if="item.hasSubmenu">
            <Collapsible :open="expandedItems[item.id]">
              <CollapsibleTrigger>
                <component :is="getIcon(item.icon)" />
                <span>{{ t(item.translationKey) }}</span>
                <ChevronRight />
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <NuxtLink 
                  v-for="subItem in item.submenuItems" 
                  :to="subItem.href"
                >
                  {{ t(subItem.translationKey) }}
                </NuxtLink>
              </CollapsibleContent>
            </Collapsible>
          </template>
          
          <!-- Item sin submenu -->
          <template v-else>
            <NuxtLink :to="item.href">
              <component :is="getIcon(item.icon)" />
              <span>{{ t(item.translationKey) }}</span>
            </NuxtLink>
          </template>
          
        </template>
      </CollapsibleContent>
    </Collapsible>
  </template>
</div>
```

---

### 2.2. navigation.ts

**Ubicación:** `app/config/navigation.ts`

**Propósito:** Define la estructura de navegación del sidebar principal.

**Estructura:**

```typescript
export const navigationSections: NavigationSection[] = [
  {
    id: "registro-societario",
    title: "Registro Societario",
    translationKey: "navigation.registroSocietario",
    items: [
      {
        id: "sociedades",
        label: "Sociedades",
        translationKey: "navigation.sociedades",
        icon: "Building2",
        href: "/registro-societario/sociedades",
        roles: ["admin", "manager", "user"],
      },
      {
        id: "sucursales",
        label: "Sucursales",
        translationKey: "navigation.sucursales",
        icon: "MapPin",
        href: "/registro-societario/sucursales", // ← CONFLICTO
        roles: ["admin", "manager", "user"],
      },
    ],
  },
  {
    id: "operaciones",
    title: "Operaciones de Órgano de Control",
    items: [
      {
        id: "junta-accionistas",
        label: "Junta de Accionistas",
        icon: "Crown",
        hasSubmenu: true,
        submenuItems: [
          {
            id: "junta-dashboard",
            label: "Dashboard",
            href: "/operaciones/junta-accionistas/dashboard",
          },
          {
            id: "accionistas",
            label: "Accionistas",
            href: "/operaciones/junta-accionistas/accionistas",
          },
          {
            id: "junta-historico",
            label: "Histórico",
            href: "/operaciones/junta-accionistas/historico",
          },
        ],
      },
    ],
  },
  // ... más secciones
];
```

**Tipos:**

```typescript
interface NavigationSection {
  id: string;
  title: string;
  translationKey: string;
  items: NavigationItem[];
}

interface NavigationItem {
  id: string;
  label: string;
  translationKey: string;
  icon?: string;
  href?: string;
  roles?: string[];
  hasSubmenu?: boolean;
  submenuItems?: NavigationSubItem[];
}

interface NavigationSubItem {
  id: string;
  label: string;
  translationKey: string;
  icon?: string;
  href: string;
}
```

---

### 2.3. Layout default.vue

**Ubicación:** `app/layouts/default.vue`

**Propósito:** Layout principal de la aplicación que incluye ProboSidebar.

**Estructura:**

```vue
<template>
  <div class="flex h-screen overflow-hidden bg-safe">
    <!-- Toggle Button (visible cuando está colapsado) -->
    <Button v-if="isCollapsed" class="fixed top-2 left-2 z-40" @click="toggleSidebar">
      <Menu class="w-4 h-4" />
    </Button>

    <!-- Sidebar -->
    <ProboSidebar
      v-if="!isCollapsed"
      :is-collapsed="isCollapsed"
      :toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto">
        <!-- Flow Layout (si meta.flowLayout === true) -->
        <NuxtLayout v-if="isFlowLayout" name="flow-layout">
          <slot />
        </NuxtLayout>

        <!-- Contenido normal -->
        <slot v-else />
      </main>
    </div>
  </div>
</template>
```

**Estado:**

```typescript
const isCollapsed = ref(false); // Sidebar colapsado/expandido

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
```

**Layout flow-layout:**

```typescript
const isFlowLayout = computed(() => route.meta.flowLayout === true);
```

**Uso:** Si una página define `definePageMeta({ flowLayout: true })`, se renderiza con `flow-layout` (no implementado actualmente).

---

### 2.4. Problema actual: Dos sidebars separados

#### **Escenario 1: Registro de Sociedades**

```
Layout: default.vue
└─ ProboSidebar (solo este)
   └─ Navegación principal
      ├─ Registro Societario
      │  ├─ Sociedades
      │  └─ Sucursales  ← Link a /registro-societario/sucursales
      └─ ...
```

**Resultado:** Funciona correctamente ✅

#### **Escenario 2: Junta de Accionistas (actual)**

```
Layout: flow-with-sidebar.vue
└─ FlowSidebar (solo este)
   └─ Items de nivel 0
      ├─ Selección de Agenda
      ├─ Detalles
      └─ ...
```

**Problema:** No hay navegación principal (ProboSidebar) ❌

#### **Escenario 3: Sucursales (actual)**

```
Layout: flow-with-sidebar.vue
└─ FlowSidebar (solo este)
   └─ Items de nivel 0
      ├─ Datos de la Sociedad
      ├─ Domicilio
      └─ ...
```

**Problema:** No hay navegación principal (ProboSidebar) ❌

---

## 🚀 Arquitectura Propuesta (TODO 3)

### 3.1. Visión general

```
┌────────────────────┬──────────────────────────┬─────────────────┐
│  ProboSidebar      │  SidebarFlow (opcional)  │  Main Content   │
│  (navegación       │  (pasos del flujo)       │                 │
│   principal)       │                          │                 │
├────────────────────┼──────────────────────────┼─────────────────┤
│ Logo Probo    [X]  │ Junta de Accionistas     │  <Página>       │
│                    │ ─────────────────────    │                 │
│ ▼ Registro Soc.    │ > Selección de Agenda    │                 │
│   Sociedades       │   Detalles               │                 │
│   Sucursales       │   Instalación            │                 │
│                    │ ▼ Puntos de Acuerdo      │                 │
│ ▼ Operaciones      │   > Aumento de Capital   │                 │
│ > Directorio       │     • Aporte Dinerario   │                 │
│ > Gerencia         │     • Capitalización     │                 │
│ > Junta Acc. ←─────┼────(activo)              │                 │
│                    │   > Nombramiento         │                 │
│ ▼ Storage          │   > Remociones           │                 │
│   Almacén          │   Resumen                │                 │
│                    │   Descargar              │                 │
│ User Profile       │                          │                 │
└────────────────────┴──────────────────────────┴─────────────────┘
    280px                   280px                   flex-1
```

### 3.2. Componentes a crear

#### **SidebarGeneral.vue** (nuevo)

- Versión mejorada de ProboSidebar
- Acepta slot para sidebar adicional
- Mantiene navegación principal
- Compatible con sistema actual

#### **SidebarFlow.vue** (nuevo)

- Versión simplificada de FlowSidebar
- Se integra dentro de SidebarGeneral
- Muestra pasos del flujo
- Colapsable/expandible

#### **Layout sidebar-general.vue** (nuevo)

- Reemplaza `flow-with-sidebar.vue`
- Usa SidebarGeneral + SidebarFlow
- Se aplica a Juntas y Sucursales

---

### 3.3. Flujo de datos

```
Route Change
    ↓
Layout sidebar-general.vue detecta ruta
    ↓
    ├─→ SidebarGeneral renderiza
    │   └─→ navigationSections (siempre)
    │
    └─→ SidebarFlow renderiza (si hay FlowConfig)
        └─→ FlowConfig detectado según ruta
            ├─→ /operaciones/junta-accionistas/* → juntaAccionistasFlowConfig
            └─→ /registro-societario/sucursales/* → sucursalesFlowConfig
```

---

### 3.4. Casos de uso

#### **Caso 1: Registro de Sociedades** (sin cambios)

```
Layout: default.vue
└─ ProboSidebar (como antes)
```

**Resultado:** Sigue funcionando igual ✅

#### **Caso 2: Junta de Accionistas** (nuevo)

```
Layout: sidebar-general.vue
├─ SidebarGeneral
│  └─ navigationSections (navegación principal)
└─ SidebarFlow
   └─ juntaAccionistasFlowConfig (pasos del flujo)
```

**Resultado:** Ambos sidebars visibles ✅

#### **Caso 3: Sucursales** (nuevo)

```
Layout: sidebar-general.vue
├─ SidebarGeneral
│  └─ navigationSections (navegación principal)
└─ SidebarFlow
   └─ sucursalesFlowConfig (pasos del flujo)
```

**Resultado:** Ambos sidebars visibles ✅

---

## 📝 Plan de Implementación

### Fase 1: Crear SidebarFlow.vue

- [ ] Simplificar FlowSidebar.vue
- [ ] Remover header (se mostrará en SidebarGeneral)
- [ ] Ajustar estilos para integrarse
- [ ] Hacer colapsable

### Fase 2: Crear SidebarGeneral.vue

- [ ] Copiar ProboSidebar.vue como base
- [ ] Agregar slot para sidebar adicional
- [ ] Ajustar estilos para dos columnas
- [ ] Mantener funcionalidad existente

### Fase 3: Crear Layout sidebar-general.vue

- [ ] Detectar FlowConfig según ruta
- [ ] Renderizar SidebarGeneral + SidebarFlow
- [ ] Manejar caso sin FlowConfig (solo SidebarGeneral)

### Fase 4: Aplicar a páginas

- [ ] Actualizar páginas de Junta de Accionistas
- [ ] Actualizar páginas de Sucursales
- [ ] Verificar que Registro de Sociedades sigue funcionando

### Fase 5: Documentación

- [ ] Actualizar este documento
- [ ] Crear guía de uso
- [ ] Documentar props y comportamiento

---

## 🎨 Consideraciones de diseño

### Ancho de sidebars

- ProboSidebar: 280px (actual)
- SidebarFlow: 280px
- **Total:** 560px + contenido principal

### Responsive

- Desktop (>1024px): Ambos sidebars visibles
- Tablet (768-1024px): SidebarFlow colapsado por defecto
- Mobile (<768px): Ambos como drawers

### Colapso

- SidebarGeneral: Puede colapsarse independientemente
- SidebarFlow: Puede colapsarse independientemente
- Ambos colapsados: Solo contenido principal visible

### Scroll

- SidebarGeneral: Scroll independiente
- SidebarFlow: Scroll independiente
- Main Content: Scroll independiente

---

## 🔗 Referencias

- **FlowSidebar actual:** `app/components/flow/FlowSidebar.vue`
- **FlowSidebarItem actual:** `app/components/flow/FlowSidebarItem.vue`
- **ProboSidebar actual:** `app/components/ProboSidebar.vue`
- **Layout flow-with-sidebar:** `app/layouts/flow-with-sidebar.vue`
- **Layout default:** `app/layouts/default.vue`
- **FlowConfigs:** `app/config/flows/`
- **Navigation:** `app/config/navigation.ts`

---

## 📊 Estado del Proyecto

### **Completado ✅:**

- ✅ TODO 1: Arquitectura Actual documentada
- ✅ TODO 2: ProboSidebar Existente analizado
- ✅ TODO 3: Arquitectura Propuesta diseñada
- ✅ Expediente técnico completo (roadmap + documentation)

### **Siguiente Paso:**

**Implementar TODO 3** siguiendo el expediente técnico:

- 📄 `todo-003-sidebar-general.roadmap.md` (decisiones + issues)
- 📄 `todo-003-sidebar-general.documentation.md` (diseño técnico)

### **Estimación TODO 3:**

- MVP: 5.75 horas (~1 día)
- Completo (con jerarquía): 8.75 horas (~1.5 días)

---

**FIN DE DOCUMENTACIÓN TODO 1, 2 y 3**

**ESTADO:** 📋 Expediente Técnico Completo - Listo para Implementación
