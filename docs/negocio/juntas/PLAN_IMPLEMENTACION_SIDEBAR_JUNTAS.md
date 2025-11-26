# 🎯 Plan de Implementación: Sidebar Flow Layout Juntas de Accionistas

## 📋 Objetivo

Implementar el sistema completo de sidebar y navegación para el flujo de Juntas de Accionistas, basado en:

- ✅ Flow Layout de Sociedades (documentado)
- ✅ Análisis de probo-figma-ai (React/TSX)
- ✅ Arquitectura hexagonal del proyecto

---

## 1️⃣ INVESTIGACIÓN: Documentos Utilizados

### **Documentos de Referencia**

#### **1.1. Flow Layout Sociedades**

- **Ubicación**: `docs/negocio/registros/sociedades/FLOW_LAYOUT_SOCIEDADES.md`
- **Contenido Clave**:
  - ✅ Estructura de layouts anidados
  - ✅ Componentes: `ProgressNavBar`, `HeaderProgressNavbar`, `CheckIcon`
  - ✅ Composables: `useProgressNavbarRoutes`, `useFlowLayoutNext`
  - ✅ Stores: `useProgressNavbarStore`, `useFlowLayoutStore`
  - ✅ Configuración: `progress-navbar-map.ts`, `society-register-navigation.ts`
  - ✅ Sistema de rutas y navegación

#### **1.2. Flow Layout Juntas (Análisis)**

- **Ubicación**: `docs/negocio/juntas/FLOW_LAYOUT_JUNTAS_ANALISIS.md`
- **Contenido Clave**:
  - ✅ Sistema de 3 niveles de navegación
  - ✅ Componentes: `SingleWizardSidebar`, `WizardRightSidebar`
  - ✅ Sistema de sub-steps dinámicos
  - ✅ Estilos y variables CSS
  - ✅ Mapeo de rutas

#### **1.3. Arquitectura de Sociedades (Paso a Paso)**

- **Ubicación**: `docs/negocio/registros/sociedades/pasos/`
- **Contenido Clave**:
  - ✅ Patrones de componentes reutilizables
  - ✅ Estructura Domain/Application/Infrastructure/Presentation
  - ✅ Stores con Option API

#### **1.4. Referencia Temporal**

- **Ubicación**: `docs/referencia-temporal/`
- **Archivos Relevantes**:
  - `DOCS_WIZARD_SIDEBAR.md` - Documentación del sistema wizard
  - `SIDEBAR_DINAMICO_IMPLEMENTADO.md` - Sistema de sub-steps dinámicos
  - `SISTEMA_SNAPSHOT_IMPLEMENTADO.md` - Sistema de snapshot

#### **1.5. Código Fuente de Referencia**

- **probo-figma-ai** (React/TSX):

  - `src/components/SingleWizardSidebar.tsx`
  - `src/components/WizardRightSidebar.tsx`
  - `src/components/FlujoWizardView.tsx`
  - `src/data/flujoSteps.ts`

- **Proyecto Actual (Nuxt/Vue)**:
  - `app/layouts/flow-layout.vue`
  - `app/components/flow-layout/ProgressNavBar.vue`
  - `app/components/flow-layout/CheckIcon.vue`
  - `app/composables/useProgressNavbarRoutes.ts`
  - `app/stores/useProgressNavbarStore.ts`

---

## 2️⃣ ARCHIVOS QUE SE CREARÁN O LÓGICA

### **2.1. Componentes Vue (Nuevos)**

#### **A. `SingleWizardSidebarJuntas.vue`**

**Ubicación**: `app/components/flow-layout-juntas/SingleWizardSidebarJuntas.vue`

**Propósito**: Sidebar izquierdo con pasos principales y sub-steps colapsables.

**Props**:

```typescript
interface Props {
  steps: WizardStep[];
  currentStepId: string;
  currentSubStepId?: string;
  onStepClick?: (stepId: string) => void;
  onSubStepClick?: (subStepId: string) => void;
  title: string;
  icon?: string;
  progress: { current: number; total: number };
}
```

**Características**:

- ✅ Ancho fijo: `320px` (w-80)
- ✅ Header con ícono, título y progreso
- ✅ Barra de progreso visual
- ✅ Lista de pasos con estados (completed/current/upcoming)
- ✅ Sub-steps colapsables agrupados por categoría
- ✅ Líneas conectoras verticales

**Reutiliza**:

- ✅ `CheckIcon.vue` (del flow-layout de sociedades)
- ✅ Estilos y colores de sociedades

---

#### **B. `WizardRightSidebar.vue`**

**Ubicación**: `app/components/flow-layout-juntas/WizardRightSidebar.vue`

**Propósito**: Sidebar derecho con secciones dentro de un sub-step.

**Props**:

```typescript
interface Props {
  sections: SectionItem[];
  currentSectionId: string;
  onSectionClick: (sectionId: string) => void;
  title?: string;
}
```

**Características**:

- ✅ Ancho fijo: `360px`
- ✅ Solo visible cuando `hasRightSidebar === true`
- ✅ Lista de secciones con estados
- ✅ Líneas conectoras verticales

---

#### **C. `ProgressBarJuntas.vue`** (Nuevo)

**Ubicación**: `app/components/flow-layout-juntas/ProgressBarJuntas.vue`

**Propósito**: Barra de progreso visual (no existe en sociedades).

**Props**:

```typescript
interface Props {
  current: number;
  total: number;
}
```

**Características**:

- ✅ Barra de progreso horizontal
- ✅ Porcentaje visual
- ✅ Animación de transición

---

#### **D. `HeaderJuntasNavbar.vue`**

**Ubicación**: `app/components/flow-layout-juntas/HeaderJuntasNavbar.vue`

**Propósito**: Header superior con breadcrumbs y botones de acción.

**Props**:

```typescript
interface Props {
  steps: NavigationStep[];
  currentStepIndex: number;
  onBack?: () => void;
  onSave?: () => void;
  onReset?: () => void;
}
```

**Características**:

- ✅ Botón "Salir" (volver)
- ✅ Título del paso actual
- ✅ Breadcrumbs
- ✅ Botones de acción (Guardar, Restablecer)

---

### **2.2. Layout (Actualizar)**

#### **A. `flow-layout-juntas.vue`** (Actualizar)

**Ubicación**: `app/layouts/flow-layout-juntas.vue`

**Cambios**:

- ✅ Integrar `SingleWizardSidebarJuntas`
- ✅ Integrar `WizardRightSidebar` (condicional)
- ✅ Integrar `HeaderJuntasNavbar`
- ✅ Integrar `ProgressBarJuntas`
- ✅ Footer con botón "Siguiente"
- ✅ Lógica para mostrar/ocultar sidebar derecho

**Estructura**:

```vue
<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <HeaderJuntasNavbar ... />

    <!-- Body -->
    <div class="flex min-h-0 flex-1">
      <!-- Sidebar Izquierdo -->
      <SingleWizardSidebarJuntas ... />

      <!-- Contenido + Sidebar Derecho -->
      <div class="flex-1 flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <div v-if="hasRightSidebar" class="flex h-full">
            <div class="flex-1">
              <slot />
            </div>
            <WizardRightSidebar ... />
          </div>
          <div v-else>
            <slot />
          </div>
        </div>

        <!-- Footer -->
        <div class="h-[92px] border-t ...">
          <ActionButton label="Siguiente" @click="handleNext" />
        </div>
      </div>
    </div>
  </div>
</template>
```

---

### **2.3. Composables (Nuevos/Adaptar)**

#### **A. `useJuntasNavbarRoutes.ts`** (Nuevo)

**Ubicación**: `app/composables/useJuntasNavbarRoutes.ts`

**Propósito**: Detecta la ruta actual y carga los pasos de juntas.

**Lógica**:

```typescript
export const useJuntasNavbarRoutes = () => {
  const route = useRoute();
  const juntasNavbarStore = useJuntasNavbarStore();
  const juntasFlowStore = useJuntasFlowStore();

  // Extraer juntaId de la ruta
  const extractJuntaId = (): string | undefined => {
    // Similar a extractSocietyId
  };

  // Determinar contexto
  const resolveContext = (): JuntaNavigationContext => {
    // Similar a resolveContext de sociedades
  };

  // Watch la ruta y actualizar pasos
  watch(
    () => route.path,
    (newPath) => {
      const context = resolveContext();
      // Filtrar sub-steps dinámicamente
      const steps = juntaNavigation(context);
      juntasNavbarStore.setSteps(steps);
    },
    { immediate: true }
  );

  // Calcular índices
  const currentStepIndex = computed(() => {
    return juntasNavbarStore.steps.findIndex((step) => step.route === route.path);
  });

  const currentSubStepId = computed(() => {
    // Extraer de la ruta si estamos en un sub-step
  });

  return {
    steps: juntasNavbarStore.steps,
    currentStepIndex,
    currentSubStepId,
  };
};
```

---

#### **B. `useJuntasFlowNext.ts`** (Nuevo)

**Ubicación**: `app/composables/useJuntasFlowNext.ts`

**Propósito**: Configura el handler del botón "Siguiente" para juntas.

**Lógica**: Similar a `useFlowLayoutNext` pero adaptado para juntas.

---

### **2.4. Stores (Nuevos)**

#### **A. `useJuntasNavbarStore.ts`** (Nuevo)

**Ubicación**: `app/stores/useJuntasNavbarStore.ts`

**Propósito**: Almacena los pasos de navegación de juntas.

**Estructura**:

```typescript
export const useJuntasNavbarStore = defineStore("juntasNavbar", {
  state: (): State => ({
    steps: [],
  }),
  actions: {
    setSteps(newSteps: NavigationStep[]) {
      this.steps = newSteps;
    },
    getNextStepByCurrentStep(currentStep: string) {
      // Similar a useProgressNavbarStore
    },
  },
});
```

---

#### **B. `useJuntasFlowStore.ts`** (Nuevo)

**Ubicación**: `app/stores/useJuntasFlowStore.ts`

**Propósito**: Gestiona el estado del flujo de juntas (sub-steps dinámicos, secciones).

**Estructura**:

```typescript
export const useJuntasFlowStore = defineStore("juntasFlow", {
  state: () => ({
    selectedSubSteps: [] as string[], // Sub-steps seleccionados en Paso 1
    currentStepId: "",
    currentSubStepId: "",
    currentSectionId: "",
    isLoading: false,
    onClickNext: () => {},
  }),
  getters: {
    getDynamicSubSteps: (state) => state.selectedSubSteps,
    hasRightSidebar: (state) => !!state.currentSubStepId,
  },
  actions: {
    updateDynamicSubSteps(subStepIds: string[]) {
      this.selectedSubSteps = subStepIds;
    },
    setCurrentStep(stepId: string) {
      this.currentStepId = stepId;
    },
    setCurrentSubStep(subStepId: string) {
      this.currentSubStepId = subStepId;
    },
    setCurrentSection(sectionId: string) {
      this.currentSectionId = sectionId;
    },
    clearValues() {
      this.isLoading = false;
      this.onClickNext = () => {};
    },
  },
});
```

---

### **2.5. Configuración (Nuevos)**

#### **A. `junta-navigation.ts`** (Nuevo)

**Ubicación**: `app/config/junta-navigation.ts`

**Propósito**: Define los 6 pasos del flujo de juntas con sub-steps.

**Estructura**:

```typescript
const BASE_STEPS = [
  {
    slug: "seleccion-agenda",
    title: "Puntos de Agenda",
    description: "Selecciona los puntos a incluir en la junta",
    status: "completed",
  },
  {
    slug: "detalles-junta",
    title: "Detalles de la Junta",
    description: "Completa la información de la Junta",
    status: "completed",
  },
  // ... 4 pasos más
];

const BASE_SUB_STEPS = [
  {
    id: "aporte-dinerarios",
    title: "Aporte Dinerario",
    category: "Aumento de Capital",
    parentSlug: "puntos-acuerdo",
  },
  // ... más sub-steps
];

export const juntaNavigation = (context: JuntaNavigationContext): NavigationStep[] => {
  const juntasFlowStore = useJuntasFlowStore();
  const dynamicSubSteps = juntasFlowStore.getDynamicSubSteps;

  return BASE_STEPS.map((step) => {
    // Si es "puntos-acuerdo", filtrar sub-steps
    if (step.slug === "puntos-acuerdo") {
      const filteredSubSteps = BASE_SUB_STEPS.filter(
        (sub) => sub.parentSlug === "puntos-acuerdo"
      )
        .filter((sub) => dynamicSubSteps.includes(sub.id))
        .map((sub) => ({
          ...sub,
          route: buildSubStepRoute(sub.id, context),
        }));

      return {
        ...step,
        route: buildRoute(step.slug, context),
        subSteps: filteredSubSteps,
      };
    }

    return {
      ...step,
      route: buildRoute(step.slug, context),
    };
  });
};
```

---

#### **B. `progress-navbar-map.ts`** (Actualizar)

**Ubicación**: `app/config/progress-navbar-map.ts`

**Cambios**: Agregar regla para juntas.

```typescript
export const routeMap: RouteRule[] = [
  // ... reglas existentes de sociedades
  {
    match: (path: string) => path.includes("/operaciones/junta-accionistas"),
    getSteps: (context) =>
      juntaNavigation({
        base: "operaciones",
        juntaId: context.juntaId,
        flow: context.flow,
      }),
  },
];
```

---

### **2.6. Tipos TypeScript (Nuevos/Actualizar)**

#### **A. `navigationSteps.ts`** (Actualizar)

**Ubicación**: `app/types/navigationSteps.ts`

**Cambios**: Agregar soporte para sub-steps.

```typescript
export interface NavigationStep {
  title: string;
  description: string;
  status: "completed" | "current" | "empty" | "optional" | "in-progress" | "locked" | "error";
  route: string;
  hash?: string;
  isCategory?: boolean;
  level?: number;
  subSteps?: NavigationSubStep[]; // ⭐ NUEVO
}

export interface NavigationSubStep {
  // ⭐ NUEVO
  id: string;
  title: string;
  category?: string;
  status?: "completed" | "current" | "empty";
  route: string;
}
```

---

#### **B. `junta-navigation.types.ts`** (Nuevo)

**Ubicación**: `app/types/junta-navigation.types.ts`

**Propósito**: Tipos específicos para navegación de juntas.

```typescript
export interface JuntaNavigationContext {
  base: "operaciones";
  juntaId?: string;
  flow?: "crear" | "editar";
}

export interface SectionItem {
  id: string;
  title: string;
  description?: string;
  status?: "current" | "upcoming" | "completed";
}
```

---

## 3️⃣ PLANTEAMIENTO DE PROBLEMAS O RETOS

### **Problema 1: Sistema de Sub-Steps Dinámicos**

**Descripción**:
Los sub-steps del Paso 4 (Puntos de Acuerdo) deben aparecer/desaparecer dinámicamente según lo seleccionado en el Paso 1 (Puntos de Agenda).

**Retos**:

- ❌ Cómo almacenar los sub-steps seleccionados en Paso 1
- ❌ Cómo filtrar los sub-steps en tiempo real
- ❌ Cómo sincronizar el estado entre Paso 1 y Paso 4
- ❌ Cómo mantener el estado al navegar entre pasos

**Impacto**: 🔴 **ALTO** - Funcionalidad crítica del flujo

---

### **Problema 2: Sidebar Derecho Condicional**

**Descripción**:
El sidebar derecho solo debe aparecer cuando el usuario está en un sub-step del Paso 4.

**Retos**:

- ❌ Cómo detectar si estamos en un sub-step
- ❌ Cómo determinar qué secciones mostrar
- ❌ Cómo manejar la navegación entre secciones
- ❌ Cómo mantener el ancho del contenido cuando aparece/desaparece

**Impacto**: 🟡 **MEDIO** - UX importante

---

### **Problema 3: Colapsable de Puntos de Agenda**

**Descripción**:
El Paso 4 (Puntos de Acuerdo) debe ser colapsable en el sidebar, mostrando/ocultando los sub-steps.

**Retos**:

- ❌ Cómo implementar el colapsable (acordeón)
- ❌ Cómo agrupar sub-steps por categoría
- ❌ Cómo mantener el estado de expansión
- ❌ Cómo animar la transición

**Impacto**: 🟡 **MEDIO** - Mejora UX

---

### **Problema 4: Progress Bar Visual**

**Descripción**:
Agregar una barra de progreso visual (no existe en sociedades).

**Retos**:

- ❌ Cómo calcular el progreso (incluyendo sub-steps)
- ❌ Cómo animar la barra
- ❌ Dónde ubicarla (header o sidebar)

**Impacto**: 🟢 **BAJO** - Mejora visual

---

### **Problema 5: Navegación entre Niveles**

**Descripción**:
Navegar entre 3 niveles: Pasos → Sub-steps → Secciones.

**Retos**:

- ❌ Cómo manejar la navegación entre niveles
- ❌ Cómo actualizar el estado en cada nivel
- ❌ Cómo sincronizar la ruta con el estado
- ❌ Cómo permitir navegación libre vs restringida

**Impacto**: 🔴 **ALTO** - Funcionalidad crítica

---

### **Problema 6: Reutilización de Componentes**

**Descripción**:
Reutilizar componentes de sociedades sin duplicar código.

**Retos**:

- ❌ Cómo reutilizar `CheckIcon.vue`
- ❌ Cómo adaptar `ProgressNavBar.vue` para colapsable
- ❌ Cómo mantener consistencia de estilos
- ❌ Cómo evitar duplicación de lógica

**Impacto**: 🟡 **MEDIO** - Mantenibilidad

---

## 4️⃣ HIPÓTESIS / SOLUCIÓN

### **Hipótesis 1: Sistema de Sub-Steps Dinámicos**

**Hipótesis**:
Usar un store Pinia (`useJuntasFlowStore`) para almacenar los sub-steps seleccionados en Paso 1, y filtrar dinámicamente en `junta-navigation.ts` cuando se generan los pasos.

**Solución**:

```typescript
// 1. En Paso 1: Guardar sub-steps seleccionados
const juntasFlowStore = useJuntasFlowStore();
juntasFlowStore.updateDynamicSubSteps(["aporte-dinerarios", "nombramiento-gerente"]);

// 2. En junta-navigation.ts: Filtrar sub-steps
const dynamicSubSteps = juntasFlowStore.getDynamicSubSteps;
const filteredSubSteps = BASE_SUB_STEPS.filter((sub) => dynamicSubSteps.includes(sub.id));

// 3. En SingleWizardSidebarJuntas: Renderizar solo los filtrados
```

**Validación**:

- ✅ Store persistente entre navegaciones
- ✅ Filtrado reactivo (se actualiza automáticamente)
- ✅ Sincronización con la ruta

---

### **Hipótesis 2: Sidebar Derecho Condicional**

**Hipótesis**:
Detectar si estamos en un sub-step analizando la ruta, y mostrar el sidebar derecho solo cuando `currentSubStepId` existe.

**Solución**:

```typescript
// En flow-layout-juntas.vue
const juntasFlowStore = useJuntasFlowStore();
const hasRightSidebar = computed(() => !!juntasFlowStore.currentSubStepId);

// En useJuntasNavbarRoutes.ts
const currentSubStepId = computed(() => {
  const path = route.path;
  // Extraer sub-step de la ruta: /operaciones/junta-accionistas/[id]/puntos-acuerdo/aporte-dinerario
  const match = path.match(/puntos-acuerdo\/([^/]+)/);
  return match ? match[1] : undefined;
});
```

**Validación**:

- ✅ Detección automática desde la ruta
- ✅ Reactivo (se actualiza al cambiar de ruta)
- ✅ Compatible con el sistema de rutas de Nuxt

---

### **Hipótesis 3: Colapsable de Puntos de Agenda**

**Hipótesis**:
Usar estado local en `SingleWizardSidebarJuntas` para controlar qué pasos están expandidos, y agrupar sub-steps por categoría.

**Solución**:

```typescript
// En SingleWizardSidebarJuntas.vue
const expandedSteps = ref<string[]>(["puntos-acuerdo"]); // Por defecto expandido si es current
const expandedCategories = ref<string[]>([]);

const toggleStep = (stepId: string) => {
  if (expandedSteps.value.includes(stepId)) {
    expandedSteps.value = expandedSteps.value.filter((id) => id !== stepId);
  } else {
    expandedSteps.value.push(stepId);
  }
};

// Agrupar sub-steps por categoría
const groupedSubSteps = computed(() => {
  const categories: Record<string, NavigationSubStep[]> = {};
  step.subSteps?.forEach((subStep) => {
    const category = subStep.category || "General";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(subStep);
  });
  return categories;
});
```

**Validación**:

- ✅ Estado local reactivo
- ✅ Agrupación automática por categoría
- ✅ Animación con transiciones CSS

---

### **Hipótesis 4: Progress Bar Visual**

**Hipótesis**:
Calcular el progreso basado en el índice del paso actual y el total de pasos, incluyendo sub-steps completados.

**Solución**:

```typescript
// En SingleWizardSidebarJuntas.vue
const progressPercentage = computed(() => {
  const totalSteps = props.steps.length;
  const completedSteps = props.steps.filter((s) => s.status === "completed").length;
  const currentStepProgress = props.currentStepIndex / totalSteps;
  return Math.round((completedSteps / totalSteps) * 100);
});
```

**Validación**:

- ✅ Cálculo simple y preciso
- ✅ Actualización reactiva
- ✅ Visual claro

---

### **Hipótesis 5: Navegación entre Niveles**

**Hipótesis**:
Usar el sistema de rutas de Nuxt para manejar los 3 niveles, y sincronizar el estado del store con la ruta actual.

**Solución**:

```typescript
// Estructura de rutas:
// Nivel 1: /operaciones/junta-accionistas/[id]/seleccion-agenda
// Nivel 2: /operaciones/junta-accionistas/[id]/puntos-acuerdo/aporte-dinerario
// Nivel 3: /operaciones/junta-accionistas/[id]/puntos-acuerdo/aporte-dinerario/aportes

// En useJuntasNavbarRoutes.ts
const currentStepId = computed(() => {
  // Extraer de la ruta
});

const currentSubStepId = computed(() => {
  // Extraer de la ruta si existe
});

const currentSectionId = computed(() => {
  // Extraer de la ruta si existe
});
```

**Validación**:

- ✅ Rutas claras y semánticas
- ✅ Sincronización automática con el store
- ✅ Compatible con Nuxt Router

---

### **Hipótesis 6: Reutilización de Componentes**

**Hipótesis**:
Reutilizar `CheckIcon.vue` directamente, y crear versiones adaptadas de otros componentes manteniendo la misma estructura.

**Solución**:

```typescript
// Reutilizar directamente
import CheckIcon from "~/components/flow-layout/CheckIcon.vue";

// Crear versiones adaptadas
// SingleWizardSidebarJuntas.vue (nuevo, basado en ProgressNavBar.vue)
// WizardRightSidebar.vue (nuevo, sin equivalente en sociedades)
```

**Validación**:

- ✅ Sin duplicación de código
- ✅ Mantenibilidad mejorada
- ✅ Consistencia de estilos

---

## 5️⃣ PLAN DE ACCIONES

### **FASE 1: Preparación y Configuración Base** (2-3 horas)

#### **Acción 1.1: Crear Tipos TypeScript**

- [ ] Crear `app/types/junta-navigation.types.ts`
- [ ] Actualizar `app/types/navigationSteps.ts` (agregar `subSteps`)
- [ ] Definir interfaces: `WizardStep`, `WizardSubStep`, `SectionItem`

**Tiempo estimado**: 30 min

---

#### **Acción 1.2: Crear Stores**

- [ ] Crear `app/stores/useJuntasNavbarStore.ts`
- [ ] Crear `app/stores/useJuntasFlowStore.ts`
- [ ] Implementar estado y acciones básicas

**Tiempo estimado**: 1 hora

---

#### **Acción 1.3: Crear Configuración de Navegación**

- [ ] Crear `app/config/junta-navigation.ts`
- [ ] Definir `BASE_STEPS` (6 pasos)
- [ ] Definir `BASE_SUB_STEPS` (13 sub-steps)
- [ ] Implementar `juntaNavigation()` con filtrado dinámico
- [ ] Actualizar `app/config/progress-navbar-map.ts` (agregar regla para juntas)

**Tiempo estimado**: 1.5 horas

---

### **FASE 2: Componentes Base** (4-5 horas)

#### **Acción 2.1: Crear ProgressBarJuntas**

- [ ] Crear `app/components/flow-layout-juntas/ProgressBarJuntas.vue`
- [ ] Implementar barra de progreso horizontal
- [ ] Agregar porcentaje visual
- [ ] Agregar animaciones

**Tiempo estimado**: 1 hora

---

#### **Acción 2.2: Crear SingleWizardSidebarJuntas**

- [ ] Crear `app/components/flow-layout-juntas/SingleWizardSidebarJuntas.vue`
- [ ] Implementar header con ícono, título y progress bar
- [ ] Implementar lista de pasos con estados
- [ ] Integrar `CheckIcon.vue` (reutilizar)
- [ ] Implementar colapsable para pasos con sub-steps
- [ ] Agrupar sub-steps por categoría
- [ ] Implementar líneas conectoras
- [ ] Agregar hover effects y transiciones

**Tiempo estimado**: 3 horas

---

#### **Acción 2.3: Crear WizardRightSidebar**

- [ ] Crear `app/components/flow-layout-juntas/WizardRightSidebar.vue`
- [ ] Implementar header
- [ ] Implementar lista de secciones con estados
- [ ] Implementar líneas conectoras verticales
- [ ] Agregar hover effects

**Tiempo estimado**: 1.5 horas

---

#### **Acción 2.4: Crear HeaderJuntasNavbar**

- [ ] Crear `app/components/flow-layout-juntas/HeaderJuntasNavbar.vue`
- [ ] Implementar botón "Salir"
- [ ] Implementar título del paso actual
- [ ] Implementar breadcrumbs
- [ ] Implementar botones de acción (Guardar, Restablecer)

**Tiempo estimado**: 1 hora

---

### **FASE 3: Composables y Lógica** (2-3 horas)

#### **Acción 3.1: Crear useJuntasNavbarRoutes**

- [ ] Crear `app/composables/useJuntasNavbarRoutes.ts`
- [ ] Implementar `extractJuntaId()`
- [ ] Implementar `resolveContext()`
- [ ] Implementar watch de ruta
- [ ] Implementar cálculo de `currentStepIndex`
- [ ] Implementar cálculo de `currentSubStepId`
- [ ] Integrar con `juntaNavigation()`

**Tiempo estimado**: 1.5 horas

---

#### **Acción 3.2: Crear useJuntasFlowNext**

- [ ] Crear `app/composables/useJuntasFlowNext.ts`
- [ ] Implementar configuración de `onClickNext`
- [ ] Implementar navegación al siguiente paso
- [ ] Manejar loading y errores

**Tiempo estimado**: 1 hora

---

### **FASE 4: Layout Principal** (2-3 horas)

#### **Acción 4.1: Actualizar flow-layout-juntas.vue**

- [ ] Integrar `HeaderJuntasNavbar`
- [ ] Integrar `SingleWizardSidebarJuntas`
- [ ] Integrar `WizardRightSidebar` (condicional)
- [ ] Implementar lógica `hasRightSidebar`
- [ ] Integrar footer con botón "Siguiente"
- [ ] Agregar estilos y responsive

**Tiempo estimado**: 2 horas

---

### **FASE 5: Integración con Paso 1** (2-3 horas)

#### **Acción 5.1: Conectar Paso 1 con Store**

- [ ] En `seleccion-agenda/index.vue`, agregar lógica para guardar sub-steps seleccionados
- [ ] Conectar checkboxes con `juntasFlowStore.updateDynamicSubSteps()`
- [ ] Validar que los sub-steps se guardan correctamente

**Tiempo estimado**: 1.5 horas

---

#### **Acción 5.2: Validar Filtrado Dinámico**

- [ ] Verificar que al seleccionar/deseleccionar en Paso 1, los sub-steps en Paso 4 se actualizan
- [ ] Probar navegación entre pasos
- [ ] Validar persistencia del estado

**Tiempo estimado**: 1 hora

---

### **FASE 6: Configuración de Páginas** (1-2 horas)

#### **Acción 6.1: Actualizar Páginas de Juntas**

- [ ] Actualizar todas las páginas de juntas para usar `flowLayoutJuntas: true`
- [ ] Agregar `useJuntasFlowNext()` en cada página
- [ ] Validar navegación entre pasos

**Tiempo estimado**: 1.5 horas

---

### **FASE 7: Testing y Ajustes** (2-3 horas)

#### **Acción 7.1: Testing Manual**

- [ ] Probar navegación entre todos los pasos
- [ ] Probar sistema de sub-steps dinámicos
- [ ] Probar sidebar derecho (aparece/desaparece)
- [ ] Probar colapsable de puntos de agenda
- [ ] Probar progress bar
- [ ] Probar responsive

**Tiempo estimado**: 2 horas

---

#### **Acción 7.2: Ajustes y Mejoras**

- [ ] Ajustar estilos según feedback
- [ ] Optimizar animaciones
- [ ] Corregir bugs encontrados
- [ ] Mejorar accesibilidad

**Tiempo estimado**: 1 hora

---

## 6️⃣ EJECUCIÓN

### **Orden de Ejecución Recomendado**

```
1. FASE 1: Preparación (Tipos, Stores, Config)
   ↓
2. FASE 2: Componentes Base (ProgressBar, Sidebars, Header)
   ↓
3. FASE 3: Composables (Lógica de navegación)
   ↓
4. FASE 4: Layout Principal (Integración)
   ↓
5. FASE 5: Integración con Paso 1 (Sistema dinámico)
   ↓
6. FASE 6: Configuración de Páginas
   ↓
7. FASE 7: Testing y Ajustes
```

### **Checklist de Validación**

#### **Funcionalidades Críticas**

- [ ] ✅ Sidebar izquierdo muestra los 6 pasos principales
- [ ] ✅ Estados visuales funcionan (completed/current/empty)
- [ ] ✅ Paso 4 es colapsable y muestra sub-steps agrupados por categoría
- [ ] ✅ Sub-steps se filtran dinámicamente según Paso 1
- [ ] ✅ Sidebar derecho aparece solo cuando hay sub-step activo
- [ ] ✅ Navegación entre pasos funciona
- [ ] ✅ Navegación entre sub-steps funciona
- [ ] ✅ Navegación entre secciones funciona
- [ ] ✅ Progress bar muestra porcentaje correcto
- [ ] ✅ Botón "Siguiente" navega al siguiente paso

#### **UX/UI**

- [ ] ✅ Estilos consistentes con sociedades
- [ ] ✅ Animaciones suaves
- [ ] ✅ Hover effects funcionan
- [ ] ✅ Responsive en móvil
- [ ] ✅ Accesibilidad (keyboard navigation)

#### **Integración**

- [ ] ✅ Integrado con `registros.vue` layout
- [ ] ✅ Rutas funcionan correctamente
- [ ] ✅ Estado persiste entre navegaciones
- [ ] ✅ No hay errores en consola

---

## 📊 Resumen de Esfuerzo

| Fase       | Tareas                | Tiempo Estimado |
| ---------- | --------------------- | --------------- |
| **FASE 1** | Tipos, Stores, Config | 2-3 horas       |
| **FASE 2** | Componentes Base      | 4-5 horas       |
| **FASE 3** | Composables           | 2-3 horas       |
| **FASE 4** | Layout Principal      | 2-3 horas       |
| **FASE 5** | Integración Paso 1    | 2-3 horas       |
| **FASE 6** | Configuración Páginas | 1-2 horas       |
| **FASE 7** | Testing y Ajustes     | 2-3 horas       |
| **TOTAL**  |                       | **15-22 horas** |

---

## 🎯 Criterios de Éxito

1. ✅ Sidebar izquierdo funcional con pasos y sub-steps colapsables
2. ✅ Sidebar derecho aparece/desaparece correctamente
3. ✅ Sistema de sub-steps dinámicos funciona (filtrado desde Paso 1)
4. ✅ Navegación entre 3 niveles funciona correctamente
5. ✅ Progress bar muestra progreso real
6. ✅ Estilos consistentes con el resto de la aplicación
7. ✅ Sin errores en consola
8. ✅ Responsive y accesible

---

## 🚀 Próximos Pasos Inmediatos

1. **Crear estructura de carpetas**:

   ```
   app/components/flow-layout-juntas/
   app/stores/
   app/composables/
   app/config/
   ```

2. **Empezar con FASE 1**: Tipos y Stores

3. **Validar hipótesis**: Probar sistema de sub-steps dinámicos con datos mock

---

**¿Listo para comenzar la implementación?** 🚀
