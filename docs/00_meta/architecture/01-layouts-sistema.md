# 🎨 Layouts del Sistema

> Este documento describe los **5 layouts** disponibles en el proyecto y dónde se usan.

---

## 📋 Resumen

El proyecto tiene **5 layouts** que controlan la estructura visual de las páginas:

| Layout | Uso Principal | Sidebar | Progreso | Flow |
|--------|---------------|---------|----------|------|
| `default.vue` | Páginas generales | ✅ ProboSidebar | ❌ | ❌ |
| `registros.vue` | Registros de sociedades | ✅ ProboSidebar | ✅ Condicional | ✅ |
| `flow-layout.vue` | Flujo de sociedades (8 pasos) | ✅ Sidebar Pasos | ✅ Header + Navbar | ✅ |
| `flow-layout-juntas.vue` | Flujo de juntas | ✅ Sidebar Pasos | ✅ Header | ✅ |
| `sidebar-general.vue` | Páginas con sidebar dinámico | ✅ SidebarGeneral | ❌ | Condicional |

---

## 1️⃣ `default.vue` - Layout General

### 📍 Ubicación:
```
app/layouts/default.vue
```

### 🎯 Propósito:
Layout por defecto para todas las páginas que no especifican un layout particular.

### 🏗️ Estructura:
```
┌─────────────────────────────────┐
│ ProboSidebar (colapsable)       │  Main Content
│ - Dashboard                     │  ┌──────────────────┐
│ - Registros                     │  │                  │
│ - Operaciones                   │  │  <slot />        │
│ - Panel Admin                   │  │  (Página aquí)   │
│ - Repositorio                   │  │                  │
└─────────────────────────────────┘  └──────────────────┘
```

### 🔧 Características:
- Sidebar colapsable (persistencia en localStorage)
- Key: `probo-sidebar-collapsed`
- Soporta flow-layout anidado si `route.meta.flowLayout === true`

### 📄 Código simplificado:
```vue
<template>
  <div class="flex h-screen overflow-hidden bg-safe">
    <ProboSidebar :is-collapsed="isCollapsed" />
    <main class="flex-1 overflow-y-auto">
      <NuxtLayout v-if="isFlowLayout" name="flow-layout">
        <slot />
      </NuxtLayout>
      <slot v-else />
    </main>
  </div>
</template>
```

### 🗺️ Usado en:
- Páginas sin layout específico
- Dashboard principal
- Páginas de configuración

---

## 2️⃣ `registros.vue` - Layout de Registros

### 📍 Ubicación:
```
app/layouts/registros.vue
```

### 🎯 Propósito:
Layout para las páginas de **registro de sociedades** y **juntas**.

### 🏗️ Estructura:
```
┌─────────────────────────────────┐
│ ProboSidebar (colapsable)       │  Main Content
│ - Dashboard                     │  ┌──────────────────┐
│ - Registros                     │  │ flow-layout      │
│ - Operaciones                   │  │ o                │
│ - Panel Admin                   │  │ flow-layout-     │
│ - Repositorio                   │  │ juntas           │
└─────────────────────────────────┘  └──────────────────┘
```

### 🔧 Características:
- Sidebar colapsable (igual que `default.vue`)
- Detecta si debe usar `flow-layout` o `flow-layout-juntas`
- Basado en `route.meta.flowLayout` y `route.meta.flowLayoutJuntas`

### 📄 Código simplificado:
```vue
<template>
  <div class="flex h-screen overflow-hidden bg-safe">
    <ProboSidebar :is-collapsed="isCollapsed" />
    <main class="flex-1 overflow-y-auto">
      <!-- Layout para registros (sociedades) -->
      <NuxtLayout v-if="isFlowLayout" name="flow-layout">
        <slot />
      </NuxtLayout>
      <!-- Layout para juntas -->
      <NuxtLayout v-else-if="isFlowLayoutJuntas" name="flow-layout-juntas">
        <slot />
      </NuxtLayout>
      <!-- Sin layout anidado -->
      <slot v-else />
    </main>
  </div>
</template>
```

### 🗺️ Usado en:
- `pages/registros/sociedades/**` (con `flowLayout: true`)
- `pages/operaciones/sociedades/[societyId]/junta-accionistas/**` (con `flowLayoutJuntas: true`)

### 📝 Ejemplo de uso en página:
```vue
<script setup lang="ts">
definePageMeta({
  layout: "registros",
  flowLayout: true, // Activa flow-layout
});
</script>
```

---

## 3️⃣ `flow-layout.vue` - Layout de Flujo (Sociedades)

### 📍 Ubicación:
```
app/layouts/flow-layout.vue
```

### 🎯 Propósito:
Layout para el **flujo de registro de sociedades** (8 pasos con progreso).

### 🏗️ Estructura:
```
┌─────────────────────────────────────────────────────────┐
│ HeaderProgressNavbar (Header con progreso)              │
├──────────────┬──────────────────────────────────────────┤
│ Sidebar      │ Main Content                             │
│ Pasos:       │ ┌────────────────────────────────────┐   │
│ 1. Datos     │ │                                    │   │
│ 2. Acciones  │ │  <slot />                          │   │
│ 3. ...       │ │  (Formularios aquí)                │   │
│              │ │                                    │   │
│              │ └────────────────────────────────────┘   │
│              │ ┌────────────────────────────────────┐   │
│              │ │ Footer: [Botón Siguiente]          │   │
│              │ └────────────────────────────────────┘   │
└──────────────┴──────────────────────────────────────────┘
```

### 🔧 Características:
- Header con barra de progreso
- Sidebar izquierdo con pasos (401px fijo)
- Footer con botón "Siguiente" controlado por `useFlowLayoutStore`
- Limpia valores del store en `onUnmounted`

### 📄 Código simplificado:
```vue
<template>
  <div class="flex flex-col h-screen">
    <HeaderProgressNavbar :steps="steps" :current-step-index="currentStepIndex" />
    <div class="flex min-h-0 flex-1">
      <div class="w-[401px] shrink-0 border-r px-6 py-14">
        <ProgressNavBar :steps="steps" />
      </div>
      <div class="flex-1 flex flex-col min-w-0">
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>
        <div class="h-[92px] border-t sticky bottom-0 bg-white z-10">
          <ActionButton
            label="Siguiente"
            :is-loading="flowLayoutStore.isLoading"
            @click="flowLayoutStore.onClickNext"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

### 🗺️ Usado en:
- `pages/registros/sociedades/datos-principales.vue`
- `pages/registros/sociedades/accionistas/index.vue`
- `pages/registros/sociedades/acciones/index.vue`
- `pages/registros/sociedades/asignacion-acciones.vue`
- `pages/registros/sociedades/directorio/index.vue`
- `pages/registros/sociedades/apoderados/index.vue`
- `pages/registros/sociedades/estatutos.vue`
- `pages/registros/sociedades/quorum.vue`

### 🎮 Store relacionado:
```typescript
// app/core/presentation/layout/stores/flow-layout.store.ts
export const useFlowLayoutStore = defineStore("flowLayout", {
  state: () => ({
    isLoading: false,
    onClickNext: () => {}, // Se redefine en cada página
  }),
});
```

---

## 4️⃣ `flow-layout-juntas.vue` - Layout de Flujo (Juntas)

### 📍 Ubicación:
```
app/layouts/flow-layout-juntas.vue
```

### 🎯 Propósito:
Layout para el **flujo de juntas de accionistas** con pasos colapsables.

### 🏗️ Estructura:
```
┌──────────┬────────────────────────────────────────────────────┐
│ Sidebar  │ Header: Breadcrumbs + Botones                      │
│ Pasos:   ├────────────────────────────────────────────────────┤
│ 1. Inst. │ Main Content              │ Sidebar Derecho (Cond.)│
│    ▼     │ ┌─────────────────────┐   │ - Secciones            │
│    - A   │ │                     │   │ - Sub-steps            │
│    - B   │ │  <slot />           │   │                        │
│ 2. Puntos│ │                     │   │                        │
│ 3. Vota. │ └─────────────────────┘   │                        │
│          ├────────────────────────────────────────────────────┤
│          │ Footer: [Botón Siguiente]                          │
└──────────┴────────────────────────────────────────────────────┘
```

### 🔧 Características:
- Sidebar izquierdo con pasos colapsables (desde arriba, no limitado por header)
- Header con breadcrumbs y botones de acción
- Sidebar derecho condicional (para sub-steps)
- Footer con botón "Siguiente"
- Todos los componentes son auto-gestionados (no reciben props)

### 📄 Código simplificado:
```vue
<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar Izquierdo -->
    <FlowLayoutJuntasSidebar />
    
    <!-- Contenido Principal -->
    <div class="flex flex-col min-h-0 flex-1 overflow-hidden">
      <FlowLayoutJuntasHeader />
      
      <FlowLayoutJuntasContentWrapper>
        <slot />
      </FlowLayoutJuntasContentWrapper>
      
      <FlowLayoutJuntasFooterWrapper />
    </div>
  </div>
</template>
```

### 🗺️ Usado en:
- `pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/seleccion-agenda/index.vue`
- `pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/puntos-acuerdo.vue`
- `pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/**`
- `pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/**`
- Y todas las páginas de juntas...

### 📝 Ejemplo de uso en página:
```vue
<script setup lang="ts">
definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true, // Activa flow-layout-juntas
});
</script>
```

---

## 5️⃣ `sidebar-general.vue` - Layout con Sidebar Dinámico

### 📍 Ubicación:
```
app/layouts/sidebar-general.vue
```

### 🎯 Propósito:
Layout con sidebar dinámico que detecta el flujo según la ruta.

### 🏗️ Estructura:
```
┌──────────────────┬────────────────────────────────┐
│ SidebarGeneral   │ Main Content                   │
│ (con Flow Sidebar│ ┌──────────────────────────┐   │
│  condicional)    │ │                          │   │
│                  │ │  <slot />                │   │
│ - Dashboard      │ │                          │   │
│ - Registros      │ │                          │   │
│ - Operaciones    │ │                          │   │
│ [Flow Sidebar]   │ │                          │   │
│ - Paso 1         │ │                          │   │
│ - Paso 2         │ │                          │   │
└──────────────────┴────────────────────────────────┘
```

### 🔧 Características:
- Sidebar principal (SidebarGeneral)
- Detecta automáticamente FlowConfig según la ruta:
  - Juntas de Accionistas: `/operaciones/sociedades/.../junta-accionistas`
  - Sucursales: `/registro-societario/sucursales`
- Sidebar de flujo condicional (se muestra solo si hay FlowConfig)

### 📄 Código simplificado:
```vue
<template>
  <div class="layout-with-sidebar-general relative min-h-screen">
    <SidebarGeneral
      :is-collapsed="isCollapsed"
      :toggle-sidebar="toggleSidebar"
      :flow-config="currentFlowConfig"
      :show-flow-sidebar="showFlowSidebar"
    />
    <main class="relative z-0 min-h-screen overflow-x-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const currentFlowConfig = computed(() => {
  if (path.includes("/junta-accionistas")) {
    return buildFlowItemTree(juntaAccionistasFlowConfig.items);
  }
  if (path.startsWith("/registro-societario/sucursales")) {
    return buildFlowItemTree(sucursalesFlowConfig.items);
  }
  return null;
});
</script>
```

### 🗺️ Usado en:
- Páginas que necesitan sidebar dinámico
- Potencialmente para módulos futuros

---

## 📊 Comparación de Layouts

### Cuándo usar cada layout:

| Escenario | Layout Recomendado | Por qué |
|-----------|-------------------|---------|
| Página general | `default.vue` | Sidebar + contenido simple |
| Registro de sociedad (8 pasos) | `registros.vue` + `flow-layout.vue` | Progreso lineal con pasos |
| Junta de accionistas | `registros.vue` + `flow-layout-juntas.vue` | Pasos colapsables con sub-steps |
| Página con sidebar dinámico | `sidebar-general.vue` | Sidebar adapta según ruta |
| Página sin sidebar | Ninguno (custom) | Crear layout específico |

---

## 🎯 Cómo Usar un Layout

### En una página de Nuxt:

```vue
<script setup lang="ts">
definePageMeta({
  layout: "registros", // Nombre del layout (sin .vue)
  flowLayout: true,    // Activa flow-layout dentro de registros
  // O
  flowLayoutJuntas: true, // Activa flow-layout-juntas dentro de registros
});
</script>

<template>
  <div>
    <!-- Contenido de la página -->
  </div>
</template>
```

### Layout por defecto:
Si no defines `layout` en `definePageMeta`, se usa `default.vue`.

---

## 🔍 Persistencia de Estado

### Sidebar colapsado:
Los layouts `default.vue` y `registros.vue` guardan el estado del sidebar en localStorage:

```javascript
const SIDEBAR_STORAGE_KEY = "probo-sidebar-collapsed";

// Guardar
localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed.value));

// Leer
const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
const isCollapsed = ref(stored === "true");
```

---

## 📚 Recursos Adicionales

- **ProboSidebar:** `components/ProboSidebar.vue`
- **FlowLayoutStore:** `app/core/presentation/layout/stores/flow-layout.store.ts`
- **Componentes de Juntas:** `components/flow-layout-juntas/`
- **Componentes de Sociedades:** `components/flow-layout/`

---

**Última actualización:** Diciembre 3, 2025


