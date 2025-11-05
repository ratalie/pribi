# 🎯 PLAN: DualPanelSidebar - Nueva UI con Config Reutilizable

**Fecha:** 4 de Noviembre, 2025  
**Objetivo:** Crear un nuevo sidebar con UI de Registro de Sociedades pero usando la config universal  
**Estado:** 📋 PLAN PARA APROBACIÓN  
**Tiempo estimado:** 4-6 horas

---

## 🎯 Visión del Proyecto

### Lo que Queremos Lograr:

**Demostrar que tenemos:**

1. ✅ **Config reutilizable** (FlowConfig + SidebarConfig)
2. ✅ **Múltiples UIs** intercambiables
3. ✅ **Aplicable a diferentes casos:**
   - Wizards paso a paso (como Sociedades)
   - Navegación jerárquica (como Juntas)
   - Sidebars de admin simples
   - Sidebars de documentación

### El Mensaje para los Equipos:

> "Tenemos una configuración de sidebar universal y reutilizable. Solo defines los datos (FlowConfig), y puedes usar diferentes UIs según tu necesidad. ¿Necesitas wizard? ¿Navegación jerárquica? ¿Panel de admin? Solo cambias el componente de UI, la configuración es la misma."

---

## 📊 Análisis: Sistema de Registro de Sociedades

### Componentes (EQUIPO SOCIEDADES - NO TOCAR):

```
app/layouts/flow-layout.vue          🚫 NO TOCAR
app/components/flow-layout/
├─ ProgressNavBar.vue                🚫 NO TOCAR (pero ESTUDIAR)
├─ HeaderProgressNavbar.vue          🚫 NO TOCAR (pero ESTUDIAR)
└─ CheckIcon.vue                     🚫 NO TOCAR (pero ESTUDIAR)

app/config/
├─ society-register-navigation.ts    🚫 NO TOCAR
└─ progress-navbar-map.ts            🚫 NO TOCAR

app/composables/
└─ useProgressNavbarRoutes.ts        🚫 NO TOCAR
```

---

### Características del Sistema de Sociedades:

#### 1. UI/UX Excelente ⭐⭐⭐⭐⭐

**Layout:**
```
┌──────────────────────────────────┐
│  Header con breadcrumbs          │
├─────────────┬────────────────────┤
│  Sidebar    │   Contenido        │
│  (401px)    │   (flex-1)         │
│             │                    │
│  Pasos con  │   Formulario       │
│  checkmarks │                    │
│             │                    │
│             ├────────────────────┤
│             │  Footer con botón  │
└─────────────┴────────────────────┘
```

**Elementos visuales:**
- ✅ Checkmarks azules para completados
- ✅ Círculo con punto para actual
- ✅ Círculo vacío para pendientes
- ✅ Líneas conectoras (azules/grises)
- ✅ Hover effects (texto azul, underline)
- ✅ Descripciones bajo cada paso
- ✅ Ancho fijo 401px
- ✅ Padding y spacing perfecto

---

#### 2. Sistema de Estados ⭐⭐⭐⭐⭐

```typescript
type Status = "completed" | "current" | "empty";

interface NavigationStep {
  title: string;
  description: string;
  status: Status;
  route: string;
}
```

**Lógica:**
- Estado hardcoded en `society-register-navigation.ts`
- `useProgressNavbarRoutes` mapea ruta → currentStepIndex
- CheckIcon renderiza según status

**Visual:**
```
completed: ✓ (círculo azul con check blanco)
current:   • (círculo azul con punto)
empty:     ○ (círculo gris vacío)
```

---

#### 3. Limitaciones ⚠️

**NO soporta:**
- ❌ Jerarquías (solo lista flat)
- ❌ Niveles anidados (niveles 0-4)
- ❌ Sidebar derecho dinámico
- ❌ Filtrado contextual
- ❌ Configuración data-driven

**Es simple pero efectivo para wizards lineales.**

---

## 🆚 Comparación: Sociedades vs. Nuestro Sistema

### Registro de Sociedades (Imagen 2):

| Aspecto | Valor |
|---------|-------|
| UI | ⭐⭐⭐⭐⭐ Excelente |
| Estados visuales | ⭐⭐⭐⭐⭐ Perfecto |
| Jerarquías | ❌ No soporta |
| Configuración | ⭐⭐ Hardcoded |
| Reutilización | ⭐ Solo para wizards lineales |
| Complejidad | ⭐⭐ Simple |

---

### Nuestro Sistema Universal (Imagen 1):

| Aspecto | Valor |
|---------|-------|
| UI | ⭐⭐⭐ Funcional (sin polish) |
| Estados visuales | ⭐⭐ Básico |
| Jerarquías | ⭐⭐⭐⭐⭐ 4 niveles soportados |
| Configuración | ⭐⭐⭐⭐⭐ Data-driven completo |
| Reutilización | ⭐⭐⭐⭐⭐ Universal |
| Complejidad | ⭐⭐⭐⭐ Complejo pero potente |

---

### Lo que Queremos (DualPanelSidebar):

| Aspecto | Valor |
|---------|-------|
| UI | ⭐⭐⭐⭐⭐ Como Sociedades |
| Estados visuales | ⭐⭐⭐⭐⭐ Como Sociedades |
| Jerarquías | ⭐⭐⭐⭐⭐ Como nuestro sistema |
| Configuración | ⭐⭐⭐⭐⭐ Como nuestro sistema |
| Reutilización | ⭐⭐⭐⭐⭐ Universal |
| Complejidad | ⭐⭐⭐⭐ Moderada (vale la pena) |

**Objetivo:** Combinar LO MEJOR de ambos sistemas.

---

## 🏗️ Arquitectura Propuesta: DualPanelSidebar

### Concepto:

```
Config Reutilizable (FlowConfig + SidebarConfig)
          ↓
    [Capa de Adaptación]
          ↓
    UI Component (intercambiable)
          ↓
┌─────────────────────────────────┐
│ Opción A: StepWizardPanel       │ ← UI de Sociedades
│ Opción B: HierarchicalPanel     │ ← UI con jerarquía
│ Opción C: AdminNavigationPanel  │ ← UI de admin simple
└─────────────────────────────────┘
```

---

### Estructura de Archivos Propuesta:

```
app/components/dual-panel-sidebar/
│
├─ DualPanelSidebar.vue              ← Componente orquestador
│
├─ panels/                            ← Diferentes UIs
│  ├─ StepWizardPanel.vue            ← UI estilo Sociedades
│  ├─ HierarchicalPanel.vue          ← UI con jerarquía (tu diseño)
│  └─ AdminNavPanel.vue              ← UI simple para admin
│
├─ shared/                            ← Componentes compartidos
│  ├─ StatusIcon.vue                 ← Basado en CheckIcon
│  ├─ StepItem.vue                   ← Item de paso con estado
│  └─ ConnectorLine.vue              ← Línea conectora
│
└─ adapters/                          ← Adaptadores de config
   ├─ flowConfigToSteps.ts           ← FlowConfig → NavigationStep[]
   └─ flowConfigToHierarchy.ts       ← FlowConfig → Árbol jerárquico
```

---

## 🎨 UI Components Propuestos

### 1. StepWizardPanel.vue (Estilo Sociedades)

**Características:**
- ✅ Checkmarks con estados (completed, current, empty)
- ✅ Líneas conectoras verticales
- ✅ Títulos + descripciones
- ✅ Hover effects
- ✅ Lista secuencial (no jerarquía)

**Cuándo usar:**
- Wizards paso a paso
- Flujos lineales
- Procesos secuenciales

**Ejemplo:** Registro de Sociedades (actual), Sucursales (futuro con esta UI)

---

### 2. HierarchicalPanel.vue (Tu Diseño)

**Características:**
- ✅ Soporte para niveles 0-4
- ✅ Expand/collapse
- ✅ Indent por nivel
- ✅ Estados por item
- ✅ Badges de nivel

**Cuándo usar:**
- Navegación jerárquica
- Flujos complejos con sub-opciones
- Documentación con secciones

**Ejemplo:** Juntas de Accionistas

---

### 3. AdminNavPanel.vue (Nuevo)

**Características:**
- ✅ Lista simple de links
- ✅ Iconos a la izquierda
- ✅ Sin estados (solo navegación)
- ✅ Active state highlight

**Cuándo usar:**
- Paneles de administración
- Configuración del sistema
- Navegación simple

**Ejemplo:** Admin de usuarios, Configuración

---

## 🔧 Componentes Compartidos

### StatusIcon.vue (Basado en CheckIcon)

```vue
<template>
  <div class="status-icon-wrapper">
    <!-- Icono según estado -->
    <div v-if="status === 'completed'" class="icon completed">
      <CheckmarkIcon />
    </div>
    <div v-else-if="status === 'current'" class="icon current">
      <DotIcon />
    </div>
    <div v-else class="icon empty" />
    
    <!-- Línea conectora -->
    <div v-if="!isFinalItem" class="connector-line" :class="lineClass" />
  </div>
</template>
```

**Props:**
- `status`: "completed" | "current" | "empty" | "locked" | "error"
- `isFinalItem`: boolean
- `showLine`: boolean

---

## 📐 Plan de Implementación

### Fase 1: Crear Infraestructura Base (1.5 horas)

#### Tarea 1.1: Crear DualPanelSidebar.vue (30 min)

**Archivo:** `app/components/dual-panel-sidebar/DualPanelSidebar.vue`

**Props:**
```typescript
interface Props {
  config: SidebarConfig;  // Usa la config existente
  mode: "wizard" | "hierarchical" | "admin";  // Selecciona UI
  currentPath: string;
}
```

**Lógica:**
```typescript
const panelComponent = computed(() => {
  switch (props.mode) {
    case "wizard": return StepWizardPanel;
    case "hierarchical": return HierarchicalPanel;
    case "admin": return AdminNavPanel;
  }
});
```

---

#### Tarea 1.2: Crear Adaptadores (45 min)

**Archivo:** `app/components/dual-panel-sidebar/adapters/flowConfigToSteps.ts`

**Función:**
```typescript
/**
 * Convierte FlowConfig (nuestro sistema) a NavigationStep[] (formato Sociedades)
 */
export function flowConfigToSteps(
  flowConfig: FlowConfig,
  currentPath: string
): NavigationStep[] {
  // Lógica:
  // 1. Flatten FlowItems
  // 2. Determinar status de cada item (completed, current, empty)
  // 3. Convertir a NavigationStep[]
}
```

**Resultado:** FlowConfig → NavigationStep[] automático

---

#### Tarea 1.3: Crear StatusIcon.vue (15 min)

**Archivo:** `app/components/dual-panel-sidebar/shared/StatusIcon.vue`

Copiar lógica de `CheckIcon.vue` pero más flexible:
- Soporte para 5 estados (completed, current, empty, locked, error)
- Línea conectora configurable
- Colores configurables

---

### Fase 2: Crear StepWizardPanel (2 horas)

#### Tarea 2.1: Componente Principal (1 hora)

**Archivo:** `app/components/dual-panel-sidebar/panels/StepWizardPanel.vue`

**Diseño exacto como Registro de Sociedades:**
```vue
<template>
  <div class="step-wizard-panel">
    <div v-for="(step, index) in steps" :key="index" class="step-item">
      <!-- StatusIcon (checkmark, dot, empty) -->
      <StatusIcon 
        :status="step.status" 
        :is-final-item="index === steps.length - 1" 
      />
      
      <!-- Contenido del paso -->
      <NuxtLink :to="step.route" class="step-content">
        <p class="step-title">{{ step.title }}</p>
        <p class="step-description">{{ step.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
```

**CSS:** Copiar estilos de `ProgressNavBar.vue`

---

#### Tarea 2.2: Lógica de Estados (30 min)

**Determinar status automáticamente:**

```typescript
function determineStatus(item: FlowItemTree, currentPath: string): Status {
  // Completado: behavior.isCompleted
  if (item.behavior.isCompleted) return "completed";
  
  // Actual: route === currentPath
  if (item.navigation.route === currentPath) return "current";
  
  // Vacío: default
  return "empty";
}
```

---

#### Tarea 2.3: Integración con Config (30 min)

```typescript
// Recibe SidebarConfig
const props = defineProps<{ config: SidebarConfig }>();

// Convierte a NavigationStep[]
const steps = computed(() => {
  return flowConfigToSteps(props.config.items, currentPath);
});
```

---

### Fase 3: Crear HierarchicalPanel (1.5 horas)

**Archivo:** `app/components/dual-panel-sidebar/panels/HierarchicalPanel.vue`

**Basado en tu diseño actual (Imagen 1) pero con:**
- Checkmarks en vez de círculos vacíos
- Líneas conectoras
- Mejor hover effects
- Descripciones opcionales

---

### Fase 4: Crear Layout con DualPanelSidebar (1 hora)

**Archivo:** `app/layouts/dual-panel-layout.vue`

**Estructura:**
```vue
<template>
  <div class="dual-panel-layout">
    <!-- ProboSidebar (global) -->
    <ProboSidebar />
    
    <!-- Panel principal (con DualPanelSidebar) -->
    <div class="main-panel">
      <!-- Sidebar de flujo -->
      <DualPanelSidebar
        :config="sidebarConfig"
        :mode="panelMode"
        :current-path="currentPath"
      />
      
      <!-- Contenido -->
      <main>
        <NuxtPage />
      </main>
      
      <!-- Sidebar derecho (opcional) -->
      <DualPanelSidebar
        v-if="rightSidebarConfig"
        :config="rightSidebarConfig"
        :mode="rightPanelMode"
      />
    </div>
  </div>
</template>
```

---

### Fase 5: Configurar para Juntas y Sucursales (30 min)

#### Juntas con StepWizardPanel:

```typescript
// app/config/flows/juntas-wizard.layout.ts
export const juntasWizardLayoutConfig = {
  leftSidebar: {
    mode: "wizard",  // ← UI de Sociedades
    config: mainSidebarConfig
  },
  rightSidebar: {
    mode: "wizard",  // ← UI de Sociedades para nivel 3
    config: stepsSidebarConfig
  }
};
```

#### Juntas con HierarchicalPanel:

```typescript
// app/config/flows/juntas-hierarchy.layout.ts
export const juntasHierarchyLayoutConfig = {
  leftSidebar: {
    mode: "hierarchical",  // ← Tu UI actual
    config: mainSidebarConfig
  },
  rightSidebar: {
    mode: "wizard",  // ← UI de Sociedades
    config: stepsSidebarConfig
  }
};
```

#### Sucursales con StepWizardPanel:

```typescript
// app/config/flows/sucursales-wizard.layout.ts
export const sucursalesWizardLayoutConfig = {
  leftSidebar: {
    mode: "wizard",  // ← UI de Sociedades
    config: mainSidebarConfig
  }
};
```

---

## 🎯 Demostración para los Equipos

### Demo 1: Mismo Config, Diferentes UIs

```
FlowConfig de Juntas (mismo config)
         ↓
┌────────┴────────┐
│                 │
UI Wizard      UI Hierarchy
(Sociedades)   (Tu diseño)
```

**Mensaje:** "Mismos datos, diferentes UIs. Elige la que necesites."

---

### Demo 2: Diferentes Configs, Misma UI

```
        UI Wizard (Sociedades)
              ↓
┌─────────────┼─────────────┐
│             │             │
Config      Config      Config
Juntas      Sucursales  Admin
```

**Mensaje:** "Misma UI, diferentes flujos. Reutilizable al máximo."

---

### Demo 3: Mix and Match

```
Juntas:
- Sidebar izq: Hierarchy UI (niveles 0-2)
- Sidebar der: Wizard UI (niveles 3-4)

Sucursales:
- Sidebar izq: Wizard UI (paso a paso)

Admin:
- Sidebar izq: Admin UI (navegación simple)
```

**Mensaje:** "Combina UIs como quieras. Máxima flexibilidad."

---

## 📋 Plan Detallado de Implementación

### Día 1 (4 horas):

**Mañana (2h):**
- [ ] Crear estructura de carpetas
- [ ] Crear DualPanelSidebar.vue (orquestador)
- [ ] Crear adaptadores (flowConfigToSteps)
- [ ] Crear StatusIcon.vue

**Tarde (2h):**
- [ ] Crear StepWizardPanel.vue
- [ ] Copiar estilos de ProgressNavBar
- [ ] Testing básico

---

### Día 2 (2-3 horas):

**Mañana (1.5h):**
- [ ] Crear HierarchicalPanel.vue
- [ ] Mejorar con checkmarks y líneas
- [ ] Testing

**Tarde (1h):**
- [ ] Crear dual-panel-layout.vue
- [ ] Configurar para Juntas
- [ ] Configurar para Sucursales
- [ ] Testing completo

---

## 🎯 Resultado Esperado

### Después de Implementar:

**Tendrás 2 layouts funcionando:**

1. **universal-flow-layout.vue** (Actual)
   - Sistema funcional básico
   - FlowSidebar con renderers
   - Funciona hoy

2. **dual-panel-layout.vue** (Nuevo)
   - UI de Registro de Sociedades
   - Soporta jerarquías (que Sociedades no tiene)
   - Múltiples modos de panel

---

### Demo para Equipos:

**Juntas con wizard UI:**
```
/operaciones/junta-accionistas
Layout: dual-panel-layout
Mode: wizard
UI: Como Registro de Sociedades ✨
Jerarquía: Soportada ✨
```

**Sucursales con wizard UI:**
```
/registro-societario/sucursales
Layout: dual-panel-layout
Mode: wizard
UI: Como Registro de Sociedades ✨
Jerarquía: No necesaria (flat)
```

---

## 📦 Archivos a Crear (8 archivos)

### Core (2 archivos):

1. `DualPanelSidebar.vue` (~150 líneas)
2. `dual-panel-layout.vue` (~200 líneas)

### Panels (3 archivos):

3. `StepWizardPanel.vue` (~180 líneas)
4. `HierarchicalPanel.vue` (~200 líneas)
5. `AdminNavPanel.vue` (~100 líneas)

### Shared (2 archivos):

6. `StatusIcon.vue` (~80 líneas)
7. `StepItem.vue` (~100 líneas)

### Adapters (1 archivo):

8. `flowConfigToSteps.ts` (~150 líneas)

**TOTAL:** 8 archivos, ~1,160 líneas

---

## ✅ Ventajas del Approach

### 1. Reutilización Máxima

- Misma config (FlowConfig)
- Múltiples UIs intercambiables
- Un cambio en config afecta a todas las UIs

---

### 2. UI Profesional

- Copia la UI de Sociedades (aprobada por otro equipo)
- Agrega soporte para jerarquías
- Mejor que el sistema actual

---

### 3. Flexible

```typescript
// Cambiar UI es tan simple como:
<DualPanelSidebar mode="wizard" />      // UI de Sociedades
<DualPanelSidebar mode="hierarchical" /> // Tu UI
<DualPanelSidebar mode="admin" />        // UI simple
```

---

### 4. Demostrable

```
Para los equipos:
"Miren, tenemos una config universal.
¿Quieren wizard como Sociedades? → mode='wizard'
¿Quieren jerarquía como Juntas? → mode='hierarchical'
¿Quieren admin simple? → mode='admin'

Misma configuración, diferentes UIs. Reutilizable."
```

---

## 🚨 Consideraciones Importantes

### 1. NO Tocar Registro de Sociedades

- ✅ Solo COPIAR su UI
- ✅ Solo ESTUDIAR su código
- ❌ NO modificar sus archivos

---

### 2. Mantener Sistema Actual Funcionando

- ✅ `universal-flow-layout.vue` sigue funcionando
- ✅ Juntas y Sucursales siguen funcionando
- ✅ Nuevo sistema es ADICIONAL, no reemplazo

---

### 3. Testing Incremental

- Crear StepWizardPanel primero
- Testear con Sucursales (más simple)
- Luego crear HierarchicalPanel
- Testear con Juntas (más complejo)

---

## 📊 Comparativa de Layouts

### Layout Actual (universal-flow-layout):

```
Ventajas:
✅ Funciona hoy
✅ Soporta jerarquías
✅ Filtrado contextual
✅ Sistema completo

Desventajas:
⚠️ UI básica (sin polish)
⚠️ No tiene estados visuales bonitos
⚠️ No tiene checkmarks
```

---

### Layout Nuevo (dual-panel-layout):

```
Ventajas:
✅ UI profesional (como Sociedades)
✅ Estados visuales (checkmarks)
✅ Múltiples modos intercambiables
✅ Soporta jerarquías (mejora sobre Sociedades)

Desventajas:
⚠️ Más complejo de mantener
⚠️ Requiere adaptadores
⚠️ 8 archivos nuevos
```

---

## 🎯 Recomendación

### Opción A: Implementar DualPanelSidebar (RECOMENDADO)

**Por qué:**
- UI profesional que impresionará a los equipos
- Demuestra reutilización real
- Combina lo mejor de ambos mundos

**Tiempo:** 2 días (6-8 horas)

**Resultado:** Sistema completo y presentable

---

### Opción B: Mejorar UI del Sistema Actual

**Por qué:**
- Menos trabajo
- Sistema ya funciona
- Solo agregar checkmarks y estilos

**Tiempo:** 1 día (4 horas)

**Resultado:** Sistema actual mejorado

---

### Opción C: Dejar Como Está y Documentar

**Por qué:**
- Sistema funciona
- Enfocarse en otros issues
- Documentar lo que hay

**Tiempo:** 30 minutos

**Resultado:** Sistema funcional, docs completas

---

## 💡 Mi Recomendación Personal

**Opción A:** Implementar DualPanelSidebar

**Razones:**
1. UI de Sociedades es excelente (aprobada)
2. Agregarle jerarquías es valor adicional
3. Demo para equipos será impactante
4. Vale la pena la inversión de tiempo

**Próximos pasos:**
1. Aprobar este plan
2. Implementar Fase 1 (infraestructura)
3. Implementar Fase 2 (StepWizardPanel)
4. Testing con Sucursales
5. Implementar Fase 3 (HierarchicalPanel)
6. Testing con Juntas
7. Demo para equipos

---

## 📞 ¿Qué Decides?

**A)** Implementar DualPanelSidebar (2 días, 6-8 horas)  
**B)** Mejorar UI actual (1 día, 4 horas)  
**C)** Dejar como está (30 min docs)

**Dime qué opción prefieres y arrancamos.** 🚀

---

**Plan creado:** 4 de Noviembre, 2025  
**Archivos a crear:** 8  
**Tiempo estimado:** 6-8 horas  
**Resultado:** Sistema profesional y demostrable

