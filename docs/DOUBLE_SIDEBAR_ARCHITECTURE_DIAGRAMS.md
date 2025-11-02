```mermaid
# Arquitectura del Sistema de Sidebar Doble

## 1. Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    DoubleSidebarLayout                          │
│                     (Orquestador Maestro)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌─────────────────┐    ┌──────────────┐
│  MainSidebar  │    │  Content Area   │    │   Context    │
│  (Izquierdo)  │    │   + Footer      │    │   Sidebar    │
│               │    │                 │    │  (Derecho)   │
└───────────────┘    └─────────────────┘    └──────────────┘
```

## 2. Flujo de Datos

```
┌──────────────────────────────────────────────────────────────┐
│                    Usuario Interactúa                        │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              useFlowNavigation (Composable)                  │
│  - Valida transición                                         │
│  - Actualiza estado                                          │
│  - Persiste en backend                                       │
└──────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────┐   ┌──────────────┐   ┌─────────────┐
│  Router     │   │   Backend    │   │ localStorage│
│  (Nuxt)     │   │   API        │   │  (Fallback) │
└─────────────┘   └──────────────┘   └─────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              Componentes Re-renderizan                       │
│  - MainSidebar: Actualiza active state                      │
│  - ContextSidebar: Actualiza estados de pasos               │
│  - Content: Muestra nuevo paso                              │
└──────────────────────────────────────────────────────────────┘
```

## 3. Estructura de Componentes

```
App.vue
└── DoubleSidebarLayout.vue
    ├── SidebarProvider (Context)
    │   │
    │   ├── MainSidebar (left)
    │   │   ├── SidebarHeader
    │   │   │   ├── Logo
    │   │   │   └── CloseButton
    │   │   ├── SidebarContent
    │   │   │   └── SidebarMenu
    │   │   │       ├── SidebarMenuItem (nivel 1)
    │   │   │       └── SidebarMenuSub (nivel 2)
    │   │   │           └── SidebarMenuSubItem (nivel 3)
    │   │   └── SidebarFooter
    │   │       └── UserDropdownMenu
    │   │
    │   ├── SidebarInset (center)
    │   │   ├── ProgressBar (opcional)
    │   │   ├── MainContent
    │   │   │   └── <slot> (NuxtPage)
    │   │   └── FooterActions
    │   │       ├── BackButton
    │   │       └── NextButton
    │   │
    │   └── ContextSidebar (right)
    │       ├── SidebarHeader
    │       │   └── Title
    │       ├── SidebarContent
    │       │   ├── [Modo Progress]
    │       │   │   └── ProgressSteps
    │       │   │       └── StepItem
    │       │   │           ├── CheckIcon
    │       │   │           └── StepInfo
    │       │   ├── [Modo ToC]
    │       │   │   └── TableOfContents
    │       │   │       └── TocItem
    │       │   └── [Modo Custom]
    │       │       └── <slot>
    │       └── SidebarFooter
    │           └── <slot>
    │
    └── MobileOverlay (backdrop)
```

## 4. Estados del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                   SidebarState                          │
├─────────────────────────────────────────────────────────┤
│  left: {                                                │
│    visible: boolean         // ¿Está visible?          │
│    collapsed: boolean       // ¿Está colapsado?        │
│    locked: boolean          // ¿No se puede cerrar?    │
│  }                                                      │
│                                                         │
│  right: {                                               │
│    visible: boolean                                     │
│    mode: 'progress' | 'toc' | 'custom'                 │
│    collapsed: boolean                                   │
│  }                                                      │
│                                                         │
│  mobile: {                                              │
│    leftOpen: boolean        // Overlay mobile          │
│    rightOpen: boolean                                   │
│  }                                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    FlowState                            │
├─────────────────────────────────────────────────────────┤
│  isWizard: boolean           // ¿Es flujo wizard?      │
│  currentStep: number         // Índice del paso actual │
│  completedSteps: number[]    // Pasos completados      │
│  lockedSteps: number[]       // Pasos bloqueados       │
│  canGoBack: boolean          // ¿Puede retroceder?     │
│  canGoNext: boolean          // ¿Puede avanzar?        │
│  isLoading: boolean          // Estado de carga        │
│  isDirty: boolean            // ¿Hay cambios?          │
└─────────────────────────────────────────────────────────┘
```

## 5. Responsive Behavior

```
┌─────────────────────────────────────────────────────────┐
│                   Mobile (< 1024px)                     │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐         │
│  │          [☰] Header [⚙]                   │         │
│  ├───────────────────────────────────────────┤         │
│  │                                           │         │
│  │          Content Area                     │         │
│  │                                           │         │
│  │                                           │         │
│  ├───────────────────────────────────────────┤         │
│  │      [← Anterior]  [Siguiente →]         │         │
│  └───────────────────────────────────────────┘         │
│                                                         │
│  ☰ Click → Sidebar overlay (izquierdo)                │
│  ⚙ Click → Progress overlay (derecho)                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                Tablet (1024px - 1280px)                 │
├─────────────────────────────────────────────────────────┤
│  ┌──────┬────────────────────────────────┐             │
│  │ Nav  │  Content Area                  │             │
│  │      │                                │             │
│  │ •    │  Lorem ipsum...                │             │
│  │ •    │                                │             │
│  │ •    │                                │             │
│  │      ├────────────────────────────────┤             │
│  │      │   [← Anterior] [Siguiente →]  │             │
│  └──────┴────────────────────────────────┘             │
│                                                         │
│  Sidebar izquierdo visible                             │
│  Sidebar derecho como overlay o hidden                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Desktop (> 1280px)                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────┬──────────────────────┬──────────┐            │
│  │ Nav  │  Content Area        │ Progress │            │
│  │      │                      │          │            │
│  │ •    │  Lorem ipsum...      │ ✓ Step 1 │            │
│  │ •    │                      │ → Step 2 │            │
│  │ •    │                      │   Step 3 │            │
│  │      ├──────────────────────┤          │            │
│  │      │ [← Prev]    [Next →]│          │            │
│  └──────┴──────────────────────┴──────────┘            │
│                                                         │
│  Ambos sidebars visibles                               │
└─────────────────────────────────────────────────────────┘
```

## 6. Flujo de Navegación Wizard

```
1. Usuario entra al flujo
   │
   ├─→ GET /api/flows/:id/progress
   │   └─→ Backend responde con pathCurrent
   │
   ├─→ useFlowNavigation.restoreProgress()
   │   ├─→ Parsea pathCurrent
   │   ├─→ Marca pasos completados
   │   └─→ Navega a paso actual
   │
   └─→ Renderiza UI con estado restaurado

2. Usuario completa un paso
   │
   ├─→ Valida formulario actual
   │   ├─→ ❌ Error → Muestra mensajes
   │   └─→ ✅ Válido → Continúa
   │
   ├─→ useFlowNavigation.nextStep()
   │   ├─→ Actualiza estado local
   │   ├─→ PUT /api/flows/:id/progress
   │   └─→ navigateTo(nextStepRoute)
   │
   └─→ UI se actualiza automáticamente

3. Usuario navega a paso específico
   │
   ├─→ Click en paso en ContextSidebar
   │
   ├─→ useFlowNavigation.goToStep(index)
   │   ├─→ Verifica canNavigateTo()
   │   ├─→ ❌ Bloqueado → Toast de error
   │   └─→ ✅ Permitido → Navega
   │
   └─→ Actualiza todos los indicadores visuales

4. Usuario sale del flujo
   │
   ├─→ beforeRouteLeave guard
   │   ├─→ ¿isDirty?
   │   ├─→ Sí → confirm("¿Guardar cambios?")
   │   │   ├─→ Sí → saveProgress()
   │   │   └─→ No → Descarta cambios
   │   └─→ No → Permite salir
   │
   └─→ Limpia estado temporal
```

## 7. Sistema de Persistencia

```
┌─────────────────────────────────────────────────────────┐
│                Backend (Prioritario)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PUT /api/flows/:flowId/progress                       │
│  {                                                      │
│    flowId: "registro-sociedades",                      │
│    currentStepIndex: 2,                                │
│    completedSteps: [0, 1, 2],                          │
│    pathCurrent: "/registro-societario/.../paso-3",    │
│    formData: { ... },  // Opcional                     │
│    timestamp: 1698765432000                            │
│  }                                                      │
│                                                         │
│  GET /api/flows/:flowId/progress                       │
│  →  Retorna último estado guardado                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
                        │
                        │ Si falla ↓
┌─────────────────────────────────────────────────────────┐
│              localStorage (Fallback)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Key: "probo_flow_{flowId}"                            │
│  Value: {                                               │
│    ...mismo formato que backend                        │
│  }                                                      │
│                                                         │
│  Se sincroniza con backend cuando vuelve               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 8. Composables y su Relación

```
┌─────────────────────────────────────────────────────────┐
│              useDoubleSidebar()                         │
│  (Estado global del layout)                            │
├─────────────────────────────────────────────────────────┤
│  - leftSidebar: Ref<SidebarState>                      │
│  - rightSidebar: Ref<SidebarState>                     │
│  - toggleLeft(), toggleRight()                          │
│  - Responsive breakpoints                              │
└─────────────────────────────────────────────────────────┘
                        │
                        │ Usa
                        ▼
┌─────────────────────────────────────────────────────────┐
│            useFlowNavigation(flowId)                    │
│  (Lógica de wizard)                                    │
├─────────────────────────────────────────────────────────┤
│  - steps: Ref<FlowStep[]>                              │
│  - currentStepIndex: Ref<number>                       │
│  - goToStep(), nextStep(), prevStep()                  │
│  - saveProgress(), restoreProgress()                   │
└─────────────────────────────────────────────────────────┘
                        │
                        │ Usa
                        ▼
┌─────────────────────────────────────────────────────────┐
│               useProgressNavbarStore()                  │
│  (Pinia store - Estado global de pasos)               │
├─────────────────────────────────────────────────────────┤
│  - steps: FlowStep[]                                   │
│  - setSteps(steps)                                     │
└─────────────────────────────────────────────────────────┘
```

## 9. Validaciones y Guards

```
┌─────────────────────────────────────────────────────────┐
│              Validación de Navegación                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Usuario intenta navegar a Paso N                      │
│       │                                                 │
│       ├─→ ¿Tiene permisos?                            │
│       │   └─→ NO → Error 403                           │
│       │                                                 │
│       ├─→ ¿Paso está locked?                           │
│       │   └─→ SÍ → Toast "Completa pasos anteriores"  │
│       │                                                 │
│       ├─→ ¿canNavigateTo()?                            │
│       │   └─→ NO → Toast con razón específica         │
│       │                                                 │
│       ├─→ ¿Hay cambios sin guardar (isDirty)?         │
│       │   └─→ SÍ → Confirm dialog                      │
│       │                                                 │
│       └─→ ✅ Todas las validaciones pasan              │
│           └─→ Ejecuta onExit() del paso actual        │
│               └─→ Navega al nuevo paso                 │
│                   └─→ Ejecuta onEnter() del nuevo paso │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 10. Estados de un FlowStep

```
┌──────────────────────────────────────────────────────┐
│                 Ciclo de Vida de un Paso             │
├──────────────────────────────────────────────────────┤
│                                                      │
│  pending (inicial)                                   │
│     │                                                │
│     ├─→ Usuario entra → active                       │
│     │                                                │
│     ├─→ Completa paso → completed                    │
│     │                                                │
│     ├─→ Error en validación → error                  │
│     │                                                │
│     └─→ No cumple requisitos → locked                │
│                                                      │
│  Transiciones:                                       │
│  pending → active → completed                        │
│  pending → locked (condicional)                      │
│  active → error (validación falló)                   │
│  error → active (usuario corrige)                    │
│  locked → pending (se cumplen requisitos)            │
│                                                      │
└──────────────────────────────────────────────────────┘
```
```
