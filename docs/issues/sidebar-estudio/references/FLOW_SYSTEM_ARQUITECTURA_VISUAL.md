# 📊 Arquitectura Visual: DDD Hexagonal + OOP + Objetos Agrupados

## 🎨 Diagrama 1: Vista General de Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI LAYER                                 │
│                    (Presentation)                                │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ FlowSidebar.vue│  │UniversalLayout │  │FlowNavButtons  │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                  │
│  Components: Renderizar datos, emitir eventos                   │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ usa
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│                     (Composables)                                │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │useFlowNavigation │  │  useFlowProgress │  │ useFlowState │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                  │
│  Casos de Uso: Orquestar Domain + Infrastructure                │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                     ┌─────────┴─────────┐
                     │                   │
                     ▼                   ▼
┌────────────────────────────┐  ┌────────────────────────────┐
│      DOMAIN LAYER          │  │  INFRASTRUCTURE LAYER      │
│   (Lógica de Negocio)      │  │   (Almacenamiento)         │
│                            │  │                            │
│  ┌──────────────────────┐ │  │  ┌──────────────────────┐ │
│  │   FlowConfig         │ │  │  │  FlowStateStore      │ │
│  │   (Aggregate Root)   │ │  │  │  (Pinia)             │ │
│  └──────────────────────┘ │  │  └──────────────────────┘ │
│           │                │  │           │                │
│           │ contiene       │  │           │                │
│           ▼                │  │           ▼                │
│  ┌──────────────────────┐ │  │  ┌──────────────────────┐ │
│  │     FlowItem         │ │  │  │  LocalStorage        │ │
│  │     (Entity)         │ │  │  │  Persistence         │ │
│  └──────────────────────┘ │  │  └──────────────────────┘ │
│           │                │  │                            │
│           │ compuesto de   │  │  Adaptadores externos     │
│           ▼                │  │                            │
│  ┌──────────────────────┐ │  └────────────────────────────┘
│  │   Value Objects      │ │
│  │ • FlowIdentity       │ │
│  │ • FlowHierarchy      │ │
│  │ • FlowNavigation     │ │
│  └──────────────────────┘ │
│                            │
│  Clases puras, sin deps    │
└────────────────────────────┘
```

---

## 🎨 Diagrama 2: Flujo de Datos (Cómo se conecta todo)

```
     Usuario hace click en                 Usuario navega
     "Siguiente" en sidebar                   a una página
            │                                      │
            ▼                                      ▼
┌───────────────────────┐              ┌────────────────────────┐
│  FlowSidebar.vue      │              │  Page Component        │
│  @click="onNext()"    │              │  onMounted(() => {})   │
└───────────┬───────────┘              └──────────┬─────────────┘
            │                                     │
            │ emite evento                        │ llama
            ▼                                     ▼
┌───────────────────────────────────────────────────────────────┐
│              useFlowNavigation()                               │
│                                                                │
│  const { goNext, currentItem } = useFlowNavigation(config)    │
│                                                                │
│  function goNext() {                                           │
│    const next = config.getNextItem(currentId)  ◄─────┐        │
│    if (next) navigateTo(next.navigation.path)        │        │
│  }                                                    │        │
└───────────────────────────────────────────────────────┼────────┘
                                                        │
                                           ┌────────────┘
                                           │ llama método
                                           ▼
┌───────────────────────────────────────────────────────────────┐
│                    FlowConfig (Domain)                         │
│                                                                │
│  getNextItem(currentId: string): FlowItem | null {            │
│    const current = this.getItemById(currentId);               │
│    if (current.hasChildren()) return current.children[0];     │
│    // Buscar en lista plana...                                │
│    return allItems[currentIndex + 1];                         │
│  }                                                             │
└────────────────────────────────────┬──────────────────────────┘
                                     │
                                     │ accede a
                                     ▼
┌───────────────────────────────────────────────────────────────┐
│                    FlowItem (Domain)                           │
│                                                                │
│  - identity: FlowIdentity                                      │
│  - hierarchy: FlowHierarchy                                    │
│  - navigation: FlowNavigation                                  │
│  - children: FlowItem[]                                        │
└───────────────────────────────────┬───────────────────────────┘
                                    │
                                    │ compuesto de
                                    ▼
┌───────────────────────────────────────────────────────────────┐
│              Value Objects (Domain)                            │
│                                                                │
│  FlowIdentity    FlowHierarchy    FlowNavigation              │
│  • id            • level           • path                      │
│  • label         • order           • href                      │
│  • description   • parentId        • type                      │
│  • icon          • childrenIds                                 │
│  • badge                                                       │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Diagrama 3: FlowItem con Objetos Agrupados

### ANTES (Flat Structure) ❌

```typescript
interface FlowItem {
  id: string; // ¿Qué es esto?
  label: string; // ¿Qué es esto?
  description?: string;
  icon?: string;
  badge?: string;
  level: 1 | 2 | 3 | 4; // ¿Qué es esto?
  order: number; // ¿Qué es esto?
  parentId?: string; // ¿Qué es esto?
  children?: FlowItem[];
  path?: string; // ¿Qué es esto?
  href?: string;
  isOptional?: boolean;
  isLocked?: boolean;
  requiresCompletion?: boolean;
}

// ❌ Problema: 15 propiedades planas, difícil de organizar mentalmente
```

### AHORA (Grouped Structure) ✅

```typescript
class FlowItem {
  // ✅ Grupo 1: IDENTIDAD
  identity: {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    badge?: string;
  };

  // ✅ Grupo 2: JERARQUÍA
  hierarchy: {
    level: 1 | 2 | 3 | 4;
    order: number;
    parentId?: string;
    childrenIds: string[];
  };

  // ✅ Grupo 3: NAVEGACIÓN
  navigation: {
    path?: string;
    href?: string;
    type: "page" | "anchor" | "none";
  };

  // ✅ Grupo 4: COMPORTAMIENTO
  behavior: {
    isOptional: boolean;
    isLocked: boolean;
    requiresCompletion: boolean;
  };
}

// ✅ Ventaja: Organización mental clara
// "¿Dónde pongo el path?" → "Es navegación" → navigation.path
```

---

## 🎨 Diagrama 4: Composición de FlowItem (OOP)

```
                    ┌─────────────────────────┐
                    │      FlowItem           │
                    │     (Entity)            │
                    │                         │
                    │  • Tiene identidad (ID) │
                    │  • Lógica de negocio    │
                    └────────┬────────────────┘
                             │
                             │ COMPUESTO DE
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │FlowIdentity │  │FlowHierarchy│  │FlowNavigation│
    │(Value Object)  │(Value Object)  │(Value Object)│
    │             │  │             │  │             │
    │ • id        │  │ • level     │  │ • path      │
    │ • label     │  │ • order     │  │ • href      │
    │ • icon      │  │ • parentId  │  │ • type      │
    └─────────────┘  └─────────────┘  └─────────────┘
          │                 │                 │
          │                 │                 │
          └─────────────────┴─────────────────┘
                            │
                    VALIDACIÓN en
                    CONSTRUCTOR
                            │
                            ▼
            ┌───────────────────────────────┐
            │ new FlowIdentity("", "X")     │
            │                               │
            │ ❌ Error: id no puede estar  │
            │    vacío                      │
            └───────────────────────────────┘

// ✅ Ventaja: Validación automática al crear
// No puedes crear un FlowItem con datos inválidos
```

---

## 🎨 Diagrama 5: FlowConfig (Aggregate Root)

```
                  ┌─────────────────────────────────┐
                  │        FlowConfig               │
                  │      (Aggregate Root)           │
                  │                                 │
                  │  • id: "registro-sociedades"   │
                  │  • name: "Registro"             │
                  │  • type: "sequential"           │
                  │                                 │
                  │  • items: FlowItem[]            │
                  │  • _itemsById: Map<id, item>    │
                  └──────────────┬──────────────────┘
                                 │
                                 │ CONTIENE
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
        ┌─────────────────┐         ┌─────────────────┐
        │   FlowItem 1    │   ...   │   FlowItem 10   │
        │ "datos-sociedad"│         │"quorum-mayorias"│
        └─────────────────┘         └─────────────────┘
                  │
                  │ PROVEE MÉTODOS
                  ▼
    ┌──────────────────────────────────────────┐
    │ • getItemById(id)                        │
    │ • getNextItem(currentId)                 │
    │ • getPreviousItem(currentId)             │
    │ • getAllItemsFlat()                      │
    │ • isFirstItem(id)                        │
    │ • isLastItem(id)                         │
    └──────────────────────────────────────────┘

// ✅ Ventaja: Punto de entrada único para trabajar con el flujo
// ✅ Ventaja: Navegación automática (sabe cuál es el siguiente)
```

---

## 🎨 Diagrama 6: Navegación Automática (La Magia)

```
Usuario está en página:
"/registro-societario/sociedades/crear/datos-sociedad"

                     │
                     │ onMounted
                     ▼
┌────────────────────────────────────────────────────────┐
│  Page Component                                        │
│                                                        │
│  const route = useRoute();                            │
│  const currentPath = route.path;                      │
│                                                        │
│  // Buscar FlowItem por path                          │
│  const currentItem = config.getItemByPath(currentPath)│
└────────────────────┬───────────────────────────────────┘
                     │
                     │ llama
                     ▼
┌────────────────────────────────────────────────────────┐
│  FlowConfig.getItemByPath(path)                       │
│                                                        │
│  return this._itemsById.values().find(               │
│    item => item.navigation.path === path              │
│  );                                                    │
│                                                        │
│  ✅ Encuentra: FlowItem { id: "datos-sociedad" }     │
└────────────────────┬───────────────────────────────────┘
                     │
                     │ ahora conoce el item actual
                     ▼
┌────────────────────────────────────────────────────────┐
│  FlowConfig.getNextItem("datos-sociedad")             │
│                                                        │
│  const allItems = this.getAllItemsFlat();             │
│  // allItems = [item1, item2, ..., item10]           │
│                                                        │
│  const currentIndex = allItems.findIndex(             │
│    item => item.id === "datos-sociedad"               │
│  ); // index = 0                                       │
│                                                        │
│  return allItems[0 + 1]; // item2                     │
│                                                        │
│  ✅ Devuelve: FlowItem { id: "datos-socios" }        │
└────────────────────┬───────────────────────────────────┘
                     │
                     │ ahora sabe el siguiente
                     ▼
┌────────────────────────────────────────────────────────┐
│  useFlowNavigation                                     │
│                                                        │
│  const nextItem = computed(() => {                    │
│    return config.getNextItem(currentItemId.value);    │
│  });                                                   │
│                                                        │
│  ✅ nextItem.value = { id: "datos-socios", ... }     │
└────────────────────┬───────────────────────────────────┘
                     │
                     │ renderiza
                     ▼
┌────────────────────────────────────────────────────────┐
│  FlowNavigationButtons.vue                             │
│                                                        │
│  <button                                               │
│    :disabled="!canGoNext"                             │
│    @click="goNext"                                     │
│  >                                                     │
│    Siguiente: {{ nextItem?.label }}                   │
│  </button>                                             │
│                                                        │
│  ✅ Botón muestra: "Siguiente: Datos de Socios"      │
└────────────────────────────────────────────────────────┘

// ✅ MAGIA: El botón "Siguiente" sabe automáticamente:
// 1. ¿Hay un siguiente? (canGoNext)
// 2. ¿Cuál es su label? (nextItem.label)
// 3. ¿A dónde navegar? (nextItem.navigation.path)
```

---

## 🎨 Diagrama 7: Estructura de Carpetas Completa

```
app/modules/flow-system/
│
├── domain/                          # ✅ CAPA DE DOMINIO (OOP)
│   │
│   ├── entities/                    # Clases con identidad
│   │   ├── FlowItem.ts              # Entity: Un paso del flujo
│   │   └── FlowConfig.ts            # Aggregate Root: Configuración completa
│   │
│   ├── value-objects/               # Clases inmutables sin identidad
│   │   ├── FlowIdentity.ts          # VO: Identidad (id, label, icon...)
│   │   ├── FlowHierarchy.ts         # VO: Jerarquía (level, order...)
│   │   ├── FlowNavigation.ts        # VO: Navegación (path, href)
│   │   ├── FlowBehavior.ts          # VO: Comportamiento (isOptional...)
│   │   ├── FlowRightSidebar.ts      # VO: Sidebar derecho
│   │   └── FlowValidation.ts        # VO: Validación
│   │
│   ├── services/                    # Servicios de dominio
│   │   ├── FlowHierarchyService.ts  # Lógica de árbol
│   │   ├── FlowNavigationService.ts # Lógica de navegación
│   │   └── FlowProgressCalculator.ts# Cálculo de progreso
│   │
│   ├── repositories/                # Interfaces (puertos)
│   │   ├── IFlowStateRepository.ts
│   │   └── IFlowConfigRepository.ts
│   │
│   └── types/                       # Types/Interfaces
│       ├── FlowItemState.ts
│       └── FlowState.ts
│
├── application/                     # ✅ CAPA DE APLICACIÓN (Functional)
│   │
│   ├── composables/                 # Casos de uso (orquestar)
│   │   ├── useFlowNavigation.ts     # Navegar entre items
│   │   ├── useFlowProgress.ts       # Calcular progreso
│   │   ├── useFlowValidation.ts     # Validar completitud
│   │   ├── useFlowHierarchy.ts      # Trabajar con árbol
│   │   └── useFlowState.ts          # Manejar estado
│   │
│   ├── dtos/                        # Data Transfer Objects
│   │   ├── FlowItemDTO.ts
│   │   └── FlowStateDTO.ts
│   │
│   └── commands/                    # CQRS (opcional)
│       ├── CreateFlowCommand.ts
│       └── UpdateProgressCommand.ts
│
├── infrastructure/                  # ✅ CAPA DE INFRAESTRUCTURA
│   │
│   ├── stores/                      # Pinia Stores
│   │   └── useFlowStateStore.ts
│   │
│   ├── repositories/                # Implementaciones
│   │   ├── FlowStateLocalRepository.ts
│   │   ├── FlowStateApiRepository.ts
│   │   └── FlowConfigFileRepository.ts
│   │
│   └── persistence/                 # Persistencia
│       ├── LocalStoragePersistence.ts
│       └── IndexedDBPersistence.ts
│
├── presentation/                    # ✅ CAPA DE PRESENTACIÓN (UI)
│   │
│   ├── components/
│   │   ├── UniversalFlowLayout.vue
│   │   ├── FlowSidebar.vue
│   │   ├── FlowSidebarItem.vue
│   │   ├── FlowRightSidebar.vue
│   │   ├── FlowProgressBar.vue
│   │   └── FlowNavigationButtons.vue
│   │
│   └── layouts/
│       └── flow-layout.vue
│
└── config/                          # ✅ CONFIGURACIONES
    │
    ├── flows/                       # Flujos concretos
    │   ├── registro-sociedades.flow.ts
    │   ├── juntas-accionistas.flow.ts
    │   └── sucursales.flow.ts
    │
    └── generators/                  # Factories
        ├── FlowConfigFactory.ts
        └── FlowItemFactory.ts
```

---

## 🎨 Diagrama 8: Cómo Usar el Sistema (Workflow Completo)

```
PASO 1: Crear FlowItems usando clases
────────────────────────────────────────
const item1 = new FlowItem(
  new FlowIdentity("datos-sociedad", "Datos de Sociedad"),
  new FlowHierarchy(1, 1),
  FlowNavigation.fromPath("/registro/datos-sociedad")
);

const item2 = new FlowItem(
  new FlowIdentity("datos-socios", "Datos de Socios"),
  new FlowHierarchy(1, 2),
  FlowNavigation.fromPath("/registro/datos-socios")
);

          │
          │ Validación automática
          ▼
┌─────────────────────────────────┐
│ ✅ Datos válidos               │
│ ✅ IDs únicos                  │
│ ✅ Jerarquía correcta          │
└─────────────────────────────────┘


PASO 2: Crear FlowConfig
────────────────────────────────────────
const config = new FlowConfig(
  "registro-sociedades",
  "Registro de Sociedades",
  "sequential",
  [item1, item2, ..., item10]
);

          │
          │ Validación estructura
          ▼
┌─────────────────────────────────┐
│ ✅ Sin IDs duplicados          │
│ ✅ Orden secuencial            │
│ ✅ Índice construido           │
└─────────────────────────────────┘


PASO 3: Exportar desde config/flows/
────────────────────────────────────────
// config/flows/registro-sociedades.flow.ts
export function getRegistroSociedadesFlow(): FlowConfig {
  return config;
}


PASO 4: Usar en Layout
────────────────────────────────────────
// layouts/flow-layout.vue
import { getRegistroSociedadesFlow } from '~/modules/flow-system/config/flows/registro-sociedades.flow';

const flowConfig = getRegistroSociedadesFlow();
const { currentItem, goNext, goPrevious } = useFlowNavigation(flowConfig);


PASO 5: Renderizar en Componentes
────────────────────────────────────────
<template>
  <UniversalFlowLayout :flow-config="flowConfig">
    <template #sidebar>
      <FlowSidebar
        :items="flowConfig.items"
        :current-item-id="currentItem?.id"
        @navigate="navigateTo"
      />
    </template>

    <template #content>
      <NuxtPage />
    </template>

    <template #footer>
      <FlowNavigationButtons
        :can-go-previous="canGoPrevious"
        :can-go-next="canGoNext"
        :next-label="nextItem?.label"
        @previous="goPrevious"
        @next="goNext"
      />
    </template>
  </UniversalFlowLayout>
</template>


PASO 6: Usuario Navega
────────────────────────────────────────
Usuario hace click en "Siguiente"
          │
          ▼
FlowNavigationButtons emite @next
          │
          ▼
useFlowNavigation.goNext()
          │
          ▼
FlowConfig.getNextItem(currentId)
          │
          ▼
Devuelve FlowItem con navigation.path
          │
          ▼
navigateTo(nextItem.navigation.path)
          │
          ▼
Nuxt router navega a la página
          │
          ▼
✅ Usuario ve la siguiente página
```

---

## 🎯 Resumen Visual

### ¿Qué es DDD Hexagonal?

```
        UI ────► Application ────► Domain ◄──── Infrastructure
                                      │
                                      │
                                 ✅ NÚCLEO
                                 (Sin deps)
```

### ¿Qué es OOP en Domain?

```
    Entity (FlowItem)
         │
         │ COMPUESTO DE
         ▼
    Value Objects
    • FlowIdentity
    • FlowHierarchy
    • FlowNavigation
         │
         │ VALIDACIÓN
         ▼
    Constructor valida datos
    ❌ No puedes crear datos inválidos
```

### ¿Qué son Objetos Agrupados?

```
    FlowItem {
      identity: {...}     ← Grupo 1
      hierarchy: {...}    ← Grupo 2
      navigation: {...}   ← Grupo 3
    }

    ✅ Mental Model Claro
    ✅ Autocompletado Inteligente
    ✅ Refactoring Seguro
```

---

## ✅ Conclusión

Has visto visualmente:

1. ✅ **Arquitectura de capas** (DDD Hexagonal)
2. ✅ **Composición OOP** (Entity + Value Objects)
3. ✅ **Objetos agrupados** (Propiedades organizadas)
4. ✅ **Flujo de datos** (Cómo se conecta todo)
5. ✅ **Navegación automática** (La magia del sistema)
6. ✅ **Estructura de carpetas** (Dónde va cada cosa)
7. ✅ **Workflow completo** (Del código a la UI)

**¡Ahora tienes el mapa mental completo! 🚀**
