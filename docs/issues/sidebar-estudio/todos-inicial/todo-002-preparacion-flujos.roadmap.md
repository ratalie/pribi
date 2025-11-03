# 📋 TODO-002: Preparación de Flujos (Juntas + Sucursales)

**Estado:** 📋 Expediente en Creación  
**Prioridad:** 🔥 Alta  
**Estimación:** 6-8 horas  
**Ubicación:** `todos-inicial/`

---

## 🎯 OBJETIVO

Preparar la infraestructura necesaria para probar el sistema de sidebar universal en dos flujos:

1. **Junta de Accionistas** (3 páginas existentes - simplificar)
2. **Registro de Sucursales** (6-8 páginas nuevas - crear)

**CRÍTICO:** NO tocar Registro de Sociedades (otro equipo trabaja ahí)

---

## 🏗️ DECISIONES ARQUITECTÓNICAS

### **DECISIÓN 1: ¿Cuántas páginas necesita cada flujo?**

#### **Opción A: Mínimo Viable (RECOMENDADA ✅)**

**Junta de Accionistas (3 páginas):**

```
├─ dashboard.vue       - Vista general de juntas
├─ accionistas.vue     - Gestión de accionistas
└─ historico.vue       - Historial de juntas realizadas
```

**Sucursales (6 páginas):**

```
├─ index.vue                    - Lista de sucursales existentes
├─ crear/
│  ├─ datos-generales.vue       - RUC, razón social, tipo
│  ├─ ubicacion.vue             - Dirección, departamento, provincia
│  ├─ representantes.vue        - Gerente, contactos
│  ├─ documentacion.vue         - Subir archivos legales
│  └─ resumen.vue               - Confirmar y crear
```

**Total:** 9 páginas

**Pros:**

- ✅ Suficiente para probar navegación completa
- ✅ Cubre casos: lista, creación step-by-step, resumen
- ✅ Rápido de implementar (páginas simples)

**Contras:**

- ⚠️ No cubre edición (se puede agregar después)

---

#### **Opción B: Completo (Más ambicioso)**

**Junta de Accionistas (6 páginas):**

```
├─ dashboard.vue
├─ accionistas.vue
├─ historico.vue
├─ crear-junta.vue
├─ editar-junta/[id].vue
└─ convocatoria/[id].vue
```

**Sucursales (10 páginas):**

```
├─ index.vue
├─ crear/[5 pasos]
├─ editar/[id]/[5 pasos]
└─ ver/[id].vue
```

**Total:** 16 páginas

**Pros:**

- ✅ Cubre todos los casos de uso
- ✅ Sistema completo desde el inicio

**Contras:**

- ❌ Mucho trabajo para una prueba inicial
- ❌ Más tiempo de implementación
- ❌ Mayor superficie de bugs

---

#### **🎯 DECISIÓN FINAL:**

**Opción A (Mínimo Viable)** ✅

**Razón:**

- Validamos navegación rápido
- Agregamos más páginas después si funciona
- Principio: "Start small, scale fast"

**Aprobado por:** [Pendiente usuario]

---

### **DECISIÓN 2: ¿Estructura flat o jerárquica?**

#### **Opción A: Flat (Sin secciones)**

**Junta de Accionistas:**

```
FlowItems: [
  { id: 'dashboard', level: 0, type: STEP },
  { id: 'accionistas', level: 0, type: STEP },
  { id: 'historico', level: 0, type: STEP }
]
```

**Renderizado:**

```
☐ Dashboard
☐ Accionistas
☐ Histórico
```

**Pros:**

- ✅ Simple
- ✅ Fácil de navegar (pocas opciones)

**Contras:**

- ❌ No agrupa conceptualmente

---

#### **Opción B: Jerárquica (Con secciones) - RECOMENDADA ✅**

**Junta de Accionistas:**

```
FlowItems: [
  { id: 'seccion-gestion', level: 0, type: SECTION, label: 'Gestión' },
  { id: 'dashboard', level: 1, type: STEP, parentId: 'seccion-gestion' },
  { id: 'accionistas', level: 1, type: STEP, parentId: 'seccion-gestion' },

  { id: 'seccion-historial', level: 0, type: SECTION, label: 'Historial' },
  { id: 'historico', level: 1, type: STEP, parentId: 'seccion-historial' }
]
```

**Renderizado:**

```
▼ Gestión
  ☐ Dashboard
  ☐ Accionistas
▼ Historial
  ☐ Histórico
```

**Pros:**

- ✅ Agrupa conceptos relacionados
- ✅ Escalable (fácil agregar más pasos)
- ✅ Prueba navegación jerárquica

**Contras:**

- ⚠️ Un poco más de configuración

---

**Sucursales (Jerárquica):**

```
FlowItems: [
  { id: 'lista', level: 0, type: STEP, label: 'Lista de Sucursales' },

  { id: 'seccion-crear', level: 0, type: SECTION, label: 'Crear Sucursal' },
  { id: 'crear-paso-1', level: 1, type: STEP, parentId: 'seccion-crear', label: 'Datos Generales' },
  { id: 'crear-paso-2', level: 1, type: STEP, parentId: 'seccion-crear', label: 'Ubicación' },
  { id: 'crear-paso-3', level: 1, type: STEP, parentId: 'seccion-crear', label: 'Representantes' },
  { id: 'crear-paso-4', level: 1, type: STEP, parentId: 'seccion-crear', label: 'Documentación' },
  { id: 'crear-paso-5', level: 1, type: STEP, parentId: 'seccion-crear', label: 'Resumen' }
]
```

**Renderizado:**

```
☐ Lista de Sucursales

▼ Crear Sucursal
  ☐ Paso 1: Datos Generales
  ☐ Paso 2: Ubicación
  ☐ Paso 3: Representantes
  ☐ Paso 4: Documentación
  ☐ Paso 5: Resumen
```

---

#### **🎯 DECISIÓN FINAL:**

**Opción B (Jerárquica)** ✅

**Razón:**

- Mejor organización conceptual
- Permite probar colapsado/expandido de secciones
- Escalable para agregar más pasos después

**Aprobado por:** [Pendiente usuario]

---

### **DECISIÓN 3: ¿Enums de rutas o hardcodear?**

#### **Opción A: Hardcodear rutas (❌ NO RECOMENDADO)**

```typescript
const dashboardItem: FlowItem = {
  navigation: {
    route: "/operaciones/junta-accionistas/dashboard",
  },
};
```

**Contras:**

- ❌ Propenso a errores tipográficos
- ❌ Difícil de refactorizar
- ❌ No type-safe

---

#### **Opción B: Enums de rutas (✅ RECOMENDADA)**

```typescript
// app/config/routes/junta-accionistas.routes.ts
export enum JuntaAccionistasRoutes {
  DASHBOARD = "/operaciones/junta-accionistas/dashboard",
  ACCIONISTAS = "/operaciones/junta-accionistas/accionistas",
  HISTORICO = "/operaciones/junta-accionistas/historico",
}

// Uso:
const dashboardItem: FlowItem = {
  navigation: {
    route: JuntaAccionistasRoutes.DASHBOARD,
  },
};
```

**Pros:**

- ✅ Type-safe (TypeScript autocompleta)
- ✅ Fácil refactorizar (cambias en un solo lugar)
- ✅ Previene errores tipográficos
- ✅ Centraliza todas las rutas

---

#### **🎯 DECISIÓN FINAL:**

**Opción B (Enums)** ✅

**Estructura:**

```
app/config/routes/
├─ junta-accionistas.routes.ts
├─ sucursales.routes.ts
└─ index.ts (re-export todo)
```

**Aprobado por:** [Pendiente usuario]

---

### **DECISIÓN 4: ¿Dónde crear FlowItems individuales?**

#### **Opción A: En el FlowConfig (Inline)**

```typescript
// app/config/flows/junta-accionistas.flow.ts
export const juntaFlowConfig: FlowConfig = {
  id: 'junta-flow',
  items: [
    {
      identity: { id: 'dashboard', label: 'Dashboard', ... },
      hierarchy: { level: 0, ... },
      // ... todo inline
    },
    {
      identity: { id: 'accionistas', label: 'Accionistas', ... },
      // ... todo inline
    }
  ]
};
```

**Contras:**

- ❌ Archivo muy grande (>500 líneas)
- ❌ Difícil de mantener
- ❌ No reutilizable

---

#### **Opción B: Módulos separados (✅ RECOMENDADA)**

```typescript
// app/modules/junta-accionistas/flow-items/dashboard.item.ts
export const juntaDashboardItem: FlowItem = {
  identity: { id: 'junta-dashboard', label: 'Dashboard', ... },
  hierarchy: { level: 1, ... },
  // ...
};

// app/modules/junta-accionistas/flow-items/accionistas.item.ts
export const juntaAccionistasItem: FlowItem = { /* ... */ };

// app/modules/junta-accionistas/index.ts
export * from './flow-items/dashboard.item';
export * from './flow-items/accionistas.item';

// app/config/flows/junta-accionistas.flow.ts
import { juntaDashboardItem, juntaAccionistasItem } from '@/modules/junta-accionistas';

export const juntaFlowConfig: FlowConfig = {
  id: 'junta-flow',
  items: [juntaDashboardItem, juntaAccionistasItem, ...]
};
```

**Pros:**

- ✅ Modular (un archivo por FlowItem)
- ✅ Fácil de mantener
- ✅ Reutilizable
- ✅ FlowConfig queda limpio (~50 líneas)

---

#### **🎯 DECISIÓN FINAL:**

**Opción B (Módulos separados)** ✅

**Estructura:**

```
app/modules/
├─ junta-accionistas/
│  ├─ flow-items/
│  │  ├─ sections/
│  │  │  ├─ gestion.section.ts
│  │  │  └─ historial.section.ts
│  │  ├─ dashboard.item.ts
│  │  ├─ accionistas.item.ts
│  │  └─ historico.item.ts
│  └─ index.ts
│
└─ sucursales/
   ├─ flow-items/
   │  ├─ sections/
   │  │  └─ crear.section.ts
   │  ├─ lista.item.ts
   │  ├─ crear-paso-1.item.ts
   │  ├─ crear-paso-2.item.ts
   │  ├─ crear-paso-3.item.ts
   │  ├─ crear-paso-4.item.ts
   │  └─ crear-paso-5.item.ts
   └─ index.ts
```

**Aprobado por:** [Pendiente usuario]

---

### **DECISIÓN 5: ¿Crear playground aislado?**

#### **Opción A: Probar directamente en páginas reales (❌ RIESGOSO)**

**Contras:**

- ❌ Si algo falla, afecta producción
- ❌ Difícil experimentar libremente

---

#### **Opción B: Crear playground aislado (✅ RECOMENDADA)**

```
pages/sidebar-playground/
├─ index.vue              - Índice con links a tests
├─ junta-test.vue         - Sidebar con FlowConfig de Juntas
└─ sucursales-test.vue    - Sidebar con FlowConfig de Sucursales
```

**Playground:**

```vue
<!-- pages/sidebar-playground/junta-test.vue -->
<template>
  <div class="playground">
    <h1>Testing: Junta de Accionistas Flow</h1>

    <!-- Aquí montaremos el sidebar después -->
    <div class="sidebar-preview">
      <pre>{{ JSON.stringify(juntaFlowConfig, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { juntaAccionistasFlowConfig } from "@/config/flows";

  const juntaFlowConfig = juntaAccionistasFlowConfig;
</script>
```

**Pros:**

- ✅ Experimento sin riesgo
- ✅ Fácil comparar configuraciones
- ✅ Debug rápido

---

#### **🎯 DECISIÓN FINAL:**

**Opción B (Playground)** ✅

**Aprobado por:** [Pendiente usuario]

---

## 📋 ARQUITECTURA

### **Estructura de Archivos Resultante:**

```
app/
├─ types/
│  └─ flow-system/              ← TODO-001 (ya creado)
│
├─ config/
│  ├─ routes/                   ← TODO-002
│  │  ├─ junta-accionistas.routes.ts
│  │  ├─ sucursales.routes.ts
│  │  └─ index.ts
│  │
│  └─ flows/                    ← TODO-002
│     ├─ junta-accionistas.flow.ts
│     ├─ sucursales.flow.ts
│     └─ index.ts
│
├─ modules/
│  ├─ junta-accionistas/        ← TODO-002
│  │  ├─ flow-items/
│  │  │  ├─ sections/
│  │  │  │  ├─ gestion.section.ts
│  │  │  │  └─ historial.section.ts
│  │  │  ├─ dashboard.item.ts
│  │  │  ├─ accionistas.item.ts
│  │  │  └─ historico.item.ts
│  │  └─ index.ts
│  │
│  └─ sucursales/               ← TODO-002
│     ├─ flow-items/
│     │  ├─ sections/
│     │  │  └─ crear.section.ts
│     │  ├─ lista.item.ts
│     │  ├─ crear-paso-1.item.ts
│     │  ├─ crear-paso-2.item.ts
│     │  ├─ crear-paso-3.item.ts
│     │  ├─ crear-paso-4.item.ts
│     │  └─ crear-paso-5.item.ts
│     └─ index.ts
│
└─ pages/
   ├─ operaciones/
   │  └─ junta-accionistas/     ← TODO-002 (simplificar existentes)
   │     ├─ dashboard.vue
   │     ├─ accionistas.vue
   │     └─ historico.vue
   │
   ├─ registro-societario/
   │  └─ sucursales/            ← TODO-002 (crear nuevas)
   │     ├─ index.vue
   │     └─ crear/
   │        ├─ datos-generales.vue
   │        ├─ ubicacion.vue
   │        ├─ representantes.vue
   │        ├─ documentacion.vue
   │        └─ resumen.vue
   │
   └─ sidebar-playground/       ← TODO-002 (nuevo)
      ├─ index.vue
      ├─ junta-test.vue
      └─ sucursales-test.vue
```

---

## 📋 ISSUES (Tareas)

### **ISSUE 2.1: Crear Enums de Rutas**

**Archivos a crear:**

1. `app/config/routes/junta-accionistas.routes.ts`
2. `app/config/routes/sucursales.routes.ts`
3. `app/config/routes/index.ts`

**Estimación:** 30 minutos

**Salida esperada:**

```typescript
// junta-accionistas.routes.ts
export enum JuntaAccionistasRoutes {
  DASHBOARD = "/operaciones/junta-accionistas/dashboard",
  ACCIONISTAS = "/operaciones/junta-accionistas/accionistas",
  HISTORICO = "/operaciones/junta-accionistas/historico",
}

// sucursales.routes.ts
export enum SucursalesRoutes {
  INDEX = "/registro-societario/sucursales",
  CREAR_DATOS_GENERALES = "/registro-societario/sucursales/crear/datos-generales",
  CREAR_UBICACION = "/registro-societario/sucursales/crear/ubicacion",
  CREAR_REPRESENTANTES = "/registro-societario/sucursales/crear/representantes",
  CREAR_DOCUMENTACION = "/registro-societario/sucursales/crear/documentacion",
  CREAR_RESUMEN = "/registro-societario/sucursales/crear/resumen",
}
```

---

### **ISSUE 2.2: Crear Páginas Simples (Junta)**

**Archivos a modificar:**

1. `pages/operaciones/junta-accionistas/dashboard.vue` (simplificar)
2. `pages/operaciones/junta-accionistas/accionistas.vue` (simplificar)
3. `pages/operaciones/junta-accionistas/historico.vue` (simplificar)

**Estimación:** 30 minutos

**Template estándar:**

```vue
<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <div class="placeholder">
      <p>Placeholder: {{ pageTitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  const pageTitle = "Dashboard - Junta de Accionistas";
</script>
```

---

### **ISSUE 2.3: Crear Páginas Simples (Sucursales)**

**Archivos a crear:**

1. `pages/registro-societario/sucursales/index.vue`
2. `pages/registro-societario/sucursales/crear/datos-generales.vue`
3. `pages/registro-societario/sucursales/crear/ubicacion.vue`
4. `pages/registro-societario/sucursales/crear/representantes.vue`
5. `pages/registro-societario/sucursales/crear/documentacion.vue`
6. `pages/registro-societario/sucursales/crear/resumen.vue`

**Estimación:** 1 hora

---

### **ISSUE 2.4: Crear FlowItems (Junta)**

**Archivos a crear:**

1. `app/modules/junta-accionistas/flow-items/sections/gestion.section.ts`
2. `app/modules/junta-accionistas/flow-items/sections/historial.section.ts`
3. `app/modules/junta-accionistas/flow-items/dashboard.item.ts`
4. `app/modules/junta-accionistas/flow-items/accionistas.item.ts`
5. `app/modules/junta-accionistas/flow-items/historico.item.ts`
6. `app/modules/junta-accionistas/index.ts`

**Estimación:** 1.5 horas

**Ejemplo:**

```typescript
// dashboard.item.ts
import type { FlowItem } from "@/types/flow-system";
import { FlowItemType, NavigationBehavior } from "@/types/flow-system";
import { JuntaAccionistasRoutes } from "@/config/routes";

export const juntaDashboardItem: FlowItem = {
  identity: {
    id: "junta-dashboard",
    type: FlowItemType.STEP,
    label: "Dashboard",
    shortLabel: "Dashboard",
    description: "Vista general de juntas de accionistas",
    icon: "IconDashboard",
  },
  hierarchy: {
    parentId: "junta-seccion-gestion",
    level: 1,
    order: 0,
  },
  navigation: {
    route: JuntaAccionistasRoutes.DASHBOARD,
    behavior: NavigationBehavior.PUSH,
  },
  behavior: {
    isActive: false,
    isCompleted: false,
    isDisabled: false,
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isOptional: false,
    requiresConfirmation: false,
    isSkippable: false,
  },
  rightSidebar: {
    enabled: false,
  },
  validation: {
    required: false,
    validateOnExit: false,
    validateOnEnter: false,
    blockNavigationOnError: false,
    confirmOnWarning: false,
  },
};
```

---

### **ISSUE 2.5: Crear FlowItems (Sucursales)**

**Archivos a crear:**

1. `app/modules/sucursales/flow-items/sections/crear.section.ts`
2. `app/modules/sucursales/flow-items/lista.item.ts`
3. `app/modules/sucursales/flow-items/crear-paso-1.item.ts`
4. `app/modules/sucursales/flow-items/crear-paso-2.item.ts`
5. `app/modules/sucursales/flow-items/crear-paso-3.item.ts`
6. `app/modules/sucursales/flow-items/crear-paso-4.item.ts`
7. `app/modules/sucursales/flow-items/crear-paso-5.item.ts`
8. `app/modules/sucursales/index.ts`

**Estimación:** 2 horas

---

### **ISSUE 2.6: Crear FlowConfigs**

**Archivos a crear:**

1. `app/config/flows/junta-accionistas.flow.ts`
2. `app/config/flows/sucursales.flow.ts`
3. `app/config/flows/index.ts`

**Estimación:** 1 hora

**Ejemplo:**

```typescript
// junta-accionistas.flow.ts
import type { FlowConfig } from "@/types/flow-system";
import { RenderMode, SidebarPosition } from "@/types/flow-system";
import {
  juntaGestionSection,
  juntaHistorialSection,
  juntaDashboardItem,
  juntaAccionistasItem,
  juntaHistoricoItem,
} from "@/modules/junta-accionistas";

export const juntaAccionistasFlowConfig: FlowConfig = {
  id: "junta-accionistas-flow",
  name: "Junta de Accionistas",
  description: "Gestión completa de juntas de accionistas",
  version: "1.0.0",
  items: [
    juntaGestionSection,
    juntaDashboardItem,
    juntaAccionistasItem,
    juntaHistorialSection,
    juntaHistoricoItem,
  ],
  renderOptions: {
    mode: RenderMode.HIERARCHICAL,
    showProgress: false,
    showCompletionStatus: false,
    animateTransitions: true,
  },
  sidebarOptions: {
    position: SidebarPosition.LEFT,
    width: 280,
    collapsible: true,
    sticky: true,
  },
};
```

---

### **ISSUE 2.7: Crear Playground**

**Archivos a crear:**

1. `pages/sidebar-playground/index.vue`
2. `pages/sidebar-playground/junta-test.vue`
3. `pages/sidebar-playground/sucursales-test.vue`

**Estimación:** 30 minutos

**Ejemplo:**

```vue
<!-- pages/sidebar-playground/index.vue -->
<template>
  <div class="playground-index">
    <h1>Sidebar Playground</h1>
    <p>Espacio aislado para probar configuraciones de sidebar</p>

    <div class="test-links">
      <NuxtLink to="/sidebar-playground/junta-test" class="test-card">
        <h2>Junta de Accionistas</h2>
        <p>Probar FlowConfig de Juntas</p>
      </NuxtLink>

      <NuxtLink to="/sidebar-playground/sucursales-test" class="test-card">
        <h2>Registro de Sucursales</h2>
        <p>Probar FlowConfig de Sucursales</p>
      </NuxtLink>
    </div>
  </div>
</template>
```

---

### **ISSUE 2.8: Tests**

**Archivos a crear:**

1. `app/config/routes/__tests__/routes.test.ts`
2. `app/modules/junta-accionistas/__tests__/flow-items.test.ts`
3. `app/modules/sucursales/__tests__/flow-items.test.ts`
4. `app/config/flows/__tests__/flow-configs.test.ts`

**Estimación:** 2 horas

---

## ⏱️ ESTIMACIÓN TOTAL

| Issue | Descripción                   | Tiempo    |
| ----- | ----------------------------- | --------- |
| 2.1   | Enums de Rutas                | 30 min    |
| 2.2   | Páginas Simples (Junta)       | 30 min    |
| 2.3   | Páginas Simples (Sucursales)  | 1 hora    |
| 2.4   | FlowItems (Junta)             | 1.5 horas |
| 2.5   | FlowItems (Sucursales)        | 2 horas   |
| 2.6   | FlowConfigs                   | 1 hora    |
| 2.7   | Playground                    | 30 min    |
| 2.8   | Tests                         | 2 horas   |
| ----- | ----------------------------- | --------- |
|       | **TOTAL**                     | **9 hrs** |

---

## 🔗 DEPENDENCIAS

### **Requiere (Bloqueadores):**

- ✅ TODO-001 (Estructura de Datos) - En progreso (75% completo)

### **Bloquea (Dependientes):**

- ⬜ TODO-003 (Store Pinia) - Necesita FlowConfigs creados
- ⬜ TODO-004 (Composable API) - Necesita FlowConfigs
- ⬜ TODO-005 (UniversalFlowLayout) - Necesita páginas

---

## ✅ CRITERIOS DE ACEPTACIÓN

### **Enums:**

- [ ] Todos los enums de rutas creados
- [ ] Enums exportados desde index.ts
- [ ] TypeScript autocompleta rutas
- [ ] No hay hardcoded strings en navegación

### **Páginas:**

- [ ] 9 páginas creadas (3 Junta + 6 Sucursales)
- [ ] Todas las páginas tienen solo título + placeholder
- [ ] Todas las rutas funcionan (no 404)
- [ ] Páginas usan enums de rutas (no hardcoded)

### **FlowItems:**

- [ ] 13 FlowItems creados (5 Junta + 8 Sucursales)
- [ ] Cada FlowItem en su archivo separado
- [ ] FlowItems usan enums de rutas
- [ ] FlowItems exportados desde módulos

### **FlowConfigs:**

- [ ] 2 FlowConfigs creados (Junta + Sucursales)
- [ ] FlowConfigs importan FlowItems desde módulos
- [ ] FlowConfigs validados con Zod schemas

### **Playground:**

- [ ] 3 páginas de playground creadas
- [ ] Playground muestra FlowConfigs en JSON
- [ ] Links de navegación funcionan

### **Tests:**

- [ ] Tests de enums (rutas válidas)
- [ ] Tests de FlowItems (estructura correcta)
- [ ] Tests de FlowConfigs (validación Zod)
- [ ] Coverage >80%

### **Validaciones:**

- [ ] TypeScript sin errores (`npm run type-check`)
- [ ] Linter sin warnings (`npm run lint`)
- [ ] Todos los tests pasan
- [ ] Usuario valida estructura

### **Restricciones:**

- [ ] ⚠️ NO se tocó ningún archivo de Registro de Sociedades
- [ ] ⚠️ NO se modificó navegación existente
- [ ] ⚠️ Páginas solo tienen placeholder (sin lógica compleja)

---

## 🚀 PRÓXIMOS PASOS (Post-TODO-002)

Después de completar TODO-002:

1. **TODO-003:** Crear Store Pinia que consuma FlowConfigs
2. **TODO-004:** Crear composable `useFlowNavigation`
3. **TODO-005:** Crear componente `UniversalFlowLayout`
4. **TODO-006:** Crear componente `FlowSidebar`
5. **TODO-007:** Implementar renderizadores (Hierarchical, Sequential)
6. **TODO-008:** Montar sidebar en playground
7. **TODO-009:** Integrar en páginas reales de Junta
8. **TODO-010:** Integrar en páginas reales de Sucursales

---

## 📝 NOTAS

### **⚠️ Restricciones Críticas:**

1. **NO TOCAR Registro de Sociedades**

   - Archivos en `pages/registro-societario/sociedades/`
   - Archivos en `modules/registro-sociedades/`
   - Archivo `app/config/society-register-navigation.ts`

2. **Páginas Simples Solamente**

   - Solo título + placeholder
   - Sin formularios complejos
   - Sin lógica de negocio

3. **Usar Enums Siempre**
   - Todas las rutas deben usar enums
   - No hardcodear strings

---

**Estado:** 📋 Expediente en Creación  
**Esperando:** Aprobación de usuario para las 5 decisiones  
**Siguiente Paso:** Crear archivo `.documentation.md` con detalles técnicos
