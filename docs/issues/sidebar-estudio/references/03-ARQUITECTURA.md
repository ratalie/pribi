# 🏗️ Arquitectura del Sistema Universal de Sidebars

**Fecha**: 31 de Octubre, 2025  
**Objetivo**: Diseñar CÓMO construir el sistema

---

## 🎯 Visión General

### **Concepto Central**

Un sistema de **renderizado dinámico** que toma un objeto de configuración y genera automáticamente la UI apropiada para cualquier tipo de flujo.

### **Analogía**

Como un motor de plantillas: tú defines QUÉ mostrar (datos), el sistema decide CÓMO mostrarlo (UI).

---

## 🏛️ Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                    layouts/default.vue                       │
│  ┌──────────┐  ┌─────────────────────────────────────────┐ │
│  │          │  │                                          │ │
│  │  Probo   │  │    <UniversalFlowLayout                  │ │
│  │ Sidebar  │  │      :config="flowConfig"                │ │
│  │          │  │      :store="flowStore">                 │ │
│  │  (Main   │  │                                          │ │
│  │   Nav)   │  │      <template #content>                 │ │
│  │          │  │        <NuxtPage />                      │ │
│  │          │  │      </template>                         │ │
│  │          │  │                                          │ │
│  │          │  │    </UniversalFlowLayout>                │ │
│  │          │  │                                          │ │
│  └──────────┘  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

         ▼ Renderiza dinámicamente basado en config ▼

┌─────────────────────────────────────────────────────────────┐
│         Resultado: Layout Adaptativo                         │
│                                                              │
│  Para Juntas (config.type = 'hierarchical'):                │
│  ┌──────────┬──────────┬──────────┐                        │
│  │ Left SB  │ Content  │ Right SB │                        │
│  │ (Árbol)  │ (Slot)   │ (Steps)  │                        │
│  └──────────┴──────────┴──────────┘                        │
│                                                              │
│  Para Registro (config.type = 'sequential'):                │
│  ┌────────────────────────────────┐                        │
│  │ Header (Progress Bar)          │                        │
│  ├──────────┬─────────────────────┤                        │
│  │ Left SB  │ Content (Slot)      │                        │
│  │ (Steps)  │                     │                        │
│  │          │ Footer (Buttons)    │                        │
│  └──────────┴─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes del Sistema

### **1. Componente Principal: UniversalFlowLayout**

**Responsabilidad**: Orquestar todo el sistema

```vue
<template>
  <div class="universal-flow-layout">
    <!-- Header (condicional) -->
    <component
      v-if="config.header?.enabled"
      :is="config.header.component"
      v-bind="config.header.props"
    />

    <div class="layout-body">
      <!-- Sidebar Izquierdo (siempre) -->
      <FlowSidebar
        :items="config.navigation"
        :type="config.type"
        :current-path="currentPath"
        @navigate="handleNavigate"
      />

      <!-- Contenido Principal -->
      <div class="content-area">
        <slot name="content" />

        <!-- Footer (condicional) -->
        <component
          v-if="config.footer?.enabled"
          :is="config.footer.component"
          v-bind="config.footer.props"
        />
      </div>

      <!-- Sidebar Derecho (condicional) -->
      <FlowSidebar
        v-if="showRightSidebar"
        :items="rightSidebarSteps"
        type="sequential"
        position="right"
        :current-path="currentPath"
        @navigate="handleNavigate"
      />
    </div>
  </div>
</template>
```

---

### **2. Componente: FlowSidebar**

**Responsabilidad**: Renderizar navegación (adaptable a tipo)

```vue
<template>
  <aside class="flow-sidebar" :class="`position-${position}`">
    <!-- Renderizado dinámico basado en tipo -->
    <component
      :is="rendererComponent"
      :items="items"
      :current-path="currentPath"
      @navigate="$emit('navigate', $event)"
    />
  </aside>
</template>

<script setup>
  const rendererComponent = computed(() => {
    switch (props.type) {
      case "hierarchical":
        return HierarchicalRenderer;
      case "sequential":
        return SequentialRenderer;
      case "mixed":
        return MixedRenderer;
      default:
        return DefaultRenderer;
    }
  });
</script>
```

---

### **3. Renderizadores Específicos**

#### **HierarchicalRenderer.vue**

```vue
<!-- Para navegación tipo árbol (Juntas) -->
<template>
  <nav class="hierarchical-nav">
    <template v-for="item in items" :key="item.id">
      <NavItem :item="item" :level="0" :is-active="isActive(item)" @navigate="handleNavigate">
        <!-- Recursión para hijos -->
        <HierarchicalRenderer v-if="item.children" :items="item.children" :level="level + 1" />
      </NavItem>
    </template>
  </nav>
</template>
```

#### **SequentialRenderer.vue**

```vue
<!-- Para navegación tipo lista (Registro) -->
<template>
  <nav class="sequential-nav">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="step-item"
      :class="getStepClasses(item)"
    >
      <!-- Número del paso -->
      <div class="step-number">{{ index + 1 }}</div>

      <!-- Contenido -->
      <div class="step-content">
        <h4>{{ item.title }}</h4>
        <p v-if="item.description">{{ item.description }}</p>
      </div>

      <!-- Icono de estado -->
      <div class="step-status">
        <StatusIcon :status="item.status" />
      </div>
    </div>
  </nav>
</template>
```

---

### **4. Store: useFlowNavigationStore**

**Responsabilidad**: Estado global reactivo

```typescript
import { defineStore } from "pinia";

export const useFlowNavigationStore = defineStore("flowNavigation", {
  state: () => ({
    // Estado de cada item (por ID)
    itemStates: {} as Record<string, FlowItemState>,

    // Item actual
    currentItemId: null as string | null,

    // Historial de navegación
    history: [] as string[],

    // Configuración del flujo actual
    activeFlow: null as FlowConfig | null,
  }),

  getters: {
    // Estado de un item específico
    getItemState: (state) => (itemId: string) => {
      return state.itemStates[itemId] || { status: "not-started" };
    },

    // Calcular progreso general
    overallProgress: (state) => {
      const total = Object.keys(state.itemStates).length;
      const completed = Object.values(state.itemStates).filter(
        (s) => s.status === "completed"
      ).length;
      return total > 0 ? (completed / total) * 100 : 0;
    },

    // Siguiente item válido
    nextItem: (state) => {
      // Lógica para encontrar siguiente item navegable
    },

    // Item anterior
    previousItem: (state) => {
      // Lógica para encontrar item anterior
    },
  },

  actions: {
    // Inicializar flujo
    initializeFlow(config: FlowConfig) {
      this.activeFlow = config;
      this.itemStates = this.buildInitialStates(config);
    },

    // Actualizar estado de item
    updateItemState(itemId: string, state: Partial<FlowItemState>) {
      this.itemStates[itemId] = {
        ...this.itemStates[itemId],
        ...state,
      };
    },

    // Navegar a item
    async navigateTo(itemId: string, validate = true) {
      if (validate) {
        const currentItem = this.getCurrentItem();
        if (currentItem?.validate) {
          const isValid = await currentItem.validate();
          if (!isValid) {
            throw new Error("Validation failed");
          }
        }
      }

      this.history.push(itemId);
      this.currentItemId = itemId;
    },

    // Guardar progreso (localStorage + API)
    async saveProgress() {
      // Guardar en localStorage
      localStorage.setItem("flow-progress", JSON.stringify(this.itemStates));

      // Guardar en backend
      await api.saveFlowProgress(this.itemStates);
    },

    // Restaurar progreso
    async restoreProgress() {
      // Intentar desde localStorage primero
      const local = localStorage.getItem("flow-progress");
      if (local) {
        this.itemStates = JSON.parse(local);
      }

      // Sincronizar con backend
      const remote = await api.getFlowProgress();
      if (remote) {
        this.itemStates = { ...this.itemStates, ...remote };
      }
    },
  },
});
```

---

### **5. Composable: useFlowNavigation**

**Responsabilidad**: API conveniente para componentes

```typescript
export function useFlowNavigation(flowId?: string) {
  const store = useFlowNavigationStore();
  const router = useRouter();
  const route = useRoute();

  // Estado reactivo
  const currentItem = computed(() => store.getItemState(route.path));

  const progress = computed(() => store.overallProgress);

  // Métodos de navegación
  const next = async () => {
    const nextItem = store.nextItem;
    if (nextItem) {
      await store.navigateTo(nextItem.id);
      router.push(nextItem.path);
    }
  };

  const previous = () => {
    const prevItem = store.previousItem;
    if (prevItem) {
      store.navigateTo(prevItem.id, false); // Sin validación al retroceder
      router.push(prevItem.path);
    }
  };

  const goTo = async (itemId: string, validate = true) => {
    const item = store.getItem(itemId);
    if (!item) return;

    await store.navigateTo(itemId, validate);
    router.push(item.path);
  };

  const reset = () => {
    store.resetFlow();
    router.push(store.activeFlow?.startPath || "/");
  };

  // Actualizar estado del item actual
  const updateStatus = (status: FlowItemStatus) => {
    store.updateItemState(route.path, { status });
  };

  return {
    // Estado
    currentItem,
    progress,

    // Métodos
    next,
    previous,
    goTo,
    reset,
    updateStatus,
  };
}
```

---

## 📦 Estructura de Archivos

```
app/
├─ components/
│  ├─ flow-system/                    # 🆕 Sistema universal
│  │  ├─ UniversalFlowLayout.vue      # Componente principal
│  │  ├─ FlowSidebar.vue              # Sidebar adaptable
│  │  ├─ renderers/
│  │  │  ├─ HierarchicalRenderer.vue  # Para navegación árbol
│  │  │  ├─ SequentialRenderer.vue    # Para navegación lineal
│  │  │  ├─ MixedRenderer.vue         # Para navegación mixta
│  │  │  └─ DefaultRenderer.vue       # Fallback
│  │  ├─ items/
│  │  │  ├─ NavItem.vue               # Item genérico
│  │  │  ├─ StepItem.vue              # Item con número
│  │  │  └─ StatusIcon.vue            # Iconos de estado
│  │  └─ parts/
│  │     ├─ FlowHeader.vue            # Header genérico
│  │     └─ FlowFooter.vue            # Footer genérico
│  │
│  ├─ JuntasDoubleSidebar.vue         # ⚠️ Deprecar (legacy)
│  └─ ...
│
├─ composables/
│  ├─ flows/                           # 🆕 Composables de flujos
│  │  ├─ useFlowNavigation.ts         # API principal
│  │  ├─ useFlowValidation.ts         # Validación
│  │  └─ useFlowProgress.ts           # Progreso
│  └─ ...
│
├─ stores/
│  ├─ useFlowNavigationStore.ts       # 🆕 Store principal
│  └─ ...
│
├─ types/
│  ├─ flow-system/                    # 🆕 Tipos del sistema
│  │  ├─ config.ts                    # FlowConfig
│  │  ├─ item.ts                      # FlowItem
│  │  ├─ state.ts                     # FlowItemState
│  │  ├─ renderer.ts                  # Renderer types
│  │  └─ index.ts                     # Export all
│  └─ ...
│
├─ config/
│  ├─ flows/                          # Configuraciones de flujos
│  │  ├─ juntas.flow.ts               # 🆕 Config de Juntas
│  │  ├─ registro.flow.ts             # 🆕 Config de Registro
│  │  └─ index.ts                     # Export all
│  │
│  ├─ juntas-navigation.ts            # ⚠️ Deprecar (legacy)
│  └─ society-register-navigation.ts  # ⚠️ Deprecar (legacy)
│
└─ pages/
   ├─ juntas/
   │  ├─ index.vue                    # Usa UniversalFlowLayout
   │  └─ ...                          # Todas usan el mismo
   │
   └─ registro-societario/
      ├─ sociedades/
      │  ├─ crear/
      │  │  ├─ datos-sociedad.vue     # Usa UniversalFlowLayout
      │  │  └─ ...                    # Todas usan el mismo
      │  └─ ...
      └─ ...
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                      1. Inicialización                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Page Component                                               │
│  <UniversalFlowLayout :config="juntasFlowConfig" />         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ UniversalFlowLayout                                          │
│  - Lee config                                                │
│  - Inicializa store                                          │
│  - Determina qué renderizar                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   2. Renderizado Dinámico                    │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   Header    │ │  FlowSidebar│ │   Footer    │
    │(condicional)│ │  (dinámico) │ │(condicional)│
    └─────────────┘ └─────────────┘ └─────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │ Selecciona Renderer     │
              │ según config.type       │
              └─────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │Hierarchical │ │ Sequential  │ │   Mixed     │
    │  Renderer   │ │   Renderer  │ │  Renderer   │
    └─────────────┘ └─────────────┘ └─────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      3. Interacción Usuario                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
          Usuario hace clic en item de navegación
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Evento @navigate capturado por UniversalFlowLayout          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ useFlowNavigation.goTo(itemId)                              │
│  1. Validar item actual (si config.validateOnNavigate)      │
│  2. Actualizar estado en store                              │
│  3. Navegar con router.push()                               │
│  4. Guardar progreso (localStorage + API)                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   4. Actualización Reactiva                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Store actualizado → Componentes reactivos se re-renderizan  │
│  - Item anterior: status = 'completed'                       │
│  - Item nuevo: status = 'in-progress'                        │
│  - Progreso general actualizado                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Decisiones de Diseño

### **✅ Decisión 1: Renderizado Dinámico vs Componentes Específicos**

**Elegido**: Renderizado dinámico con `<component :is="...">`

**Razones**:

- ✅ Un solo componente base (UniversalFlowLayout)
- ✅ Fácil agregar nuevos tipos de renderizado
- ✅ Sin duplicación de código
- ✅ Más flexible para cambios

**Alternativa descartada**: Un componente por tipo de flujo

- ❌ Duplicación de lógica
- ❌ Más archivos que mantener

---

### **✅ Decisión 2: Store Centralizado vs Prop Drilling**

**Elegido**: Store centralizado (Pinia)

**Razones**:

- ✅ Estado accesible desde cualquier componente
- ✅ Facilita persistencia (localStorage/API)
- ✅ Facilita debugging (Vue DevTools)
- ✅ Facilita testing

**Alternativa descartada**: Pasar props entre componentes

- ❌ Props drilling profundo
- ❌ Difícil mantener sincronizado
- ❌ Difícil persistir

---

### **✅ Decisión 3: Configuración en TS vs JSON**

**Elegido**: Archivos TypeScript

**Razones**:

- ✅ Type safety
- ✅ Autocompletado en IDE
- ✅ Puede incluir funciones (validate, etc.)
- ✅ Imports fáciles

**Alternativa descartada**: JSON puro

- ❌ Sin tipos
- ❌ No puede incluir funciones
- ❌ Menos flexible

---

### **✅ Decisión 4: Validación Síncrona vs Asíncrona**

**Elegido**: Soporte para ambas

**Razones**:

- ✅ Validación simple: síncrona (form.isValid())
- ✅ Validación compleja: asíncrona (API calls)
- ✅ Flexible para diferentes casos de uso

---

### **✅ Decisión 5: Componente vs Layout**

**Elegido**: Componente

**Razones**:

- ✅ Preserva ProboSidebar
- ✅ Más flexible
- ✅ Lección aprendida de error previo con Juntas

---

## 📊 Diagrama de Componentes

```
UniversalFlowLayout (Orquestador)
├─ FlowHeader (Opcional)
│  └─ [Componente dinámico pasado en config]
│
├─ FlowSidebar (Izquierdo - Siempre)
│  └─ [Renderer dinámico según tipo]
│     ├─ HierarchicalRenderer
│     │  └─ NavItem (recursivo)
│     │
│     ├─ SequentialRenderer
│     │  └─ StepItem
│     │
│     └─ MixedRenderer
│        ├─ NavItem
│        └─ StepItem
│
├─ Content Area (Slot)
│  └─ <slot name="content" />
│     └─ NuxtPage (página actual)
│
├─ FlowSidebar (Derecho - Condicional)
│  └─ SequentialRenderer
│     └─ StepItem (numerado)
│
└─ FlowFooter (Opcional)
   └─ [Componente dinámico pasado en config]
```

---

## 🔐 Seguridad y Validación

### **Validación de Configuración**

```typescript
// Validar config al inicializar
function validateFlowConfig(config: FlowConfig): void {
  if (!config.id) throw new Error("Flow ID required");
  if (!config.navigation) throw new Error("Navigation required");
  if (!config.type) throw new Error("Type required");

  // Validar cada item recursivamente
  validateItems(config.navigation);
}
```

### **Protección de Rutas**

```typescript
// Middleware para validar acceso a rutas
export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useFlowNavigationStore();
  const item = store.getItemByPath(to.path);

  // Verificar si está bloqueado
  if (item?.status === "locked") {
    return navigateTo(from.path);
  }

  // Verificar prerequisitos
  if (item?.requires) {
    const allCompleted = item.requires.every(
      (id) => store.getItemState(id).status === "completed"
    );

    if (!allCompleted) {
      return navigateTo(from.path);
    }
  }
});
```

---

## 🧪 Estrategia de Testing

### **Unit Tests**

- ✅ Store: todas las actions y getters
- ✅ Composables: todas las funciones públicas
- ✅ Renderers: lógica de renderizado
- ✅ Validación: funciones de validación

### **Integration Tests**

- ✅ Navegación completa de flujo
- ✅ Persistencia (localStorage + API)
- ✅ Restauración de progreso
- ✅ Validación entre pasos

### **E2E Tests**

- ✅ Usuario completa flujo de Juntas
- ✅ Usuario completa flujo de Registro
- ✅ Usuario con validación fallida
- ✅ Usuario recarga página y continúa

---

## 📝 Próximos Pasos

1. **Definir estructura de datos detallada** → [04-ESTRUCTURA-DATOS.md](./04-ESTRUCTURA-DATOS.md)
2. **Crear plan de implementación** → [05-PLAN-IMPLEMENTACION.md](./05-PLAN-IMPLEMENTACION.md)
3. **Validar arquitectura con stakeholder**
4. **Comenzar implementación**

---

**Última actualización**: 31 de Octubre, 2025
