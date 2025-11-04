# 🔍 DIAGNÓSTICO: Problema Encontrado - Sidebar Derecho No Aparece

**Fecha:** 4 de Noviembre, 2025  
**Estado:** ✅ CAUSA RAÍZ IDENTIFICADA  
**Criticidad:** 🔥 ALTA - Sistema no funciona correctamente

---

## 🎯 Problema Principal Identificado

### El Bug Central

**Línea 148 de `universal-flow-layout.vue`:**

```typescript
const found = findItem(layoutConfig.value.flowConfig.items);
```

### Por Qué Está Mal

```
flowConfig.items = Array PLANO de FlowItem[]
├─ Item nivel 0 (id: "seleccion-agenda")
├─ Item nivel 1 (id: "puntos-acuerdo-section")
├─ Item nivel 2 (id: "nombramiento-apoderados")
├─ Item nivel 3 (id: "nombramiento-apoderados-designacion")  ← ESTÁ EN EL ARRAY
├─ Item nivel 3 (id: "nombramiento-apoderados-otorgamiento")
└─ Item nivel 3 (id: "nombramiento-apoderados-votacion")

PERO después de buildFlowItemTree():

flowTree = Array TREE de FlowItemTree[]
├─ Item nivel 0 (id: "seleccion-agenda")
│   └─ children: []
├─ Item nivel 1 (id: "puntos-acuerdo-section")
│   └─ children: [Item nivel 2]
│       └─ Item nivel 2 (id: "nombramiento-apoderados")
│           └─ children: [
│               Item nivel 3 (id: "nombramiento-apoderados-designacion"),  ← ANIDADO
│               Item nivel 3 (id: "nombramiento-apoderados-otorgamiento"),
│               Item nivel 3 (id: "nombramiento-apoderados-votacion")
│           ]
```

### El Problema

**La función `findItem` busca en el array PLANO (`flowConfig.items`), NO en el TREE construido.**

Resultado:
- ✅ Encuentra items de nivel 0, 1, 2 (están en el root)
- ❌ NO encuentra items de nivel 3 (están en children, pero busca solo en flat)

**ESPERA... revisemos esto mejor.**

En realidad, la función `findItem` SÍ busca recursivamente en children:

```typescript
if (item.children) {
  const found = findItem(item.children);
  if (found) return found;
}
```

Entonces el problema NO es ese. Déjame pensar...

---

## 🔍 Análisis Más Profundo

### Verificación del FlowConfig

En `junta-accionistas.flow.ts`:

```typescript
items: [
  // Nivel 0 (6 items principales)
  ...Object.values(nivel0),
  
  // Nivel 1 (4 sections)
  ...Object.values(nivel1),
  
  // Nivel 2 (items con rightSidebar)
  ...Object.values(nivel2),
  
  // Nivel 3 (sub-items en rightSidebar)
  ...Object.values(nivel3),
  
  // Nivel 4 (scroll anchors)
  ...Object.values(nivel4),
],
```

Esto crea un **array PLANO** con TODOS los items.

Luego en `juntas.layout.ts`:

```typescript
const flowTree = buildFlowItemTree(juntaAccionistasFlowConfig.items);
```

Esto convierte el array PLANO en árbol TREE usando `parentId`.

### El Problema Real (CONFIRMADO)

En `universal-flow-layout.vue` línea 148:

```typescript
return findItem(layoutConfig.value.flowConfig.items);
```

Busca en `flowConfig.items` que es el **array PLANO original**.

**PERO** si la estructura es:
```typescript
items: [
  { id: "parent", parentId: null },
  { id: "child", parentId: "parent" }  ← Tiene parentId, NO tiene children
]
```

Entonces cuando `buildFlowItemTree` lo convierte a árbol:
```typescript
[
  { id: "parent", children: [
    { id: "child", children: [] }  ← AHORA tiene children
  ]}
]
```

**El array original NO CAMBIA.** Es un array flat sin children.

Entonces `findItem` que busca recursivamente en children **NO FUNCIONA** porque está buscando en el array flat que **NO TIENE children**.

---

## 💡 La Solución

### Opción 1: Buscar en el flowTree construido (RECOMENDADO)

Cambiar línea 148 de `universal-flow-layout.vue`:

```typescript
// MAL: Busca en array plano
const found = findItem(layoutConfig.value.flowConfig.items);

// BIEN: Busca en árbol construido
const firstSidebar = layoutConfig.value.sidebars[0];
if (!firstSidebar?.items) return undefined;
const found = findItem(firstSidebar.items);
```

**Ventaja:**
- Busca en el árbol con children anidados
- Encuentra items de nivel 3-4 que están en children

**Desventaja:**
- Depende de que al menos 1 sidebar exista

---

### Opción 2: Construir árbol en el layout (ALTERNATIVA)

Agregar computed que construya el árbol:

```typescript
const flowTree = computed(() => {
  if (!layoutConfig.value?.flowConfig?.items) return [];
  return buildFlowItemTree(layoutConfig.value.flowConfig.items);
});

// Buscar en flowTree
const found = findItem(flowTree.value);
```

**Ventaja:**
- Independiente de sidebars
- Árbol disponible para otros usos

**Desventaja:**
- Construye el árbol 2 veces (una en layout config, otra aquí)

---

### Opción 3: Usar helper findItemByRoute (MEJOR)

Ya existe un helper en `flowHelpers.ts`:

```typescript
export function findItemByRoute(
  items: FlowItemTree[],
  route: string
): FlowItemTree | undefined
```

Usar ese helper en vez de definir `findItem` local:

```typescript
import { buildFlowItemTree, findItemByRoute } from "~/utils/flowHelpers";

const flowTree = computed(() => {
  if (!layoutConfig.value?.flowConfig?.items) return [];
  return buildFlowItemTree(layoutConfig.value.flowConfig.items);
});

const currentItem = computed(() => {
  if (!flowTree.value.length) return undefined;
  return findItemByRoute(flowTree.value, currentPath.value);
});
```

**Ventaja:**
- Reutiliza código existente
- Más limpio
- Evita duplicación

---

## 🎯 Recomendación Final

**Usar Opción 3: Helper findItemByRoute**

1. Importar `buildFlowItemTree` y `findItemByRoute`
2. Crear computed `flowTree` que construya el árbol
3. Usar `findItemByRoute` en `currentItem`
4. Eliminar función `findItem` local

**Archivos a modificar:**
- `/app/layouts/universal-flow-layout.vue`

**Líneas a cambiar:**
- Línea 75-76: Agregar imports
- Línea 123-151: Reemplazar `currentItem` computed

---

## 🐛 Problema Secundario: Ruta Incorrecta

La página está en:
```
/operaciones/junta-accionistas/nombramiento-apoderados/nombramiento
```

Pero el FlowItem tiene ruta:
```typescript
route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_DETALLE
```

Verificar en `junta-accionistas.routes.ts` línea 75:

```typescript
NOMBRAMIENTO_APODERADOS_DETALLE = "/operaciones/junta-accionistas/nombramiento-apoderados/nombramiento",
```

✅ **La ruta coincide.** No hay problema aquí.

---

## 🎯 Plan de Fix

### Fix #1: Buscar en árbol construido (15 min)

**Archivo:** `/app/layouts/universal-flow-layout.vue`

**Cambios:**

1. Agregar imports (línea 75):
```typescript
import { buildFlowItemTree, findItemByRoute } from "~/utils/flowHelpers";
```

2. Agregar computed flowTree (después de línea 114):
```typescript
/**
 * Árbol construido de FlowItems
 */
const flowTree = computed<FlowItemTree[]>(() => {
  if (!layoutConfig.value?.flowConfig?.items) return [];
  return buildFlowItemTree(layoutConfig.value.flowConfig.items);
});
```

3. Reemplazar currentItem computed (líneas 123-151):
```typescript
/**
 * Item actualmente activo
 */
const currentItem = computed<FlowItemTree | undefined>(() => {
  if (!flowTree.value.length) return undefined;
  
  console.log("[DEBUG] currentPath:", currentPath.value);
  console.log("[DEBUG] flowTree length:", flowTree.value.length);
  
  const found = findItemByRoute(flowTree.value, currentPath.value);
  
  console.log("[DEBUG] currentItem result:", found ? found.identity.id : "NOT FOUND");
  console.log("[DEBUG] currentItem level:", found ? found.hierarchy.level : "N/A");
  
  return found;
});
```

---

### Fix #2: Verificar que visibilityRule usa función correctamente (5 min)

**Archivo:** `/app/config/flows/juntas.layout.ts`

**Verificar líneas 69-76:**

```typescript
visibilityRule: {
  type: "property",
  path: "hierarchy.level",
  fn: (context) => {
    const level = context.currentItem?.hierarchy.level;
    return level !== undefined && level >= 3;
  },
},
```

**Problema detectado:**

El `type: "property"` usa `path` y `equals`, NO `fn`.

**Debe ser:**

```typescript
visibilityRule: {
  type: "custom",  // ← CAMBIAR de "property" a "custom"
  fn: (context) => {
    const level = context.currentItem?.hierarchy.level;
    console.log("[DEBUG] RightSidebar visibility check, level:", level);
    return level !== undefined && level >= 3;
  },
},
```

O si queremos usar `property`:

```typescript
visibilityRule: {
  type: "property",
  path: "hierarchy.level",
  // Usar comparación numérica
  fn: (context) => {
    const level = context.currentItem?.hierarchy.level;
    return level !== undefined && level >= 3;
  },
},
```

Pero mirando el código de `evaluateVisibilityRule` en `universal-flow-layout.vue`:

```typescript
case "property": {
  const value = getNestedProperty(currentItem.value, rule.path || "");
  
  if (rule.equals !== undefined) {
    return value === rule.equals;  // Compara con equals
  }
  // ...
  return Boolean(value);  // O solo verifica que existe
}
```

**NO hay soporte para `fn` en `type: "property"`.**

La función `fn` solo se usa en `type: "custom"`.

---

## ✅ Solución Definitiva

### Cambio 1: Fix currentItem en universal-flow-layout.vue

Usar `findItemByRoute` con árbol construido.

### Cambio 2: Fix visibilityRule en juntas.layout.ts

Cambiar de `type: "property"` a `type: "custom"`:

```typescript
visibilityRule: {
  type: "custom",  // ← ESTO
  fn: (context) => {
    const level = context.currentItem?.hierarchy.level;
    return level !== undefined && level >= 3;
  },
},
```

---

## 🎯 Impacto Esperado

Después de aplicar estos fixes:

1. ✅ `currentItem` se encontrará correctamente (busca en árbol, no en flat)
2. ✅ `currentItem.hierarchy.level` será 3 cuando estés en nivel 3
3. ✅ `visibilityRule` con `type: "custom"` se evaluará correctamente
4. ✅ Función custom retornará `true` cuando level >= 3
5. ✅ Sidebar derecho aparecerá en `activeSidebars`
6. ✅ Template renderizará el sidebar derecho

**Resultado:** Sidebar derecho visible en nivel 3-4 ✨

---

## 📊 Resumen

| Problema | Causa | Fix |
|----------|-------|-----|
| Sidebar derecho no aparece | currentItem busca en array flat | Buscar en flowTree construido |
| visibilityRule no evalúa | type: "property" con fn es inválido | Cambiar a type: "custom" |
| Items nivel 3 no se encuentran | children solo existen en árbol | Usar findItemByRoute con árbol |

**Tiempo de fix:** 20 minutos  
**Complejidad:** Baja  
**Riesgo:** Bajo

---

**Siguiente paso:** Aplicar fixes (Fase 2 del plan)

