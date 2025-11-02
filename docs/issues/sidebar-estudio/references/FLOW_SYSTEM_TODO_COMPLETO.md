# ✅ TODO List: Implementación Completa del Flow System

## 📋 Índice Rápido

1. [Fase 1: Setup Inicial](#fase-1-setup-inicial) - 1 hora
2. [Fase 2: Domain Layer - Value Objects](#fase-2-domain-layer---value-objects) - 2 horas
3. [Fase 3: Domain Layer - Entities](#fase-3-domain-layer---entities) - 2 horas
4. [Fase 4: Config Layer - Crear Flujos](#fase-4-config-layer---crear-flujos) - 3 horas
5. [Fase 5: Application Layer - Composables](#fase-5-application-layer---composables) - 3 horas
6. [Fase 6: Infrastructure Layer - Store](#fase-6-infrastructure-layer---store) - 2 horas
7. [Fase 7: Presentation Layer - Componentes](#fase-7-presentation-layer---componentes) - 4 horas
8. [Fase 8: Integración](#fase-8-integración) - 2 horas
9. [Fase 9: Testing](#fase-9-testing) - 2 horas
10. [Fase 10: Documentación](#fase-10-documentación) - 1 hora

**Total estimado: 22 horas (~3 días)**

---

## Fase 1: Setup Inicial

**Tiempo estimado:** 1 hora  
**Objetivo:** Crear la estructura de carpetas completa

### Tareas

- [ ] **1.1** Crear estructura base

  ```bash
  cd app
  mkdir -p modules/flow-system
  ```

- [ ] **1.2** Crear carpetas de Domain Layer

  ```bash
  cd modules/flow-system
  mkdir -p domain/entities
  mkdir -p domain/value-objects
  mkdir -p domain/services
  mkdir -p domain/repositories
  mkdir -p domain/types
  ```

- [ ] **1.3** Crear carpetas de Application Layer

  ```bash
  mkdir -p application/composables
  mkdir -p application/dtos
  mkdir -p application/commands
  ```

- [ ] **1.4** Crear carpetas de Infrastructure Layer

  ```bash
  mkdir -p infrastructure/stores
  mkdir -p infrastructure/repositories
  mkdir -p infrastructure/persistence
  ```

- [ ] **1.5** Crear carpetas de Presentation Layer

  ```bash
  mkdir -p presentation/components
  mkdir -p presentation/layouts
  ```

- [ ] **1.6** Crear carpetas de Config Layer

  ```bash
  mkdir -p config/flows
  mkdir -p config/generators
  ```

- [ ] **1.7** Verificar estructura completa
  ```bash
  tree app/modules/flow-system
  ```

### ✅ Checklist de Verificación

- [ ] Todas las carpetas creadas
- [ ] Estructura visible en VS Code
- [ ] Sin errores de permisos

---

## Fase 2: Domain Layer - Value Objects

**Tiempo estimado:** 2 horas  
**Objetivo:** Crear los 3 Value Objects principales con validación

### Tareas

#### 2.1 FlowIdentity

- [ ] **2.1.1** Crear archivo `domain/value-objects/FlowIdentity.ts`
- [ ] **2.1.2** Copiar código de FlowIdentity (ver doc GUIA_PRACTICA)
- [ ] **2.1.3** Revisar validaciones:
  - [ ] ID no vacío
  - [ ] ID en formato kebab-case
  - [ ] ID max 50 caracteres
  - [ ] Label no vacío
  - [ ] Label min 3 caracteres
- [ ] **2.1.4** Testear FlowIdentity:

  ```typescript
  // Test válido
  const id1 = new FlowIdentity("datos-sociedad", "Datos de Sociedad");
  console.log(id1.toString());

  // Test inválido (debe fallar)
  try {
    const id2 = new FlowIdentity("", "Label");
  } catch (error) {
    console.log("✅ Validación funciona:", error.message);
  }
  ```

#### 2.2 FlowHierarchy

- [ ] **2.2.1** Crear archivo `domain/value-objects/FlowHierarchy.ts`
- [ ] **2.2.2** Copiar código de FlowHierarchy
- [ ] **2.2.3** Revisar validaciones:
  - [ ] Level debe ser 1, 2, 3 o 4
  - [ ] Order >= 1 y entero
  - [ ] Level 1 no puede tener padre
  - [ ] Level > 1 debe tener padre
- [ ] **2.2.4** Testear FlowHierarchy:

  ```typescript
  // Level 1 sin padre (válido)
  const h1 = new FlowHierarchy(1, 1);
  console.log(h1.isRoot()); // true

  // Level 2 con padre (válido)
  const h2 = new FlowHierarchy(2, 1, "padre-id");
  console.log(h2.isChildOf("padre-id")); // true
  ```

#### 2.3 FlowNavigation

- [ ] **2.3.1** Crear archivo `domain/value-objects/FlowNavigation.ts`
- [ ] **2.3.2** Copiar código de FlowNavigation
- [ ] **2.3.3** Revisar validaciones:
  - [ ] No puede tener path y href simultáneamente
  - [ ] Path debe empezar con /
  - [ ] Path no puede tener espacios
  - [ ] Href debe empezar con #
  - [ ] Href mínimo 2 caracteres
- [ ] **2.3.4** Testear FlowNavigation:

  ```typescript
  // Navegación por página (válido)
  const nav1 = FlowNavigation.fromPath("/registro/datos-sociedad");
  console.log(nav1.isPage()); // true

  // Navegación por ancla (válido)
  const nav2 = FlowNavigation.fromHref("#seccion-1");
  console.log(nav2.isAnchor()); // true

  // Sin navegación (válido)
  const nav3 = FlowNavigation.none();
  console.log(nav3.hasNavigation()); // false
  ```

### ✅ Checklist de Verificación

- [ ] FlowIdentity creado y validado
- [ ] FlowHierarchy creado y validado
- [ ] FlowNavigation creado y validado
- [ ] Todos los tests pasan
- [ ] Sin errores de TypeScript

---

## Fase 3: Domain Layer - Entities

**Tiempo estimado:** 2 horas  
**Objetivo:** Crear FlowItem y FlowConfig

### Tareas

#### 3.1 FlowItem Entity

- [ ] **3.1.1** Crear archivo `domain/entities/FlowItem.ts`
- [ ] **3.1.2** Copiar código de FlowItem (ver doc DDD_HEXAGONAL)
- [ ] **3.1.3** Verificar composición con Value Objects:
  - [ ] identity: FlowIdentity
  - [ ] hierarchy: FlowHierarchy
  - [ ] navigation: FlowNavigation
- [ ] **3.1.4** Verificar métodos:
  - [ ] setChildren()
  - [ ] addChild()
  - [ ] hasChildren()
  - [ ] isRoot()
  - [ ] getAllDescendants()
  - [ ] equals()
  - [ ] toJSON()
  - [ ] fromJSON()
- [ ] **3.1.5** Testear FlowItem:

  ```typescript
  const item = new FlowItem(
    new FlowIdentity("datos-sociedad", "Datos de Sociedad"),
    new FlowHierarchy(1, 1),
    FlowNavigation.fromPath("/registro/datos-sociedad"),
    { requiresCompletion: true }
  );

  console.log(item.toString());
  console.log("ID:", item.id);
  console.log("Label:", item.label);
  console.log("Level:", item.level);
  console.log("Is Root:", item.isRoot());
  ```

#### 3.2 FlowConfig Aggregate Root

- [ ] **3.2.1** Crear archivo `domain/entities/FlowConfig.ts`
- [ ] **3.2.2** Copiar código de FlowConfig
- [ ] **3.2.3** Verificar validaciones:
  - [ ] ID no vacío
  - [ ] Name no vacío
  - [ ] Sin IDs duplicados
  - [ ] Orden secuencial válido
- [ ] **3.2.4** Verificar métodos de búsqueda:
  - [ ] getItemById()
  - [ ] getItemByPath()
  - [ ] getItemsByLevel()
  - [ ] getRootItems()
- [ ] **3.2.5** Verificar métodos de navegación:
  - [ ] getNextItem()
  - [ ] getPreviousItem()
  - [ ] getAllItemsFlat()
  - [ ] isFirstItem()
  - [ ] isLastItem()
- [ ] **3.2.6** Testear FlowConfig:

  ```typescript
  const config = new FlowConfig("registro", "Registro", "sequential", [item1, item2, item3]);

  console.log("Total steps:", config.totalSteps);
  console.log("Next item:", config.getNextItem("datos-sociedad")?.label);
  console.log("Is first:", config.isFirstItem("datos-sociedad"));
  ```

### ✅ Checklist de Verificación

- [ ] FlowItem creado y funcional
- [ ] FlowConfig creado y funcional
- [ ] Validaciones funcionan correctamente
- [ ] Navegación automática funciona
- [ ] Serialización/deserialización funciona
- [ ] Todos los tests pasan

---

## Fase 4: Config Layer - Crear Flujos

**Tiempo estimado:** 3 horas  
**Objetivo:** Crear los 3 flujos principales

### Tareas

#### 4.1 Flujo Registro de Sociedades

- [ ] **4.1.1** Crear archivo `config/flows/registro-sociedades.flow.ts`
- [ ] **4.1.2** Importar clases necesarias:
  ```typescript
  import { FlowItem } from "../../domain/entities/FlowItem";
  import { FlowConfig } from "../../domain/entities/FlowConfig";
  import { FlowIdentity } from "../../domain/value-objects/FlowIdentity";
  import { FlowHierarchy } from "../../domain/value-objects/FlowHierarchy";
  import { FlowNavigation } from "../../domain/value-objects/FlowNavigation";
  ```
- [ ] **4.1.3** Crear los 10 FlowItems:
  - [ ] Item 1: Datos de Sociedad
  - [ ] Item 2: Datos de Socios
  - [ ] Item 3: Representantes Legales
  - [ ] Item 4: Capital Social
  - [ ] Item 5: Acciones
  - [ ] Item 6: Asignación de Acciones
  - [ ] Item 7: Directorio
  - [ ] Item 8: Registro de Apoderados
  - [ ] Item 9: Régimen General de Poderes
  - [ ] Item 10: Quorum y Mayorías
- [ ] **4.1.4** Crear función `getRegistroSociedadesFlow()`:
  ```typescript
  export function getRegistroSociedadesFlow(): FlowConfig {
    return new FlowConfig(
      "registro-sociedades",
      "Registro de Sociedades",
      "sequential",
      [item1, item2, ..., item10],
      "Flujo completo para registro de sociedades"
    );
  }
  ```
- [ ] **4.1.5** Testear el flujo:
  ```typescript
  const flow = getRegistroSociedadesFlow();
  console.log("Total steps:", flow.totalSteps); // 10
  console.log("First item:", flow.getRootItems()[0].label);
  console.log("Next from first:", flow.getNextItem("datos-sociedad")?.label);
  ```

#### 4.2 Flujo Juntas de Accionistas (Jerárquico)

- [ ] **4.2.1** Crear archivo `config/flows/juntas-accionistas.flow.ts`
- [ ] **4.2.2** Crear estructura jerárquica (4 niveles):
  ```
  L1: Juntas (sin path, contenedor)
    L2: Convocatoria (path)
      L3: Tipo de Convocatoria (href)
      L3: Fecha y Hora (href)
    L2: Desarrollo (path)
      L3: Asistencia (href)
      L3: Votaciones (href)
    L2: Acuerdos (path)
      L3: Listado (href)
      L3: Aprobación (href)
    L2: Acta (path)
  ```
- [ ] **4.2.3** Implementar items de nivel 1:
  - [ ] Item raíz: "Juntas"
- [ ] **4.2.4** Implementar items de nivel 2:
  - [ ] Convocatoria
  - [ ] Desarrollo
  - [ ] Acuerdos
  - [ ] Acta
- [ ] **4.2.5** Implementar items de nivel 3:
  - [ ] Tipo de Convocatoria
  - [ ] Fecha y Hora
  - [ ] Asistencia
  - [ ] Votaciones
  - [ ] Listado
  - [ ] Aprobación
- [ ] **4.2.6** Establecer relaciones padre-hijo:

  ```typescript
  // Nivel 2 tiene hijos nivel 3
  convocatoriaItem.setChildren([tipoItem, fechaItem]);
  desarrolloItem.setChildren([asistenciaItem, votacionesItem]);
  acuerdosItem.setChildren([listadoItem, aprobacionItem]);

  // Nivel 1 tiene hijos nivel 2
  juntasItem.setChildren([convocatoriaItem, desarrolloItem, acuerdosItem, actaItem]);
  ```

- [ ] **4.2.7** Crear función `getJuntasAccionistasFlow()`
- [ ] **4.2.8** Testear jerarquía:
  ```typescript
  const flow = getJuntasAccionistasFlow();
  const rootItem = flow.getRootItems()[0];
  console.log("Root:", rootItem.label);
  console.log("Children:", rootItem.children.length); // 4
  console.log("First child:", rootItem.children[0].label);
  console.log("Grandchildren:", rootItem.children[0].children.length); // 2
  ```

#### 4.3 Flujo Sucursales (Simple)

- [ ] **4.3.1** Crear archivo `config/flows/sucursales.flow.ts`
- [ ] **4.3.2** Crear 4 FlowItems:
  - [ ] Información General
  - [ ] Ubicación
  - [ ] Responsable
  - [ ] Documentación
- [ ] **4.3.3** Crear función `getSucursalesFlow()`
- [ ] **4.3.4** Testear flujo simple:
  ```typescript
  const flow = getSucursalesFlow();
  console.log("Total steps:", flow.totalSteps); // 4
  ```

### ✅ Checklist de Verificación

- [ ] Registro flow creado (10 items)
- [ ] Juntas flow creado (jerárquico 4 niveles)
- [ ] Sucursales flow creado (4 items)
- [ ] Todos los flujos se instancian correctamente
- [ ] Navegación funciona en cada flujo
- [ ] Jerarquías correctas en Juntas flow

---

## Fase 5: Application Layer - Composables

**Tiempo estimado:** 3 horas  
**Objetivo:** Crear composables para casos de uso

### Tareas

#### 5.1 useFlowNavigation

- [ ] **5.1.1** Crear archivo `application/composables/useFlowNavigation.ts`
- [ ] **5.1.2** Implementar composable:

  ```typescript
  import { ref, computed } from "vue";
  import type { FlowConfig, FlowItem } from "~/modules/flow-system/domain/entities";

  export function useFlowNavigation(flowConfig: FlowConfig) {
    const currentItemId = ref<string | null>(null);

    const currentItem = computed(() => {
      if (!currentItemId.value) return null;
      return flowConfig.getItemById(currentItemId.value) ?? null;
    });

    const nextItem = computed(() => {
      if (!currentItemId.value) return null;
      return flowConfig.getNextItem(currentItemId.value);
    });

    const previousItem = computed(() => {
      if (!currentItemId.value) return null;
      return flowConfig.getPreviousItem(currentItemId.value);
    });

    const canGoNext = computed(() => nextItem.value !== null);
    const canGoPrevious = computed(() => previousItem.value !== null);

    const isFirst = computed(() => {
      if (!currentItemId.value) return false;
      return flowConfig.isFirstItem(currentItemId.value);
    });

    const isLast = computed(() => {
      if (!currentItemId.value) return false;
      return flowConfig.isLastItem(currentItemId.value);
    });

    function navigateTo(itemId: string) {
      const item = flowConfig.getItemById(itemId);
      if (!item) {
        console.error(`Item ${itemId} no encontrado`);
        return;
      }
      currentItemId.value = itemId;
    }

    function goNext() {
      if (nextItem.value) {
        navigateTo(nextItem.value.id);
      }
    }

    function goPrevious() {
      if (previousItem.value) {
        navigateTo(previousItem.value.id);
      }
    }

    return {
      currentItem,
      nextItem,
      previousItem,
      canGoNext,
      canGoPrevious,
      isFirst,
      isLast,
      navigateTo,
      goNext,
      goPrevious,
    };
  }
  ```

- [ ] **5.1.3** Testear useFlowNavigation:

  ```typescript
  const flow = getRegistroSociedadesFlow();
  const { currentItem, nextItem, goNext, canGoNext } = useFlowNavigation(flow);

  // Navegar al primer item
  navigateTo("datos-sociedad");
  console.log("Current:", currentItem.value?.label);
  console.log("Next:", nextItem.value?.label);
  console.log("Can go next:", canGoNext.value);

  // Navegar al siguiente
  goNext();
  console.log("After goNext:", currentItem.value?.label);
  ```

#### 5.2 useFlowProgress

- [ ] **5.2.1** Crear archivo `application/composables/useFlowProgress.ts`
- [ ] **5.2.2** Implementar cálculo de progreso:

  ```typescript
  import { computed } from "vue";
  import type { FlowConfig } from "~/modules/flow-system/domain/entities";
  import { useFlowStateStore } from "~/modules/flow-system/infrastructure/stores/useFlowStateStore";

  export function useFlowProgress(flowConfig: FlowConfig) {
    const store = useFlowStateStore();

    const totalSteps = computed(() => flowConfig.totalSteps);

    const completedSteps = computed(() => {
      return flowConfig.getAllItemsFlat().filter((item) => store.isItemCompleted(item.id))
        .length;
    });

    const progress = computed(() => {
      if (totalSteps.value === 0) return 0;
      return Math.round((completedSteps.value / totalSteps.value) * 100);
    });

    const isFlowCompleted = computed(() => {
      return completedSteps.value === totalSteps.value;
    });

    return {
      totalSteps,
      completedSteps,
      progress,
      isFlowCompleted,
    };
  }
  ```

#### 5.3 useFlowState

- [ ] **5.3.1** Crear archivo `application/composables/useFlowState.ts`
- [ ] **5.3.2** Implementar gestión de estado:

  ```typescript
  import { useFlowStateStore } from "~/modules/flow-system/infrastructure/stores/useFlowStateStore";
  import type { FlowConfig } from "~/modules/flow-system/domain/entities";

  export function useFlowState(flowConfig: FlowConfig) {
    const store = useFlowStateStore();

    function initializeFlow() {
      store.setCurrentFlow(flowConfig.id);
    }

    function setCurrentItem(itemId: string) {
      store.setCurrentItem(itemId);
    }

    function markItemCompleted(itemId: string) {
      store.markItemCompleted(itemId);
    }

    function isItemCompleted(itemId: string): boolean {
      return store.isItemCompleted(itemId);
    }

    function resetFlow() {
      store.resetFlow();
    }

    return {
      initializeFlow,
      setCurrentItem,
      markItemCompleted,
      isItemCompleted,
      resetFlow,
    };
  }
  ```

### ✅ Checklist de Verificación

- [ ] useFlowNavigation creado y funcional
- [ ] useFlowProgress creado y funcional
- [ ] useFlowState creado y funcional
- [ ] Todos los composables usan el store correctamente
- [ ] Tests de integración pasan

---

## Fase 6: Infrastructure Layer - Store

**Tiempo estimado:** 2 horas  
**Objetivo:** Crear Pinia Store para estado global

### Tareas

#### 6.1 Crear Pinia Store

- [ ] **6.1.1** Crear archivo `infrastructure/stores/useFlowStateStore.ts`
- [ ] **6.1.2** Implementar store:

  ```typescript
  import { defineStore } from "pinia";
  import { ref, computed } from "vue";

  export const useFlowStateStore = defineStore("flowState", () => {
    // Estado
    const currentFlowId = ref<string | null>(null);
    const currentItemId = ref<string | null>(null);
    const completedItemIds = ref<Set<string>>(new Set());
    const itemData = ref<Map<string, any>>(new Map());

    // Getters
    const progress = computed(() => {
      // Calcular progreso basado en items completados
      return 0; // Placeholder
    });

    // Actions
    function setCurrentFlow(flowId: string) {
      currentFlowId.value = flowId;
    }

    function setCurrentItem(itemId: string) {
      currentItemId.value = itemId;
    }

    function markItemCompleted(itemId: string) {
      completedItemIds.value.add(itemId);
    }

    function isItemCompleted(itemId: string): boolean {
      return completedItemIds.value.has(itemId);
    }

    function setItemData(itemId: string, data: any) {
      itemData.value.set(itemId, data);
    }

    function getItemData(itemId: string): any {
      return itemData.value.get(itemId);
    }

    function resetFlow() {
      currentFlowId.value = null;
      currentItemId.value = null;
      completedItemIds.value.clear();
      itemData.value.clear();
    }

    return {
      // State
      currentFlowId,
      currentItemId,
      completedItemIds,
      itemData,
      // Getters
      progress,
      // Actions
      setCurrentFlow,
      setCurrentItem,
      markItemCompleted,
      isItemCompleted,
      setItemData,
      getItemData,
      resetFlow,
    };
  });
  ```

#### 6.2 Persistencia LocalStorage

- [ ] **6.2.1** Crear archivo `infrastructure/persistence/LocalStoragePersistence.ts`
- [ ] **6.2.2** Implementar persistencia:
  ```typescript
  export class LocalStoragePersistence {
    private readonly STORAGE_KEY = "flow-state";

    save(flowId: string, data: any): void {
      try {
        const existing = this.load(flowId) || {};
        const updated = { ...existing, ...data };
        localStorage.setItem(`${this.STORAGE_KEY}-${flowId}`, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }

    load(flowId: string): any | null {
      try {
        const data = localStorage.getItem(`${this.STORAGE_KEY}-${flowId}`);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        return null;
      }
    }

    clear(flowId: string): void {
      try {
        localStorage.removeItem(`${this.STORAGE_KEY}-${flowId}`);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
  }
  ```

### ✅ Checklist de Verificación

- [ ] Pinia Store creado
- [ ] Store guarda estado correctamente
- [ ] Store recupera estado correctamente
- [ ] Persistencia localStorage funciona
- [ ] Store se resetea correctamente

---

## Fase 7: Presentation Layer - Componentes

**Tiempo estimado:** 4 horas  
**Objetivo:** Actualizar componentes UI para usar FlowConfig

### Tareas

#### 7.1 Actualizar UniversalFlowLayout

- [ ] **7.1.1** Abrir `presentation/components/UniversalFlowLayout.vue`
- [ ] **7.1.2** Añadir prop `flowConfig`:

  ```typescript
  interface Props {
    flowConfig: FlowConfig;
  }

  const props = defineProps<Props>();
  ```

- [ ] **7.1.3** Usar composables:

  ```typescript
  const { currentItem, nextItem, previousItem, canGoNext, canGoPrevious } = useFlowNavigation(
    props.flowConfig
  );

  const { progress, totalSteps, completedSteps } = useFlowProgress(props.flowConfig);
  ```

#### 7.2 Actualizar FlowSidebar

- [ ] **7.2.1** Abrir `presentation/components/FlowSidebar.vue`
- [ ] **7.2.2** Actualizar props:
  ```typescript
  interface Props {
    items: readonly FlowItem[];
    currentItemId?: string;
  }
  ```
- [ ] **7.2.3** Renderizar usando FlowItem properties:
  ```vue
  <template>
    <div v-for="item in items" :key="item.id">
      <FlowSidebarItem
        :item="item"
        :is-active="item.id === currentItemId"
        @click="$emit('navigate', item.id)"
      />
    </div>
  </template>
  ```

#### 7.3 Actualizar FlowSidebarItem

- [ ] **7.3.1** Abrir `presentation/components/FlowSidebarItem.vue`
- [ ] **7.3.2** Actualizar props:
  ```typescript
  interface Props {
    item: FlowItem;
    isActive: boolean;
  }
  ```
- [ ] **7.3.3** Usar propiedades agrupadas:
  ```vue
  <template>
    <div :class="{ active: isActive }">
      <Icon :name="item.identity.icon" />
      <span>{{ item.identity.label }}</span>
      <Badge v-if="item.identity.badge">
        {{ item.identity.badge }}
      </Badge>
    </div>
  </template>
  ```

#### 7.4 Crear FlowNavigationButtons

- [ ] **7.4.1** Crear archivo `presentation/components/FlowNavigationButtons.vue`
- [ ] **7.4.2** Implementar componente:

  ```vue
  <script setup lang="ts">
    interface Props {
      canGoPrevious: boolean;
      canGoNext: boolean;
      previousLabel?: string;
      nextLabel?: string;
    }

    const props = defineProps<Props>();
    const emit = defineEmits<{
      previous: [];
      next: [];
    }>();
  </script>

  <template>
    <div class="flex justify-between">
      <button :disabled="!canGoPrevious" @click="emit('previous')" class="btn-secondary">
        ← {{ previousLabel || "Anterior" }}
      </button>

      <button :disabled="!canGoNext" @click="emit('next')" class="btn-primary">
        {{ nextLabel || "Siguiente" }} →
      </button>
    </div>
  </template>
  ```

### ✅ Checklist de Verificación

- [ ] UniversalFlowLayout actualizado
- [ ] FlowSidebar actualizado
- [ ] FlowSidebarItem actualizado
- [ ] FlowNavigationButtons creado
- [ ] Todos los componentes usan FlowItem properties correctamente
- [ ] No hay errores de TypeScript

---

## Fase 8: Integración

**Tiempo estimado:** 2 horas  
**Objetivo:** Integrar todo en los layouts

### Tareas

#### 8.1 Actualizar flow-layout.vue

- [ ] **8.1.1** Abrir `presentation/layouts/flow-layout.vue`
- [ ] **8.1.2** Importar flujo:

  ```typescript
  import { getRegistroSociedadesFlow } from "~/modules/flow-system/config/flows/registro-sociedades.flow";

  const flowConfig = getRegistroSociedadesFlow();
  ```

- [ ] **8.1.3** Usar composables:

  ```typescript
  const {
    currentItem,
    nextItem,
    previousItem,
    canGoNext,
    canGoPrevious,
    goNext,
    goPrevious,
    navigateTo,
  } = useFlowNavigation(flowConfig);

  const { initializeFlow } = useFlowState(flowConfig);

  onMounted(() => {
    initializeFlow();
  });
  ```

- [ ] **8.1.4** Pasar props a UniversalFlowLayout:
  ```vue
  <template>
    <UniversalFlowLayout :flow-config="flowConfig">
      <!-- ... -->
    </UniversalFlowLayout>
  </template>
  ```

#### 8.2 Configurar páginas

- [ ] **8.2.1** Verificar que las páginas usan `definePageMeta`:
  ```typescript
  definePageMeta({
    layout: "flow-layout",
  });
  ```

#### 8.3 Testear navegación

- [ ] **8.3.1** Iniciar dev server:
  ```bash
  npm run dev
  ```
- [ ] **8.3.2** Navegar a primera página del flujo
- [ ] **8.3.3** Verificar que sidebar muestra todos los items
- [ ] **8.3.4** Click en "Siguiente"
- [ ] **8.3.5** Verificar navegación a segunda página
- [ ] **8.3.6** Verificar que botón "Anterior" funciona

### ✅ Checklist de Verificación

- [ ] flow-layout.vue integrado
- [ ] Páginas configuradas correctamente
- [ ] Navegación funciona
- [ ] Sidebar muestra items correctamente
- [ ] Botones Anterior/Siguiente funcionan
- [ ] Estado se persiste (recargar página mantiene estado)

---

## Fase 9: Testing

**Tiempo estimado:** 2 horas  
**Objetivo:** Crear tests automatizados

### Tareas

#### 9.1 Tests Unitarios - Value Objects

- [ ] **9.1.1** Crear `domain/value-objects/__tests__/FlowIdentity.spec.ts`
- [ ] **9.1.2** Crear tests:

  ```typescript
  import { describe, it, expect } from "vitest";
  import { FlowIdentity } from "../FlowIdentity";

  describe("FlowIdentity", () => {
    it("debería crear identidad válida", () => {
      const identity = new FlowIdentity("datos-sociedad", "Datos de Sociedad");
      expect(identity.id).toBe("datos-sociedad");
      expect(identity.label).toBe("Datos de Sociedad");
    });

    it("debería fallar con ID vacío", () => {
      expect(() => new FlowIdentity("", "Label")).toThrow();
    });

    it("debería fallar con ID en formato incorrecto", () => {
      expect(() => new FlowIdentity("DatosSociedad", "Label")).toThrow();
    });
  });
  ```

- [ ] **9.1.3** Repetir para FlowHierarchy
- [ ] **9.1.4** Repetir para FlowNavigation

#### 9.2 Tests Unitarios - Entities

- [ ] **9.2.1** Crear `domain/entities/__tests__/FlowItem.spec.ts`
- [ ] **9.2.2** Crear tests para FlowItem
- [ ] **9.2.3** Crear `domain/entities/__tests__/FlowConfig.spec.ts`
- [ ] **9.2.4** Crear tests para FlowConfig

#### 9.3 Tests de Integración - Composables

- [ ] **9.3.1** Crear `application/composables/__tests__/useFlowNavigation.spec.ts`
- [ ] **9.3.2** Testear navegación completa
- [ ] **9.3.3** Testear casos extremos (primer/último item)

### ✅ Checklist de Verificación

- [ ] Tests para Value Objects creados
- [ ] Tests para Entities creados
- [ ] Tests para Composables creados
- [ ] Todos los tests pasan
- [ ] Cobertura >= 80%

---

## Fase 10: Documentación

**Tiempo estimado:** 1 hora  
**Objetivo:** Documentar el sistema

### Tareas

- [ ] **10.1** Crear `README_FLOW_SYSTEM.md` con:
  - [ ] Descripción del sistema
  - [ ] Cómo crear un nuevo flujo
  - [ ] Ejemplos de uso
  - [ ] Troubleshooting
- [ ] **10.2** Añadir comentarios JSDoc a todas las clases públicas
- [ ] **10.3** Crear diagrama de arquitectura actualizado
- [ ] **10.4** Actualizar `ARCHITECTURE.md` principal

### ✅ Checklist de Verificación

- [ ] README creado
- [ ] Ejemplos funcionan
- [ ] JSDoc completo
- [ ] Diagramas actualizados

---

## 📊 Resumen de Progreso

### Horas totales: 22 horas (~3 días)

| Fase              | Tiempo | Estado |
| ----------------- | ------ | ------ |
| 1. Setup          | 1h     | ⬜     |
| 2. Value Objects  | 2h     | ⬜     |
| 3. Entities       | 2h     | ⬜     |
| 4. Flujos         | 3h     | ⬜     |
| 5. Composables    | 3h     | ⬜     |
| 6. Store          | 2h     | ⬜     |
| 7. Componentes    | 4h     | ⬜     |
| 8. Integración    | 2h     | ⬜     |
| 9. Testing        | 2h     | ⬜     |
| 10. Documentación | 1h     | ⬜     |

**Progreso:** 0% (0/10 fases completadas)

---

## 🎯 Próximo Paso

**Empieza con Fase 1: Setup Inicial**

```bash
# Comando para empezar
cd app
mkdir -p modules/flow-system
```

¡Éxito! 🚀
