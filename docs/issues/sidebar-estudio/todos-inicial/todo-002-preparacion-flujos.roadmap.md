# 📋 TODO-002: Preparación de Flujos (Juntas + Sucursales)

**Estado:** 📋 Expediente en Creación  
**Prioridad:** 🔥 Alta  
**Estimación:** 26.5h implementación + 8.5h buffer = **35 horas total**  
**Ubicación:** `todos-inicial/`

---

## 🎯 OBJETIVO

Preparar la infraestructura completa para implementar el sistema de sidebar universal en dos flujos:

1. **Junta de Accionistas** (~87 FlowItems, 4 niveles de profundidad, sidebar derecho condicional)
2. **Registro de Sucursales** (6 FlowItems, estructura flat simple)

**CRÍTICO:** NO tocar Registro de Sociedades (otro equipo trabaja ahí)

**ANÁLISIS COMPLETO:** Ver `asistencia-copilot/analisis-jerarquia-juntas-sucursales.md`

---

## 🏗️ DECISIONES ARQUITECTÓNICAS

### **DECISIÓN 1: Estructura Real de FlowItems**

#### **ESTRUCTURA CONFIRMADA:**

**Junta de Accionistas: 87 FlowItems en 4 niveles de profundidad**

```
📁 Nivel 0: 6 pasos principales
├─ Selección de Puntos de Agenda
├─ Detalles de la Junta (con rightSidebar)
├─ Instalación de la Junta (con rightSidebar)
├─ Puntos de Acuerdo (padre complejo)
├─ Resumen (con rightSidebar de scroll)
└─ Descargar (con rightSidebar de lista actas)

📁 Nivel 1: 4 secciones (dentro de Puntos de Acuerdo)
├─ Aumento de Capital
├─ Nombramiento
├─ Remociones
└─ Gestión Social y Resultados Económicos

📁 Nivel 2: ~17 items específicos (con rightSidebar condicional)
├─ Aumento de Capital
│  ├─ Aporte Dinerario → [Aportantes, Aportes, Votación]
│  └─ Capitalización Créditos → [Acreedores, Créditos, Votación]
├─ Nombramiento
│  ├─ Apoderados → [Nombramiento, Otorgamiento, Votación]
│  ├─ Gerente → [Nombramiento, Votación]
│  ├─ Directores → [Nombramiento, Votación]
│  ├─ Directorio → [Nombramiento, Votación]
│  └─ Auditores → [Nombramiento, Votación]
├─ Remociones
│  ├─ Apoderados → [Remoción, Votación]
│  ├─ Gerente → [Remoción, Votación]
│  └─ Directores → [Remoción, Votación]
└─ Gestión Social
   ├─ Pronunciamiento → [Pronunciamiento, Votación]
   ├─ Aplicación Resultados → [Aplicación, Votación]
   ├─ Estados Financieros → [Estados, Votación]
   └─ Reparto Dividendos → [Reparto, Votación]

📁 Nivel 3: ~40 sub-páginas (aparecen en rightSidebar)
└─ Items entre [ ] del nivel 2

📁 Nivel 4: ~20 scroll anchors (navegación intra-página)
└─ Ejemplo: Otorgamiento → [#yull-timoteo, #jose-luis, #franco-vidal]
```

**Sucursales: 6 FlowItems (estructura flat)**

```
├─ Datos de la Sociedad
├─ Datos Generales
├─ Capital Social
├─ Acciones
├─ Accionistas
└─ Asignación de Acciones
```

**TOTAL: ~93 FlowItems (87 Juntas + 6 Sucursales)**

---

#### **🎯 DECISIÓN FINAL:**

**Estructura Real Completa** ✅

**Validación:**

- ✅ Sistema soporta 4 niveles de profundidad (sin límite técnico)
- ✅ 3 patrones de navegación identificados (rightSidebar, scroll, summary)
- ✅ Análisis completo en `analisis-jerarquia-juntas-sucursales.md`

**Aprobado por:** Usuario (3 Nov 2025)

---

### **DECISIÓN 2: ¿Cómo manejar el Right Sidebar condicional?**

#### **Problema Identificado:**

Algunos items del sidebar izquierdo tienen hijos que deben aparecer en un **sidebar derecho** cuando el item padre está activo.

**Ejemplo:**

```
LEFT SIDEBAR                RIGHT SIDEBAR (condicional)
├─ Aumento de Capital
   ▶ Aporte Dinerario  →    ├─ Aportantes
   ▷ Capitalización...      ├─ Aportes
                            └─ Votación
```

---

#### **Opción A: Usar `rightSidebar.enabled` + `showChildrenInSidebar` (ELEGIDA ✅)**

**Implementación:**

```typescript
// Item padre (Nivel 2) - Aparece en LEFT sidebar
const aporteDinerario: FlowItem = {
  identity: {
    id: "aporte-dinerario",
    type: FlowItemType.STEP,
    label: "Aporte Dinerario",
  },
  hierarchy: {
    parentId: "aumento-capital",
    level: 2,
    children: ["aportantes", "aportes", "votacion"], // IDs de hijos
  },
  rightSidebar: {
    enabled: true, // ← Habilita sidebar derecho
    contentType: "navigation",
    showChildrenInSidebar: true, // ← Renderiza hijos en RIGHT sidebar
  },
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO,
    behavior: NavigationBehavior.NAVIGATE,
  },
};

// Items hijos (Nivel 3) - Aparecen en RIGHT sidebar
const aportantes: FlowItem = {
  identity: {
    id: "aportantes",
    type: FlowItemType.STEP,
    label: "Aportantes",
  },
  hierarchy: {
    parentId: "aporte-dinerario",
    level: 3,
  },
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO_APORTANTES,
    behavior: NavigationBehavior.NAVIGATE,
  },
};
```

**Lógica en Componente:**

```typescript
const shouldShowRightSidebar = computed(() => {
  const currentItem = findItemById(currentRoute.value);
  return currentItem?.rightSidebar?.enabled === true;
});

const rightSidebarItems = computed(() => {
  const currentItem = findItemById(currentRoute.value);
  if (!currentItem?.rightSidebar?.showChildrenInSidebar) return [];

  return currentItem.hierarchy.children.map((childId) => findItemById(childId));
});
```

**Pros:**

- ✅ Usa estructura FlowItem existente (no requiere nuevos tipos)
- ✅ Configuración clara y explícita
- ✅ Fácil de activar/desactivar por item
- ✅ Permite diferentes tipos de contenido en rightSidebar

---

#### **Opción B: Crear componente especial `<DoubleS idebar>`**

Rechazada porque añade complejidad innecesaria.

---

#### **🎯 DECISIÓN FINAL:**

**Opción A (`rightSidebar.enabled` + `showChildrenInSidebar`)** ✅

**Razón:**

- Reutiliza estructura FlowItem existente
- No requiere nuevos tipos ni interfaces
- Configuración flexible por item
- Ya validado en TODO-001

**Items con rightSidebar en Juntas:**

- Detalles de la Junta (nivel 0)
- Instalación (nivel 0)
- Todos los items de nivel 2 (~17 items)
- Resumen (nivel 0, tipo especial)

**Aprobado por:** Usuario (3 Nov 2025)

---

### **DECISIÓN 3: ¿Cómo manejar Scroll Anchors (navegación intra-página)?**

#### **Problema Identificado:**

Algunos items tienen hijos que NO son páginas nuevas, sino **scroll anchors** dentro de la misma página.

**Ejemplo:**

```
Otorgamiento de Poderes (página)
  ├─ Yull Timoteo (scroll a #yull-timoteo)
  ├─ José Luis Matos (scroll a #jose-luis)
  └─ Franco Vidal (scroll a #franco-vidal)
```

---

#### **Opción A: Usar `NavigationBehavior.SCROLL` + `hash`**

```typescript
const yullTimoteo: FlowItem = {
  identity: {
    id: "yull-timoteo",
    type: FlowItemType.ACTION, // ← Tipo ACTION para acciones
    label: "Yull Timoteo",
  },
  hierarchy: {
    parentId: "otorgamiento-poderes",
    level: 4,
  },
  navigation: {
    hash: "#yull-timoteo", // ← Hash para scroll
    behavior: NavigationBehavior.SCROLL, // ← Comportamiento: scroll
  },
};
```

**Lógica en Componente:**

```typescript
if (item.navigation.behavior === NavigationBehavior.SCROLL) {
  const element = document.querySelector(item.navigation.hash);
  element?.scrollIntoView({ behavior: "smooth" });
}
```

**Pros:**

- ✅ Usa estructura existente
- ✅ Reutiliza NavigationBehavior
- ✅ Simple de implementar

---

#### **Opción B: Crear tipo especial `SCROLL_ANCHOR`**

**Contras:**

- ❌ Duplica funcionalidad
- ❌ Más complejo

---

#### **🎯 DECISIÓN FINAL:**

**Opción A (NavigationBehavior.SCROLL + hash)** ✅

**Tipos de FlowItemType a usar:**

- `STEP` - Páginas principales
- `SECTION` - Agrupaciones/secciones
- `ACTION` - Scroll anchors o acciones

**NavigationBehavior a usar:**

- `PUSH` - Navegación a página nueva
- `SCROLL` - Scroll dentro de página actual

**Aprobado por:** Usuario (3 Nov 2025)

---

### **DECISIÓN 4: ¿Enums de rutas o hardcodear?**

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
export enum JuntaRoutes {
  // Nivel 0 (6 rutas principales)
  SELECCION_AGENDA = "/operaciones/junta-accionistas/seleccion-agenda",
  DETALLES = "/operaciones/junta-accionistas/detalles",
  INSTALACION = "/operaciones/junta-accionistas/instalacion",
  PUNTOS_ACUERDO = "/operaciones/junta-accionistas/puntos-acuerdo",
  RESUMEN = "/operaciones/junta-accionistas/resumen",
  DESCARGAR = "/operaciones/junta-accionistas/descargar",

  // Nivel 2 - Aumento de Capital (con sub-rutas nivel 3)
  APORTE_DINERARIO = "/operaciones/junta-accionistas/aporte-dinerario",
  APORTE_DINERARIO_APORTANTES = "/operaciones/junta-accionistas/aporte-dinerario/aportantes",
  APORTE_DINERARIO_APORTES = "/operaciones/junta-accionistas/aporte-dinerario/aportes",
  APORTE_DINERARIO_VOTACION = "/operaciones/junta-accionistas/aporte-dinerario/votacion",

  CAPITALIZACION_CREDITOS = "/operaciones/junta-accionistas/capitalizacion-creditos",
  CAPITALIZACION_ACREEDORES = "/operaciones/junta-accionistas/capitalizacion-creditos/acreedores",
  CAPITALIZACION_CREDITOS_DETALLE = "/operaciones/junta-accionistas/capitalizacion-creditos/creditos",
  CAPITALIZACION_VOTACION = "/operaciones/junta-accionistas/capitalizacion-creditos/votacion",

  // Nivel 2 - Nombramiento (con sub-rutas nivel 3)
  NOMBRAMIENTO_APODERADOS = "/operaciones/junta-accionistas/nombramiento-apoderados",
  NOMBRAMIENTO_APODERADOS_DETALLE = "/operaciones/junta-accionistas/nombramiento-apoderados/nombramiento",
  NOMBRAMIENTO_APODERADOS_OTORGAMIENTO = "/operaciones/junta-accionistas/nombramiento-apoderados/otorgamiento-poderes",
  NOMBRAMIENTO_APODERADOS_VOTACION = "/operaciones/junta-accionistas/nombramiento-apoderados/votacion",

  NOMBRAMIENTO_GERENTE = "/operaciones/junta-accionistas/nombramiento-gerente",
  NOMBRAMIENTO_GERENTE_DETALLE = "/operaciones/junta-accionistas/nombramiento-gerente/nombramiento",
  NOMBRAMIENTO_GERENTE_VOTACION = "/operaciones/junta-accionistas/nombramiento-gerente/votacion",

  // ... (~87 rutas totales)
}

// app/config/routes/sucursales.routes.ts
export enum SucursalesRoutes {
  DATOS_SOCIEDAD = "/registro-societario/sucursales/datos-sociedad",
  DATOS_GENERALES = "/registro-societario/sucursales/datos-generales",
  CAPITAL_SOCIAL = "/registro-societario/sucursales/capital-social",
  ACCIONES = "/registro-societario/sucursales/acciones",
  ACCIONISTAS = "/registro-societario/sucursales/accionistas",
  ASIGNACION_ACCIONES = "/registro-societario/sucursales/asignacion-acciones",
}

// Uso en FlowItem:
const dashboardItem: FlowItem = {
  navigation: {
    route: JuntaRoutes.APORTE_DINERARIO_APORTANTES,
    behavior: NavigationBehavior.PUSH,
  },
};
```

**Pros:**

- ✅ Type-safe (TypeScript autocompleta)
- ✅ Fácil refactorizar (cambias en un solo lugar)
- ✅ Previene errores tipográficos
- ✅ Centraliza todas las rutas (~93 rutas totales)

---

#### **🎯 DECISIÓN FINAL:**

**Opción B (Enums)** ✅

**Estructura:**

```
app/config/routes/
├─ junta-accionistas.routes.ts (~87 rutas)
├─ sucursales.routes.ts (6 rutas)
└─ index.ts (re-export todo)
```

**Total rutas:** ~93 (87 Juntas + 6 Sucursales)

**Aprobado por:** Usuario (3 Nov 2025)

---

### **DECISIÓN 5: ¿Dónde crear FlowItems individuales?**

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

**Estructura REAL:**

```
app/modules/
├─ junta-accionistas/
│  ├─ flow-items/
│  │  ├─ nivel-0/ (6 items)
│  │  │  ├─ seleccion-agenda.item.ts
│  │  │  ├─ detalles.item.ts
│  │  │  ├─ instalacion.item.ts
│  │  │  ├─ puntos-acuerdo.item.ts (COMPLEJO - padre de nivel 1)
│  │  │  ├─ resumen.item.ts
│  │  │  └─ descargar.item.ts
│  │  │
│  │  ├─ nivel-1/ (4 secciones)
│  │  │  ├─ aumento-capital.section.ts
│  │  │  ├─ nombramiento.section.ts
│  │  │  ├─ remociones.section.ts
│  │  │  └─ gestion-social.section.ts
│  │  │
│  │  ├─ nivel-2/ (~17 items)
│  │  │  ├─ aumento-capital/
│  │  │  │  ├─ aporte-dinerario.item.ts
│  │  │  │  └─ capitalizacion-creditos.item.ts
│  │  │  ├─ nombramiento/
│  │  │  │  ├─ nombramiento-apoderados.item.ts
│  │  │  │  ├─ nombramiento-gerente.item.ts
│  │  │  │  ├─ nombramiento-directores.item.ts
│  │  │  │  ├─ nombramiento-directorio.item.ts
│  │  │  │  └─ nombramiento-auditores.item.ts
│  │  │  ├─ remociones/
│  │  │  │  ├─ remocion-apoderados.item.ts
│  │  │  │  ├─ remocion-gerente.item.ts
│  │  │  │  └─ remocion-directores.item.ts
│  │  │  └─ gestion-social/
│  │  │     ├─ pronunciamiento.item.ts
│  │  │     ├─ aplicacion-resultados.item.ts
│  │  │     ├─ estados-financieros.item.ts
│  │  │     └─ reparto-dividendos.item.ts
│  │  │
│  │  ├─ nivel-3/ (~40 sub-páginas para rightSidebar)
│  │  │  ├─ aporte-dinerario/
│  │  │  │  ├─ aportantes.item.ts
│  │  │  │  ├─ aportes.item.ts
│  │  │  │  └─ votacion.item.ts
│  │  │  ├─ capitalizacion-creditos/
│  │  │  │  ├─ acreedores.item.ts
│  │  │  │  ├─ creditos.item.ts
│  │  │  │  └─ votacion.item.ts
│  │  │  ├─ nombramiento-apoderados/
│  │  │  │  ├─ nombramiento.item.ts
│  │  │  │  ├─ otorgamiento-poderes.item.ts
│  │  │  │  └─ votacion.item.ts
│  │  │  └─ ... (más sub-páginas)
│  │  │
│  │  └─ nivel-4/ (~20 scroll anchors)
│  │     ├─ otorgamiento-poderes/
│  │     │  ├─ yull-timoteo.anchor.ts
│  │     │  ├─ jose-luis.anchor.ts
│  │     │  └─ franco-vidal.anchor.ts
│  │     └─ ... (más scroll anchors)
│  │
│  └─ index.ts (exporta todos los ~87 items)
│
└─ sucursales/
   ├─ flow-items/
   │  ├─ datos-sociedad.item.ts
   │  ├─ datos-generales.item.ts
   │  ├─ capital-social.item.ts
   │  ├─ acciones.item.ts
   │  ├─ accionistas.item.ts
   │  └─ asignacion-acciones.item.ts
   │
   └─ index.ts (exporta los 6 items)
```

**Total archivos a crear:**

- Juntas: ~87 archivos .ts
- Sucursales: 6 archivos .ts

**Aprobado por:** Usuario (3 Nov 2025)

---

### **DECISIÓN 6: ¿Crear playground aislado?**

#### **Opción A: Probar directamente en páginas reales (❌ RIESGOSO)**

**Contras:**

- ❌ Si algo falla, afecta producción
- ❌ Difícil experimentar libremente

---

#### **Opción B: Reutilizar playground existente (✅ ELEGIDA)**

Ya existe `pages/indiceSidebarsPruebas.vue` como índice de tests.

**Estrategia:**

```
pages/
├─ indiceSidebarsPruebas.vue  ← Actualizar con nuevos links
└─ sidebar-test/               ← Crear nuevo (aislado)
   ├─ juntas.vue               ← Test de Juntas con FlowConfig real
   └─ sucursales.vue           ← Test de Sucursales con FlowConfig real
```

**Ejemplo:**

```vue
<!-- pages/sidebar-test/juntas.vue -->
<template>
  <div class="test-page">
    <h1>Test: Junta de Accionistas (87 items, 4 niveles)</h1>

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

**PERO:** Usar página existente `indiceSidebarsPruebas.vue` en lugar de crear nueva carpeta.

**Actualizar:**

```vue
<!-- pages/indiceSidebarsPruebas.vue -->
<template>
  <div class="flex gap-6 flex-col p-24">
    <h1 class="text-2xl font-bold">Sidebar Playground</h1>

    <NuxtLink to="/sidebar-test/juntas" class="btn">
      Probar Sidebar: Junta de Accionistas (87 items)
    </NuxtLink>

    <NuxtLink to="/sidebar-test/sucursales" class="btn">
      Probar Sidebar: Sucursales (6 items)
    </NuxtLink>
  </div>
</template>
```

**Crear:**

```
pages/sidebar-test/
├─ juntas.vue      - Monta FlowConfig de Juntas
└─ sucursales.vue  - Monta FlowConfig de Sucursales
```

**Aprobado por:** Usuario (3 Nov 2025)

---

## 📋 ARQUITECTURA

### **Estructura de Archivos Resultante:**

```
app/
├─ types/
│  └─ flow-system/              ← TODO-001 (ya creado - 20 archivos)
│
├─ config/
│  ├─ routes/                   ← TODO-002
│  │  ├─ junta-accionistas.routes.ts (~87 rutas enumeradas)
│  │  ├─ sucursales.routes.ts (6 rutas)
│  │  └─ index.ts
│  │
│  └─ flows/                    ← TODO-002
│     ├─ junta-accionistas.flow.ts (importa ~87 items)
│     ├─ sucursales.flow.ts (importa 6 items)
│     └─ index.ts
│
├─ modules/
│  ├─ junta-accionistas/        ← TODO-002 (COMPLEJO)
│  │  ├─ flow-items/
│  │  │  ├─ nivel-0/           (6 archivos .ts)
│  │  │  ├─ nivel-1/           (4 archivos .section.ts)
│  │  │  ├─ nivel-2/           (~17 archivos .item.ts en subcarpetas)
│  │  │  ├─ nivel-3/           (~40 archivos .item.ts en subcarpetas)
│  │  │  └─ nivel-4/           (~20 archivos .anchor.ts en subcarpetas)
│  │  └─ index.ts              (exporta ~87 FlowItems)
│  │
│  └─ sucursales/               ← TODO-002 (SIMPLE)
│     ├─ flow-items/
│     │  ├─ datos-sociedad.item.ts
│     │  ├─ datos-generales.item.ts
│     │  ├─ capital-social.item.ts
│     │  ├─ acciones.item.ts
│     │  ├─ accionistas.item.ts
│     │  └─ asignacion-acciones.item.ts
│     └─ index.ts              (exporta 6 FlowItems)
│
└─ pages/
   ├─ operaciones/
   │  └─ junta-accionistas/     ← TODO-002 (páginas reales - ~60 archivos)
   │     ├─ seleccion-agenda.vue
   │     ├─ detalles.vue
   │     ├─ instalacion.vue
   │     ├─ aporte-dinerario/
   │     │  ├─ index.vue
   │     │  ├─ aportantes.vue
   │     │  ├─ aportes.vue
   │     │  └─ votacion.vue
   │     ├─ capitalizacion-creditos/
   │     │  ├─ index.vue
   │     │  ├─ acreedores.vue
   │     │  ├─ creditos.vue
   │     │  └─ votacion.vue
   │     ├─ nombramiento-apoderados/
   │     │  ├─ index.vue
   │     │  ├─ nombramiento.vue
   │     │  ├─ otorgamiento-poderes.vue
   │     │  └─ votacion.vue
   │     └─ ... (~60 páginas totales)
   │
   ├─ registro-societario/
   │  └─ sucursales/            ← TODO-002 (páginas simples - 6 archivos)
   │     ├─ datos-sociedad.vue
   │     ├─ datos-generales.vue
   │     ├─ capital-social.vue
   │     ├─ acciones.vue
   │     ├─ accionistas.vue
   │     └─ asignacion-acciones.vue
   │
   ├─ sidebar-test/             ← TODO-002 (playground nuevo)
   │  ├─ juntas.vue
   │  └─ sucursales.vue
   │
   └─ indiceSidebarsPruebas.vue ← Actualizar (índice de tests)
```

**Total archivos a crear en TODO-002:**

- Enums: 3 archivos
- FlowItems: ~93 archivos (87 Juntas + 6 Sucursales)
- FlowConfigs: 3 archivos
- Páginas: ~68 archivos (60 Juntas + 6 Sucursales + 2 playground)
- Tests: ~15 archivos

**GRAN TOTAL: ~182 archivos**

---

## 📋 ISSUES (Tareas)

### **ISSUE 2.1: Crear Enums de Rutas**

**Archivos a crear:**

1. `app/config/routes/junta-accionistas.routes.ts` (~87 rutas)
2. `app/config/routes/sucursales.routes.ts` (6 rutas)
3. `app/config/routes/index.ts`

**Estimación:** 2 horas

**Complejidad:** Media (muchas rutas pero estructura simple)

**Salida esperada:**

```typescript
// junta-accionistas.routes.ts
export enum JuntaRoutes {
  // Nivel 0 (6 rutas principales)
  SELECCION_AGENDA = "/operaciones/junta-accionistas/seleccion-agenda",
  DETALLES = "/operaciones/junta-accionistas/detalles",
  INSTALACION = "/operaciones/junta-accionistas/instalacion",
  PUNTOS_ACUERDO = "/operaciones/junta-accionistas/puntos-acuerdo",
  RESUMEN = "/operaciones/junta-accionistas/resumen",
  DESCARGAR = "/operaciones/junta-accionistas/descargar",

  // Nivel 2 - Aumento de Capital
  APORTE_DINERARIO = "/operaciones/junta-accionistas/aporte-dinerario",
  APORTE_DINERARIO_APORTANTES = "/operaciones/junta-accionistas/aporte-dinerario/aportantes",
  APORTE_DINERARIO_APORTES = "/operaciones/junta-accionistas/aporte-dinerario/aportes",
  APORTE_DINERARIO_VOTACION = "/operaciones/junta-accionistas/aporte-dinerario/votacion",

  CAPITALIZACION_CREDITOS = "/operaciones/junta-accionistas/capitalizacion-creditos",
  CAPITALIZACION_ACREEDORES = "/operaciones/junta-accionistas/capitalizacion-creditos/acreedores",
  CAPITALIZACION_CREDITOS_DETALLE = "/operaciones/junta-accionistas/capitalizacion-creditos/creditos",
  CAPITALIZACION_VOTACION = "/operaciones/junta-accionistas/capitalizacion-creditos/votacion",

  // Nivel 2 - Nombramiento
  NOMBRAMIENTO_APODERADOS = "/operaciones/junta-accionistas/nombramiento-apoderados",
  NOMBRAMIENTO_APODERADOS_DETALLE = "/operaciones/junta-accionistas/nombramiento-apoderados/nombramiento",
  NOMBRAMIENTO_APODERADOS_OTORGAMIENTO = "/operaciones/junta-accionistas/nombramiento-apoderados/otorgamiento-poderes",
  NOMBRAMIENTO_APODERADOS_VOTACION = "/operaciones/junta-accionistas/nombramiento-apoderados/votacion",

  NOMBRAMIENTO_GERENTE = "/operaciones/junta-accionistas/nombramiento-gerente",
  NOMBRAMIENTO_GERENTE_DETALLE = "/operaciones/junta-accionistas/nombramiento-gerente/nombramiento",
  NOMBRAMIENTO_GERENTE_VOTACION = "/operaciones/junta-accionistas/nombramiento-gerente/votacion",

  NOMBRAMIENTO_DIRECTORES = "/operaciones/junta-accionistas/nombramiento-directores",
  NOMBRAMIENTO_DIRECTORES_DETALLE = "/operaciones/junta-accionistas/nombramiento-directores/nombramiento",
  NOMBRAMIENTO_DIRECTORES_VOTACION = "/operaciones/junta-accionistas/nombramiento-directores/votacion",

  NOMBRAMIENTO_DIRECTORIO = "/operaciones/junta-accionistas/nombramiento-directorio",
  NOMBRAMIENTO_DIRECTORIO_DETALLE = "/operaciones/junta-accionistas/nombramiento-directorio/nombramiento",
  NOMBRAMIENTO_DIRECTORIO_VOTACION = "/operaciones/junta-accionistas/nombramiento-directorio/votacion",

  NOMBRAMIENTO_AUDITORES = "/operaciones/junta-accionistas/nombramiento-auditores",
  NOMBRAMIENTO_AUDITORES_DETALLE = "/operaciones/junta-accionistas/nombramiento-auditores/nombramiento",
  NOMBRAMIENTO_AUDITORES_VOTACION = "/operaciones/junta-accionistas/nombramiento-auditores/votacion",

  // Nivel 2 - Remociones
  REMOCION_APODERADOS = "/operaciones/junta-accionistas/remocion-apoderados",
  REMOCION_APODERADOS_DETALLE = "/operaciones/junta-accionistas/remocion-apoderados/remocion",
  REMOCION_APODERADOS_VOTACION = "/operaciones/junta-accionistas/remocion-apoderados/votacion",

  REMOCION_GERENTE = "/operaciones/junta-accionistas/remocion-gerente",
  REMOCION_GERENTE_DETALLE = "/operaciones/junta-accionistas/remocion-gerente/remocion",
  REMOCION_GERENTE_VOTACION = "/operaciones/junta-accionistas/remocion-gerente/votacion",

  REMOCION_DIRECTORES = "/operaciones/junta-accionistas/remocion-directores",
  REMOCION_DIRECTORES_DETALLE = "/operaciones/junta-accionistas/remocion-directores/remocion",
  REMOCION_DIRECTORES_VOTACION = "/operaciones/junta-accionistas/remocion-directores/votacion",

  // Nivel 2 - Gestión Social
  PRONUNCIAMIENTO_GESTION = "/operaciones/junta-accionistas/pronunciamiento-gestion",
  PRONUNCIAMIENTO_DETALLE = "/operaciones/junta-accionistas/pronunciamiento-gestion/pronunciamiento",
  PRONUNCIAMIENTO_VOTACION = "/operaciones/junta-accionistas/pronunciamiento-gestion/votacion",

  APLICACION_RESULTADOS = "/operaciones/junta-accionistas/aplicacion-resultados",
  APLICACION_DETALLE = "/operaciones/junta-accionistas/aplicacion-resultados/aplicacion",
  APLICACION_VOTACION = "/operaciones/junta-accionistas/aplicacion-resultados/votacion",

  ESTADOS_FINANCIEROS = "/operaciones/junta-accionistas/estados-financieros",
  ESTADOS_DETALLE = "/operaciones/junta-accionistas/estados-financieros/estados",
  ESTADOS_VOTACION = "/operaciones/junta-accionistas/estados-financieros/votacion",

  REPARTO_DIVIDENDOS = "/operaciones/junta-accionistas/reparto-dividendos",
  REPARTO_DETALLE = "/operaciones/junta-accionistas/reparto-dividendos/reparto",
  REPARTO_VOTACION = "/operaciones/junta-accionistas/reparto-dividendos/votacion",
}

// sucursales.routes.ts
export enum SucursalesRoutes {
  DATOS_SOCIEDAD = "/registro-societario/sucursales/datos-sociedad",
  DATOS_GENERALES = "/registro-societario/sucursales/datos-generales",
  CAPITAL_SOCIAL = "/registro-societario/sucursales/capital-social",
  ACCIONES = "/registro-societario/sucursales/acciones",
  ACCIONISTAS = "/registro-societario/sucursales/accionistas",
  ASIGNACION_ACCIONES = "/registro-societario/sucursales/asignacion-acciones",
}
```

---

### **ISSUE 2.2: Crear Páginas Simples (Juntas)**

**Archivos a crear:** ~60 páginas .vue

**Estimación:** 4 horas

**Estructura:**

```
pages/operaciones/junta-accionistas/
├─ seleccion-agenda.vue
├─ detalles.vue
├─ instalacion.vue
├─ aporte-dinerario/
│  ├─ index.vue
│  ├─ aportantes.vue
│  ├─ aportes.vue
│  └─ votacion.vue
├─ capitalizacion-creditos/
│  ├─ index.vue
│  ├─ acreedores.vue
│  ├─ creditos.vue
│  └─ votacion.vue
├─ nombramiento-apoderados/
│  ├─ index.vue
│  ├─ nombramiento.vue
│  ├─ otorgamiento-poderes.vue (CON SCROLL ANCHORS)
│  └─ votacion.vue (CON SCROLL ANCHORS)
└─ ... (más carpetas siguiendo el mismo patrón)
```

**Template estándar para páginas simples:**

```vue
<template>
  <div class="page-container p-6">
    <PageTitle :title="pageTitle" />

    <div class="placeholder mt-4">
      <p class="text-gray-600">{{ pageDescription }}</p>
      <p class="text-sm text-gray-400 mt-2">Ruta: {{ $route.path }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  const pageTitle = "Aportantes - Aporte Dinerario";
  const pageDescription =
    "Gestión de aportantes para el aumento de capital por aporte dinerario";
</script>
```

**Template para páginas CON SCROLL ANCHORS:**

```vue
<template>
  <div class="page-container p-6">
    <PageTitle title="Otorgamiento de Poderes" />

    <!-- Secciones con IDs para scroll -->
    <div id="yull-timoteo" class="section-anchor py-8 border-b">
      <h2 class="text-xl font-semibold">Yull Timoteo</h2>
      <p>Detalles del otorgamiento de poderes...</p>
    </div>

    <div id="jose-luis-matos" class="section-anchor py-8 border-b">
      <h2 class="text-xl font-semibold">José Luis Matos</h2>
      <p>Detalles del otorgamiento de poderes...</p>
    </div>

    <div id="franco-vidal" class="section-anchor py-8 border-b">
      <h2 class="text-xl font-semibold">Franco Vidal</h2>
      <p>Detalles del otorgamiento de poderes...</p>
    </div>
  </div>
</template>
```

---

### **ISSUE 2.3: Crear Páginas Simples (Sucursales)**

**Archivos a crear:** 6 páginas .vue

**Estimación:** 30 minutos

**Estructura:**

```
pages/registro-societario/sucursales/
├─ datos-sociedad.vue
├─ datos-generales.vue
├─ capital-social.vue
├─ acciones.vue
├─ accionistas.vue
└─ asignacion-acciones.vue
```

**Template estándar:**

```vue
<template>
  <div class="page-container p-6">
    <PageTitle :title="pageTitle" />
    <div class="placeholder mt-4">
      <p>Placeholder: {{ pageTitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  const pageTitle = "Datos de la Sociedad";
</script>
```

---

### **ISSUE 2.4: Crear FlowItems Nivel 0 (Juntas)**

**Archivos a crear:** 6 archivos en `app/modules/junta-accionistas/flow-items/nivel-0/`

**Estimación:** 1.5 horas

**Archivos:**

1. `seleccion-agenda.item.ts`
2. `detalles.item.ts` (con rightSidebar)
3. `instalacion.item.ts` (con rightSidebar)
4. `puntos-acuerdo.item.ts` (padre complejo)
5. `resumen.item.ts` (con rightSidebar de scroll)
6. `descargar.item.ts` (con rightSidebar de scroll)

**Ejemplo completo:**

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

| Issue | Descripción                        | Tiempo       |
| ----- | ---------------------------------- | ------------ |
| 2.1   | Enums de Rutas (~93)               | 2 horas      |
| 2.2   | Páginas Juntas (~60)               | 4 horas      |
| 2.3   | Páginas Sucursales (6)             | 30 min       |
| 2.4   | FlowItems Nivel 0 (6)              | 1.5 horas    |
| 2.5   | FlowItems Nivel 1 (4)              | 1 hora       |
| 2.6   | FlowItems Nivel 2 (~17)            | 3 horas      |
| 2.7   | FlowItems Nivel 3 (~40)            | 5 horas      |
| 2.8   | FlowItems Nivel 4 (~20)            | 2 horas      |
| 2.9   | FlowItems Sucursales (6)           | 1 hora       |
| 2.10  | FlowConfigs (2)                    | 2 horas      |
| 2.11  | Test Pages (3)                     | 1 hora       |
| 2.12  | Tests                              | 3 horas      |
| ----- | ---------------------------------- | ---------    |
|       | **SUBTOTAL IMPLEMENTACIÓN**        | **26.5 hrs** |
|       | **BUFFER (Debugging + Refactor)**  | **8.5 hrs**  |
|       | **TOTAL REALISTA**                 | **35 hrs**   |

**Nota:** Buffer incluye tiempo para debugging, ajustes y refactorización durante implementación.

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

- [ ] Enums de rutas creados (~93 rutas: 87 Juntas + 6 Sucursales)
- [ ] Enums exportados desde index.ts
- [ ] TypeScript autocompleta rutas
- [ ] No hay hardcoded strings en navegación
- [ ] Rutas organizadas por nivel (Nivel 0, Nivel 2, Nivel 3)

### **Páginas:**

- [ ] ~68 páginas creadas (60 Juntas + 6 Sucursales + 2 test)
- [ ] Todas las páginas tienen PageTitle + placeholder
- [ ] Páginas con scroll anchors tienen secciones con IDs correctos
- [ ] Todas las rutas funcionan (no 404)
- [ ] Páginas usan enums de rutas (no hardcoded)

### **FlowItems:**

- [ ] ~93 FlowItems creados (87 Juntas + 6 Sucursales)
- [ ] Estructura por niveles:
  - [ ] Nivel 0: 6 items (Juntas)
  - [ ] Nivel 1: 4 sections (Juntas)
  - [ ] Nivel 2: ~17 items con rightSidebar (Juntas)
  - [ ] Nivel 3: ~40 sub-pages (Juntas)
  - [ ] Nivel 4: ~20 scroll anchors (Juntas)
  - [ ] Sucursales: 6 items flat
- [ ] Cada FlowItem en su archivo separado
- [ ] FlowItems usan enums de rutas
- [ ] FlowItems exportados desde módulos
- [ ] Items con rightSidebar configurados correctamente
- [ ] Scroll anchors con NavigationBehavior.SCROLL + hash

### **FlowConfigs:**

- [ ] 2 FlowConfigs creados (Junta + Sucursales)
- [ ] FlowConfigs importan FlowItems desde módulos
- [ ] FlowConfigs validados con Zod schemas
- [ ] juntaAccionistasFlowConfig tiene ~87 items
- [ ] sucursalesFlowConfig tiene 6 items

### **Playground:**

- [ ] indiceSidebarsPruebas.vue actualizado con links
- [ ] pages/sidebar-test/juntas.vue creado
- [ ] pages/sidebar-test/sucursales.vue creado
- [ ] Playground muestra FlowConfigs en JSON
- [ ] Links de navegación funcionan

### **Tests:**

- [ ] Tests de enums (rutas válidas, ~93 rutas)
- [ ] Tests de FlowItems por nivel (0-4)
- [ ] Tests de FlowConfigs (validación Zod)
- [ ] Tests de rightSidebar condicional
- [ ] Tests de scroll anchors
- [ ] Coverage >80%

### **Validaciones:**

- [ ] TypeScript sin errores (`npx nuxi typecheck`)
- [ ] Linter sin warnings (`npm run lint`)
- [ ] Todos los tests pasan
- [ ] Usuario valida estructura completa
- [ ] Todos los tests pasan
- [ ] Usuario valida estructura

### **Restricciones:**

- [ ] ⚠️ NO se tocó ningún archivo de Registro de Sociedades (otro equipo)
- [ ] ⚠️ NO se modificó navegación existente
- [ ] ⚠️ Páginas solo tienen placeholder (sin lógica compleja)
- [ ] ⚠️ Respeta estructura de 4 niveles documentada
- [ ] ⚠️ Usa patrones aprobados (rightSidebar, scroll, summary)

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
