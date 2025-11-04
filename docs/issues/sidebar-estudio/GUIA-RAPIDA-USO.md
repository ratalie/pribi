# 🚀 Guía Rápida de Uso - Sistema de Sidebar Universal

**Fecha:** 4 de Noviembre, 2025  
**Tiempo de lectura:** 15 minutos  
**Nivel:** Principiante a Intermedio

---

## 🎯 ¿Qué es el Sistema de Sidebar Universal?

Un sistema **data-driven** para crear sidebars dinámicos en flujos multi-paso.

### Características Clave

- ✅ **Universal**: Un componente para todos los flujos
- ✅ **Configurable**: Todo se define con objetos, no código
- ✅ **Reutilizable**: Crear nuevos flujos en 10 minutos
- ✅ **Type-safe**: 100% TypeScript
- ✅ **Dinámico**: Sidebars aparecen/desaparecen según condiciones

---

## 📦 Componentes del Sistema

```
1. FlowConfig: Define los items del flujo
2. SidebarConfig: Configura un sidebar
3. FlowLayoutConfig: Ensambla todo (flow + sidebars)
4. UniversalFlowLayout: Renderiza el layout completo
```

---

## 🏃 Quick Start: Tu Primer Flujo en 5 Pasos

### Paso 1: Definir tus items (FlowItems)

**Archivo:** `/app/types/flows/mi-flujo/items.ts`

```typescript
import type { FlowItem } from "~/types/flow-system";
import { FlowItemType, NavigationBehavior } from "~/types/flow-system";

export const paso1Item: FlowItem = {
  identity: {
    id: "paso-1",
    type: FlowItemType.STEP,
    label: "Paso 1: Datos Generales",
  },
  hierarchy: {
    level: 0,        // Nivel 0 = root
    order: 0,        // Orden de aparición
    parentId: null,  // null = no tiene padre
    children: [],    // IDs de hijos (vacío si no tiene)
  },
  navigation: {
    route: "/mi-flujo/paso-1",
    behavior: NavigationBehavior.PUSH,
  },
  behavior: {
    isVisible: true,
    isDisabled: false,
    isCompleted: false,
    isActive: false,
    isLocked: false,
  },
  rightSidebar: { enabled: false },
  validation: {
    isRequired: true,
    showErrors: true,
  },
  metadata: {},
};

// Repetir para paso-2, paso-3, etc.
```

---

### Paso 2: Crear FlowConfig

**Archivo:** `/app/config/flows/mi-flujo.flow.ts`

```typescript
import type { FlowConfig } from "~/types/flow-system";
import { RenderMode, SidebarPosition } from "~/types/flow-system";
import { paso1Item, paso2Item, paso3Item } from "~/types/flows/mi-flujo/items";

export const miFlowConfig: FlowConfig = {
  id: "mi-flujo",
  name: "Mi Flujo",
  description: "Descripción de mi flujo",
  version: "1.0.0",

  // Todos los items
  items: [
    paso1Item,
    paso2Item,
    paso3Item,
  ],

  renderOptions: {
    mode: RenderMode.SEQUENTIAL,  // Lista numerada
    showProgress: true,
    showIcons: false,
    allowFreeNavigation: true,
  },

  sidebarOptions: {
    position: SidebarPosition.LEFT,
    width: 280,
    collapsible: true,
    headerTitle: "Mi Flujo",
  },
};
```

---

### Paso 3: Crear SidebarConfig

**Archivo:** `/app/config/flows/mi-flujo.layout.ts`

```typescript
import type { FlowLayoutConfig, SidebarConfig } from "~/types/flow-layout";
import { defineFlowLayout } from "~/types/flow-layout/flow-layout-config";
import { buildFlowItemTree } from "~/utils/flowHelpers";
import { miFlowConfig } from "./mi-flujo.flow";

// Construir árbol de items
const flowTree = buildFlowItemTree(miFlowConfig.items);

// Sidebar izquierdo
const mainSidebar: SidebarConfig = {
  id: "mi-flujo-sidebar",
  position: "left",
  mode: "sequential",      // Lista numerada (wizard)
  items: flowTree,
  title: "Mi Flujo",
  
  width: "280px",
  collapsible: true,
  collapsed: false,
};

// Layout completo
export const miFlowLayoutConfig: FlowLayoutConfig = defineFlowLayout({
  id: "mi-flujo-layout",
  name: "Mi Flujo",
  type: "wizard",
  
  flowConfig: miFlowConfig,
  sidebars: [mainSidebar],
  
  showLoadingSkeleton: true,
  showSaveIndicator: false,
});

export default miFlowLayoutConfig;
```

---

### Paso 4: Registrar en useFlowLayoutConfig

**Archivo:** `/app/composables/useFlowLayoutConfig.ts`

```typescript
import miFlowLayoutConfig from "~/config/flows/mi-flujo.layout";

const LAYOUT_CONFIG_MAP: Record<string, FlowLayoutConfig> = {
  "/mi-flujo": miFlowLayoutConfig,  // ← Agregar aquí
  "/operaciones/junta-accionistas": juntasLayoutConfig,
  "/registro-societario/sucursales": sucursalesLayoutConfig,
};
```

---

### Paso 5: Usar en tus páginas

**Archivo:** `/app/pages/mi-flujo/paso-1.vue`

```vue
<template>
  <div class="page-container p-6">
    <h1 class="text-3xl font-bold mb-4">Paso 1: Datos Generales</h1>
    
    <!-- Tu contenido aquí -->
    <p>Contenido del paso 1</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "universal-flow-layout",  // ← Esto es todo lo que necesitas
});
</script>
```

**Repetir para paso-2.vue, paso-3.vue, etc.**

---

## 🎉 ¡Listo!

Tu flujo ahora tiene:
- ✅ Sidebar izquierdo con navegación
- ✅ Numeración automática de pasos
- ✅ Item activo destacado
- ✅ Navegación entre pasos
- ✅ Layout responsive

---

## 🎨 Ejemplos de Configuraciones

### Ejemplo 1: Sidebar Simple (Como Sucursales)

```typescript
const mainSidebar: SidebarConfig = {
  id: "mi-sidebar",
  position: "left",
  mode: "flat",  // Lista simple sin jerarquía
  items: flowTree,
  title: "Navegación",
};
```

**Resultado:** Lista plana de items, todos al mismo nivel

---

### Ejemplo 2: Sidebar Jerárquico (Como Juntas Nivel 0-2)

```typescript
const mainSidebar: SidebarConfig = {
  id: "mi-sidebar",
  position: "left",
  mode: "hierarchical",  // Árbol colapsable
  items: flowTree,
  title: "Navegación",
  
  // Filtro: Solo niveles 0-2
  filter: {
    type: "level",
    criteria: {
      minLevel: 0,
      maxLevel: 2,
    },
  },
};
```

**Resultado:** Árbol con expand/collapse, solo muestra niveles 0-2

---

### Ejemplo 3: Sidebar Condicional (Como Juntas RightSidebar)

```typescript
const stepsSidebar: SidebarConfig = {
  id: "steps-sidebar",
  position: "right",
  mode: "sequential",
  items: flowTree,
  title: "Pasos",
  
  // Filtro: Solo niveles 3-4
  filter: {
    type: "level",
    criteria: { minLevel: 3, maxLevel: 4 },
  },
  
  // Visibility Rule: Solo visible cuando estás en nivel 3+
  visibilityRule: {
    type: "custom",
    fn: (context) => {
      const level = context.currentItem?.hierarchy.level;
      return level !== undefined && level >= 3;
    },
  },
};
```

**Resultado:** Sidebar derecho aparece SOLO cuando navegas a nivel 3 o 4

---

### Ejemplo 4: Múltiples Sidebars

```typescript
export const miFlowLayoutConfig = defineFlowLayout({
  id: "mi-layout",
  name: "Mi Flujo",
  type: "wizard",
  
  flowConfig: miFlowConfig,
  
  // ¡Puedes tener 1, 2, 3, o más sidebars!
  sidebars: [
    mainSidebar,      // Izquierdo
    stepsSidebar,     // Derecho
    // helperSidebar,  // Otro (si quisieras)
  ],
});
```

---

## 🔧 Configuraciones Comunes

### Navegación Libre vs. Wizard

**Navegación Libre** (como Sucursales):
```typescript
navigation: {
  allowFreeNavigation: true,  // Puede ir a cualquier paso
  markPreviousAsCompleted: false,
}
```

**Navegación Wizard** (como Juntas):
```typescript
navigation: {
  allowFreeNavigation: false,  // Solo puede ir al siguiente/anterior
  markPreviousAsCompleted: true,
}
```

---

### Validación

**Sin Validación** (documentación):
```typescript
validation: {
  validateOnNavigate: false,
  allowNavigationWithErrors: true,
}
```

**Con Validación** (wizard):
```typescript
validation: {
  validateOnNavigate: true,
  allowNavigationWithErrors: false,
  showValidationErrors: true,
}
```

---

### Persistencia

**Solo localStorage:**
```typescript
persistence: {
  enabled: true,
  localStorage: true,
  backend: false,
  storageKey: "mi-flujo-progress",
}
```

**Backend + localStorage:**
```typescript
persistence: {
  enabled: true,
  localStorage: true,
  backend: true,
  storageKey: "mi-flujo-progress",
  saveEndpoint: "/api/flows/mi-flujo/progress",
  loadEndpoint: "/api/flows/mi-flujo/progress",
}
```

---

## 📊 Tipos de Modo de Renderizado

| Modo | Descripción | Cuándo Usar |
|------|-------------|-------------|
| `hierarchical` | Árbol colapsable con niveles | Flujos con jerarquía (Juntas) |
| `sequential` | Lista numerada (1, 2, 3...) | Wizards, pasos secuenciales |
| `flat` | Lista simple sin números | Documentación, navegación simple |
| `custom` | Renderizado personalizado | Casos especiales |

---

## 🎯 Filtros Disponibles

### Filtro por Nivel

```typescript
filter: {
  type: "level",
  criteria: {
    minLevel: 0,
    maxLevel: 2,
  },
}
```

**Resultado:** Solo items de nivel 0, 1, y 2

---

### Filtro por Propiedad

```typescript
filter: {
  type: "property",
  criteria: {
    path: "behavior.isVisible",
    equals: true,
  },
}
```

**Resultado:** Solo items donde `item.behavior.isVisible === true`

---

### Filtro Custom

```typescript
filter: {
  type: "custom",
  criteria: {
    fn: (item) => {
      return item.behavior.isVisible && !item.behavior.isDisabled;
    },
  },
}
```

**Resultado:** Solo items que pasan la función

---

## ⚡ Reglas de Visibilidad

### Siempre Visible

```typescript
// No agregar visibilityRule
// El sidebar siempre está visible
```

---

### Visible según Nivel

```typescript
visibilityRule: {
  type: "custom",
  fn: (context) => {
    const level = context.currentItem?.hierarchy.level;
    return level !== undefined && level >= 3;
  },
}
```

**Resultado:** Sidebar solo visible en nivel 3+

---

### Visible según Ruta

```typescript
visibilityRule: {
  type: "route",
  pattern: "/operaciones/junta-accionistas/**",
}
```

**Resultado:** Sidebar solo visible en rutas que empiezan con `/operaciones/junta-accionistas/`

---

## 🧪 Testing de tu Flujo

### 1. Página de Testing

Navega a: `http://localhost:3000/test/sidebar-test`

Selecciona tu flujo y verifica:
- ✅ Árbol de items se construye correctamente
- ✅ Items tienen children (si es jerárquico)
- ✅ Niveles son correctos
- ✅ Rutas son correctas

---

### 2. Testing Manual

```
1. Navega a primera página del flujo
   ✅ ¿Sidebar aparece?
   ✅ ¿Item activo está destacado?

2. Click en siguiente item
   ✅ ¿Navega correctamente?
   ✅ ¿Item nuevo está destacado?

3. Si es jerárquico, expandir sección
   ✅ ¿Children aparecen?
   ✅ ¿Se pueden clickear?

4. Si tiene sidebar condicional
   ✅ ¿Aparece cuando debe?
   ✅ ¿Desaparece cuando debe?
```

---

## 📝 Checklist de Creación de Flujo

- [ ] FlowItems definidos con todas las propiedades
- [ ] Rutas agregadas al enum de rutas
- [ ] Páginas Vue creadas en /pages/
- [ ] FlowConfig creado en /config/flows/
- [ ] SidebarConfig(s) creados
- [ ] FlowLayoutConfig creado
- [ ] Config registrado en useFlowLayoutConfig
- [ ] definePageMeta agregado a páginas
- [ ] Testing en /test/sidebar-test
- [ ] Testing manual en navegador

---

## 🐛 Problemas Comunes

### "Sidebar no aparece"

**Fix:**
- Verificar que `items` tiene valores
- Verificar que `filter` no es muy restrictivo
- Verificar que `visibilityRule` retorna true

---

### "currentItem no se detecta"

**Fix:**
- Verificar que ruta del item coincide con URL
- Verificar que item está en `flowConfig.items`
- Ver logs de [DEBUG] en consola

---

### "Children no aparecen"

**Fix:**
- Verificar que `parentId` coincide con ID del padre
- Verificar que `buildFlowItemTree` está construyendo el árbol
- Verificar que modo es `hierarchical` (no `flat`)

---

## 🎓 Mejores Prácticas

### 1. Organiza tus archivos

```
app/types/flows/mi-flujo/
├─ items.ts           # FlowItems (si son pocos)
└─ nivel-0/           # O separar por niveles
   ├─ index.ts
   └─ items.ts
```

---

### 2. Usa enums para rutas

```typescript
// app/config/routes/mi-flujo.routes.ts
export enum MiFlujRoutes {
  PASO_1 = "/mi-flujo/paso-1",
  PASO_2 = "/mi-flujo/paso-2",
}

// Usar en FlowItems
navigation: {
  route: MiFlujRoutes.PASO_1,  // Type-safe
}
```

---

### 3. Defaults para propiedades comunes

```typescript
// app/types/flows/mi-flujo/defaults.ts
export const defaultBehavior = {
  isVisible: true,
  isDisabled: false,
  isCompleted: false,
  isActive: false,
  isLocked: false,
};

// Usar en items
behavior: defaultBehavior,  // No repetir código
```

---

### 4. Naming conventions

```typescript
// IDs en kebab-case
id: "nombramiento-apoderados"  ✅
id: "NombramientoApoderados"   ❌

// Variables en camelCase
const mainSidebar = { ... }  ✅
const MainSidebar = { ... }  ❌

// Archivos en kebab-case
mi-flujo.layout.ts  ✅
miFlujLayout.ts     ❌
```

---

## 📚 Ejemplos Reales

### Ver Juntas de Accionistas

**FlowConfig:** `/app/config/flows/junta-accionistas.flow.ts`  
**Layout:** `/app/config/flows/juntas.layout.ts`  
**Características:**
- 4 niveles de jerarquía
- 3 sidebars (main + ProboSidebar + steps)
- Sidebar derecho condicional (aparece en nivel 3+)
- Filtros por nivel

---

### Ver Sucursales

**FlowConfig:** `/app/config/flows/sucursales.flow.ts`  
**Layout:** `/app/config/flows/sucursales.layout.ts`  
**Características:**
- 1 solo nivel (flat)
- 2 sidebars (main + ProboSidebar)
- Navegación libre
- Sin validación

---

## 🚀 Próximos Pasos

Después de crear tu flujo:

1. **Testing:** Usa `/test/sidebar-test` para verificar estructura
2. **Validación:** Prueba navegación manualmente
3. **Refinamiento:** Ajusta configs según necesidad
4. **Documentación:** Documenta decisiones de diseño

---

## 📖 Referencias

- **API Reference:** `API-REFERENCE-SIDEBAR-UNIVERSAL.md` (próximo a crear)
- **Troubleshooting:** `TROUBLESHOOTING.md` (creado)
- **Ejemplos:** Ver configs de Juntas y Sucursales

---

## 💡 Tips Finales

- **Empieza simple:** Primer flujo con 3 items flat, luego agrega jerarquía
- **Usa la página de testing:** Siempre verifica en `/test/sidebar-test` primero
- **Lee los logs:** DevTools → Console con filtro `[DEBUG]`
- **Itera:** Crear, testear, ajustar, repetir

---

**Guía creada:** 4 de Noviembre, 2025  
**Tiempo para tu primer flujo:** ~30 minutos  
**Dificultad:** ⭐⭐ (Intermedio)

