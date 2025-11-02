# Flow System - Arquitectura del Generador

## 🎯 El Problema Real

### Lo que pensabas que necesitabas:

```
❌ "Necesito crear 2 sidebars"
❌ "Necesito un componente DoubleSidebar"
❌ "Necesito duplicar código para cada flujo"
```

### Lo que REALMENTE necesitas:

```
✅ "Necesito manejar jerarquías de hasta 4 niveles"
✅ "La UI (sidebar) es solo una consecuencia de la jerarquía"
✅ "Necesito un generador que cree la estructura de datos"
```

---

## 📐 Arquitectura Correcta

### Capas del Sistema

```
┌─────────────────────────────────────────────────┐
│  CAPA 1: DOMINIO (Tu Problema de Negocio)      │
│  "Tengo un árbol de 4 niveles"                  │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│  CAPA 2: GENERADOR (FlowGenerator)             │
│  "Crea la estructura de datos desde dominio"    │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│  CAPA 3: CONFIGURACIÓN (FlowConfig)            │
│  "Estructura de datos agnóstica de UI"          │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│  CAPA 4: RENDERER (UniversalFlowLayout)        │
│  "Lee la estructura y decide cómo renderizar"   │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│  CAPA 5: UI COMPONENTS (Sidebars, Tabs, etc)   │
│  "Componentes visuales intercambiables"         │
└─────────────────────────────────────────────────┘
```

---

## 🏗️ El Generador: HierarchyFlowGenerator

### Concepto

**No generas "sidebars", generas "estructuras de jerarquía".**

```typescript
// ❌ INCORRECTO: Pensar en UI
createDoubleSidebar();
createTripleSidebar();

// ✅ CORRECTO: Pensar en estructura
HierarchyFlowGenerator.create({
  levels: 4, // ← Tu problema de dominio
  type: "hierarchical",
});
```

### Interface del Generador

```typescript
interface HierarchyFlowGeneratorConfig {
  // === ESTRUCTURA ===
  maxLevels: 1 | 2 | 3 | 4; // Profundidad del árbol
  type: "sequential" | "hierarchical" | "mixed";

  // === DATOS DE ENTRADA ===
  source: {
    type: "array" | "tree" | "api" | "custom";
    data: any; // Tus datos crudos
    mapper?: (item: any) => FlowItem; // Función de mapeo
  };

  // === REGLAS DE NAVEGACIÓN ===
  navigationRules?: {
    allowJumpAhead?: boolean;
    requireSequential?: boolean;
    autoUnlock?: boolean;
  };

  // === ESTRATEGIA DE RENDERIZADO ===
  renderStrategy?: {
    leftSidebar: {
      levels: number[]; // Ej: [1, 2]
      renderer: "sequential" | "hierarchical";
    };
    rightSidebar?: {
      levels: number[]; // Ej: [3, 4]
      renderer: "sequential" | "hierarchical";
      condition?: (item: FlowItem) => boolean;
    };
    center?: {
      type: "tabs" | "accordion" | "single";
    };
  };

  // === METADATA ===
  id: string;
  name: string;
  description?: string;
}
```

---

## 🔧 Uso del Generador

### Ejemplo 1: Registro Societario (1 nivel)

```typescript
// Tu dominio: 10 pasos lineales
const registroSteps = [
  { id: "datos-sociedad", label: "Datos de Sociedad", route: "/registro/..." },
  { id: "datos-socios", label: "Datos de Socios", route: "/registro/..." },
  // ... 8 más
];

// Usar el generador
const registroFlow = HierarchyFlowGenerator.create({
  id: "registro-sociedades",
  name: "Registro de Sociedades",
  maxLevels: 1, // ← Solo 1 nivel
  type: "sequential",

  source: {
    type: "array",
    data: registroSteps,
    mapper: (step) => ({
      id: step.id,
      label: step.label,
      level: 1, // ← Todos nivel 1
      path: step.route,
      icon: "Building",
    }),
  },

  renderStrategy: {
    leftSidebar: {
      levels: [1], // ← Solo nivel 1 en sidebar izquierdo
      renderer: "sequential",
    },
    // NO hay rightSidebar
  },
});

// RESULTADO:
// FlowConfig generado automáticamente con:
// - navigation: FlowItem[] (10 items nivel 1)
// - sidebarStyle: { ... }
// - NO rightSidebarStyle
```

**¿Qué UI genera?**

```
┌──────────────┬─────────────────┐
│ SIDEBAR IZQ  │   CONTENIDO     │
│              │                 │
│ 1. Datos     │   Vista actual  │
│ 2. Socios    │                 │
│ 3. Repr.     │                 │
│ ...          │                 │
└──────────────┴─────────────────┘
```

---

### Ejemplo 2: Juntas de Accionistas (4 niveles)

```typescript
// Tu dominio: Árbol jerárquico complejo
const juntasTree = {
  id: "juntas",
  label: "Juntas de Accionistas",
  children: [
    {
      id: "seleccion-puntos",
      label: "Selección de Puntos",
      children: [
        {
          id: "acuerdos",
          label: "Acuerdos",
          children: [
            {
              id: "acuerdo-directorio",
              label: "Elección de Directorio",
              children: [
                { id: "director-1", label: "Director 1" },
                { id: "director-2", label: "Director 2" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Usar el generador
const juntasFlow = HierarchyFlowGenerator.create({
  id: "juntas-accionistas",
  name: "Juntas de Accionistas",
  maxLevels: 4, // ← 4 niveles
  type: "hierarchical",

  source: {
    type: "tree",
    data: juntasTree,
    mapper: (node, level, parent) => ({
      id: node.id,
      label: node.label,
      level: level, // ← Auto-calculado (1, 2, 3, 4)
      parentId: parent?.id,
      path: level <= 2 ? `/juntas/${node.id}` : undefined,
      href: level >= 3 ? `#${node.id}` : undefined,
      icon: getIconForLevel(level),
      children: node.children?.map((child) => mapper(child, level + 1, node)),
    }),
  },

  renderStrategy: {
    leftSidebar: {
      levels: [1, 2], // ← Niveles 1-2 en izquierda
      renderer: "hierarchical",
    },
    rightSidebar: {
      levels: [3, 4], // ← Niveles 3-4 en derecha
      renderer: "hierarchical",
      condition: (item) => item.level === 2 && item.children?.length > 0,
    },
  },
});

// RESULTADO:
// FlowConfig generado automáticamente con:
// - navigation: FlowItem[] (árbol completo)
// - Niveles 1-2 como items normales
// - Niveles 3-4 dentro de rightSidebar de nivel 2
// - sidebarStyle: { ... }
// - rightSidebarStyle: { ... }
```

**¿Qué UI genera?**

```
┌───────────────┬──────────────┬──────────────┐
│ SIDEBAR IZQ   │  CONTENIDO   │ SIDEBAR DER  │
│ (Niveles 1-2) │              │ (Niveles 3-4)│
│               │              │              │
│ 1. Sel. Ptos  │  Vista       │ 3. Acuerdo 1 │
│   ├─ Acuerdos │  Acuerdos    │   ├─ 4. Det. │
│   └─ Otros    │              │   └─ 4. Det. │
│ 2. Detalles   │              │ 3. Acuerdo 2 │
└───────────────┴──────────────┴──────────────┘
```

---

### Ejemplo 3: Dashboard Admin (3 sidebars - Caso Extremo)

```typescript
// Supongamos que necesitas 3 sidebars (caso raro)
const dashboardFlow = HierarchyFlowGenerator.create({
  id: "dashboard-admin",
  name: "Dashboard de Administración",
  maxLevels: 5, // ← 5 niveles (caso extremo)
  type: "mixed",

  source: {
    type: "api",
    data: fetchDashboardStructure(),
    mapper: mapDashboardToFlowItems,
  },

  renderStrategy: {
    leftSidebar: {
      levels: [1, 2], // ← Menú principal
      renderer: "hierarchical",
    },
    rightSidebar: {
      levels: [3, 4], // ← Submenu contextual
      renderer: "hierarchical",
      condition: (item) => item.hasContextualMenu,
    },
    farRightSidebar: {
      // ← Tercer sidebar (nuevo!)
      levels: [5],
      renderer: "sequential",
      condition: (item) => item.hasDetailPanel,
    },
  },
});
```

**¿Qué UI genera?**

```
┌────────┬──────────┬────────────┬────────────┐
│ MAIN   │ CONTEXT  │  CONTENT   │  DETAILS   │
│ (1-2)  │ (3-4)    │            │  (5)       │
│        │          │            │            │
│ Menu   │ Submenu  │   Vista    │   Panel    │
└────────┴──────────┴────────────┴────────────┘
```

---

## 💻 Implementación del Generador

### Archivo: `utils/HierarchyFlowGenerator.ts`

```typescript
export class HierarchyFlowGenerator {
  /**
   * Crea un FlowConfig desde una estructura de datos
   */
  static create(config: HierarchyFlowGeneratorConfig): FlowConfig {
    // 1. Procesar los datos de entrada
    const navigation = this.processSource(config.source, config.maxLevels);

    // 2. Aplicar estrategia de renderizado
    const processedNavigation = this.applyRenderStrategy(navigation, config.renderStrategy);

    // 3. Generar FlowConfig
    return {
      id: config.id,
      name: config.name,
      description: config.description,
      type: config.type,
      navigation: processedNavigation,

      // Auto-generar estilos según estrategia
      sidebarStyle: this.generateSidebarStyle(config.renderStrategy?.leftSidebar),
      rightSidebarStyle: this.generateRightSidebarStyle(config.renderStrategy?.rightSidebar),

      // Auto-generar reglas
      allowJumpAhead: config.navigationRules?.allowJumpAhead ?? false,
      persistState: true,
    };
  }

  /**
   * Procesa el source según su tipo
   */
  private static processSource(
    source: HierarchyFlowGeneratorConfig["source"],
    maxLevels: number
  ): FlowItem[] {
    switch (source.type) {
      case "array":
        return this.processArray(source.data, source.mapper, maxLevels);

      case "tree":
        return this.processTree(source.data, source.mapper, maxLevels);

      case "api":
        return this.processAPI(source.data, source.mapper, maxLevels);

      case "custom":
        return source.data; // Ya viene procesado

      default:
        throw new Error(`Unknown source type: ${source.type}`);
    }
  }

  /**
   * Procesa array (para flujos secuenciales)
   */
  private static processArray(
    data: any[],
    mapper?: (item: any) => FlowItem,
    maxLevels: number
  ): FlowItem[] {
    return data.map((item, index) => {
      const flowItem = mapper ? mapper(item) : item;

      return {
        ...flowItem,
        level: 1, // Arrays siempre nivel 1
        order: index + 1,
      };
    });
  }

  /**
   * Procesa árbol (para flujos jerárquicos)
   */
  private static processTree(
    node: any,
    mapper?: (node: any, level: number, parent?: any) => FlowItem,
    maxLevels: number,
    currentLevel = 1,
    parent?: any
  ): FlowItem[] {
    if (currentLevel > maxLevels) return [];

    const flowItem = mapper
      ? mapper(node, currentLevel, parent)
      : { ...node, level: currentLevel };

    // Procesar hijos recursivamente
    if (node.children && currentLevel < maxLevels) {
      flowItem.children = node.children.flatMap((child: any) =>
        this.processTree(child, mapper, maxLevels, currentLevel + 1, node)
      );
    }

    return [flowItem];
  }

  /**
   * Aplica estrategia de renderizado
   * Distribuye niveles entre sidebars
   */
  private static applyRenderStrategy(
    navigation: FlowItem[],
    strategy?: HierarchyFlowGeneratorConfig["renderStrategy"]
  ): FlowItem[] {
    if (!strategy?.rightSidebar) {
      // No hay sidebar derecho, retornar tal cual
      return navigation;
    }

    // Mover niveles 3-4 a rightSidebar de nivel 2
    return this.distributeToRightSidebar(
      navigation,
      strategy.rightSidebar.levels,
      strategy.rightSidebar.condition
    );
  }

  /**
   * Distribuye niveles 3-4 al rightSidebar
   */
  private static distributeToRightSidebar(
    items: FlowItem[],
    rightLevels: number[],
    condition?: (item: FlowItem) => boolean
  ): FlowItem[] {
    return items.map((item) => {
      // Si el item es nivel 2 y tiene hijos de nivel 3-4
      if (item.level === 2 && item.children) {
        const rightSidebarItems = item.children.filter((child) =>
          rightLevels.includes(child.level)
        );

        const shouldShowRightSidebar = condition
          ? condition(item)
          : rightSidebarItems.length > 0;

        if (shouldShowRightSidebar) {
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

      // Aplicar recursivamente a hijos
      if (item.children) {
        return {
          ...item,
          children: this.distributeToRightSidebar(item.children, rightLevels, condition),
        };
      }

      return item;
    });
  }

  /**
   * Genera estilos del sidebar izquierdo
   */
  private static generateSidebarStyle(
    leftConfig?: HierarchyFlowGeneratorConfig["renderStrategy"]["leftSidebar"]
  ) {
    return {
      width: "280px",
      position: "left" as const,
      collapsible: true,
      defaultCollapsed: false,
    };
  }

  /**
   * Genera estilos del sidebar derecho
   */
  private static generateRightSidebarStyle(
    rightConfig?: HierarchyFlowGeneratorConfig["renderStrategy"]["rightSidebar"]
  ) {
    if (!rightConfig) return undefined;

    return {
      width: "240px",
      position: "right" as const,
      showByDefault: false, // Siempre condicional
    };
  }
}
```

---

## 🎨 Uso en tu App

### Antes (Manual)

```typescript
// ❌ Tenías que crear manualmente cada config
export function getRegistroFlowConfig() {
  return {
    id: "registro",
    name: "Registro",
    type: "sequential",
    navigation: [
      { id: "paso-1", label: "...", level: 1 /* ... */ },
      { id: "paso-2", label: "...", level: 1 /* ... */ },
      // ... 50 líneas más
    ],
    sidebarStyle: {
      /* ... */
    },
    // ... 30 líneas más
  };
}
```

### Ahora (Con Generador)

```typescript
// ✅ Defines tu estructura de dominio
const registroSteps = [
  { id: "datos-sociedad", label: "Datos de Sociedad" },
  { id: "datos-socios", label: "Datos de Socios" },
  // ... datos crudos
];

// ✅ Generas el FlowConfig en 1 línea
export function getRegistroFlowConfig() {
  return HierarchyFlowGenerator.create({
    id: "registro-sociedades",
    name: "Registro de Sociedades",
    maxLevels: 1,
    type: "sequential",
    source: {
      type: "array",
      data: registroSteps,
      mapper: mapToFlowItem, // Función reutilizable
    },
    renderStrategy: {
      leftSidebar: { levels: [1], renderer: "sequential" },
    },
  });
}
```

---

## 🚀 Escalabilidad

### Agregar nuevo flujo

```typescript
// Nuevo flujo: Contratos (3 niveles)
const contratosFlow = HierarchyFlowGenerator.create({
  id: "gestion-contratos",
  name: "Gestión de Contratos",
  maxLevels: 3,
  type: "hierarchical",

  source: {
    type: "api",
    data: await fetchContratosStructure(),
    mapper: mapContratosToFlowItem,
  },

  renderStrategy: {
    leftSidebar: { levels: [1, 2], renderer: "hierarchical" },
    rightSidebar: { levels: [3], renderer: "sequential" },
  },
});
```

### Cambiar UI sin tocar lógica

```typescript
// Mismo FlowConfig, diferente renderer
const flowConfig = getJuntasFlowConfig()

// Opción 1: Sidebars (actual)
<UniversalFlowLayout :config="flowConfig" />

// Opción 2: Tabs (nuevo renderer)
<TabsFlowRenderer :config="flowConfig" />

// Opción 3: Tree view (nuevo renderer)
<TreeFlowRenderer :config="flowConfig" />
```

---

## 📊 Comparación: Antes vs Ahora

### Antes (Sin Generador)

```
Problema: 4 niveles de jerarquía
        ↓
Solución Manual: Crear DoubleSidebar component
        ↓
Código: 500 líneas de configuración manual
        ↓
Nuevos flujos: Duplicar 500 líneas
        ↓
Cambiar UI: Reescribir todo
```

### Ahora (Con Generador)

```
Problema: N niveles de jerarquía
        ↓
Definir: maxLevels y renderStrategy
        ↓
Generador: Crea FlowConfig automáticamente
        ↓
Código: 20 líneas de configuración
        ↓
Nuevos flujos: 20 líneas más
        ↓
Cambiar UI: Cambiar renderer (mismo config)
```

---

## 🎯 Respuesta a tu Pregunta

### "¿Necesito un generador?"

**SÍ**, pero no para generar "sidebars", sino para:

✅ **Generar estructuras de jerarquía** desde datos crudos  
✅ **Separar dominio (niveles) de UI (sidebars)**  
✅ **Reutilizar código** entre flujos  
✅ **Escalar fácilmente** (1, 2, 3, 4, 5+ niveles)  
✅ **Cambiar UI** sin tocar lógica

### "¿Cómo se llama?"

```typescript
HierarchyFlowGenerator; // ← Nombre correcto

// NO "SidebarGenerator" (eso es UI)
// NO "DoubleSidebarCreator" (muy específico)
// SÍ "HierarchyFlowGenerator" (genérico, escalable)
```

### "¿Qué hace?"

```typescript
// Input: Tus datos + Reglas de jerarquía
HierarchyFlowGenerator.create({
  maxLevels: 4,
  source: { type: "tree", data: misDatos },
  renderStrategy: { leftSidebar: [1, 2], rightSidebar: [3, 4] },
});

// Output: FlowConfig completo
// {
//   navigation: FlowItem[],
//   sidebarStyle: {...},
//   rightSidebarStyle: {...}
// }
```

---

## 🏁 Conclusión

### Tu problema NO es:

❌ "Necesito múltiples sidebars"

### Tu problema ES:

✅ "Necesito manejar jerarquías de N niveles"

### La solución:

**HierarchyFlowGenerator** que:

1. Recibe estructura de dominio (árbol/array)
2. Aplica reglas de jerarquía (maxLevels)
3. Aplica estrategia de renderizado (qué niveles en qué sidebar)
4. Genera FlowConfig automáticamente
5. UniversalFlowLayout lee el config y renderiza

### Resultado:

```typescript
// Para CUALQUIER número de flujos
const flow1 = HierarchyFlowGenerator.create({ maxLevels: 1, ... })
const flow2 = HierarchyFlowGenerator.create({ maxLevels: 4, ... })
const flow3 = HierarchyFlowGenerator.create({ maxLevels: 2, ... })

// Todos usan el MISMO renderer
<UniversalFlowLayout :config="flow1" />
<UniversalFlowLayout :config="flow2" />
<UniversalFlowLayout :config="flow3" />
```

**Un generador para gobernarlos a todos.** 🧙‍♂️

---

¿Quieres que ahora implementemos el `HierarchyFlowGenerator` completo? 🚀
