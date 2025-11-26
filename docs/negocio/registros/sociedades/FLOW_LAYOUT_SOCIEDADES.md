# 🎨 Flow Layout Sociedades - Documentación Técnica Completa

## 🎯 Objetivo

Documentar **toda la estructura técnica** del flow layout de Registro de Sociedades para replicarlo en Juntas de Accionistas, con adaptaciones necesarias (puntos de agenda colapsable, etc.).

---

## 📐 Arquitectura del Sistema

### **Estructura de Layouts Anidados**

```
┌─────────────────────────────────────────────────────────────┐
│  Layout: registros.vue (Layout Principal)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ProboSidebar (Sidebar general de la app)              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Layout: flow-layout.vue (Layout del flujo)          │  │
│  │ ┌────────────────────────────────────────────────┐  │  │
│  │ │ HeaderProgressNavbar (Header con breadcrumbs)  │  │  │
│  │ └────────────────────────────────────────────────┘  │  │
│  │ ┌──────────────┬──────────────────────────────────┐  │  │
│  │ │ ProgressNavBar│  Contenido (slot)              │  │  │
│  │ │ (Sidebar Izq) │  (Páginas de pasos)            │  │  │
│  │ │ w-[401px]     │                                 │  │  │
│  │ └──────────────┴──────────────────────────────────┘  │  │
│  │ ┌────────────────────────────────────────────────┐  │  │
│  │ │ Footer (Botón Siguiente)                       │  │  │
│  │ └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes Principales

### **1. Layout Principal: `registros.vue`**

**Ubicación**: `app/layouts/registros.vue`

**Propósito**: Layout contenedor que incluye el sidebar general de la app y decide qué layout anidado usar.

**Estructura**:
```vue
<template>
  <div class="flex h-screen overflow-hidden bg-safe">
    <!-- Sidebar General (ProboSidebar) -->
    <ProboSidebar :is-collapsed="isCollapsed" :toggle-sidebar="toggleSidebar" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
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
  </div>
</template>
```

**Lógica**:
```typescript
const route = useRoute();
const isFlowLayout = computed(() => route.meta.flowLayout === true);
const isFlowLayoutJuntas = computed(() => route.meta.flowLayoutJuntas === true);
```

**Características**:
- ✅ Detecta automáticamente qué layout usar según `route.meta`
- ✅ Sidebar general colapsable con persistencia en localStorage
- ✅ Layout anidado según el flujo (sociedades o juntas)

---

### **2. Layout del Flujo: `flow-layout.vue`**

**Ubicación**: `app/layouts/flow-layout.vue`

**Propósito**: Layout específico del flujo de registro de sociedades con sidebar de progreso.

**Estructura**:
```vue
<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <HeaderProgressNavbar 
      :steps="steps" 
      :current-step-index="currentStepIndex" 
    />

    <!-- Body -->
    <div class="flex min-h-0 flex-1">
      <!-- Sidebar Izquierdo (ProgressNavBar) -->
      <div class="w-[401px] shrink-0 border-r px-6 py-14">
        <ProgressNavBar :steps="steps" />
      </div>

      <!-- Contenido Principal -->
      <div class="flex-1 flex flex-col min-w-0">
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>

        <!-- Footer -->
        <div class="h-[92px] border-t sticky bottom-0 bg-white z-10 shrink-0 flex items-center justify-end px-16">
          <ActionButton
            label="Siguiente"
            size="md"
            :is-loading="flowLayoutStore.isLoading"
            @click="flowLayoutStore.onClickNext"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

**Lógica**:
```typescript
const { steps, currentStepIndex } = useProgressNavbarRoutes();
const flowLayoutStore = useFlowLayoutStore();
```

**Características**:
- ✅ Ancho fijo del sidebar: `401px` (w-[401px])
- ✅ Header con breadcrumbs y botón volver
- ✅ Footer sticky con botón "Siguiente"
- ✅ Contenido scrollable

---

### **3. Header: `HeaderProgressNavbar.vue`**

**Ubicación**: `app/components/flow-layout/HeaderProgressNavbar.vue`

**Propósito**: Header superior con breadcrumbs y botón volver.

**Props**:
```typescript
interface Props {
  steps: NavigationStep[];
  currentStepIndex: number;
}
```

**Estructura Visual**:
```
┌─────────────────────────────────────────────────────────┐
│ [←] Agregar nueva sociedad                              │
│                                                          │
│ Datos principales > Accionistas > Capital Social...     │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades**:
- ✅ Botón volver (navega al paso anterior)
- ✅ Breadcrumbs con todos los pasos
- ✅ Títulos truncados si son muy largos

**Código Clave**:
```typescript
const goBackStep = () => {
  if (props.currentStepIndex > 0) {
    const prevStep = props.steps[props.currentStepIndex - 1];
    router.push(prevStep!.route);
  }
};
```

---

### **4. Sidebar de Progreso: `ProgressNavBar.vue`**

**Ubicación**: `app/components/flow-layout/ProgressNavBar.vue`

**Propósito**: Sidebar izquierdo con lista de pasos y estados visuales.

**Props**:
```typescript
interface Props {
  steps: NavigationStep[];
}
```

**Estructura Visual**:
```
┌─────────────────────────────────┐
│                                 │
│  ✅ Datos principales          │
│     Completa todos los datos... │
│  │                              │
│  ✅ Accionistas                 │
│     Agrega los accionistas...   │
│  │                              │
│  🔵 Capital Social y Acciones  │
│     Completa información...     │
│  │                              │
│  ⚪ Asignación de Acciones      │
│     Distribuye Tipos...        │
│                                 │
└─────────────────────────────────┘
```

**Características**:
- ✅ Estados visuales: `completed` (✅), `current` (🔵), `empty` (⚪)
- ✅ Links clickeables a cada paso
- ✅ Hover effects (underline, color change)
- ✅ Líneas conectoras verticales entre pasos

**Componente Hijo**: `CheckIcon.vue` (renderiza el círculo con estado)

---

### **5. Icono de Progreso: `CheckIcon.vue`**

**Ubicación**: `app/components/flow-layout/CheckIcon.vue`

**Propósito**: Renderiza el círculo de estado y la línea conectora.

**Props**:
```typescript
interface Props {
  status?: "empty" | "current" | "completed";
  isFinalItem?: boolean;
}
```

**Estados Visuales**:

1. **Empty** (⚪):
```vue
<div class="w-7 h-7 border-2 border-gray-300 rounded-full" />
```

2. **Current** (🔵):
```vue
<div class="w-7 h-7 border-2 border-primary-800 rounded-full">
  <span class="w-2.5 h-2.5 rounded-full bg-primary-800" />
</div>
```

3. **Completed** (✅):
```vue
<div class="w-7 h-7 border-2 bg-primary-800 border-primary-800 rounded-full">
  <svg>...</svg> <!-- Check icon -->
</div>
```

**Línea Conectora**:
```vue
<div
  v-if="!isFinalItem"
  :class="[
    'w-0.5 h-8',
    {
      'bg-gray-300': status === 'empty',
      'bg-primary-800': status === 'current' || status === 'completed',
    },
  ]"
/>
```

**Características**:
- ✅ Tamaño fijo: `w-7 h-7` (28px)
- ✅ Colores: `primary-800` para activo/completado, `gray-300` para vacío
- ✅ Línea conectora con altura `h-8` (32px)
- ✅ Transiciones de color

---

## 🔄 Sistema de Navegación

### **1. Composable: `useProgressNavbarRoutes`**

**Ubicación**: `app/composables/useProgressNavbarRoutes.ts`

**Propósito**: Detecta la ruta actual y carga los pasos correspondientes.

**Lógica**:
```typescript
export const useProgressNavbarRoutes = () => {
  const route = useRoute();
  const progressNavbar = useProgressNavbarStore();

  // Extraer societyId de la ruta
  const extractSocietyId = (): string | undefined => {
    const param = route.params.id;
    if (typeof param === "string" && param.length > 0) return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return undefined;
  };

  // Determinar contexto (crear/editar)
  const resolveContext = (): ProgressNavigationContext => {
    const path = route.path;
    const flow = path.includes("/crear") ? "crear" 
               : path.includes("/editar") ? "editar" 
               : undefined;
    return {
      societyId: extractSocietyId(),
      flow,
    };
  };

  // Watch la ruta y actualizar pasos
  watch(
    () => route.path,
    (newPath) => {
      const context = resolveContext();
      for (const rule of routeMap) {
        if (rule.match(newPath)) {
          progressNavbar.setSteps(rule.getSteps(context));
          return;
        }
      }
      progressNavbar.setSteps([]);
    },
    { immediate: true }
  );

  // Calcular índice del paso actual
  const currentStepIndex = computed(() => {
    return progressNavbar.steps.findIndex((step) => step.route === route.path);
  });

  return {
    steps: progressNavbar.steps,
    currentStepIndex,
  };
};
```

**Características**:
- ✅ Detecta automáticamente el contexto (crear/editar)
- ✅ Extrae `societyId` de los parámetros de ruta
- ✅ Usa `routeMap` para determinar qué pasos mostrar
- ✅ Calcula el índice del paso actual

---

### **2. Store: `useProgressNavbarStore`**

**Ubicación**: `app/stores/useProgressNavbarStore.ts`

**Propósito**: Almacena los pasos de navegación y proporciona métodos para navegar.

**Estructura**:
```typescript
export const useProgressNavbarStore = defineStore("progressNavbar", {
  state: (): State => ({
    steps: [],
  }),
  actions: {
    setSteps(newSteps: NavigationStep[]) {
      this.steps = newSteps;
    },

    getNextStepByCurrentStep(currentStep: string) {
      const currentStepIndex = this.steps.findIndex((step) => step.route === currentStep);
      if (currentStepIndex === -1) {
        return null;
      }
      return this.steps[currentStepIndex + 1];
    },
  },
});
```

**Características**:
- ✅ Almacena array de `NavigationStep[]`
- ✅ Método para obtener el siguiente paso
- ✅ Usa **Option API** de Pinia

---

### **3. Configuración de Rutas: `progress-navbar-map.ts`**

**Ubicación**: `app/config/progress-navbar-map.ts`

**Propósito**: Mapea rutas a configuraciones de navegación.

**Estructura**:
```typescript
export interface ProgressNavigationContext {
  societyId?: string;
  flow?: "crear" | "editar";
}

type RouteRule = {
  match: (path: string) => boolean;
  getSteps: (context: ProgressNavigationContext) => NavigationStep[];
};

export const routeMap: RouteRule[] = [
  {
    match: (path: string) => path.includes("/registros/sociedades"),
    getSteps: (context) =>
      societyRegisterNavigation({
        base: "registros",
        societyId: context.societyId,
        flow: context.flow,
      }),
  },
  // ... más reglas
];
```

**Características**:
- ✅ Sistema de reglas basado en patrones de ruta
- ✅ Extensible (agregar más reglas fácilmente)
- ✅ Contexto dinámico (societyId, flow)

---

### **4. Configuración de Pasos: `society-register-navigation.ts`**

**Ubicación**: `app/config/society-register-navigation.ts`

**Propósito**: Define los 10 pasos del flujo de registro de sociedades.

**Estructura**:
```typescript
const BASE_STEPS = [
  {
    slug: "datos-sociedad",
    title: "Datos principales",
    description: "Completa todos los datos de la Sociedad",
    status: "completed",
  },
  {
    slug: "accionistas",
    title: "Accionistas",
    description: "Agrega los accionistas de la Sociedad",
    status: "completed",
  },
  // ... 8 pasos más
];

export const societyRegisterNavigation = (
  context: SocietyNavigationContext
): NavigationStep[] => {
  return BASE_STEPS.map((step) => ({
    title: step.title,
    description: step.description,
    status: step.status,
    route: buildRoute(step.slug, context),
  }));
};
```

**Construcción de Rutas**:
```typescript
const buildRoute = (slug: string, context: SocietyNavigationContext) => {
  if (context.base === "registros") {
    const id = context.societyId ?? ":id";
    return `/registros/sociedades/${id}/${slug}`;
  }
  const modeSegment = buildLegacyModeSegment(context);
  return `/registro-societario/sociedades/${modeSegment}/${slug}`;
};
```

**Ejemplos de Rutas Generadas**:
- Crear: `/registros/sociedades/:id/datos-sociedad`
- Editar: `/registros/sociedades/123/datos-sociedad`

---

### **5. Store: `useFlowLayoutStore`**

**Ubicación**: `app/stores/useFlowLayoutStore.ts`

**Propósito**: Gestiona el estado del botón "Siguiente" y el handler de navegación.

**Estructura**:
```typescript
export const useFlowLayoutStore = defineStore("flowLayout", {
  state: () => ({
    isLoading: false,
    onClickNext: () => {},
  }),
  actions: {
    clearValues() {
      this.isLoading = false;
      this.onClickNext = () => {};
    },
  },
});
```

**Características**:
- ✅ Estado de loading para el botón
- ✅ Handler dinámico (`onClickNext`) que cada página puede configurar
- ✅ Método para limpiar valores al desmontar

---

### **6. Composable: `useFlowLayoutNext`**

**Ubicación**: `app/composables/useFlowLayoutNext.ts`

**Propósito**: Configura el handler del botón "Siguiente" en cada página.

**Uso**:
```typescript
// En una página de paso (ej: datos-sociedad.vue)
useFlowLayoutNext(async () => {
  // Validar formulario
  await validateForm();
  
  // Guardar datos
  await saveData();
  
  // El composable automáticamente navega al siguiente paso
});
```

**Implementación**:
```typescript
export const useFlowLayoutNext = (handleNext: FlowNextHandler) => {
  const flowLayoutStore = useFlowLayoutStore();
  const progressNavbarStore = useProgressNavbarStore();
  const router = useRouter();
  const route = useRoute();

  onMounted(() => {
    flowLayoutStore.onClickNext = async () => {
      try {
        flowLayoutStore.isLoading = true;
        await handleNext();

        // Navegar al siguiente paso
        const nextStep = progressNavbarStore.getNextStepByCurrentStep(route.path);
        if (nextStep) {
          router.push(nextStep.route);
        }
      } catch (error) {
        console.error(error);
      } finally {
        flowLayoutStore.isLoading = false;
      }
    };
  });

  onUnmounted(() => {
    flowLayoutStore.clearValues();
  });
};
```

**Características**:
- ✅ Configura el handler en `onMounted`
- ✅ Limpia el handler en `onUnmounted`
- ✅ Maneja loading automáticamente
- ✅ Navega al siguiente paso después de ejecutar el handler

---

## 🛣️ Sistema de Rutas

### **Estructura de Rutas**

```
/registros/sociedades/
├── dashboard.vue                    # Lista de sociedades
├── agregar.vue                      # Crear nueva sociedad
├── [id]/
│   ├── datos-sociedad.vue          # Paso 1
│   ├── accionistas.vue             # Paso 2
│   ├── acciones.vue                # Paso 3
│   ├── asignacion-acciones.vue     # Paso 4
│   ├── directorio.vue              # Paso 5
│   ├── registro-apoderados.vue     # Paso 6
│   ├── regimen-poderes.vue         # Paso 7
│   ├── quorums-mayorias.vue        # Paso 8
│   ├── acuerdos-societarios.vue    # Paso 9
│   ├── resumen.vue                 # Paso 10
│   └── preview.vue                 # Vista de solo lectura
```

### **Configuración de Página**

```vue
<!-- app/pages/registros/sociedades/[id]/datos-sociedad.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "registros",
  flowLayout: true,  // ⭐ Activa el flow-layout
});

const route = useRoute();
const societyId = computed(() => route.params.id as string);

// Configurar handler del botón "Siguiente"
useFlowLayoutNext(async () => {
  // Lógica de guardado/validación
  await saveData();
});
</script>

<template>
  <section>
    <DatosSociedadForm :society-id="societyId" :mode="EntityModeEnum.CREAR" />
  </section>
</template>
```

---

## 🎨 Estilos y Componentes Visuales

### **Progress Bar (Barra de Progreso)**

**No hay barra de progreso visual** en el flow layout de sociedades. Solo hay:
- ✅ Estados visuales en los círculos (empty/current/completed)
- ✅ Líneas conectoras entre pasos

**Para Juntas**: Se puede agregar una barra de progreso similar a la de probo-figma-ai:
```vue
<div class="h-2 rounded-full overflow-hidden bg-gray-200">
  <div
    class="h-full transition-all duration-300"
    :style="{
      width: `${(currentStepIndex + 1) / steps.length * 100}%`,
      backgroundColor: 'var(--primary-800)'
    }"
  />
</div>
<p class="text-xs mt-2 text-right text-gray-500">
  {{ Math.round((currentStepIndex + 1) / steps.length * 100) }}% completado
</p>
```

### **Colores Utilizados**

```css
/* Primary */
--primary-800: #3C28A4    /* Bordes activos, check completado */

/* Grays */
--gray-300: #C6C5CA       /* Bordes vacíos, líneas conectoras vacías */
--gray-600: #8D8A95      /* Texto descripciones */

/* Estados */
completed: bg-primary-800 border-primary-800
current: border-primary-800 (fondo blanco)
empty: border-gray-300 (fondo blanco)
```

### **Tipografía**

```css
font-primary: /* Títulos de pasos */
font-secondary: /* Descripciones */
```

---

## 🔄 Flujo Completo de Navegación

### **1. Usuario entra a una página**

```
1. Página carga → definePageMeta({ flowLayout: true })
   ↓
2. Layout registros.vue detecta isFlowLayout === true
   ↓
3. Renderiza NuxtLayout name="flow-layout"
   ↓
4. flow-layout.vue se monta
   ↓
5. useProgressNavbarRoutes() se ejecuta
   ↓
6. Watch detecta route.path
   ↓
7. routeMap.match() encuentra la regla correspondiente
   ↓
8. societyRegisterNavigation() genera los pasos
   ↓
9. progressNavbarStore.setSteps() actualiza el store
   ↓
10. currentStepIndex se calcula (findIndex de route.path)
   ↓
11. Componentes se renderizan con los pasos
```

### **2. Usuario hace click en un paso del sidebar**

```
1. Usuario hace click en ProgressNavBar → NuxtLink
   ↓
2. router.push(step.route)
   ↓
3. Ruta cambia → watch en useProgressNavbarRoutes se dispara
   ↓
4. currentStepIndex se recalcula
   ↓
5. Componentes se actualizan (nuevo paso marcado como current)
```

### **3. Usuario hace click en "Siguiente"**

```
1. Usuario hace click en botón "Siguiente"
   ↓
2. flowLayoutStore.onClickNext() se ejecuta
   ↓
3. Handler configurado por useFlowLayoutNext() se ejecuta
   ↓
4. Validación/guardado se realiza
   ↓
5. progressNavbarStore.getNextStepByCurrentStep() obtiene siguiente paso
   ↓
6. router.push(nextStep.route)
   ↓
7. Navegación al siguiente paso
```

---

## 📊 Tipos TypeScript

### **NavigationStep**

```typescript
export interface NavigationStep {
  title: string;
  description: string;
  status: "completed" | "current" | "empty" | "optional" | "in-progress" | "locked" | "error";
  route: string;
  hash?: string;
  isCategory?: boolean;  // Para separadores de categoría
  level?: number;        // Nivel del item (para tamaño de círculo)
}
```

### **ProgressNavigationContext**

```typescript
export interface ProgressNavigationContext {
  societyId?: string;
  flow?: "crear" | "editar";
}
```

---

## 🔄 Reutilización para Juntas de Accionistas

### ✅ **Qué se puede REUTILIZAR:**

1. **Estructura de Layouts Anidados**
   - ✅ Layout principal (`registros.vue`)
   - ✅ Sistema de detección de layout por `route.meta`
   - ✅ Layout anidado (`flow-layout-juntas.vue`)

2. **Sistema de Navegación**
   - ✅ `useProgressNavbarRoutes` (adaptar para juntas)
   - ✅ `useProgressNavbarStore` (reutilizable)
   - ✅ `routeMap` (agregar regla para juntas)

3. **Componentes Base**
   - ✅ `CheckIcon.vue` (reutilizable)
   - ✅ `HeaderProgressNavbar.vue` (adaptar)
   - ✅ `ProgressNavBar.vue` (adaptar para colapsable)

4. **Sistema de Navegación**
   - ✅ `useFlowLayoutNext` (reutilizable)
   - ✅ `useFlowLayoutStore` (reutilizable)

5. **Estilos**
   - ✅ Colores (primary-800, gray-300)
   - ✅ Tamaños de círculos (w-7 h-7)
   - ✅ Líneas conectoras

### ❌ **Qué hay que CREAR/ADAPTAR:**

1. **Layout Específico**
   - ❌ `flow-layout-juntas.vue` (nuevo, con sidebar derecho opcional)
   - ❌ Lógica para mostrar/ocultar sidebar derecho según sub-step

2. **Configuración de Pasos**
   - ❌ `junta-navigation.ts` (nuevo, con 6 pasos + sub-steps)
   - ❌ Sistema de sub-steps dinámicos (filtrado por Paso 1)

3. **Componentes Específicos**
   - ❌ `ProgressNavBarJuntas.vue` (adaptar con colapsable para puntos de agenda)
   - ❌ `WizardRightSidebar.vue` (nuevo, para secciones dentro de sub-steps)

4. **Sistema de Sub-Steps Dinámicos**
   - ❌ Store para almacenar sub-steps seleccionados
   - ❌ Lógica de filtrado en `junta-navigation.ts`

5. **Progress Bar**
   - ❌ Agregar barra de progreso visual (no existe en sociedades)

---

## 📝 Resumen Técnico

| Componente | Ubicación | Propósito | Reutilizable |
|------------|-----------|-----------|--------------|
| **registros.vue** | `app/layouts/` | Layout principal con sidebar general | ✅ Sí |
| **flow-layout.vue** | `app/layouts/` | Layout del flujo de sociedades | ⚠️ Adaptar |
| **HeaderProgressNavbar** | `app/components/flow-layout/` | Header con breadcrumbs | ⚠️ Adaptar |
| **ProgressNavBar** | `app/components/flow-layout/` | Sidebar izquierdo con pasos | ⚠️ Adaptar (colapsable) |
| **CheckIcon** | `app/components/flow-layout/` | Icono de estado | ✅ Sí |
| **useProgressNavbarRoutes** | `app/composables/` | Detecta ruta y carga pasos | ⚠️ Adaptar |
| **useProgressNavbarStore** | `app/stores/` | Almacena pasos | ✅ Sí |
| **useFlowLayoutNext** | `app/composables/` | Configura botón Siguiente | ✅ Sí |
| **useFlowLayoutStore** | `app/stores/` | Estado del botón Siguiente | ✅ Sí |
| **progress-navbar-map.ts** | `app/config/` | Mapeo de rutas | ⚠️ Agregar regla |
| **society-register-navigation.ts** | `app/config/` | Configuración de pasos | ❌ Crear equivalente |

---

## 🎯 Diferencias Clave: Sociedades vs Juntas

| Aspecto | Sociedades | Juntas |
|---------|------------|--------|
| **Niveles de Navegación** | 1 (Pasos) | 3 (Pasos → Sub-steps → Secciones) |
| **Sidebar Derecho** | ❌ No | ✅ Sí (cuando hay sub-step) |
| **Sub-steps** | ❌ No | ✅ Sí (dinámicos, filtrados) |
| **Progress Bar** | ❌ No | ✅ Sí (agregar) |
| **Colapsable** | ❌ No | ✅ Sí (puntos de agenda) |
| **Ancho Sidebar** | 401px | 320px (izq) + 360px (der opcional) |

---

**Siguiente**: Crear plan de implementación de flow-layout-juntas basado en esta documentación

