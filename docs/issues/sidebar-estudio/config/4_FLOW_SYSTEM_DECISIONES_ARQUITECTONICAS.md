# Flow System - Decisiones Arquitectónicas: Clases vs Objetos

## 🎯 La Pregunta

> "¿Debería crear clases (`FlowGeneratorDoubleSidebar`, `FlowGeneratorSimple`) o trabajar con objetos puros?"

---

## 🤔 Análisis: Clases vs Objetos

### Opción 1: Clases (OOP)

```typescript
// ❌ Enfoque con clases
class FlowGeneratorDoubleSidebar {
  constructor(config) {
    /* ... */
  }
  generate() {
    /* ... */
  }
  validate() {
    /* ... */
  }
}

class FlowGeneratorSimple {
  constructor(config) {
    /* ... */
  }
  generate() {
    /* ... */
  }
  validate() {
    /* ... */
  }
}

// Uso
const generator = new FlowGeneratorDoubleSidebar(config);
const flow = generator.generate();
```

**Problemas:**

- ❌ Duplicación de código (dos clases muy similares)
- ❌ Difícil de extender (nueva clase por cada variante)
- ❌ Overhead de instancias
- ❌ Más complejo de testear
- ❌ No es idiomático en Vue/Nuxt (composables > clases)

---

### Opción 2: Objetos + Funciones (Functional)

```typescript
// ✅ Enfoque funcional con objetos
export const HierarchyFlowGenerator = {
  create(config: HierarchyFlowGeneratorConfig): FlowConfig {
    // Lógica de generación
    return flowConfig;
  },

  validate(config: FlowConfig): boolean {
    // Validación
    return true;
  },
};

// Uso
const flow = HierarchyFlowGenerator.create(config);
```

**Ventajas:**

- ✅ Sin instancias (stateless)
- ✅ Más simple y directo
- ✅ Fácil de testear (funciones puras)
- ✅ Idiomático en Vue/Nuxt
- ✅ Tree-shakeable
- ✅ TypeScript lo ama

---

## 🎯 Decisión: **Objetos + Funciones** (Functional Programming)

### ¿Por qué?

**1. Vue/Nuxt son funcionales por naturaleza**

```typescript
// Composables (functional)
export function useFlowNavigation(config) {
  /* ... */
}

// NOT classes
// export class FlowNavigation { /* ... */ }
```

**2. Más simple y testeable**

```typescript
// Test funcional (fácil)
test("should generate flow config", () => {
  const result = HierarchyFlowGenerator.create(mockConfig);
  expect(result).toEqual(expectedConfig);
});

// Test con clases (complejo)
test("should generate flow config", () => {
  const generator = new FlowGenerator(mockConfig);
  const result = generator.generate();
  expect(result).toEqual(expectedConfig);
});
```

**3. No necesitas estado (stateless)**

```typescript
// Generador NO mantiene estado interno
// Solo transforma INPUT → OUTPUT
HierarchyFlowGenerator.create(config); // ← Pure function
```

**4. Composición sobre herencia**

```typescript
// ✅ Functional composition
const flow = pipe(
  validateConfig,
  generateNavigation,
  applyRenderStrategy,
  buildFlowConfig
)(config);

// ❌ Class inheritance (complejo)
class BaseGenerator {
  /* ... */
}
class DoubleGenerator extends BaseGenerator {
  /* ... */
}
class SimpleGenerator extends BaseGenerator {
  /* ... */
}
```

---

## 🏗️ Arquitectura Correcta

### No necesitas múltiples generadores

```typescript
// ❌ INCORRECTO: Múltiples clases/objetos
FlowGeneratorDoubleSidebar;
FlowGeneratorSimple;
FlowGeneratorTriple;

// ✅ CORRECTO: UN generador con configuración
HierarchyFlowGenerator.create({
  renderStrategy: {
    leftSidebar: { levels: [1, 2] },
    rightSidebar: { levels: [3, 4] }, // ← Config determina UI
  },
});

HierarchyFlowGenerator.create({
  renderStrategy: {
    leftSidebar: { levels: [1] }, // ← Sin rightSidebar = Simple
  },
});
```

### Principio: Data over Code

```typescript
// ❌ Lógica en clases
class DoubleGenerator {
  generate() {
    // Lógica hardcodeada para double sidebar
  }
}

// ✅ Lógica en datos
const config = {
  renderStrategy: {
    leftSidebar: { levels: [1, 2] },
    rightSidebar: { levels: [3, 4] },
  },
};

// Una función lee el config y actúa
HierarchyFlowGenerator.create(config);
```

---

## 🔧 Implementación Recomendada

### Archivo: `utils/HierarchyFlowGenerator.ts`

```typescript
import type { FlowConfig, FlowItem, HierarchyFlowGeneratorConfig } from "~/types/flow-system";

/**
 * Generador de flujos jerárquicos
 * Enfoque funcional: Sin estado, funciones puras
 */
export const HierarchyFlowGenerator = {
  /**
   * Crea un FlowConfig desde configuración
   */
  create(config: HierarchyFlowGeneratorConfig): FlowConfig {
    // 1. Validar config
    this.validateConfig(config);

    // 2. Procesar datos de entrada
    const navigation = this.processSource(config);

    // 3. Aplicar estrategia de renderizado
    const processedNavigation = this.applyRenderStrategy(navigation, config.renderStrategy);

    // 4. Construir FlowConfig
    return this.buildFlowConfig(config, processedNavigation);
  },

  /**
   * Valida la configuración
   */
  validateConfig(config: HierarchyFlowGeneratorConfig): void {
    if (!config.id || !config.name) {
      throw new Error("id and name are required");
    }

    if (config.maxLevels < 1 || config.maxLevels > 10) {
      throw new Error("maxLevels must be between 1 and 10");
    }

    if (!config.source?.data) {
      throw new Error("source.data is required");
    }
  },

  /**
   * Procesa el source de datos
   */
  processSource(config: HierarchyFlowGeneratorConfig): FlowItem[] {
    const { source, maxLevels } = config;

    switch (source.type) {
      case "array":
        return this.processArray(source.data, source.mapper, maxLevels);

      case "tree":
        return this.processTree(source.data, source.mapper, maxLevels);

      default:
        return source.data;
    }
  },

  /**
   * Procesa array (flujos secuenciales)
   */
  processArray(
    data: any[],
    mapper?: (item: any, index: number) => FlowItem,
    maxLevels: number = 1
  ): FlowItem[] {
    return data.map((item, index) => {
      const flowItem = mapper ? mapper(item, index) : item;

      return {
        ...flowItem,
        level: 1,
        order: index + 1,
      };
    });
  },

  /**
   * Procesa árbol (flujos jerárquicos)
   */
  processTree(
    data: any,
    mapper?: (node: any, level: number, parent?: any) => FlowItem,
    maxLevels: number = 4,
    currentLevel: number = 1,
    parent?: any
  ): FlowItem[] {
    if (currentLevel > maxLevels) return [];

    const processNode = (node: any): FlowItem => {
      const flowItem = mapper
        ? mapper(node, currentLevel, parent)
        : { ...node, level: currentLevel };

      if (node.children && currentLevel < maxLevels) {
        flowItem.children = node.children.flatMap((child: any) =>
          this.processTree(child, mapper, maxLevels, currentLevel + 1, node)
        );
      }

      return flowItem;
    };

    return Array.isArray(data) ? data.map(processNode) : [processNode(data)];
  },

  /**
   * Aplica estrategia de renderizado
   */
  applyRenderStrategy(
    navigation: FlowItem[],
    strategy?: HierarchyFlowGeneratorConfig["renderStrategy"]
  ): FlowItem[] {
    if (!strategy?.rightSidebar) {
      return navigation;
    }

    return this.distributeToRightSidebar(
      navigation,
      strategy.rightSidebar.levels,
      strategy.rightSidebar.condition
    );
  },

  /**
   * Distribuye niveles al sidebar derecho
   */
  distributeToRightSidebar(
    items: FlowItem[],
    rightLevels: number[],
    condition?: (item: FlowItem) => boolean
  ): FlowItem[] {
    return items.map((item) => {
      if (item.level === 2 && item.children) {
        const rightSidebarItems = item.children.filter((child) =>
          rightLevels.includes(child.level)
        );

        const shouldShow = condition ? condition(item) : rightSidebarItems.length > 0;

        if (shouldShow) {
          return {
            ...item,
            rightSidebar: {
              enabled: true,
              title: item.label,
              items: rightSidebarItems,
            },
            children: item.children.filter((child) => !rightLevels.includes(child.level)),
          };
        }
      }

      if (item.children) {
        return {
          ...item,
          children: this.distributeToRightSidebar(item.children, rightLevels, condition),
        };
      }

      return item;
    });
  },

  /**
   * Construye el FlowConfig final
   */
  buildFlowConfig(config: HierarchyFlowGeneratorConfig, navigation: FlowItem[]): FlowConfig {
    return {
      id: config.id,
      name: config.name,
      description: config.description,
      type: config.type,
      navigation,

      allowJumpAhead: config.navigationRules?.allowJumpAhead ?? false,
      persistState: true,

      sidebarStyle: {
        width: "280px",
        position: "left",
        collapsible: true,
        defaultCollapsed: false,
      },

      rightSidebarStyle: config.renderStrategy?.rightSidebar
        ? {
            width: "240px",
            position: "right",
            showByDefault: false,
          }
        : undefined,

      header: {
        show: true,
        showProgress: true,
        showBreadcrumbs: config.type !== "sequential",
      },

      footer: {
        show: true,
        showNavigation: true,
        showSave: true,
      },
    };
  },
};
```

---

## 🧭 Navegación: ¿Cómo sabe el botón la ruta anterior/siguiente?

### El Problema

```
Usuario está en: /juntas/seleccion-puntos/acuerdos

Botón "Anterior": ¿Cómo sabe que debe ir a /juntas/seleccion-puntos?
Botón "Siguiente": ¿Cómo sabe que debe ir a /juntas/detalles-junta?
```

### La Solución: Composable `useFlowNavigation`

```typescript
// composables/useFlowNavigation.ts

export function useFlowNavigation(config: FlowConfig) {
  const route = useRoute();
  const router = useRouter();
  const store = useFlowNavigationStore();

  /**
   * Obtiene el FlowItem actual desde la ruta
   */
  const currentItem = computed(() => {
    const currentPath = route.path;
    return findItemByPath(config.navigation, currentPath);
  });

  /**
   * Obtiene el FlowItem anterior (en el flujo, NO en historial)
   */
  const previousItem = computed(() => {
    if (!currentItem.value) return null;

    const flatItems = flattenNavigation(config.navigation);
    const currentIndex = flatItems.findIndex((item) => item.id === currentItem.value?.id);

    return currentIndex > 0 ? flatItems[currentIndex - 1] : null;
  });

  /**
   * Obtiene el FlowItem siguiente (en el flujo)
   */
  const nextItem = computed(() => {
    if (!currentItem.value) return null;

    const flatItems = flattenNavigation(config.navigation);
    const currentIndex = flatItems.findIndex((item) => item.id === currentItem.value?.id);

    return currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : null;
  });

  /**
   * Puede ir al anterior?
   */
  const canGoPrevious = computed(() => {
    return previousItem.value !== null;
  });

  /**
   * Puede ir al siguiente?
   */
  const canGoNext = computed(() => {
    if (!nextItem.value) return false;

    // Verificar si el paso actual está completado
    const currentState = store.itemStates.get(currentItem.value?.id);
    if (config.type === "sequential" && currentState?.status !== "completed") {
      return false;
    }

    // Verificar si el siguiente está bloqueado
    const nextState = store.itemStates.get(nextItem.value.id);
    return nextState?.status !== "locked";
  });

  /**
   * Ir al anterior (en el flujo, NO historial)
   */
  async function previous() {
    if (!previousItem.value?.path) return;

    await router.push(previousItem.value.path);
    store.setCurrentItem(previousItem.value.id);
  }

  /**
   * Ir al siguiente (en el flujo)
   */
  async function next() {
    if (!canGoNext.value || !nextItem.value?.path) return false;

    // Marcar el actual como completado
    if (currentItem.value) {
      store.completeItem(currentItem.value.id);
    }

    // Navegar al siguiente
    await router.push(nextItem.value.path);
    store.setCurrentItem(nextItem.value.id);

    return true;
  }

  /**
   * Ir a un item específico
   */
  async function goTo(itemId: string) {
    const item = findItemById(config.navigation, itemId);
    if (!item?.path) return false;

    // Verificar si puede acceder
    const itemState = store.itemStates.get(itemId);
    if (itemState?.status === "locked" && !config.allowJumpAhead) {
      return false;
    }

    await router.push(item.path);
    store.setCurrentItem(itemId);

    return true;
  }

  return {
    currentItem,
    previousItem,
    nextItem,
    canGoPrevious,
    canGoNext,
    previous,
    next,
    goTo,
  };
}

/**
 * Aplana el árbol de navegación a array lineal
 */
function flattenNavigation(items: FlowItem[]): FlowItem[] {
  return items.reduce((acc: FlowItem[], item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...flattenNavigation(item.children));
    }
    return acc;
  }, []);
}

/**
 * Busca item por path
 */
function findItemByPath(items: FlowItem[], path: string): FlowItem | null {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.children) {
      const found = findItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Busca item por ID
 */
function findItemById(items: FlowItem[], id: string): FlowItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}
```

### Uso en Componentes

```vue
<!-- components/flow-system/FlowFooter.vue -->
<script setup lang="ts">
  const props = defineProps<{
    config: FlowConfig;
  }>();

  // Composable maneja toda la lógica de navegación
  const flow = useFlowNavigation(props.config);

  async function handlePrevious() {
    await flow.previous(); // ← Va al anterior en el FLUJO
  }

  async function handleNext() {
    await flow.next(); // ← Va al siguiente en el FLUJO
  }
</script>

<template>
  <footer class="flow-footer">
    <Button @click="handlePrevious" :disabled="!flow.canGoPrevious">← Anterior</Button>

    <Button @click="handleNext" :disabled="!flow.canGoNext">Siguiente →</Button>
  </footer>
</template>
```

---

## 🎯 Resumen de Decisiones

### 1. Arquitectura: Funcional > OOP

```typescript
// ✅ ELEGIDO: Funcional
export const HierarchyFlowGenerator = {
  create(config) {
    /* ... */
  },
};

// ❌ DESCARTADO: Clases
class FlowGenerator {
  /* ... */
}
```

**Razón**: Vue/Nuxt son funcionales, más simple, testeable, idiomático

---

### 2. Un Generador > Múltiples Generadores

```typescript
// ✅ ELEGIDO: Uno con config
HierarchyFlowGenerator.create({
  renderStrategy: {
    /* config determina UI */
  },
});

// ❌ DESCARTADO: Múltiples
FlowGeneratorDouble;
FlowGeneratorSimple;
```

**Razón**: Data over Code, menos duplicación, más flexible

---

### 3. Navegación: Composable > Store directo

```typescript
// ✅ ELEGIDO: Composable
const flow = useFlowNavigation(config);
flow.next(); // ← Conoce el flujo completo

// ❌ DESCARTADO: Store directo
store.goToNext(); // ← No sabe qué es "next"
```

**Razón**: Composable conoce el FlowConfig, puede calcular anterior/siguiente

---

### 4. Estado: Store (Pinia) para progreso

```typescript
// ✅ ELEGIDO: Store para estado global
const store = useFlowNavigationStore();
store.completeItem("datos-sociedad");
store.itemStates; // ← Compartido entre componentes

// ✅ Composable para lógica de navegación
const flow = useFlowNavigation(config);
flow.next(); // ← Usa el store internamente
```

**Razón**: Store para estado, Composable para lógica

---

## 🏆 Arquitectura Final

```
┌─────────────────────────────────────┐
│  HierarchyFlowGenerator             │  ← Funcional, sin estado
│  create(config) → FlowConfig        │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  FlowConfig (Objeto)                │  ← Datos puros
│  { navigation, type, ... }          │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  useFlowNavigation(config)          │  ← Composable con lógica
│  previous(), next(), goTo()         │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  useFlowNavigationStore()           │  ← Store para estado
│  itemStates, currentItemId          │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  UniversalFlowLayout                │  ← Componente UI
│  <FlowSidebar> <FlowFooter>         │
└─────────────────────────────────────┘
```

---

## 💡 Respuesta a "¿Qué eligirías como senior?"

**Funcional + Objetos puros + Composables**

**Por qué:**

- ✅ Más simple (menos código)
- ✅ Más testeable (funciones puras)
- ✅ Más idiomático (Vue/Nuxt style)
- ✅ Más flexible (composición)
- ✅ Más performante (tree-shaking)
- ✅ Menos errores (sin estado compartido en clases)

**Evitar:**

- ❌ Clases con estado (no es idiomático en Vue)
- ❌ Múltiples generadores (duplicación)
- ❌ Lógica en componentes (usar composables)

---

¿Quieres que ahora implementemos el código completo siguiendo esta arquitectura? 🚀
