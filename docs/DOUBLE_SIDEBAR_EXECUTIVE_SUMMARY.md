# 📊 Resumen Ejecutivo: Sistema de Sidebar Doble

**Documento**: Plan de Implementación Completo  
**Fecha**: Octubre 30, 2025  
**Estimación**: 5 semanas (1 desarrollador)  
**Prioridad**: Alta

---

## 🎯 Objetivo

Crear un **sistema de sidebar doble universal y reutilizable** que sirva para:

1. ✅ Flujos wizard multi-paso (como Registro de Sociedades)
2. ✅ Sistemas de documentación con ToC
3. ✅ Dashboards con navegación contextual
4. ✅ Cualquier flujo futuro de la aplicación

---

## 💡 Concepto Central

### Arquitectura de 3 Componentes

```
┌──────────────┬─────────────────────┬──────────────┐
│              │                     │              │
│  MainSidebar │   Contenido         │ Context      │
│  (Global)    │   Principal         │ Sidebar      │
│              │                     │ (Contextual) │
│              │                     │              │
│  • Home      │   [Contenido del    │  • Progress  │
│  • Módulos   │    paso actual]     │  • ToC       │
│  • Config    │                     │  • Custom    │
│              │   [Footer Actions]  │              │
└──────────────┴─────────────────────┴──────────────┘
```

### Características Clave

- 🔄 **Totalmente reutilizable** - Un layout para todos los flujos
- 🎨 **3 modos de operación** - Wizard, Docs, Híbrido
- 💾 **Persistencia inteligente** - Backend + localStorage fallback
- 📱 **Responsive perfecto** - Mobile, tablet, desktop
- 🔐 **Gestión de permisos** - Integrado con sistema de roles
- 🌐 **i18n nativo** - Todas las etiquetas traducibles
- ⚡ **Estados de carga** - Skeletons y transiciones

---

## 🏗️ Componentes Principales

### 1. DoubleSidebarLayout (Orquestador)

**Responsabilidad**: Layout maestro que coordina todo

**Props principales**:

```typescript
{
  leftSidebar: { visible, collapsible, width },
  rightSidebar: { visible, mode: 'progress' | 'toc' | 'custom', width },
  isWizardFlow: boolean,
  showProgressBar: boolean,
  isLoading: boolean
}
```

### 2. MainSidebar (Navegación Global)

**Responsabilidad**: Navegación principal de la app

- Secciones colapsables jerárquicas (hasta 3 niveles)
- Detección automática de ruta activa
- Verificación de permisos por item
- Header personalizable (logo, usuario)

### 3. ContextSidebar (Navegación Contextual)

**Responsabilidad**: Contenido específico del flujo actual

**Modos**:

- **Progress**: Lista de pasos con estados (pending, active, completed, locked)
- **ToC**: Tabla de contenidos con scroll spy
- **Custom**: Cualquier contenido personalizado

### 4. useFlowNavigation (Composable Core)

**Responsabilidad**: Lógica de navegación entre pasos

```typescript
const {
  steps, // Lista de pasos
  currentStepIndex, // Paso actual
  currentStep, // Paso activo
  goToStep, // Navegar a paso específico
  nextStep, // Siguiente paso
  prevStep, // Paso anterior
  canGoNext, // ¿Puede avanzar?
  canGoPrev, // ¿Puede retroceder?
  saveProgress, // Guardar en backend
  restoreProgress, // Restaurar desde path_current
} = useFlowNavigation("registro-sociedades");
```

---

## 📦 Lo Que Reutilizamos (YA existe)

### ✅ Componentes shadcn-vue (25 componentes)

- `Sidebar`, `SidebarProvider`, `SidebarContent`, `SidebarMenu`, etc.
- **Ya están instalados y funcionan perfectamente**

### ✅ Componentes actuales

- `ProgressNavBar.vue` → Lo adaptamos como `ProgressSteps.vue`
- `CheckIcon.vue` → Reutilización directa
- `HeaderProgressNavbar.vue` → Lo integramos

### ✅ Composables existentes

- `useProboI18n` - Internacionalización
- `useUser` - Permisos y roles
- `useProgressNavbarStore` - Lo adaptamos

### ✅ Configuración actual

- `navigation.ts` - Navegación global
- `progress-navbar-map.ts` - Mapeo de rutas
- `society-register-navigation.ts` - Pasos de registro

---

## 🆕 Lo Que Crearemos

### Nuevos Componentes (6)

1. `DoubleSidebarLayout.vue` - Layout maestro
2. `MainSidebar.vue` - Sidebar izquierdo genérico
3. `ContextSidebar.vue` - Sidebar derecho
4. `FlowFooterActions.vue` - Botones de navegación
5. `TableOfContents.vue` - ToC para docs
6. `StepIndicator.vue` - Indicador visual de paso

### Nuevos Composables (2)

1. `useDoubleSidebar` - Estado y control de sidebars
2. `useFlowNavigation` - Lógica de wizard

### Nuevos Tipos TypeScript (5 archivos)

1. `types/double-sidebar.ts`
2. `types/flow-navigation.ts`
3. `types/navigation-config.ts`
4. `types/sidebar-state.ts`
5. `types/flow-step.ts`

### Configuración de Flujos

```
config/flows/
├── registro-sociedades.ts
├── junta-accionistas.ts
└── [otros flujos futuros]
```

---

## 🔑 Feature: Persistencia de Progreso

### Flujo de Persistencia

```
1. Usuario completa un paso
   ↓
2. useFlowNavigation.saveProgress()
   ↓
3. PUT /api/flows/:flowId/progress
   {
     flowId: "registro-sociedades",
     currentStepIndex: 2,
     completedSteps: [0, 1, 2],
     pathCurrent: "/registro-societario/sociedades/crear/accionistas",
     timestamp: 1698765432000
   }
   ↓
4. Backend guarda en DB
   ↓
5. Respuesta exitosa → actualiza estado local
```

### Restauración desde Backend

```
1. Usuario entra al flujo
   ↓
2. useFlowNavigation.restoreProgress()
   ↓
3. GET /api/flows/:flowId/progress
   ↓
4. Backend responde con:
   {
     pathCurrent: "/registro-societario/sociedades/crear/accionistas",
     completedSteps: [0, 1, 2]
   }
   ↓
5. Sistema navega automáticamente a pathCurrent
   ↓
6. Marca pasos anteriores como completados
```

### Fallback localStorage

Si backend falla o no está disponible:

```typescript
// Guarda en localStorage
localStorage.setItem("probo_flow_registro_sociedades", JSON.stringify(progressData));

// Restaura en próxima sesión
const cached = localStorage.getItem("probo_flow_registro_sociedades");
```

---

## 📅 Timeline de Implementación

### Semana 1: Fundamentos

- Tipos TypeScript completos
- Composables `useDoubleSidebar` y `useFlowNavigation`
- Layout base `DoubleSidebarLayout.vue`

### Semana 2: Componentes

- `MainSidebar.vue` completo
- `ContextSidebar.vue` con 3 modos
- `FlowFooterActions.vue`

### Semana 3: Integración

- Configuración de flujos existentes
- Sistema de persistencia (backend + localStorage)
- Estados de carga y skeletons

### Semana 4: Testing

- Tests unitarios (composables)
- Tests de integración (componentes)
- Tests E2E (flujos completos)
- Migración del flujo "Registro de Sociedades"

### Semana 5: Features Avanzadas

- Validaciones avanzadas por paso
- Animaciones y transiciones
- Optimizaciones de performance
- Documentación completa

---

## 🎨 Ejemplo de Uso (Simple)

### Caso 1: Flujo Wizard Simple

```vue
<template>
  <DoubleSidebarLayout :config="miFlowConfig" is-wizard-flow>
    <NuxtPage />
  </DoubleSidebarLayout>
</template>

<script setup lang="ts">
  const miFlowConfig = {
    flowId: "mi-flujo",
    steps: [
      { id: "1", title: "Paso 1", route: "/mi-flujo/paso-1", status: "pending" },
      { id: "2", title: "Paso 2", route: "/mi-flujo/paso-2", status: "pending" },
      { id: "3", title: "Paso 3", route: "/mi-flujo/paso-3", status: "pending" },
    ],
  };
</script>
```

### Caso 2: Documentación con ToC

```vue
<template>
  <DoubleSidebarLayout
    :left-sidebar="{ visible: true }"
    :right-sidebar="{ visible: true, mode: 'toc' }"
  >
    <template #right-content>
      <TableOfContents :items="tocItems" />
    </template>

    <article>
      <!-- Tu contenido de documentación -->
    </article>
  </DoubleSidebarLayout>
</template>
```

### Caso 3: Dashboard Híbrido

```vue
<template>
  <DoubleSidebarLayout
    :left-sidebar="{ visible: true, collapsible: true }"
    :right-sidebar="{ visible: true, mode: 'custom' }"
  >
    <template #right-content>
      <!-- Widgets personalizados -->
      <QuickActions />
      <RecentActivity />
      <Notifications />
    </template>

    <DashboardContent />
  </DoubleSidebarLayout>
</template>
```

---

## 🎯 Migración del Flujo Actual

### Registro de Sociedades (Antes)

```vue
<!-- app/layouts/flow-layout.vue -->
<template>
  <div class="flex flex-col h-screen">
    <HeaderProgressNavbar />
    <div class="flex">
      <div class="w-[401px]">
        <ProgressNavBar :steps="steps" />
      </div>
      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>
```

### Registro de Sociedades (Después)

```vue
<!-- pages/registro-societario/sociedades/[mode]/layout.vue -->
<template>
  <DoubleSidebarLayout
    :config="registroSociedadesConfig"
    is-wizard-flow
    show-progress-bar
    show-footer-actions
  >
    <NuxtPage />
  </DoubleSidebarLayout>
</template>

<script setup lang="ts">
  import { registroSociedadesConfig } from "~/config/flows/registro-sociedades";
</script>
```

**Ventajas**:

- ✅ Menos código
- ✅ Más reutilizable
- ✅ Mejor tipado
- ✅ Persistencia incluida
- ✅ Estados de carga automáticos

---

## 📊 Métricas de Éxito

### Funcionalidad

- [ ] ✅ 100% de flujos migrados sin problemas
- [ ] ✅ Navegación funciona perfectamente en todos los breakpoints
- [ ] ✅ Persistencia funciona (backend + localStorage)
- [ ] ✅ Restauración desde `path_current` funciona
- [ ] ✅ Todos los permisos se respetan

### Performance

- [ ] ✅ Layout rinde a 60fps en mobile
- [ ] ✅ Transiciones son suaves
- [ ] ✅ No hay re-renders innecesarios
- [ ] ✅ Lazy loading de pasos funciona

### Testing

- [ ] ✅ 80%+ cobertura de tests
- [ ] ✅ Tests E2E pasan en todos los flujos
- [ ] ✅ Tests de accesibilidad pasan (WCAG 2.1 AA)

### UX

- [ ] ✅ Usuarios pueden navegar sin confusión
- [ ] ✅ Estados de carga son claros
- [ ] ✅ Errores se manejan gracefully
- [ ] ✅ Feedback visual es inmediato

---

## 🚀 Quick Start (Cuando esté listo)

### 1. Instalar (si falta algo)

```bash
# Ya tienes shadcn-vue instalado, solo asegúrate de tener todo
npx shadcn-vue@latest add sidebar
```

### 2. Crear tu primer flujo

```typescript
// config/flows/mi-flujo.ts
export const miFlowConfig = defineFlowConfig({
  flowId: "mi-flujo",
  mode: "wizard",
  steps: [
    /* tus pasos */
  ],
});
```

### 3. Usar en tu layout

```vue
<template>
  <DoubleSidebarLayout :config="miFlowConfig" is-wizard-flow>
    <NuxtPage />
  </DoubleSidebarLayout>
</template>
```

### 4. ¡Listo! 🎉

---

## 📚 Documentación Completa

Ver: [`DOUBLE_SIDEBAR_PLAN.md`](./DOUBLE_SIDEBAR_PLAN.md) para detalles completos

---

## ✅ Próximos Pasos Inmediatos

1. **Revisar este resumen y el plan completo**
2. **Aprobar el enfoque**
3. **Comenzar Fase 1**: Crear tipos TypeScript
4. **Daily check-ins** para validar progreso

---

¿Listo para empezar? 🚀
