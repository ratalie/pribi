# 🔍 DIAGNÓSTICO: Problema de Jerarquía en Sidebar de Juntas

**Fecha:** 2025-01-03  
**Reportado por:** yull23  
**Estado:** 🔴 PROBLEMA IDENTIFICADO

---

## 📋 Síntomas Reportados

### Problema 1: Sidebar muestra solo 1 nivel

- ✅ **Esperado:** Sidebar debería mostrar 4 niveles jerárquicos (Nivel 0 → Nivel 1 → Nivel 2 → Nivel 3)
- ❌ **Actual:** Sidebar solo muestra 6 items del Nivel 0 (planos, sin jerarquía)

### Problema 2: Al hacer click, desaparece el sidebar

- ✅ **Esperado:** Al navegar a "Aporte Dinerario", debería mantener ambos sidebars visibles
- ❌ **Actual:** Al navegar, la página cambia a layout diferente (sin sidebars)

### Problema 3: Sucursales funciona, Juntas no

- ✅ **Sucursales:** Funciona correcto porque es flat (1 nivel)
- ❌ **Juntas:** No funciona porque es jerárquico (4 niveles)

---

## 🔬 ANÁLISIS TÉCNICO

### 1. Estado de los FlowItems

#### ✅ FlowItems Creados (130 archivos)

```
app/types/flows/junta-accionistas/
├── nivel-0/          ✅ 6 items (todos exportados)
│   ├── seleccion-agenda.item.ts
│   ├── detalles.item.ts
│   ├── instalacion.item.ts
│   ├── puntos-acuerdo.item.ts    ← PADRE COMPLEJO
│   ├── resumen.item.ts
│   └── descargar.item.ts
│
├── nivel-1/          ✅ 4 sections (todas exportadas)
│   ├── aumento-capital.section.ts
│   ├── nombramiento.section.ts
│   ├── remociones.section.ts
│   └── gestion-social.section.ts
│
├── nivel-2/          ✅ 20+ items (todos creados)
│   ├── aumento-capital/
│   │   ├── aporte-dinerario.item.ts
│   │   └── capitalizacion-creditos.item.ts
│   ├── nombramiento/
│   │   ├── nombramiento-directores.item.ts
│   │   ├── nombramiento-auditores.item.ts
│   │   └── ...
│   └── ...
│
├── nivel-3/          ✅ 40+ items (todos creados)
│   └── aporte-dinerario/
│       ├── aportantes.item.ts
│       ├── aportes.item.ts
│       ├── votacion.item.ts
│       └── acta.item.ts
│
└── nivel-4/          ✅ 10+ items (scroll anchors)
```

**Conclusión:** ✅ Todos los FlowItems existen y están bien estructurados con `parentId` y `children`.

---

### 2. Estado del FlowConfig

#### ❌ PROBLEMA 1: junta-accionistas.flow.ts solo registra Nivel 0

**Archivo actual:**

```typescript
// app/config/flows/junta-accionistas.flow.ts

import * as nivel0 from "@/types/flows/junta-accionistas/nivel-0";

export const juntaAccionistasFlowConfig: FlowConfig = {
  id: "junta-accionistas-flow",
  name: "Junta de Accionistas",

  items: [
    nivel0.seleccionAgendaItem, // ✅ Nivel 0
    nivel0.detallesItem, // ✅ Nivel 0
    nivel0.instalacionItem, // ✅ Nivel 0
    nivel0.puntosAcuerdoItem, // ✅ Nivel 0 - PADRE (children definidos)
    nivel0.resumenItem, // ✅ Nivel 0
    nivel0.descargarItem, // ✅ Nivel 0
  ],

  // ❌ FALTAN: items de Nivel 1, 2, 3, 4
};
```

**Problema:**

- Solo registra 6 items del Nivel 0
- NO registra los 70+ items de Nivel 1-4
- El item `puntosAcuerdoItem` tiene `children: ["aumento-capital-section", ...]` pero esos items NO están en el array principal

**Estructura actual del item Puntos de Acuerdo:**

```typescript
// app/types/flows/junta-accionistas/nivel-0/puntos-acuerdo.item.ts

export const puntosAcuerdoItem: FlowItem = {
  identity: { id: "puntos-acuerdo", ... },
  hierarchy: {
    level: 0,
    order: 4,
    parentId: null,
    children: [
      "aumento-capital-section",    // ❌ NO está en FlowConfig.items
      "nombramiento-section",       // ❌ NO está en FlowConfig.items
      "remociones-section",         // ❌ NO está en FlowConfig.items
      "gestion-social-section",     // ❌ NO está en FlowConfig.items
    ],
  },
};
```

---

### 3. Estado del buildFlowItemTree Helper

#### ❌ PROBLEMA 2: buildFlowItemTree no construye jerarquía

**Código actual:**

```typescript
// app/utils/flowHelpers.ts

export function buildFlowItemTree(items: FlowItem[]): FlowItemTree[] {
  return items.map((item) => ({
    ...item,
    children: [] as FlowItemTree[], // ❌ Siempre vacío!
  }));
}
```

**Problema:**

- Recibe items planos: `[item1, item2, item3, ...]`
- Devuelve items con `children: []` (vacío)
- NO construye árbol jerárquico basado en `parentId`

**Lo que debería hacer:**

```typescript
// Pseudocódigo del algoritmo correcto
function buildFlowItemTree(items: FlowItem[]): FlowItemTree[] {
  // 1. Crear mapa de items por ID
  const itemMap = new Map();
  items.forEach((item) => itemMap.set(item.identity.id, { ...item, children: [] }));

  // 2. Construir relaciones parent-child
  const roots = [];
  itemMap.forEach((item) => {
    if (item.hierarchy.parentId === null) {
      roots.push(item); // Items de Nivel 0
    } else {
      const parent = itemMap.get(item.hierarchy.parentId);
      if (parent) {
        parent.children.push(item); // Agregar hijo al padre
      }
    }
  });

  // 3. Devolver solo roots (contienen toda la jerarquía)
  return roots;
}
```

---

### 4. Estado de las Páginas

#### ❌ PROBLEMA 3: Páginas de Juntas no tienen layout definido

**Páginas de Nivel 0 (SÍ tienen layout):**

```vue
<!-- app/pages/operaciones/junta-accionistas/seleccion-agenda.vue -->
<script setup lang="ts">
  definePageMeta({
    layout: "sidebar-general", // ✅ OK
  });
</script>
```

**Páginas de Nivel 2+ (NO tienen layout):**

```vue
<!-- app/pages/operaciones/junta-accionistas/aporte-dinerario/index.vue -->
<script setup lang="ts">
  // ❌ NO hay definePageMeta!
  // Por defecto usa layout: "default" (ProboSidebar sin SidebarFlow)
</script>
```

**Resultado:**

- Página de "Selección de Agenda": ✅ Muestra ambos sidebars
- Página de "Aporte Dinerario": ❌ Solo muestra ProboSidebar (sin SidebarFlow)

---

## 🎯 RESUMEN DE PROBLEMAS

### Problema 1: FlowConfig Incompleto

**Ubicación:** `app/config/flows/junta-accionistas.flow.ts`  
**Síntoma:** Sidebar solo muestra 6 items (Nivel 0)  
**Causa:** FlowConfig.items solo registra Nivel 0 (faltan 70+ items de Nivel 1-4)  
**Impacto:** 🔴 CRÍTICO

**Solución requerida:**

```typescript
// Debe importar TODOS los niveles
import * as nivel0 from "@/types/flows/junta-accionistas/nivel-0";
import * as nivel1 from "@/types/flows/junta-accionistas/nivel-1";
import * as nivel2 from "@/types/flows/junta-accionistas/nivel-2";
// ... etc

export const juntaAccionistasFlowConfig: FlowConfig = {
  items: [
    // Nivel 0 (6 items)
    ...Object.values(nivel0),

    // Nivel 1 (4 sections)
    ...Object.values(nivel1),

    // Nivel 2 (20+ items)
    ...Object.values(nivel2),

    // Nivel 3 (40+ items)
    ...Object.values(nivel3),

    // Nivel 4 (10+ items)
    ...Object.values(nivel4),
  ],
};
```

---

### Problema 2: buildFlowItemTree no construye jerarquía

**Ubicación:** `app/utils/flowHelpers.ts`  
**Síntoma:** Items aparecen planos (sin children anidados)  
**Causa:** Función siempre devuelve `children: []`  
**Impacto:** 🔴 CRÍTICO

**Solución requerida:**

- Implementar algoritmo jerárquico completo
- Usar `parentId` para construir árbol
- Anidar children recursivamente

---

### Problema 3: Páginas de Nivel 2+ sin layout

**Ubicación:** `app/pages/operaciones/junta-accionistas/**/*.vue`  
**Síntoma:** Al navegar, desaparecen los sidebars  
**Causa:** Páginas de Nivel 2-4 no tienen `definePageMeta({ layout: "sidebar-general" })`  
**Impacto:** 🟡 MEDIO

**Solución requerida:**

- Agregar `definePageMeta` a TODAS las páginas de Juntas
- Verificar que todas usen `layout: "sidebar-general"`

---

## 📊 Comparación: Sucursales vs Juntas

### ✅ Sucursales (Funciona)

```typescript
// Estructura FLAT (1 nivel)
sucursalesFlowConfig.items = [
  datosSociedadItem, // Nivel 0
  datosSucursalItem, // Nivel 0
  resumenItem, // Nivel 0
];

// buildFlowItemTree devuelve:
[
  { ...datosSociedadItem, children: [] },
  { ...datosSucursalItem, children: [] },
  { ...resumenItem, children: [] },
];

// ✅ Funciona porque no necesita jerarquía
```

### ❌ Juntas (No funciona)

```typescript
// Estructura JERÁRQUICA (4 niveles)
juntaAccionistasFlowConfig.items = [
  seleccionAgendaItem, // ❌ Solo estos 6
  detallesItem,
  instalacionItem,
  puntosAcuerdoItem,
  resumenItem,
  descargarItem,

  // ❌ FALTAN:
  // - 4 sections de Nivel 1
  // - 20+ items de Nivel 2
  // - 40+ items de Nivel 3
  // - 10+ items de Nivel 4
];

// buildFlowItemTree devuelve:
[
  { ...seleccionAgendaItem, children: [] }, // ❌ children vacío
  // ...
  { ...puntosAcuerdoItem, children: [] }, // ❌ debería tener 4 children
];

// ❌ No funciona porque:
// 1. Faltan items en el array
// 2. buildFlowItemTree no construye jerarquía
```

---

## 🔧 PLAN DE CORRECCIÓN

### Fase 1: Completar FlowConfig (CRÍTICO)

**Tarea 1.1:** Importar todos los niveles en `junta-accionistas.flow.ts`
**Tarea 1.2:** Registrar todos los items (70+) en el array `items`
**Estimación:** 30 minutos

### Fase 2: Arreglar buildFlowItemTree (CRÍTICO)

**Tarea 2.1:** Implementar algoritmo jerárquico completo
**Tarea 2.2:** Construir árbol basado en `parentId`
**Tarea 2.3:** Probar con estructura de 4 niveles
**Estimación:** 1.5 horas

### Fase 3: Agregar layout a páginas (MEDIO)

**Tarea 3.1:** Buscar todas las páginas de Juntas sin `definePageMeta`
**Tarea 3.2:** Agregar `layout: "sidebar-general"` a cada una
**Estimación:** 30 minutos

### Fase 4: Verificación

**Tarea 4.1:** Navegar a "Selección de Agenda" → Verificar jerarquía completa
**Tarea 4.2:** Navegar a "Aporte Dinerario" → Verificar ambos sidebars visibles
**Tarea 4.3:** Expandir/contraer secciones → Verificar funcionamiento
**Estimación:** 30 minutos

**Tiempo total estimado:** 2.5 - 3 horas

---

## ✅ Criterios de Éxito

1. **Jerarquía completa visible:**

   - Nivel 0: 6 items (raíz)
   - Nivel 1: 4 sections (colapsables)
   - Nivel 2: 20+ items (dentro de sections)
   - Nivel 3: 40+ items (en rightSidebar)
   - Nivel 4: 10+ items (scroll anchors)

2. **Navegación funcional:**

   - Al hacer click en cualquier item → mantiene ambos sidebars
   - Items activos se destacan correctamente
   - Items padres se expanden automáticamente

3. **Consistencia entre flujos:**
   - Sucursales: ✅ Sigue funcionando (flat)
   - Juntas: ✅ Funciona igual (jerárquico)
   - Mismo componente SidebarFlow para ambos

---

## 🚨 Notas Importantes

### ⚠️ NO Tocar

- `app/components/ProboSidebar.vue` (usado por Registro de Sociedades)
- `app/layouts/default.vue` (usado por Registro de Sociedades)
- `app/layouts/flow-layout.vue` (usado por Registro de Sociedades)

### ✅ SÍ Modificar

- `app/config/flows/junta-accionistas.flow.ts` (agregar todos los items)
- `app/utils/flowHelpers.ts` (arreglar buildFlowItemTree)
- `app/pages/operaciones/junta-accionistas/**/*.vue` (agregar layout)

### 🔍 Archivos a Revisar

```bash
# Ver todos los FlowItems de Nivel 1
ls -la app/types/flows/junta-accionistas/nivel-1/

# Ver todos los FlowItems de Nivel 2
ls -la app/types/flows/junta-accionistas/nivel-2/

# Ver páginas sin layout
grep -r "definePageMeta" app/pages/operaciones/junta-accionistas/
```

---

**Próximo paso:** Implementar Fase 1 (Completar FlowConfig)
