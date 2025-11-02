# Flow System - Plan de Estudio y Desarrollo Ordenado

## 🎯 Tu Objetivo

> "Soy programador y mi objetivo es la programación del flujo. Necesito entenderlo de forma ordenada."

---

## 📋 PASO 1: Entender la Estructura de Datos

### 1.1 FlowItem (La Pieza Fundamental)

```typescript
interface FlowItem {
  // === IDENTIDAD ===
  // ¿Quién soy? ¿Cómo me identifico?
  identity: {
    id: string; // Único: "datos-sociedad"
    label: string; // UI: "Datos de Sociedad"
    description?: string; // Ayuda extra
    icon?: string; // Icono visual
    badge?: string; // Badge "Nuevo", "Opcional"
  };

  // === JERARQUÍA ===
  // ¿Dónde estoy en el árbol? ¿Quién es mi padre/hijos?
  hierarchy: {
    level: 1 | 2 | 3 | 4; // Mi nivel en el árbol
    order: number; // Mi posición (1, 2, 3...)
    parentId?: string; // ID de mi padre
    children?: FlowItem[]; // Mis hijos
  };

  // === NAVEGACIÓN ===
  // ¿A dónde voy cuando me clickean?
  navigation?: {
    path?: string; // Ruta de página: "/registro/datos-sociedad"
    href?: string; // Anchor o externa: "#seccion-1"
  };

  // === COMPORTAMIENTO ===
  // ¿Cómo me comporto? ¿Puedo saltarme? ¿Estoy bloqueado?
  behavior?: {
    isOptional?: boolean; // ¿Puedo saltarme?
    isLocked?: boolean; // ¿Estoy bloqueado?
    requiresCompletion?: boolean; // ¿Debo completarme?
  };

  // === SIDEBAR DERECHO ===
  // ¿Activo el sidebar derecho? (solo nivel 2)
  rightSidebar?: {
    enabled: boolean; // ¿Mostrar?
    title?: string; // Título del sidebar
    items: FlowItem[]; // Items nivel 3-4
  };

  // === VALIDACIÓN ===
  // ¿Necesito validación antes de avanzar?
  validation?: {
    required?: boolean; // ¿Es obligatoria?
    validator?: () => Promise<boolean>; // Función custom
  };

  // === METADATA ===
  // Cualquier data extra que necesites
  metadata?: Record<string, any>;
}
```

**🎓 Estudia esto:**

1. **Lee el interface** línea por línea
2. **Crea 3 ejemplos** a mano:
   - Uno simple (nivel 1)
   - Uno con hijos (nivel 1-2)
   - Uno completo (nivel 1-2-3-4 con rightSidebar)
3. **Identifica grupos**: identidad, jerarquía, navegación, etc.

---

### 1.2 FlowConfig (El Flujo Completo)

```typescript
interface FlowConfig {
  // === IDENTIDAD DEL FLUJO ===
  // ¿Qué flujo es este?
  identity: {
    id: string; // "registro-sociedades"
    name: string; // "Registro de Sociedades"
    description?: string; // Descripción larga
  };

  // === TIPO Y ESTRUCTURA ===
  // ¿Cómo está estructurado?
  structure: {
    type: "sequential" | "hierarchical" | "mixed";
    maxLevels: number; // 1, 2, 3, 4
    navigation: FlowItem[]; // ← AQUÍ ESTÁN TODOS LOS ITEMS
  };

  // === REGLAS DE NAVEGACIÓN ===
  // ¿Cómo puedo navegar?
  navigationRules?: {
    allowJumpAhead?: boolean; // ¿Puedo saltar pasos?
    requireSequential?: boolean; // ¿Debo ir en orden?
    autoUnlock?: boolean; // ¿Desbloquear automático?
  };

  // === UI - SIDEBARS ===
  // ¿Cómo se ve?
  ui: {
    leftSidebar: {
      width: string; // "280px"
      position: "left";
      collapsible: boolean;
      defaultCollapsed?: boolean;
      levels: number[]; // [1, 2] ← Qué niveles mostrar
    };

    rightSidebar?: {
      width: string; // "240px"
      position: "right";
      showByDefault: boolean;
      levels: number[]; // [3, 4] ← Qué niveles mostrar
    };

    header?: {
      show: boolean;
      showProgress: boolean;
      showBreadcrumbs: boolean;
      title?: string;
    };

    footer?: {
      show: boolean;
      showNavigation: boolean; // Botones Anterior/Siguiente
      showSave: boolean; // Botón Guardar
      actions?: Array<{
        // Acciones custom
        id: string;
        label: string;
        icon?: string;
        onClick: () => void;
      }>;
    };
  };

  // === PERSISTENCIA ===
  // ¿Guardo el progreso?
  persistence?: {
    enabled: boolean; // localStorage?
    key?: string; // Clave custom
    autosave?: boolean; // ¿Auto-guardar?
  };

  // === EVENTOS ===
  // ¿Qué pasa cuando...?
  events?: {
    onProgressUpdate?: (progress: number) => void;
    onFlowComplete?: () => void;
    onNavigate?: (itemId: string) => void;
    onValidationError?: (itemId: string, error: string) => void;
  };
}
```

**🎓 Estudia esto:**

1. **Lee el interface** agrupado
2. **Identifica la relación**: FlowConfig contiene FlowItem[]
3. **Visualiza**: FlowConfig = Configuración, FlowItem = Pasos

---

## 📋 PASO 2: Entender el Flujo de Datos

### 2.1 De Datos Crudos → FlowConfig

```
┌─────────────────────────────────────────────────────────┐
│ PASO 1: Tus Datos Crudos                                │
│ (Array, Árbol, API, etc.)                               │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 2: HierarchyFlowGenerator                          │
│ Transforma datos → FlowConfig                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 3: FlowConfig                                      │
│ Objeto con toda la configuración                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 4: Layout (registro-flow.vue)                     │
│ <UniversalFlowLayout :config="flowConfig" />            │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 5: Página (datos-sociedad.vue)                    │
│ definePageMeta({ layout: 'registro-flow' })             │
└─────────────────────────────────────────────────────────┘
```

**🎓 Estudia esto:**

1. **Traza el flujo** de datos en papel
2. **Identifica cada transformación**
3. **Entiende**: Datos → Config → Layout → Página

---

### 2.2 Navegación: Cómo Funciona

```typescript
// === ESTRUCTURA DE NAVEGACIÓN ===

// 1. FlowConfig tiene todos los pasos
const flowConfig = {
  structure: {
    navigation: [
      {
        identity: { id: "paso-1", label: "Paso 1" },
        hierarchy: { level: 1, order: 1 },
        navigation: { path: "/flujo/paso-1" },
      },
      {
        identity: { id: "paso-2", label: "Paso 2" },
        hierarchy: { level: 1, order: 2 },
        navigation: { path: "/flujo/paso-2" }, // ← Usuario AQUÍ
      },
      {
        identity: { id: "paso-3", label: "Paso 3" },
        hierarchy: { level: 1, order: 3 },
        navigation: { path: "/flujo/paso-3" },
      },
    ],
  },
};

// 2. useFlowNavigation LEE el config
const flow = useFlowNavigation(flowConfig);

// 3. Calcula automáticamente:
flow.currentItem; // → paso-2 (porque route.path === '/flujo/paso-2')
flow.previousItem; // → paso-1 (order: 1 < 2)
flow.nextItem; // → paso-3 (order: 3 > 2)

// 4. Métodos de navegación:
await flow.previous(); // → router.push('/flujo/paso-1')
await flow.next(); // → router.push('/flujo/paso-3')
await flow.goTo("paso-1"); // → router.push('/flujo/paso-1')

// === ¿CÓMO SABE CUÁL ES EL ANTERIOR/SIGUIENTE? ===

// Función interna del composable:
function flattenNavigation(items: FlowItem[]): FlowItem[] {
  // 1. Convierte árbol → array lineal
  // [paso-1, paso-2, paso-3]

  // 2. Encuentra índice actual
  const currentIndex = items.findIndex((item) => item.navigation.path === route.path);

  // 3. Anterior = currentIndex - 1
  const previous = items[currentIndex - 1];

  // 4. Siguiente = currentIndex + 1
  const next = items[currentIndex + 1];

  return { previous, next };
}
```

**🎓 Estudia esto:**

1. **Entiende**: FlowConfig tiene TODOS los pasos en orden
2. **Visualiza**: Composable aplana el árbol a lista
3. **Traza**: Cómo calcula anterior/siguiente

---

## 📋 PASO 3: Entender los Layouts de Nuxt

### 3.1 Sistema de Layouts

```
┌─────────────────────────────────────────────────────────┐
│ app/layouts/default.vue                                 │
│ (Layout global - tiene ProboSidebar)                    │
│                                                         │
│  <ProboSidebar /> <main><slot /></main>                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ app/layouts/registro-flow.vue                           │
│ (Layout custom para flujo)                              │
│                                                         │
│  <UniversalFlowLayout :config="flowConfig">            │
│    <slot />                                             │
│  </UniversalFlowLayout>                                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ app/pages/registro/.../datos-sociedad.vue               │
│ (Página con contenido)                                  │
│                                                         │
│  definePageMeta({ layout: 'registro-flow' })           │
│  <template>...</template>                              │
└─────────────────────────────────────────────────────────┘
```

### 3.2 ¿Cómo Selecciona el Layout?

```typescript
// En la página:
definePageMeta({
  layout: "registro-flow", // ← Busca app/layouts/registro-flow.vue
});

// Nuxt automáticamente:
// 1. Lee el metadata
// 2. Busca el archivo del layout
// 3. Wrappea tu página con ese layout
```

### 3.3 Layouts Dinámicos

```typescript
// ❌ NO PUEDES (layout debe ser string literal)
const layout = computed(() => `layout-${number}`);
definePageMeta({ layout: layout.value });

// ✅ PUEDES (pero limitado)
definePageMeta({
  layout: false, // Sin layout
});

// ✅ MEJOR: Un layout que se adapta
definePageMeta({
  layout: "universal-flow", // Mismo layout para todos
});

// Y el layout lee la ruta para saber qué FlowConfig usar
const route = useRoute();
const flowConfig = computed(() => {
  if (route.path.includes("/registro")) return getRegistroFlowConfig();
  if (route.path.includes("/juntas")) return getJuntasFlowConfig();
  // etc...
});
```

**🎓 Estudia esto:**

1. **Crea un layout simple** de prueba
2. **Crea una página** que lo use
3. **Experimenta** con metadata

---

## 📋 PASO 4: Plan de Acción para Ti

### Fase 1: Fundamentos (2-3 horas)

```
✅ 1. Leer y entender FlowItem interface
   - Identificar los 7 grupos
   - Crear 3 ejemplos a mano

✅ 2. Leer y entender FlowConfig interface
   - Identificar los 6 grupos
   - Ver cómo contiene FlowItems

✅ 3. Estudiar el flujo de datos
   - Datos → Generator → Config → Layout → Página
   - Dibujar diagrama en papel

✅ 4. Entender navegación
   - Leer useFlowNavigation conceptualmente
   - Entender cómo calcula anterior/siguiente
```

### Fase 2: Layouts de Nuxt (1-2 horas)

```
✅ 5. Crear layout de prueba
   - app/layouts/test-layout.vue
   - Con contenido simple

✅ 6. Crear página que use el layout
   - app/pages/test-page.vue
   - definePageMeta({ layout: 'test-layout' })

✅ 7. Experimentar
   - Cambiar layouts
   - Ver cómo wrappea el contenido
   - Entender el slot
```

### Fase 3: Flow System (2-3 horas)

```
✅ 8. Ver un FlowConfig real
   - Abrir config/flows/registro-sociedades.flow.ts
   - Leer línea por línea
   - Identificar FlowItems

✅ 9. Ver el layout del flujo
   - Abrir app/layouts/registro-flow.vue
   - Ver cómo usa UniversalFlowLayout
   - Entender el slot

✅ 10. Ver una página del flujo
   - Abrir app/pages/registro/.../datos-sociedad.vue
   - Ver el definePageMeta
   - Entender la relación
```

### Fase 4: Navegación (1-2 horas)

```
✅ 11. Estudiar useFlowNavigation
   - Leer el composable
   - Entender currentItem, previousItem, nextItem
   - Ver métodos previous(), next(), goTo()

✅ 12. Ver FlowFooter
   - Cómo usa el composable
   - Cómo habilita/deshabilita botones
   - Cómo navega
```

### Fase 5: Store (1 hora)

```
✅ 13. Estudiar useFlowNavigationStore
   - Ver qué estado guarda
   - Entender itemStates
   - Ver métodos de actualización

✅ 14. Entender persistencia
   - Cómo guarda en localStorage
   - Cómo restaura
```

### Fase 6: Práctica (2-3 horas)

```
✅ 15. Crear un flujo simple de prueba
   - 3 pasos secuenciales
   - Sin jerarquía
   - Sin sidebar derecho

✅ 16. Crear el FlowConfig
   - A mano (sin generador)
   - Con 3 FlowItems

✅ 17. Crear el layout
   - Copiar registro-flow.vue
   - Adaptar para tu flujo

✅ 18. Crear las 3 páginas
   - Con definePageMeta
   - Con contenido simple

✅ 19. Probar navegación
   - Botones Anterior/Siguiente
   - Sidebar
   - Progreso
```

---

## 📋 PASO 5: Orden de Archivos a Estudiar

### Orden Recomendado:

```
1️⃣ TIPOS (Entender la estructura)
   📄 app/types/flow-system.ts
      - FlowItem
      - FlowConfig
      - FlowItemState

2️⃣ CONFIG (Ver ejemplos reales)
   📄 app/config/flows/registro-sociedades.flow.ts
   📄 app/config/flows/juntas.flow.ts

3️⃣ LAYOUTS (Entender el wrapper)
   📄 app/layouts/default.vue
   📄 app/layouts/registro-flow.vue

4️⃣ COMPONENTES (Ver la UI)
   📄 app/components/flow-system/UniversalFlowLayout.vue
   📄 app/components/flow-system/FlowSidebar.vue
   📄 app/components/flow-system/FlowFooter.vue

5️⃣ COMPOSABLES (Entender la lógica)
   📄 app/composables/useFlowNavigation.ts

6️⃣ STORE (Entender el estado)
   📄 app/stores/useFlowNavigationStore.ts

7️⃣ PÁGINAS (Ver el uso final)
   📄 app/pages/registro-societario/sociedades/crear/datos-sociedad.vue
```

---

## 📋 PASO 6: Visualización Mental

### Mental Model:

```
┌─────────────────────────────────────────────────────────┐
│                    FLOWCONFIG                           │
│  (La Biblia del Flujo - tiene TODO)                     │
│                                                         │
│  ├─ structure.navigation: FlowItem[]                   │
│  │   ├─ FlowItem { id: 'paso-1', level: 1 }           │
│  │   ├─ FlowItem { id: 'paso-2', level: 1 }           │
│  │   └─ FlowItem { id: 'paso-3', level: 1 }           │
│  │                                                      │
│  ├─ ui.leftSidebar: { levels: [1] }                    │
│  └─ navigationRules: { allowJumpAhead: false }         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              UNIVERSALFLOWLAYOUT                        │
│  (Lee el config y renderiza UI)                         │
│                                                         │
│  ├─ FlowSidebar (lee config.structure.navigation)     │
│  ├─ Contenido (<slot />)                               │
│  └─ FlowFooter (lee config.ui.footer)                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              useFlowNavigation                          │
│  (Lee el config y maneja navegación)                    │
│                                                         │
│  ├─ currentItem (calculado de route.path)             │
│  ├─ previousItem (calculado de order)                  │
│  ├─ nextItem (calculado de order)                      │
│  ├─ previous() → router.push(previousItem.path)        │
│  └─ next() → router.push(nextItem.path)                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│         useFlowNavigationStore                          │
│  (Guarda el estado del progreso)                        │
│                                                         │
│  ├─ currentItemId: 'paso-2'                            │
│  ├─ itemStates: Map {                                  │
│  │    'paso-1': { status: 'completed' },              │
│  │    'paso-2': { status: 'in-progress' },            │
│  │    'paso-3': { status: 'locked' }                  │
│  │  }                                                  │
│  └─ persist() → localStorage                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Resumen: Tu Checklist

### Para Entender Todo:

```
□ Leer FlowItem interface (con grupos)
□ Leer FlowConfig interface (con grupos)
□ Entender flujo: Datos → Config → Layout → Página
□ Entender navegación: Cómo calcula anterior/siguiente
□ Estudiar layouts de Nuxt (default, custom)
□ Ver un FlowConfig real
□ Ver un layout de flujo real
□ Ver una página de flujo real
□ Estudiar useFlowNavigation
□ Estudiar useFlowNavigationStore
□ Crear flujo de prueba (3 pasos)
```

### Tiempo Estimado:

**Total: 10-15 horas** distribuidas en 2-3 días

---

## 💡 Tip Final

**No intentes entenderlo todo a la vez.**

1. **Día 1**: Interfaces (FlowItem, FlowConfig) + Flujo de datos
2. **Día 2**: Layouts + Ver código real
3. **Día 3**: Navegación + Store + Práctica

**Aprende haciendo, no solo leyendo.** 🚀

---

¿Por dónde quieres empezar? ¿Quieres que te guíe paso a paso en alguno de estos puntos? 💪
