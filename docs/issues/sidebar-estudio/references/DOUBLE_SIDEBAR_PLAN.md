````markdown
# 🎯 Plan de Implementación: Sidebar Doble Reutilizable

**Fecha**: Octubre 30, 2025  
**Objetivo**: Crear un sistema de sidebar doble universal, reutilizable para todos los flujos de la aplicación, con soporte para navegación dinámica, estados de carga, persistencia de progreso y máxima flexibilidad.

---

## 📋 Índice

1. [Análisis de Componentes Existentes](#1-análisis-de-componentes-existentes)
2. [Arquitectura del Sidebar Doble](#2-arquitectura-del-sidebar-doble)
3. [Responsabilidades y Casos de Uso](#3-responsabilidades-y-casos-de-uso)
4. [Estructura de Datos](#4-estructura-de-datos)
5. [Plan de Implementación por Fases](#5-plan-de-implementación-por-fases)
6. [Testing y Validación](#6-testing-y-validación)
7. [Migración de Flujos Existentes](#7-migración-de-flujos-existentes)

---

## 1. Análisis de Componentes Existentes

### ✅ Ya tenemos (Reutilizables)

#### Componentes shadcn-vue (`app/components/ui/sidebar/`)

- ✅ **Sidebar** - Container base
- ✅ **SidebarProvider** - Context y gestión de estado
- ✅ **SidebarContent** - Área de contenido scrolleable
- ✅ **SidebarHeader** - Header del sidebar
- ✅ **SidebarFooter** - Footer del sidebar
- ✅ **SidebarMenu** - Lista de navegación
- ✅ **SidebarMenuItem** - Item individual
- ✅ **SidebarMenuButton** - Botón de navegación
- ✅ **SidebarMenuSub** - Submenú colapsable
- ✅ **SidebarMenuSubButton** - Botón de submenú
- ✅ **SidebarTrigger** - Toggle de sidebar
- ✅ **SidebarInset** - Contenedor de contenido principal
- ✅ **useSidebar** - Composable para estado del sidebar

#### Componentes de Progress Navbar existentes

- ✅ **ProgressNavBar.vue** - Lista de pasos verticales
- ✅ **CheckIcon.vue** - Indicador visual de estado
- ✅ **HeaderProgressNavbar.vue** - Barra de progreso horizontal
- ✅ **flow-layout.vue** - Layout actual con sidebar de progreso

#### Composables y Stores

- ✅ **useProgressNavbarRoutes** - Lógica de rutas y pasos
- ✅ **useProgressNavbarStore** - Estado global de pasos
- ✅ **useProboI18n** - Internacionalización
- ✅ **useUser** - Permisos y roles

#### Configuración de Navegación

- ✅ **navigation.ts** - Configuración del sidebar principal
- ✅ **progress-navbar-map.ts** - Mapeo de rutas a pasos
- ✅ **society-register-navigation.ts** - Pasos de registro societario

### ⚠️ Lo que adaptaremos

- **ProboSidebar.vue** - Sidebar principal (izquierdo) → Lo generalizaremos
- **flow-layout.vue** - Layout actual → Lo haremos más flexible

### 🆕 Lo que crearemos

1. **DoubleSidebarLayout.vue** - Layout maestro
2. **MainSidebar.vue** - Sidebar izquierdo genérico
3. **ContextSidebar.vue** - Sidebar derecho contextual
4. **useDoubleSidebar** - Composable principal
5. **useFlowNavigation** - Composable para flujos wizard
6. **Tipos TypeScript** completos

---

## 2. Arquitectura del Sidebar Doble

### 🏗️ Estructura de Capas

```
DoubleSidebarLayout (Orquestador)
├─ SidebarProvider (Context global)
│  ├─ MainSidebar (Izquierdo)
│  │  ├─ SidebarHeader (Logo, usuario, config)
│  │  ├─ SidebarContent (Navegación principal)
│  │  │  └─ NavigationTree (Jerárquico, colapsable)
│  │  └─ SidebarFooter (User actions, config)
│  │
│  ├─ SidebarInset (Contenido central)
│  │  ├─ SidebarTrigger (Toggle sidebars)
│  │  ├─ MainContent (slot)
│  │  └─ FooterActions (Botones de navegación)
│  │
│  └─ ContextSidebar (Derecho)
│     ├─ SidebarHeader (Título contextual)
│     ├─ SidebarContent (Navegación secundaria)
│     │  ├─ ProgressSteps (Wizard flows)
│     │  ├─ TableOfContents (Docs flows)
│     │  └─ CustomContent (Otros casos)
│     └─ SidebarFooter (Acciones contextuales)
```

### 🎯 Modos de Operación

#### Modo 1: Navegación Clásica (DocsLayout style)

```
┌────────────┬─────────────────┬────────────┐
│            │                 │            │
│  Main Nav  │  Content Area   │  ToC       │
│            │                 │            │
│  - Home    │  Lorem ipsum... │  - Intro   │
│  - Docs    │                 │  - Setup   │
│  - API     │  Code samples   │  - Config  │
│            │                 │  - Deploy  │
└────────────┴─────────────────┴────────────┘
```

**Características**:

- Sidebar izquierdo: Navegación completa del sitio
- Sidebar derecho: Tabla de contenidos contextual
- Sin estado de wizard
- Navegación libre

#### Modo 2: Flujo Wizard (Flow Layout style)

```
┌────────────┬─────────────────┬────────────┐
│            │  Progress Bar   │            │
│            ├─────────────────┤            │
│  Main Nav  │                 │  Progress  │
│            │  Step Content   │            │
│  - Home    │                 │  ✓ Paso 1  │
│  - Wizard  │  Form fields    │  → Paso 2  │
│  - Docs    │                 │    Paso 3  │
│            │                 │    Paso 4  │
│            ├─────────────────┤            │
│            │ [Prev] [Next]   │            │
└────────────┴─────────────────┴────────────┘
```

**Características**:

- Sidebar izquierdo: Navegación global (puede ocultarse)
- Sidebar derecho: Pasos del wizard con estado
- Barra de progreso horizontal
- Navegación secuencial con validación
- Persistencia de progreso

#### Modo 3: Híbrido

```
┌────────────┬─────────────────┬────────────┐
│            │                 │            │
│  Main Nav  │  Content Area   │  Mixed     │
│            │                 │            │
│  - Module  │  Dashboard      │  Quick Nav │
│  - Actions │                 │  ─────────  │
│  - Reports │  Charts & Data  │  Progress  │
│            │                 │  - Task 1  │
│            │                 │  - Task 2  │
└────────────┴─────────────────┴────────────┘
```

**Características**:

- Sidebar izquierdo: Navegación de módulo
- Sidebar derecho: Mixto (navegación rápida + progreso)
- Flexible según contexto

### 🔄 Estados del Sistema

```typescript
type SidebarState = {
  left: {
    visible: boolean; // Sidebar visible o no
    collapsed: boolean; // Colapsado (icon mode)
    locked: boolean; // Bloqueado (no se puede cerrar)
  };
  right: {
    visible: boolean;
    mode: "progress" | "toc" | "custom"; // Modo de operación
    collapsed: boolean;
  };
  mobile: {
    leftOpen: boolean; // Menu overlay
    rightOpen: boolean;
  };
};

type FlowState = {
  isWizard: boolean; // ¿Es un flujo wizard?
  currentStep: number; // Paso actual
  completedSteps: number[]; // Pasos completados
  lockedSteps: number[]; // Pasos bloqueados
  canGoBack: boolean; // Puede retroceder
  canGoNext: boolean; // Puede avanzar
  isLoading: boolean; // Estado de carga
  isDirty: boolean; // Hay cambios sin guardar
};
```

---

## 3. Responsabilidades y Casos de Uso

### 📦 DoubleSidebarLayout (Componente Maestro)

**Responsabilidades**:

- ✅ Orquestar sidebars izquierdo y derecho
- ✅ Gestionar responsive (mobile/tablet/desktop)
- ✅ Proveer slots para contenido personalizado
- ✅ Manejar estados globales (loading, error)
- ✅ Coordinar navegación entre sidebars
- ✅ Gestionar overlays y focus trap en mobile

**Props**:

```typescript
interface DoubleSidebarLayoutProps {
  // Configuración de sidebars
  leftSidebar?: {
    visible?: boolean;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    locked?: boolean; // No se puede ocultar
    width?: string; // Default: "300px"
  };
  rightSidebar?: {
    visible?: boolean;
    mode?: "progress" | "toc" | "custom";
    width?: string; // Default: "320px"
  };

  // Configuración de wizard
  isWizardFlow?: boolean;
  showProgressBar?: boolean;
  showFooterActions?: boolean;

  // Loading states
  isLoading?: boolean;
  loadingMessage?: string;

  // Personalización
  headerHeight?: string;
  footerHeight?: string;
}
```

**Slots**:

```vue
<DoubleSidebarLayout>
  <!-- Sidebar izquierdo -->
  <template #left-header>Logo y config</template>
  <template #left-content>Navegación</template>
  <template #left-footer>User menu</template>

  <!-- Sidebar derecho -->
  <template #right-header>Título</template>
  <template #right-content>Progress/ToC</template>
  <template #right-footer>Acciones</template>

  <!-- Contenido principal -->
  <template #header>Barra de progreso</template>
  <template #default>Contenido</template>
  <template #footer>Botones de acción</template>
</DoubleSidebarLayout>
```

**Casos de uso**:

1. ✅ Dashboard general con navegación completa
2. ✅ Flujos wizard multi-paso
3. ✅ Documentación con ToC
4. ✅ Formularios complejos con guías
5. ✅ Editores con paneles laterales

---

### 📦 MainSidebar (Sidebar Izquierdo)

**Responsabilidades**:

- ✅ Mostrar navegación global o modular
- ✅ Detectar ruta activa automáticamente
- ✅ Soportar navegación jerárquica (hasta 3 niveles)
- ✅ Gestionar secciones colapsables
- ✅ Verificar permisos de usuario
- ✅ Internacionalización de labels

**Props**:

```typescript
interface MainSidebarProps {
  // Configuración de navegación
  navigation: NavigationSection[];

  // Comportamiento
  collapseOnNavigate?: boolean; // Cerrar en mobile
  highlightActive?: boolean; // Resaltar activo
  expandActiveSection?: boolean; // Expandir sección activa

  // Personalización
  showHeader?: boolean;
  showFooter?: boolean;
  headerLogo?: string;

  // Estado
  isLoading?: boolean;
}
```

**Estructura de Navegación**:

```typescript
interface NavigationSection {
  id: string;
  title: string;
  translationKey: string;
  icon?: string;
  defaultExpanded?: boolean;
  requiredPermission?: string;
  items: NavigationItem[];
}

interface NavigationItem {
  id: string;
  title: string;
  translationKey: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  requiredPermission?: string;
  submenuItems?: NavigationSubItem[];
}

interface NavigationSubItem {
  id: string;
  title: string;
  translationKey: string;
  href: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}
```

---

### 📦 ContextSidebar (Sidebar Derecho)

**Responsabilidades**:

- ✅ Mostrar progreso de wizard (modo progress)
- ✅ Mostrar tabla de contenidos (modo toc)
- ✅ Contenido personalizado (modo custom)
- ✅ Gestionar navegación entre pasos
- ✅ Indicar estado de cada paso
- ✅ Restaurar progreso desde backend

**Props**:

```typescript
interface ContextSidebarProps {
  mode: "progress" | "toc" | "custom";

  // Modo Progress
  steps?: FlowStep[];
  currentStep?: number;
  allowSkip?: boolean;
  allowBackward?: boolean;

  // Modo ToC
  tocItems?: TocItem[];
  scrollSpy?: boolean; // Resaltar según scroll

  // Estado
  isLoading?: boolean;
}
```

**Estructura de Pasos**:

```typescript
interface FlowStep {
  id: string;
  title: string;
  description?: string;
  route: string;
  status: "pending" | "active" | "completed" | "locked" | "error";
  icon?: string;
  duration?: number; // Tiempo estimado (minutos)
  optional?: boolean;
  disabled?: boolean;
  substeps?: FlowSubStep[];

  // Validación
  canNavigateTo?: (context: FlowContext) => boolean;
  onEnter?: (context: FlowContext) => Promise<void>;
  onExit?: (context: FlowContext) => Promise<void>;
}

interface FlowSubStep {
  id: string;
  title: string;
  anchor: string; // Para scroll
  status: "pending" | "completed" | "error";
}

interface FlowContext {
  currentStep: number;
  completedSteps: number[];
  formData: Record<string, any>;
  user: User;
}
```

---

### 🧩 useDoubleSidebar (Composable Principal)

**Responsabilidades**:

- ✅ Gestionar estado global del layout
- ✅ Controlar visibilidad de sidebars
- ✅ Sincronizar con responsive breakpoints
- ✅ Manejar transiciones
- ✅ Persistir preferencias en localStorage

**API**:

```typescript
function useDoubleSidebar(config?: DoubleSidebarConfig) {
  return {
    // Estado
    leftSidebar: Ref<SidebarState>;
    rightSidebar: Ref<SidebarState>;
    isMobile: Ref<boolean>;
    isTablet: Ref<boolean>;
    isDesktop: Ref<boolean>;

    // Acciones
    toggleLeft: () => void;
    toggleRight: () => void;
    collapseLeft: () => void;
    collapseRight: () => void;
    openLeft: () => void;
    openRight: () => void;
    closeLeft: () => void;
    closeRight: () => void;

    // Queries
    isLeftVisible: ComputedRef<boolean>;
    isRightVisible: ComputedRef<boolean>;
    contentWidth: ComputedRef<string>;

    // Persistencia
    savePreferences: () => void;
    loadPreferences: () => void;
  };
}
```

---

### 🧩 useFlowNavigation (Composable para Wizard)

**Responsabilidades**:

- ✅ Gestionar lógica de navegación entre pasos
- ✅ Validar transiciones
- ✅ Persistir progreso en backend
- ✅ Restaurar estado desde `path_current`
- ✅ Manejar estados de carga
- ✅ Detectar cambios sin guardar

**API**:

```typescript
function useFlowNavigation(flowId: string) {
  return {
    // Estado
    steps: Ref<FlowStep[]>;
    currentStepIndex: Ref<number>;
    currentStep: ComputedRef<FlowStep>;
    isLoading: Ref<boolean>;
    isDirty: Ref<boolean>;

    // Navegación
    goToStep: (index: number) => Promise<boolean>;
    nextStep: () => Promise<boolean>;
    prevStep: () => Promise<boolean>;
    goToRoute: (route: string) => Promise<boolean>;

    // Validación
    canGoNext: ComputedRef<boolean>;
    canGoPrev: ComputedRef<boolean>;
    canSkipStep: (index: number) => boolean;

    // Progreso
    completedSteps: ComputedRef<number[]>;
    progress: ComputedRef<number>; // 0-100
    saveProgress: () => Promise<void>;
    restoreProgress: () => Promise<void>;

    // Lifecycle hooks
    onStepEnter: (callback: StepCallback) => void;
    onStepExit: (callback: StepCallback) => void;
  };
}
```

---

## 4. Estructura de Datos

### 📁 Tipos TypeScript

```typescript
// types/double-sidebar.ts
export interface DoubleSidebarConfig {
  flowId: string;
  mode: "wizard" | "docs" | "hybrid";
  navigation: NavigationConfig;
  steps?: FlowStep[];
  persistence?: PersistenceConfig;
}

export interface NavigationConfig {
  sections: NavigationSection[];
  mode: "modular" | "global";
}

export interface PersistenceConfig {
  enabled: boolean;
  backend?: {
    endpoint: string;
    method: "POST" | "PUT";
    pathKey: "path_current"; // Key para path actual
  };
  localStorage?: {
    enabled: boolean;
    key: string;
  };
}

export interface FlowProgressData {
  flowId: string;
  currentStepIndex: number;
  completedSteps: number[];
  pathCurrent: string; // Del backend
  formData?: Record<string, any>;
  timestamp: number;
}
```

### 📁 Configuración de Flujos

```typescript
// config/flows/
export const flowConfigs: Record<string, DoubleSidebarConfig> = {
  "registro-sociedades": {
    flowId: "registro-sociedades",
    mode: "wizard",
    navigation: {
      sections: [
        /* ... */
      ],
      mode: "modular",
    },
    steps: [
      /* ... */
    ],
    persistence: {
      enabled: true,
      backend: {
        endpoint: "/api/flows/registro-sociedades/progress",
        method: "PUT",
        pathKey: "path_current",
      },
      localStorage: {
        enabled: true,
        key: "probo_flow_registro_sociedades",
      },
    },
  },

  "junta-accionistas": {
    flowId: "junta-accionistas",
    mode: "wizard",
    // ...
  },

  documentacion: {
    flowId: "docs",
    mode: "docs",
    navigation: {
      sections: [
        /* ... */
      ],
      mode: "global",
    },
    // Sin steps, usa ToC
  },
};
```

---

## 5. Plan de Implementación por Fases

### 🔷 Fase 1: Fundamentos (Semana 1)

#### Día 1-2: Tipos y Arquitectura

- [ ] Crear tipos TypeScript completos
  - `types/double-sidebar.ts`
  - `types/flow-navigation.ts`
  - `types/navigation-config.ts`
- [ ] Documentar interfaces en detalle
- [ ] Crear diagramas de flujo
- [ ] Configurar estructura de carpetas

#### Día 3-4: Composables Core

- [ ] Implementar `useDoubleSidebar`
  - Estado reactivo
  - Responsive breakpoints
  - Persistencia de preferencias
- [ ] Implementar `useFlowNavigation`
  - Lógica de pasos
  - Validaciones
  - Persistencia de progreso
- [ ] Tests unitarios de composables

#### Día 5: Layout Base

- [ ] Crear `DoubleSidebarLayout.vue`
  - Estructura base con slots
  - Integración con SidebarProvider
  - Responsive behavior
  - Loading states
- [ ] Tests de integración

---

### 🔷 Fase 2: Componentes de Sidebar (Semana 2)

#### Día 1-2: MainSidebar

- [ ] Crear `MainSidebar.vue`
  - Adaptación de ProboSidebar actual
  - Soporte para configuración dinámica
  - Detección de ruta activa
  - Permisos y roles
- [ ] Componentes auxiliares
  - `NavigationSection.vue`
  - `NavigationItem.vue`
  - `NavigationSubItem.vue`

#### Día 3-4: ContextSidebar

- [ ] Crear `ContextSidebar.vue`
  - Modo Progress (wizard)
  - Modo ToC (docs)
  - Modo Custom
- [ ] Componentes específicos
  - `ProgressSteps.vue` (adaptación actual)
  - `TableOfContents.vue`
  - `StepIndicator.vue`
- [ ] Integración con `useFlowNavigation`

#### Día 5: Footer y Acciones

- [ ] Crear `FlowFooterActions.vue`
  - Botones Prev/Next
  - Estados disabled
  - Loading states
  - Validaciones
- [ ] Integración con navegación

---

### 🔷 Fase 3: Integración y Configuración (Semana 3)

#### Día 1-2: Configuración de Flujos

- [ ] Crear configuraciones para flujos existentes
  - `config/flows/registro-sociedades.ts`
  - `config/flows/junta-accionistas.ts`
- [ ] Migrar navegación actual
- [ ] Adaptar mapeo de rutas

#### Día 3-4: Sistema de Persistencia

- [ ] Implementar persistencia en backend
  - API endpoints
  - Middleware
  - Validaciones
- [ ] Implementar fallback localStorage
- [ ] Restauración desde `path_current`

#### Día 5: Estados de Carga

- [ ] Skeletons para sidebars
- [ ] Loading overlays
- [ ] Transiciones suaves
- [ ] Error boundaries

---

### 🔷 Fase 4: Testing y Refinamiento (Semana 4)

#### Día 1-2: Testing Completo

- [ ] Tests unitarios de todos los composables
- [ ] Tests de integración de componentes
- [ ] Tests E2E de flujos wizard
- [ ] Tests de responsive
- [ ] Tests de accesibilidad

#### Día 3-4: Migración de Flujo Existente

- [ ] Migrar "Registro de Sociedades" al nuevo sistema
  - Adaptar layout
  - Configurar pasos
  - Probar navegación
  - Validar persistencia

#### Día 5: Documentación

- [ ] Documentar API completa
- [ ] Ejemplos de uso
- [ ] Guía de migración
- [ ] Troubleshooting guide

---

### 🔷 Fase 5: Features Avanzadas (Semana 5)

#### Día 1-2: Validaciones Avanzadas

- [ ] Sistema de validación por paso
- [ ] Bloqueo condicional de pasos
- [ ] Mensajes de error contextuales
- [ ] Confirmaciones de navegación

#### Día 3-4: UX Enhancements

- [ ] Animaciones y transiciones
- [ ] Tooltips y hints
- [ ] Atajos de teclado
- [ ] Breadcrumbs dinámicos
- [ ] Indicadores de tiempo

#### Día 5: Optimizaciones

- [ ] Performance optimization
- [ ] Lazy loading de pasos
- [ ] Prefetch de rutas siguientes
- [ ] Cache inteligente

---

## 6. Testing y Validación

### 🧪 Test Cases Principales

#### Navegación Básica

- [ ] Navegación entre pasos secuencial
- [ ] Navegación a paso específico
- [ ] Navegación bloqueada (pasos locked)
- [ ] Navegación opcional (skip step)
- [ ] Detección de ruta activa

#### Estados del Sistema

- [ ] Estado de loading
- [ ] Estado de error
- [ ] Estado de dirty form
- [ ] Estados de paso (pending, active, completed)

#### Persistencia

- [ ] Guardar progreso en backend
- [ ] Restaurar desde `path_current`
- [ ] Fallback a localStorage
- [ ] Sincronización entre tabs

#### Responsive

- [ ] Mobile: overlays funcionan
- [ ] Tablet: un sidebar visible
- [ ] Desktop: ambos sidebars
- [ ] Transiciones entre breakpoints

#### Accesibilidad

- [ ] Navegación por teclado
- [ ] Screen readers
- [ ] Focus management
- [ ] ARIA labels

---

## 7. Migración de Flujos Existentes

### 📦 Flujo: Registro de Sociedades

**Estado actual**:

- Layout: `flow-layout.vue`
- Navegación: `society-register-navigation.ts`
- Store: `useProgressNavbarStore`
- Composable: `useProgressNavbarRoutes`

**Migración**:

```vue
<!-- Antes -->
<template>
  <flow-layout>
    <NuxtPage />
  </flow-layout>
</template>

<!-- Después -->
<template>
  <DoubleSidebarLayout :config="registroSociedadesConfig" :is-wizard-flow="true">
    <template #left-content>
      <MainSidebar :navigation="globalNavigation" />
    </template>

    <template #right-content>
      <ContextSidebar mode="progress" :steps="steps" />
    </template>

    <NuxtPage />
  </DoubleSidebarLayout>
</template>

<script setup lang="ts">
  import { registroSociedadesConfig } from "~/config/flows/registro-sociedades";

  const { steps } = useFlowNavigation("registro-sociedades");
  const globalNavigation = useMainNavigation();
</script>
```

**Pasos**:

1. ✅ Crear configuración del flujo
2. ✅ Adaptar navegación existente
3. ✅ Migrar componentes de pasos
4. ✅ Configurar persistencia
5. ✅ Testing exhaustivo
6. ✅ Deploy gradual

---

## 8. Documentación de Uso

### 🚀 Quick Start

```vue
<template>
  <DoubleSidebarLayout :config="myFlowConfig">
    <!-- Tu contenido aquí -->
    <NuxtPage />
  </DoubleSidebarLayout>
</template>

<script setup lang="ts">
  import { defineFlowConfig } from "~/utils/flow-config";

  const myFlowConfig = defineFlowConfig({
    flowId: "mi-flujo",
    mode: "wizard",
    steps: [
      {
        id: "step-1",
        title: "Paso 1",
        route: "/mi-flujo/paso-1",
        status: "pending",
      },
      // ...más pasos
    ],
  });
</script>
```

### 🎨 Personalización

```typescript
// config/flows/mi-flujo.ts
export const miFlowConfig: DoubleSidebarConfig = {
  flowId: "mi-flujo",
  mode: "wizard",

  // Navegación global
  navigation: {
    sections: navigationSections, // Reutiliza la existente
    mode: "global",
  },

  // Pasos del wizard
  steps: [
    {
      id: "datos-basicos",
      title: "Datos Básicos",
      description: "Información general",
      route: "/mi-flujo/datos-basicos",
      status: "pending",
      icon: "FileText",

      // Validación personalizada
      canNavigateTo: (context) => {
        return context.user.hasPermission("mi-flujo:access");
      },

      // Hooks de ciclo de vida
      onEnter: async (context) => {
        console.log("Entrando al paso:", context.currentStep);
      },

      onExit: async (context) => {
        if (context.isDirty) {
          const confirmed = await confirm("¿Guardar cambios?");
          if (confirmed) await context.saveProgress();
        }
      },
    },
    // ...más pasos
  ],

  // Persistencia
  persistence: {
    enabled: true,
    backend: {
      endpoint: "/api/flows/mi-flujo/progress",
      method: "PUT",
      pathKey: "path_current",
    },
  },
};
```

---

## 9. Checklist de Implementación

### ✅ Fase 1: Fundamentos

- [ ] Tipos TypeScript completos
- [ ] `useDoubleSidebar` composable
- [ ] `useFlowNavigation` composable
- [ ] `DoubleSidebarLayout.vue` base
- [ ] Tests unitarios

### ✅ Fase 2: Componentes

- [ ] `MainSidebar.vue`
- [ ] `ContextSidebar.vue`
- [ ] `ProgressSteps.vue`
- [ ] `FlowFooterActions.vue`
- [ ] Tests de integración

### ✅ Fase 3: Integración

- [ ] Configuración de flujos
- [ ] Sistema de persistencia
- [ ] Restauración desde backend
- [ ] Estados de carga

### ✅ Fase 4: Testing

- [ ] Tests E2E
- [ ] Tests de responsive
- [ ] Tests de accesibilidad
- [ ] Migración de flujo existente

### ✅ Fase 5: Features Avanzadas

- [ ] Validaciones avanzadas
- [ ] Animaciones
- [ ] Optimizaciones
- [ ] Documentación completa

---

## 10. Próximos Pasos Inmediatos

1. **Revisar y aprobar este plan**
2. **Crear rama de feature**: `feature/double-sidebar-system`
3. **Comenzar Fase 1, Día 1**: Crear tipos TypeScript
4. **Daily reviews** para ajustar el plan según avancemos

---

¿Estás listo para comenzar? 🚀

````
