# 🏗️ Flow System: DDD Hexagonal + OOP + Objetos Agrupados

## 🎯 Objetivo Final

Crear un sistema de flujos que combine:

1. ✅ **Arquitectura DDD Hexagonal** (Domain, Application, Infrastructure)
2. ✅ **Paradigma OOP** (Clases, Value Objects, Entities)
3. ✅ **Objetos Agrupados** (Propiedades organizadas por concepto)
4. ✅ **Vue 3 + Nuxt 4** (Composables como Application Services)

---

## 📚 Índice

1. [Arquitectura DDD Hexagonal Explicada](#1-arquitectura-ddd-hexagonal)
2. [Por Qué OOP en Este Caso](#2-por-qué-oop)
3. [Objetos Agrupados: El Patrón](#3-objetos-agrupados)
4. [Estructura de Carpetas Completa](#4-estructura-de-carpetas)
5. [Implementación Paso a Paso](#5-implementación-paso-a-paso)
6. [Todo List de Actividades](#6-todo-list)

---

## 1. Arquitectura DDD Hexagonal

### 1.1 ¿Qué es DDD Hexagonal?

```
                    ┌─────────────────────────────────┐
                    │         CAPA DE UI              │
                    │  (Components + Layouts)         │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │    APPLICATION LAYER            │
                    │  (Composables como Services)    │
                    │  • useFlowNavigation            │
                    │  • useFlowProgress              │
                    │  • useFlowValidation            │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │      DOMAIN LAYER               │
                    │  (Clases + Value Objects)       │
                    │  • FlowItem (Entity)            │
                    │  • FlowIdentity (VO)            │
                    │  • FlowHierarchy (VO)           │
                    │  • FlowNavigation (VO)          │
                    │  • FlowConfig (Aggregate Root)  │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │   INFRASTRUCTURE LAYER          │
                    │  (Stores + API + LocalStorage)  │
                    │  • FlowStateStore (Pinia)       │
                    │  • FlowApiRepository            │
                    │  • FlowLocalStoragePersistence  │
                    └─────────────────────────────────┘
```

### 1.2 Capas Explicadas

#### **Domain Layer** (Núcleo del Negocio)

- **Responsabilidad**: Lógica de negocio pura, sin dependencias externas
- **Qué contiene**:
  - **Entities**: Objetos con identidad (`FlowItem`, `FlowConfig`)
  - **Value Objects**: Objetos sin identidad (`FlowIdentity`, `FlowHierarchy`)
  - **Domain Services**: Lógica que no pertenece a una entidad
- **Regla de oro**: No importa nada de fuera (ni Vue, ni Pinia, ni Nuxt)

#### **Application Layer** (Casos de Uso)

- **Responsabilidad**: Orquestar el dominio para resolver casos de uso
- **Qué contiene**:
  - **Composables** (en Nuxt = Application Services)
  - **DTOs** (Data Transfer Objects)
  - **Commands/Queries** (CQRS pattern)
- **Ejemplo**: `useFlowNavigation` orquesta `FlowConfig` + `FlowStateStore`

#### **Infrastructure Layer** (Adaptadores)

- **Responsabilidad**: Implementaciones técnicas (BD, API, localStorage)
- **Qué contiene**:
  - **Stores** (Pinia)
  - **Repositories** (acceso a datos)
  - **HTTP Clients** (axios, fetch)
  - **Persistence** (localStorage, IndexedDB)

#### **UI Layer** (Presentación)

- **Responsabilidad**: Mostrar datos y capturar eventos
- **Qué contiene**:
  - **Componentes** (`UniversalFlowLayout`, `FlowSidebar`)
  - **Layouts** (`flow-layout.vue`)
  - **Pages** (rutas Nuxt)

---

## 2. Por Qué OOP en Este Caso

### 2.1 OOP vs Functional: ¿Cuándo usar cada uno?

| Aspecto             | OOP (Clases)                     | Functional (Objetos + Funciones)      |
| ------------------- | -------------------------------- | ------------------------------------- |
| **Identidad**       | ✅ Perfecto para Entities        | ❌ Difícil manejar identidad          |
| **Encapsulación**   | ✅ Métodos privados/públicos     | ⚠️ Requiere closures                  |
| **Herencia**        | ✅ `FlowItem extends BaseEntity` | ❌ No existe herencia                 |
| **Validación**      | ✅ En el constructor             | ⚠️ Requiere funciones externas        |
| **Inmutabilidad**   | ⚠️ Requiere disciplina           | ✅ Natural en FP                      |
| **Testing**         | ⚠️ Mockear clases complejo       | ✅ Funciones puras fáciles de testear |
| **Vue/Nuxt idioms** | ❌ No es el patrón dominante     | ✅ Es el patrón oficial               |

### 2.2 La Decisión: Híbrido

**✅ Usar OOP (Clases) para:**

- **Domain Layer**: Entities y Value Objects
- **Razón**: Encapsulación + Validación + Lógica de negocio compleja

**✅ Usar Functional para:**

- **Application Layer**: Composables
- **Infrastructure Layer**: Repositorios
- **Razón**: Vue/Nuxt idioms + Tree-shaking + Testabilidad

### 2.3 Ejemplo Concreto

```typescript
// ❌ ANTES (Todo funcional - difícil de validar)
interface FlowItem {
  id: string;
  label: string;
  level: 1 | 2 | 3 | 4;
}

const item: FlowItem = {
  id: "", // ❌ ID vacío, no hay validación
  label: "X", // ❌ Label muy corto
  level: 5 as any, // ❌ Level inválido
};

// ✅ AHORA (OOP - validación en constructor)
class FlowItem {
  constructor(
    private identity: FlowIdentity,
    private hierarchy: FlowHierarchy,
    private navigation: FlowNavigation
  ) {
    // Validación automática al crear
  }
}

const item = new FlowItem(
  new FlowIdentity("", "X"), // ❌ EXPLOTA aquí con error claro
  new FlowHierarchy(5, 1), // ❌ EXPLOTA aquí con error claro
  new FlowNavigation("/path")
);
```

---

## 3. Objetos Agrupados: El Patrón

### 3.1 ¿Qué son Objetos Agrupados?

**Antes (Flat Structure)**:

```typescript
interface FlowItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  badge?: string;
  level: 1 | 2 | 3 | 4;
  order: number;
  parentId?: string;
  children?: FlowItem[];
  path?: string;
  href?: string;
  isOptional?: boolean;
  // ... 20 propiedades más 😱
}
```

**Ahora (Grouped Structure)**:

```typescript
interface FlowItem {
  identity: {
    // ✅ Grupo: ¿Quién soy?
    id: string;
    label: string;
    description?: string;
    icon?: string;
    badge?: string;
  };

  hierarchy: {
    // ✅ Grupo: ¿Dónde estoy en el árbol?
    level: 1 | 2 | 3 | 4;
    order: number;
    parentId?: string;
    children?: FlowItem[];
  };

  navigation: {
    // ✅ Grupo: ¿Cómo navego?
    path?: string;
    href?: string;
  };

  behavior: {
    // ✅ Grupo: ¿Cómo me comporto?
    isOptional?: boolean;
    isLocked?: boolean;
    requiresCompletion?: boolean;
  };
}
```

### 3.2 Ventajas de Agrupar

1. **Mental Model Claro**:

   - "¿Dónde va esta propiedad?" → "Es sobre navegación" → `navigation.path`

2. **Autocompletado Inteligente**:

   ```typescript
   item.identity.   // ← IDE sugiere: id, label, description, icon, badge
   item.hierarchy.  // ← IDE sugiere: level, order, parentId, children
   ```

3. **Value Objects Naturales**:

   ```typescript
   class FlowIdentity {
     constructor(
       public readonly id: string,
       public readonly label: string,
       public readonly description?: string,
       public readonly icon?: string,
       public readonly badge?: string
     ) {
       this.validate();
     }
   }
   ```

4. **Refactoring Seguro**:
   - Cambiar `identity` no afecta `hierarchy`
   - Cada grupo es independiente

---

## 4. Estructura de Carpetas Completa

```
app/
├── modules/
│   └── flow-system/                    # ✅ MÓDULO COMPLETO
│       │
│       ├── domain/                     # ✅ DOMAIN LAYER (OOP)
│       │   ├── entities/
│       │   │   ├── FlowItem.ts        # Entity (clase)
│       │   │   └── FlowConfig.ts      # Aggregate Root (clase)
│       │   │
│       │   ├── value-objects/
│       │   │   ├── FlowIdentity.ts    # VO (clase inmutable)
│       │   │   ├── FlowHierarchy.ts   # VO (clase inmutable)
│       │   │   ├── FlowNavigation.ts  # VO (clase inmutable)
│       │   │   ├── FlowBehavior.ts    # VO (clase inmutable)
│       │   │   ├── FlowRightSidebar.ts # VO (clase inmutable)
│       │   │   └── FlowValidation.ts  # VO (clase inmutable)
│       │   │
│       │   ├── services/
│       │   │   ├── FlowHierarchyService.ts      # Lógica de árbol
│       │   │   ├── FlowNavigationService.ts     # Lógica de navegación
│       │   │   └── FlowProgressCalculator.ts    # Cálculo de progreso
│       │   │
│       │   ├── repositories/          # Interfaces (puerto)
│       │   │   ├── IFlowStateRepository.ts
│       │   │   └── IFlowConfigRepository.ts
│       │   │
│       │   └── types/
│       │       ├── FlowItemState.ts
│       │       └── FlowState.ts
│       │
│       ├── application/                # ✅ APPLICATION LAYER (Functional)
│       │   ├── composables/
│       │   │   ├── useFlowNavigation.ts        # Caso de uso: navegar
│       │   │   ├── useFlowProgress.ts          # Caso de uso: progreso
│       │   │   ├── useFlowValidation.ts        # Caso de uso: validar
│       │   │   ├── useFlowHierarchy.ts         # Caso de uso: árbol
│       │   │   └── useFlowState.ts             # Caso de uso: estado
│       │   │
│       │   ├── dtos/                  # Data Transfer Objects
│       │   │   ├── FlowItemDTO.ts
│       │   │   └── FlowStateDTO.ts
│       │   │
│       │   └── commands/              # CQRS (opcional)
│       │       ├── CreateFlowCommand.ts
│       │       └── UpdateProgressCommand.ts
│       │
│       ├── infrastructure/             # ✅ INFRASTRUCTURE LAYER
│       │   ├── stores/
│       │   │   └── useFlowStateStore.ts        # Pinia Store
│       │   │
│       │   ├── repositories/          # Implementaciones
│       │   │   ├── FlowStateLocalRepository.ts
│       │   │   ├── FlowStateApiRepository.ts
│       │   │   └── FlowConfigFileRepository.ts
│       │   │
│       │   └── persistence/
│       │       ├── LocalStoragePersistence.ts
│       │       └── IndexedDBPersistence.ts
│       │
│       ├── presentation/               # ✅ UI LAYER
│       │   ├── components/
│       │   │   ├── UniversalFlowLayout.vue
│       │   │   ├── FlowSidebar.vue
│       │   │   ├── FlowSidebarItem.vue
│       │   │   ├── FlowRightSidebar.vue
│       │   │   └── FlowProgressBar.vue
│       │   │
│       │   └── layouts/
│       │       └── flow-layout.vue
│       │
│       └── config/                     # ✅ CONFIGURACIONES
│           ├── flows/
│           │   ├── registro-sociedades.flow.ts
│           │   ├── juntas-accionistas.flow.ts
│           │   └── sucursales.flow.ts
│           │
│           └── generators/             # Factory Pattern
│               ├── FlowConfigFactory.ts
│               └── FlowItemFactory.ts
```

### 4.1 Explicación de Cada Carpeta

#### **domain/** (Núcleo del Negocio)

| Carpeta          | Contenido                       | Tipo              | Responsabilidad               |
| ---------------- | ------------------------------- | ----------------- | ----------------------------- |
| `entities/`      | `FlowItem`, `FlowConfig`        | Clases            | Identidad + Lógica de negocio |
| `value-objects/` | `FlowIdentity`, `FlowHierarchy` | Clases inmutables | Validación + Comparación      |
| `services/`      | `FlowHierarchyService`          | Clases con lógica | Operaciones complejas         |
| `repositories/`  | `IFlowStateRepository`          | Interfaces        | Contratos de acceso a datos   |
| `types/`         | `FlowItemState`                 | Types/Interfaces  | Estructuras de datos          |

#### **application/** (Casos de Uso)

| Carpeta        | Contenido           | Tipo       | Responsabilidad              |
| -------------- | ------------------- | ---------- | ---------------------------- |
| `composables/` | `useFlowNavigation` | Funciones  | Orquestar dominio + infra    |
| `dtos/`        | `FlowItemDTO`       | Interfaces | Transferir datos entre capas |
| `commands/`    | `CreateFlowCommand` | Clases     | CQRS (opcional)              |

#### **infrastructure/** (Adaptadores)

| Carpeta         | Contenido                  | Tipo         | Responsabilidad                    |
| --------------- | -------------------------- | ------------ | ---------------------------------- |
| `stores/`       | `useFlowStateStore`        | Pinia Stores | Estado global reactivo             |
| `repositories/` | `FlowStateLocalRepository` | Clases       | Implementar interfaces del dominio |
| `persistence/`  | `LocalStoragePersistence`  | Clases       | Guardar/recuperar datos            |

#### **presentation/** (UI)

| Carpeta       | Contenido         | Tipo | Responsabilidad         |
| ------------- | ----------------- | ---- | ----------------------- |
| `components/` | `FlowSidebar.vue` | SFC  | Mostrar datos + eventos |
| `layouts/`    | `flow-layout.vue` | SFC  | Estructura de página    |

#### **config/** (Configuración)

| Carpeta       | Contenido                     | Tipo      | Responsabilidad       |
| ------------- | ----------------------------- | --------- | --------------------- |
| `flows/`      | `registro-sociedades.flow.ts` | Funciones | Devolver `FlowConfig` |
| `generators/` | `FlowConfigFactory.ts`        | Clases    | Factory Pattern       |

---

## 5. Implementación Paso a Paso

### PASO 1: Value Objects (Domain Layer)

#### Archivo: `app/modules/flow-system/domain/value-objects/FlowIdentity.ts`

```typescript
/**
 * Value Object: FlowIdentity
 *
 * Representa la identidad de un FlowItem.
 * INMUTABLE: Una vez creado, no se puede modificar.
 *
 * @example
 * const identity = new FlowIdentity(
 *   "datos-sociedad",
 *   "Datos de Sociedad",
 *   "Información básica de la sociedad",
 *   "Building",
 *   "Obligatorio"
 * );
 */
export class FlowIdentity {
  // Propiedades readonly (inmutables)
  public readonly id: string;
  public readonly label: string;
  public readonly description?: string;
  public readonly icon?: string;
  public readonly badge?: string;

  constructor(id: string, label: string, description?: string, icon?: string, badge?: string) {
    // Validación en el constructor
    this.validateId(id);
    this.validateLabel(label);

    this.id = id;
    this.label = label;
    this.description = description;
    this.icon = icon;
    this.badge = badge;
  }

  // ============================================
  // VALIDACIONES (privadas)
  // ============================================

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error("FlowIdentity: id no puede estar vacío");
    }

    if (!/^[a-z0-9-]+$/.test(id)) {
      throw new Error("FlowIdentity: id debe ser kebab-case (ejemplo: 'datos-sociedad')");
    }

    if (id.length > 50) {
      throw new Error("FlowIdentity: id no puede tener más de 50 caracteres");
    }
  }

  private validateLabel(label: string): void {
    if (!label || label.trim().length === 0) {
      throw new Error("FlowIdentity: label no puede estar vacío");
    }

    if (label.length < 3) {
      throw new Error("FlowIdentity: label debe tener al menos 3 caracteres");
    }

    if (label.length > 100) {
      throw new Error("FlowIdentity: label no puede tener más de 100 caracteres");
    }
  }

  // ============================================
  // MÉTODOS PÚBLICOS
  // ============================================

  /**
   * Compara dos FlowIdentity.
   * Dos identidades son iguales si tienen el mismo ID.
   */
  equals(other: FlowIdentity): boolean {
    return this.id === other.id;
  }

  /**
   * Convierte a objeto plano (para serialización).
   */
  toJSON() {
    return {
      id: this.id,
      label: this.label,
      description: this.description,
      icon: this.icon,
      badge: this.badge,
    };
  }

  /**
   * Crea desde objeto plano (para deserialización).
   */
  static fromJSON(json: {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    badge?: string;
  }): FlowIdentity {
    return new FlowIdentity(json.id, json.label, json.description, json.icon, json.badge);
  }

  /**
   * Devuelve una representación en string.
   */
  toString(): string {
    return `FlowIdentity(${this.id}: ${this.label})`;
  }
}
```

#### Archivo: `app/modules/flow-system/domain/value-objects/FlowHierarchy.ts`

```typescript
/**
 * Value Object: FlowHierarchy
 *
 * Representa la jerarquía de un FlowItem en el árbol.
 * INMUTABLE: Una vez creado, no se puede modificar.
 *
 * @example
 * const hierarchy = new FlowHierarchy(
 *   1,           // level
 *   1,           // order
 *   undefined,   // parentId
 *   []           // children IDs
 * );
 */
export class FlowHierarchy {
  public readonly level: 1 | 2 | 3 | 4;
  public readonly order: number;
  public readonly parentId?: string;
  public readonly childrenIds: string[];

  constructor(
    level: 1 | 2 | 3 | 4,
    order: number,
    parentId?: string,
    childrenIds: string[] = []
  ) {
    this.validateLevel(level);
    this.validateOrder(order);
    this.validateParentRelation(level, parentId);

    this.level = level;
    this.order = order;
    this.parentId = parentId;
    this.childrenIds = [...childrenIds]; // Copia para inmutabilidad
  }

  // ============================================
  // VALIDACIONES
  // ============================================

  private validateLevel(level: number): void {
    if (![1, 2, 3, 4].includes(level)) {
      throw new Error("FlowHierarchy: level debe ser 1, 2, 3 o 4");
    }
  }

  private validateOrder(order: number): void {
    if (order < 1) {
      throw new Error("FlowHierarchy: order debe ser mayor o igual a 1");
    }

    if (!Number.isInteger(order)) {
      throw new Error("FlowHierarchy: order debe ser un entero");
    }
  }

  private validateParentRelation(level: number, parentId?: string): void {
    if (level === 1 && parentId) {
      throw new Error("FlowHierarchy: level 1 no puede tener padre");
    }

    if (level > 1 && !parentId) {
      throw new Error(`FlowHierarchy: level ${level} debe tener padre`);
    }
  }

  // ============================================
  // MÉTODOS PÚBLICOS
  // ============================================

  isRoot(): boolean {
    return this.level === 1;
  }

  hasChildren(): boolean {
    return this.childrenIds.length > 0;
  }

  isChildOf(parentId: string): boolean {
    return this.parentId === parentId;
  }

  /**
   * Crea una nueva jerarquía con hijos añadidos.
   * (Inmutable: devuelve nueva instancia)
   */
  withChildren(childrenIds: string[]): FlowHierarchy {
    return new FlowHierarchy(this.level, this.order, this.parentId, [
      ...this.childrenIds,
      ...childrenIds,
    ]);
  }

  toJSON() {
    return {
      level: this.level,
      order: this.order,
      parentId: this.parentId,
      childrenIds: this.childrenIds,
    };
  }

  static fromJSON(json: {
    level: 1 | 2 | 3 | 4;
    order: number;
    parentId?: string;
    childrenIds?: string[];
  }): FlowHierarchy {
    return new FlowHierarchy(json.level, json.order, json.parentId, json.childrenIds);
  }

  toString(): string {
    return `FlowHierarchy(level=${this.level}, order=${this.order}, children=${this.childrenIds.length})`;
  }
}
```

#### Archivo: `app/modules/flow-system/domain/value-objects/FlowNavigation.ts`

```typescript
/**
 * Value Object: FlowNavigation
 *
 * Representa la navegación de un FlowItem.
 * Un FlowItem navega por RUTA (path) o por ANCLA (href), nunca ambos.
 *
 * @example
 * // Navegación por ruta (página)
 * const nav1 = FlowNavigation.fromPath("/registro/datos-sociedad");
 *
 * // Navegación por ancla (sección)
 * const nav2 = FlowNavigation.fromHref("#seccion-1");
 */
export class FlowNavigation {
  public readonly path?: string;
  public readonly href?: string;
  public readonly type: "page" | "anchor" | "none";

  private constructor(path?: string, href?: string) {
    this.validateNavigation(path, href);

    this.path = path;
    this.href = href;
    this.type = path ? "page" : href ? "anchor" : "none";
  }

  // ============================================
  // FACTORY METHODS (patrón de creación)
  // ============================================

  static fromPath(path: string): FlowNavigation {
    return new FlowNavigation(path, undefined);
  }

  static fromHref(href: string): FlowNavigation {
    return new FlowNavigation(undefined, href);
  }

  static none(): FlowNavigation {
    return new FlowNavigation(undefined, undefined);
  }

  // ============================================
  // VALIDACIONES
  // ============================================

  private validateNavigation(path?: string, href?: string): void {
    // Regla: No puede tener ambos
    if (path && href) {
      throw new Error("FlowNavigation: no puede tener 'path' y 'href' al mismo tiempo");
    }

    // Validar path
    if (path !== undefined) {
      if (!path.startsWith("/")) {
        throw new Error("FlowNavigation: path debe empezar con '/'");
      }

      if (path.includes(" ")) {
        throw new Error("FlowNavigation: path no puede contener espacios");
      }
    }

    // Validar href
    if (href !== undefined) {
      if (!href.startsWith("#")) {
        throw new Error("FlowNavigation: href debe empezar con '#'");
      }

      if (href.length < 2) {
        throw new Error("FlowNavigation: href debe tener al menos 2 caracteres (#id)");
      }
    }
  }

  // ============================================
  // MÉTODOS PÚBLICOS
  // ============================================

  isPage(): boolean {
    return this.type === "page";
  }

  isAnchor(): boolean {
    return this.type === "anchor";
  }

  hasNavigation(): boolean {
    return this.type !== "none";
  }

  getUrl(): string {
    return this.path ?? this.href ?? "";
  }

  toJSON() {
    return {
      path: this.path,
      href: this.href,
      type: this.type,
    };
  }

  static fromJSON(json: { path?: string; href?: string }): FlowNavigation {
    if (json.path) return FlowNavigation.fromPath(json.path);
    if (json.href) return FlowNavigation.fromHref(json.href);
    return FlowNavigation.none();
  }

  toString(): string {
    if (this.isPage()) return `FlowNavigation(page: ${this.path})`;
    if (this.isAnchor()) return `FlowNavigation(anchor: ${this.href})`;
    return "FlowNavigation(none)";
  }
}
```

---

### PASO 2: Entity FlowItem (Domain Layer)

#### Archivo: `app/modules/flow-system/domain/entities/FlowItem.ts`

```typescript
import { FlowIdentity } from "../value-objects/FlowIdentity";
import { FlowHierarchy } from "../value-objects/FlowHierarchy";
import { FlowNavigation } from "../value-objects/FlowNavigation";

/**
 * Entity: FlowItem
 *
 * Representa un paso/item en el flujo.
 * Es una ENTITY porque tiene IDENTIDAD (ID único).
 *
 * Composición con Value Objects:
 * - identity: FlowIdentity
 * - hierarchy: FlowHierarchy
 * - navigation: FlowNavigation
 *
 * @example
 * const item = new FlowItem(
 *   new FlowIdentity("datos-sociedad", "Datos de Sociedad"),
 *   new FlowHierarchy(1, 1),
 *   FlowNavigation.fromPath("/registro/datos-sociedad")
 * );
 */
export class FlowItem {
  // ============================================
  // PROPIEDADES (Value Objects)
  // ============================================

  public readonly identity: FlowIdentity;
  public readonly hierarchy: FlowHierarchy;
  public readonly navigation: FlowNavigation;

  // Propiedades opcionales
  public readonly isOptional: boolean;
  public readonly isLocked: boolean;
  public readonly requiresCompletion: boolean;

  // Children (otros FlowItems)
  private _children: FlowItem[] = [];

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(
    identity: FlowIdentity,
    hierarchy: FlowHierarchy,
    navigation: FlowNavigation,
    options: {
      isOptional?: boolean;
      isLocked?: boolean;
      requiresCompletion?: boolean;
      children?: FlowItem[];
    } = {}
  ) {
    this.identity = identity;
    this.hierarchy = hierarchy;
    this.navigation = navigation;

    this.isOptional = options.isOptional ?? false;
    this.isLocked = options.isLocked ?? false;
    this.requiresCompletion = options.requiresCompletion ?? false;

    if (options.children) {
      this.setChildren(options.children);
    }
  }

  // ============================================
  // GETTERS
  // ============================================

  get id(): string {
    return this.identity.id;
  }

  get label(): string {
    return this.identity.label;
  }

  get level(): 1 | 2 | 3 | 4 {
    return this.hierarchy.level;
  }

  get order(): number {
    return this.hierarchy.order;
  }

  get children(): readonly FlowItem[] {
    return this._children;
  }

  // ============================================
  // MÉTODOS PÚBLICOS
  // ============================================

  /**
   * Establece los hijos de este FlowItem.
   * Valida que todos los hijos tengan este item como padre.
   */
  setChildren(children: FlowItem[]): void {
    // Validar relación padre-hijo
    for (const child of children) {
      if (!child.hierarchy.isChildOf(this.id)) {
        throw new Error(`FlowItem: el hijo ${child.id} no tiene a ${this.id} como padre`);
      }
    }

    this._children = [...children];
  }

  /**
   * Añade un hijo a este FlowItem.
   */
  addChild(child: FlowItem): void {
    if (!child.hierarchy.isChildOf(this.id)) {
      throw new Error(`FlowItem: el hijo ${child.id} no tiene a ${this.id} como padre`);
    }

    this._children = [...this._children, child];
  }

  /**
   * Verifica si este item tiene hijos.
   */
  hasChildren(): boolean {
    return this._children.length > 0;
  }

  /**
   * Verifica si este item es raíz (nivel 1).
   */
  isRoot(): boolean {
    return this.hierarchy.isRoot();
  }

  /**
   * Obtiene todos los descendientes (recursivo).
   */
  getAllDescendants(): FlowItem[] {
    const descendants: FlowItem[] = [];

    for (const child of this._children) {
      descendants.push(child);
      descendants.push(...child.getAllDescendants());
    }

    return descendants;
  }

  /**
   * Compara dos FlowItems.
   * Dos items son iguales si tienen el mismo ID.
   */
  equals(other: FlowItem): boolean {
    return this.identity.equals(other.identity);
  }

  /**
   * Convierte a objeto plano (para serialización).
   */
  toJSON(): any {
    return {
      identity: this.identity.toJSON(),
      hierarchy: this.hierarchy.toJSON(),
      navigation: this.navigation.toJSON(),
      isOptional: this.isOptional,
      isLocked: this.isLocked,
      requiresCompletion: this.requiresCompletion,
      children: this._children.map((c) => c.toJSON()),
    };
  }

  /**
   * Crea desde objeto plano (para deserialización).
   */
  static fromJSON(json: any): FlowItem {
    const identity = FlowIdentity.fromJSON(json.identity);
    const hierarchy = FlowHierarchy.fromJSON(json.hierarchy);
    const navigation = FlowNavigation.fromJSON(json.navigation);

    const item = new FlowItem(identity, hierarchy, navigation, {
      isOptional: json.isOptional,
      isLocked: json.isLocked,
      requiresCompletion: json.requiresCompletion,
    });

    if (json.children) {
      const children = json.children.map((c: any) => FlowItem.fromJSON(c));
      item.setChildren(children);
    }

    return item;
  }

  toString(): string {
    return `FlowItem(${this.id}: ${this.label}, level=${this.level}, children=${this._children.length})`;
  }
}
```

---

### PASO 3: Aggregate Root FlowConfig (Domain Layer)

#### Archivo: `app/modules/flow-system/domain/entities/FlowConfig.ts`

```typescript
import { FlowItem } from "./FlowItem";

/**
 * Aggregate Root: FlowConfig
 *
 * Representa la configuración completa de un flujo.
 * Es el punto de entrada para trabajar con el flujo.
 *
 * Responsabilidades:
 * - Mantener la lista de FlowItems
 * - Validar la estructura del flujo
 * - Proporcionar métodos de navegación
 *
 * @example
 * const config = new FlowConfig(
 *   "registro-societario",
 *   "Registro Societario",
 *   "sequential",
 *   [item1, item2, item3]
 * );
 */
export class FlowConfig {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly type: "sequential" | "hierarchical" | "mixed";

  private _items: FlowItem[];
  private _itemsById: Map<string, FlowItem>;

  constructor(
    id: string,
    name: string,
    type: "sequential" | "hierarchical" | "mixed",
    items: FlowItem[],
    description?: string
  ) {
    this.validateId(id);
    this.validateName(name);

    this.id = id;
    this.name = name;
    this.type = type;
    this.description = description;

    this._items = [...items];
    this._itemsById = new Map();

    this.buildIndex();
    this.validateStructure();
  }

  // ============================================
  // VALIDACIONES
  // ============================================

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error("FlowConfig: id no puede estar vacío");
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("FlowConfig: name no puede estar vacío");
    }
  }

  private validateStructure(): void {
    // Validar que no haya IDs duplicados
    const ids = new Set<string>();

    for (const item of this._items) {
      if (ids.has(item.id)) {
        throw new Error(`FlowConfig: ID duplicado encontrado: ${item.id}`);
      }
      ids.add(item.id);
    }

    // Validar orden secuencial
    const orders = this._items.map((item) => item.order);
    const sortedOrders = [...orders].sort((a, b) => a - b);

    for (let i = 0; i < sortedOrders.length; i++) {
      if (sortedOrders[i] !== i + 1) {
        throw new Error(
          `FlowConfig: orden inválido. Esperado ${i + 1}, encontrado ${sortedOrders[i]}`
        );
      }
    }
  }

  // ============================================
  // ÍNDICE (para búsqueda rápida)
  // ============================================

  private buildIndex(): void {
    this._itemsById.clear();

    for (const item of this._items) {
      this._itemsById.set(item.id, item);

      // Indexar también los hijos
      for (const child of item.getAllDescendants()) {
        this._itemsById.set(child.id, child);
      }
    }
  }

  // ============================================
  // GETTERS
  // ============================================

  get items(): readonly FlowItem[] {
    return this._items;
  }

  get totalSteps(): number {
    return this._items.length;
  }

  // ============================================
  // MÉTODOS PÚBLICOS - BÚSQUEDA
  // ============================================

  /**
   * Busca un FlowItem por su ID.
   */
  getItemById(id: string): FlowItem | undefined {
    return this._itemsById.get(id);
  }

  /**
   * Busca un FlowItem por su ruta.
   */
  getItemByPath(path: string): FlowItem | undefined {
    return Array.from(this._itemsById.values()).find((item) => item.navigation.path === path);
  }

  /**
   * Obtiene todos los items de un nivel específico.
   */
  getItemsByLevel(level: 1 | 2 | 3 | 4): FlowItem[] {
    return Array.from(this._itemsById.values()).filter((item) => item.level === level);
  }

  /**
   * Obtiene los items raíz (nivel 1).
   */
  getRootItems(): FlowItem[] {
    return this._items.filter((item) => item.isRoot());
  }

  // ============================================
  // MÉTODOS PÚBLICOS - NAVEGACIÓN
  // ============================================

  /**
   * Obtiene el item siguiente.
   */
  getNextItem(currentId: string): FlowItem | null {
    const current = this.getItemById(currentId);
    if (!current) return null;

    // Si tiene hijos, el siguiente es el primer hijo
    if (current.hasChildren()) {
      return current.children[0];
    }

    // Si no, buscar en la lista plana
    const allItems = this.getAllItemsFlat();
    const currentIndex = allItems.findIndex((item) => item.id === currentId);

    if (currentIndex === -1 || currentIndex === allItems.length - 1) {
      return null; // Último item
    }

    return allItems[currentIndex + 1];
  }

  /**
   * Obtiene el item anterior.
   */
  getPreviousItem(currentId: string): FlowItem | null {
    const allItems = this.getAllItemsFlat();
    const currentIndex = allItems.findIndex((item) => item.id === currentId);

    if (currentIndex <= 0) {
      return null; // Primer item
    }

    return allItems[currentIndex - 1];
  }

  /**
   * Obtiene todos los items en orden plano (DFS).
   */
  getAllItemsFlat(): FlowItem[] {
    const result: FlowItem[] = [];

    const traverse = (item: FlowItem) => {
      result.push(item);
      for (const child of item.children) {
        traverse(child);
      }
    };

    for (const item of this._items) {
      traverse(item);
    }

    return result;
  }

  /**
   * Verifica si un item es el primero.
   */
  isFirstItem(itemId: string): boolean {
    const allItems = this.getAllItemsFlat();
    return allItems[0]?.id === itemId;
  }

  /**
   * Verifica si un item es el último.
   */
  isLastItem(itemId: string): boolean {
    const allItems = this.getAllItemsFlat();
    return allItems[allItems.length - 1]?.id === itemId;
  }

  // ============================================
  // SERIALIZACIÓN
  // ============================================

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      items: this._items.map((item) => item.toJSON()),
    };
  }

  static fromJSON(json: any): FlowConfig {
    const items = json.items.map((itemJson: any) => FlowItem.fromJSON(itemJson));

    return new FlowConfig(json.id, json.name, json.type, items, json.description);
  }

  toString(): string {
    return `FlowConfig(${this.id}: ${this.name}, ${this._items.length} items, type=${this.type})`;
  }
}
```

---

## 6. Todo List de Actividades

### 📝 Fase 1: Setup Inicial (1 hora)

- [ ] **1.1** Crear estructura de carpetas `app/modules/flow-system/`
- [ ] **1.2** Crear carpetas: `domain/`, `application/`, `infrastructure/`, `presentation/`, `config/`
- [ ] **1.3** Dentro de `domain/`: crear `entities/`, `value-objects/`, `services/`, `repositories/`, `types/`
- [ ] **1.4** Leer este documento completo para entender la arquitectura

---

### 📝 Fase 2: Domain Layer - Value Objects (2 horas)

- [ ] **2.1** Crear `FlowIdentity.ts` (copiar código de PASO 1)
- [ ] **2.2** Crear `FlowHierarchy.ts` (copiar código de PASO 1)
- [ ] **2.3** Crear `FlowNavigation.ts` (copiar código de PASO 1)
- [ ] **2.4** Testear cada Value Object:

  ```typescript
  // Test FlowIdentity
  const identity = new FlowIdentity("datos-sociedad", "Datos de Sociedad");
  console.log(identity.toString());

  // Test FlowHierarchy
  const hierarchy = new FlowHierarchy(1, 1);
  console.log(hierarchy.isRoot()); // true

  // Test FlowNavigation
  const nav = FlowNavigation.fromPath("/registro/datos-sociedad");
  console.log(nav.isPage()); // true
  ```

---

### 📝 Fase 3: Domain Layer - Entities (2 horas)

- [ ] **3.1** Crear `FlowItem.ts` (copiar código de PASO 2)
- [ ] **3.2** Crear `FlowConfig.ts` (copiar código de PASO 3)
- [ ] **3.3** Testear FlowItem:
  ```typescript
  const item = new FlowItem(
    new FlowIdentity("datos-sociedad", "Datos de Sociedad"),
    new FlowHierarchy(1, 1),
    FlowNavigation.fromPath("/registro/datos-sociedad")
  );
  console.log(item.toString());
  ```
- [ ] **3.4** Testear FlowConfig:
  ```typescript
  const config = new FlowConfig("registro", "Registro", "sequential", [item1, item2, item3]);
  console.log(config.getNextItem("datos-sociedad"));
  ```

---

### 📝 Fase 4: Config Layer - Crear Flujos (3 horas)

- [ ] **4.1** Crear `config/flows/registro-sociedades.flow.ts`
- [ ] **4.2** Dentro, crear función `getRegistroSociedadesFlow()`:

  ```typescript
  export function getRegistroSociedadesFlow(): FlowConfig {
    // Crear 10 FlowItems usando las clases
    const item1 = new FlowItem(
      new FlowIdentity("datos-sociedad", "Datos de Sociedad"),
      new FlowHierarchy(1, 1),
      FlowNavigation.fromPath("/registro-societario/sociedades/crear/datos-sociedad")
    );

    // ... item2, item3, ..., item10

    return new FlowConfig("registro-sociedades", "Registro de Sociedades", "sequential", [
      item1,
      item2 /* ... */,
      ,
      item10,
    ]);
  }
  ```

- [ ] **4.3** Crear `config/flows/juntas-accionistas.flow.ts` (jerárquico)
- [ ] **4.4** Crear `config/flows/sucursales.flow.ts` (secuencial simple)

---

### 📝 Fase 5: Application Layer - Composables (3 horas)

- [ ] **5.1** Crear `application/composables/useFlowNavigation.ts`:

  ```typescript
  import { ref, computed } from "vue";
  import type { FlowConfig, FlowItem } from "~/modules/flow-system/domain/entities";

  export function useFlowNavigation(flowConfig: FlowConfig) {
    const currentItemId = ref<string | null>(null);

    const currentItem = computed(() => {
      if (!currentItemId.value) return null;
      return flowConfig.getItemById(currentItemId.value) ?? null;
    });

    const nextItem = computed(() => {
      if (!currentItemId.value) return null;
      return flowConfig.getNextItem(currentItemId.value);
    });

    const previousItem = computed(() => {
      if (!currentItemId.value) return null;
      return flowConfig.getPreviousItem(currentItemId.value);
    });

    const canGoNext = computed(() => nextItem.value !== null);
    const canGoPrevious = computed(() => previousItem.value !== null);

    const isFirst = computed(() => {
      if (!currentItemId.value) return false;
      return flowConfig.isFirstItem(currentItemId.value);
    });

    const isLast = computed(() => {
      if (!currentItemId.value) return false;
      return flowConfig.isLastItem(currentItemId.value);
    });

    function navigateTo(itemId: string) {
      const item = flowConfig.getItemById(itemId);
      if (!item) {
        console.error(`Item ${itemId} no encontrado`);
        return;
      }
      currentItemId.value = itemId;
    }

    function goNext() {
      if (nextItem.value) {
        navigateTo(nextItem.value.id);
      }
    }

    function goPrevious() {
      if (previousItem.value) {
        navigateTo(previousItem.value.id);
      }
    }

    return {
      currentItem,
      nextItem,
      previousItem,
      canGoNext,
      canGoPrevious,
      isFirst,
      isLast,
      navigateTo,
      goNext,
      goPrevious,
    };
  }
  ```

- [ ] **5.2** Crear `application/composables/useFlowProgress.ts`
- [ ] **5.3** Crear `application/composables/useFlowState.ts`

---

### 📝 Fase 6: Infrastructure Layer - Store (2 horas)

- [ ] **6.1** Crear `infrastructure/stores/useFlowStateStore.ts`:

  ```typescript
  import { defineStore } from "pinia";
  import { ref, computed } from "vue";

  export const useFlowStateStore = defineStore("flowState", () => {
    // Estado
    const currentFlowId = ref<string | null>(null);
    const currentItemId = ref<string | null>(null);
    const completedItemIds = ref<Set<string>>(new Set());

    // Getters
    const progress = computed(() => {
      // Calcular progreso
      return 0;
    });

    // Actions
    function setCurrentFlow(flowId: string) {
      currentFlowId.value = flowId;
    }

    function setCurrentItem(itemId: string) {
      currentItemId.value = itemId;
    }

    function markItemCompleted(itemId: string) {
      completedItemIds.value.add(itemId);
    }

    function isItemCompleted(itemId: string): boolean {
      return completedItemIds.value.has(itemId);
    }

    return {
      currentFlowId,
      currentItemId,
      completedItemIds,
      progress,
      setCurrentFlow,
      setCurrentItem,
      markItemCompleted,
      isItemCompleted,
    };
  });
  ```

---

### 📝 Fase 7: Presentation Layer - Componentes (4 horas)

- [ ] **7.1** Actualizar `UniversalFlowLayout.vue` para usar FlowConfig
- [ ] **7.2** Actualizar `FlowSidebar.vue` para renderizar FlowItems
- [ ] **7.3** Actualizar `FlowSidebarItem.vue` para mostrar datos del FlowItem
- [ ] **7.4** Crear `FlowNavigationButtons.vue` (Anterior/Siguiente)

---

### 📝 Fase 8: Integración (2 horas)

- [ ] **8.1** Modificar `layouts/flow-layout.vue` para cargar FlowConfig
- [ ] **8.2** Testear navegación entre pasos
- [ ] **8.3** Verificar que los sidebars se muestren correctamente
- [ ] **8.4** Testear progreso

---

### 📝 Fase 9: Testing (2 horas)

- [ ] **9.1** Tests unitarios para Value Objects
- [ ] **9.2** Tests unitarios para Entities
- [ ] **9.3** Tests de integración para Composables
- [ ] **9.4** Tests E2E para flujos completos

---

### 📝 Fase 10: Documentación (1 hora)

- [ ] **10.1** Documentar cómo crear un nuevo flujo
- [ ] **10.2** Documentar cómo extender FlowItem
- [ ] **10.3** Crear guía de troubleshooting
- [ ] **10.4** Actualizar README

---

## 🎓 Resumen Final

### ✅ Lo Que Lograste

1. **Arquitectura DDD Hexagonal**: Separación clara de capas
2. **OOP en Domain**: Clases para Entities y Value Objects
3. **Functional en Application**: Composables para casos de uso
4. **Objetos Agrupados**: Propiedades organizadas por concepto
5. **Type Safety**: TypeScript con validación en tiempo de compilación
6. **Validación en Runtime**: Constructores validan datos
7. **Inmutabilidad**: Value Objects son inmutables
8. **Testabilidad**: Cada capa se testea independientemente

### 🚀 Próximos Pasos

1. Empieza por **Fase 1** (Setup)
2. Sigue **en orden** hasta Fase 10
3. No saltes fases (cada una depende de la anterior)
4. Testea cada fase antes de continuar
5. Pregunta si algo no está claro

### 📞 Preguntas Frecuentes

**P: ¿Por qué Value Objects y no simples interfaces?**  
R: Value Objects validan en el constructor. Interfaces no.

**P: ¿Por qué clases y no funciones?**  
R: Clases encapsulan mejor la lógica de negocio compleja.

**P: ¿Cuándo usar composables vs métodos de clase?**  
R: Composables para orquestar, métodos para lógica interna.

**P: ¿Cómo se relaciona con Nuxt?**  
R: Nuxt es solo UI + Infrastructure. Domain es independiente.

---

**¡Éxito con la implementación! 🚀**
