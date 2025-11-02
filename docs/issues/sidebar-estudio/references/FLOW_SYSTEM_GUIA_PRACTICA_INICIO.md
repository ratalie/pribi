# 🎯 Guía Práctica: Cómo Empezar con el Flow System

## 📋 Tu Primera Tarea: Crear el Primer FlowItem

### Contexto

Vas a crear **Registro de Sociedades**, que tiene 10 pasos secuenciales:

1. Datos de Sociedad
2. Datos de Socios
3. Representantes Legales
4. Capital Social
5. Acciones
6. Asignación de Acciones
7. Directorio
8. Registro de Apoderados
9. Régimen General de Poderes
10. Quorum y Mayorías

---

## 🏁 PASO 0: Crear las Carpetas

```bash
# Desde la raíz del proyecto
cd app

# Crear estructura de módulo
mkdir -p modules/flow-system/domain/entities
mkdir -p modules/flow-system/domain/value-objects
mkdir -p modules/flow-system/domain/services
mkdir -p modules/flow-system/domain/repositories
mkdir -p modules/flow-system/domain/types
mkdir -p modules/flow-system/application/composables
mkdir -p modules/flow-system/application/dtos
mkdir -p modules/flow-system/infrastructure/stores
mkdir -p modules/flow-system/infrastructure/repositories
mkdir -p modules/flow-system/presentation/components
mkdir -p modules/flow-system/presentation/layouts
mkdir -p modules/flow-system/config/flows
```

---

## 🎓 PASO 1: Crear Value Object FlowIdentity

### Archivo: `app/modules/flow-system/domain/value-objects/FlowIdentity.ts`

```typescript
/**
 * FlowIdentity Value Object
 *
 * Representa la identidad de un FlowItem.
 * INMUTABLE: Una vez creado, no cambia.
 *
 * Propiedades agrupadas:
 * - id: Identificador único (kebab-case)
 * - label: Etiqueta visible para el usuario
 * - description: Descripción opcional
 * - icon: Icono (lucide-vue-next)
 * - badge: Badge opcional ("Nuevo", "Opcional")
 */
export class FlowIdentity {
  public readonly id: string;
  public readonly label: string;
  public readonly description?: string;
  public readonly icon?: string;
  public readonly badge?: string;

  constructor(id: string, label: string, description?: string, icon?: string, badge?: string) {
    // VALIDACIÓN: id no vacío
    if (!id || id.trim().length === 0) {
      throw new Error("FlowIdentity: id no puede estar vacío");
    }

    // VALIDACIÓN: id formato kebab-case
    if (!/^[a-z0-9-]+$/.test(id)) {
      throw new Error("FlowIdentity: id debe ser kebab-case (ejemplo: 'datos-sociedad')");
    }

    // VALIDACIÓN: id max 50 chars
    if (id.length > 50) {
      throw new Error("FlowIdentity: id no puede tener más de 50 caracteres");
    }

    // VALIDACIÓN: label no vacío
    if (!label || label.trim().length === 0) {
      throw new Error("FlowIdentity: label no puede estar vacío");
    }

    // VALIDACIÓN: label min 3 chars
    if (label.length < 3) {
      throw new Error("FlowIdentity: label debe tener al menos 3 caracteres");
    }

    // Asignar propiedades (readonly)
    this.id = id;
    this.label = label;
    this.description = description;
    this.icon = icon;
    this.badge = badge;
  }

  // Método para comparar identidades
  equals(other: FlowIdentity): boolean {
    return this.id === other.id;
  }

  // Serialización
  toJSON() {
    return {
      id: this.id,
      label: this.label,
      description: this.description,
      icon: this.icon,
      badge: this.badge,
    };
  }

  // Deserialización
  static fromJSON(json: any): FlowIdentity {
    return new FlowIdentity(json.id, json.label, json.description, json.icon, json.badge);
  }

  toString(): string {
    return `FlowIdentity(${this.id}: ${this.label})`;
  }
}
```

### 🧪 Testear FlowIdentity

Crea un archivo temporal `test-identity.ts`:

```typescript
import { FlowIdentity } from "./FlowIdentity";

// ✅ Test 1: Crear identidad válida
try {
  const identity1 = new FlowIdentity(
    "datos-sociedad",
    "Datos de Sociedad",
    "Información básica de la sociedad",
    "Building",
    "Obligatorio"
  );
  console.log("✅ Test 1 pasó:", identity1.toString());
} catch (error) {
  console.error("❌ Test 1 falló:", error.message);
}

// ❌ Test 2: ID vacío (debe fallar)
try {
  const identity2 = new FlowIdentity("", "Label");
  console.log("❌ Test 2 NO debió pasar");
} catch (error) {
  console.log("✅ Test 2 pasó (error esperado):", error.message);
}

// ❌ Test 3: ID con mayúsculas (debe fallar)
try {
  const identity3 = new FlowIdentity("DatosSociedad", "Label");
  console.log("❌ Test 3 NO debió pasar");
} catch (error) {
  console.log("✅ Test 3 pasó (error esperado):", error.message);
}

// ❌ Test 4: Label muy corto (debe fallar)
try {
  const identity4 = new FlowIdentity("id", "Ab");
  console.log("❌ Test 4 NO debió pasar");
} catch (error) {
  console.log("✅ Test 4 pasó (error esperado):", error.message);
}

// ✅ Test 5: Comparar identidades
const id1 = new FlowIdentity("datos-sociedad", "Datos");
const id2 = new FlowIdentity("datos-sociedad", "Otro Label");
const id3 = new FlowIdentity("otro-id", "Datos");

console.log("✅ Test 5a:", id1.equals(id2)); // true (mismo ID)
console.log("✅ Test 5b:", id1.equals(id3)); // false (distinto ID)

// ✅ Test 6: Serialización
const identity = new FlowIdentity("datos-sociedad", "Datos de Sociedad");
const json = identity.toJSON();
const restored = FlowIdentity.fromJSON(json);

console.log("✅ Test 6:", restored.equals(identity)); // true
```

Ejecutar:

```bash
npx tsx app/modules/flow-system/domain/value-objects/test-identity.ts
```

---

## 🎓 PASO 2: Crear Value Object FlowHierarchy

### Archivo: `app/modules/flow-system/domain/value-objects/FlowHierarchy.ts`

```typescript
/**
 * FlowHierarchy Value Object
 *
 * Representa la jerarquía de un FlowItem en el árbol.
 *
 * Propiedades agrupadas:
 * - level: Nivel en el árbol (1, 2, 3, 4)
 * - order: Posición en ese nivel (1, 2, 3...)
 * - parentId: ID del padre (undefined para level 1)
 * - childrenIds: IDs de los hijos
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
    // VALIDACIÓN: level debe ser 1, 2, 3 o 4
    if (![1, 2, 3, 4].includes(level)) {
      throw new Error("FlowHierarchy: level debe ser 1, 2, 3 o 4");
    }

    // VALIDACIÓN: order >= 1
    if (order < 1) {
      throw new Error("FlowHierarchy: order debe ser >= 1");
    }

    // VALIDACIÓN: order debe ser entero
    if (!Number.isInteger(order)) {
      throw new Error("FlowHierarchy: order debe ser un entero");
    }

    // VALIDACIÓN: level 1 no puede tener padre
    if (level === 1 && parentId) {
      throw new Error("FlowHierarchy: level 1 no puede tener padre");
    }

    // VALIDACIÓN: level > 1 debe tener padre
    if (level > 1 && !parentId) {
      throw new Error(`FlowHierarchy: level ${level} debe tener padre`);
    }

    this.level = level;
    this.order = order;
    this.parentId = parentId;
    this.childrenIds = [...childrenIds]; // Copiar para inmutabilidad
  }

  // Métodos de consulta
  isRoot(): boolean {
    return this.level === 1;
  }

  hasChildren(): boolean {
    return this.childrenIds.length > 0;
  }

  isChildOf(parentId: string): boolean {
    return this.parentId === parentId;
  }

  // Crear nueva jerarquía con hijos añadidos (inmutable)
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

  static fromJSON(json: any): FlowHierarchy {
    return new FlowHierarchy(json.level, json.order, json.parentId, json.childrenIds);
  }

  toString(): string {
    return `FlowHierarchy(level=${this.level}, order=${this.order}, children=${this.childrenIds.length})`;
  }
}
```

### 🧪 Testear FlowHierarchy

```typescript
import { FlowHierarchy } from "./FlowHierarchy";

// ✅ Test 1: Level 1 sin padre
const h1 = new FlowHierarchy(1, 1);
console.log("✅ Test 1:", h1.isRoot()); // true

// ❌ Test 2: Level 1 con padre (debe fallar)
try {
  const h2 = new FlowHierarchy(1, 1, "padre");
  console.log("❌ Test 2 NO debió pasar");
} catch (error) {
  console.log("✅ Test 2 pasó:", error.message);
}

// ❌ Test 3: Level 2 sin padre (debe fallar)
try {
  const h3 = new FlowHierarchy(2, 1);
  console.log("❌ Test 3 NO debió pasar");
} catch (error) {
  console.log("✅ Test 3 pasó:", error.message);
}

// ✅ Test 4: Level 2 con padre
const h4 = new FlowHierarchy(2, 1, "padre-id");
console.log("✅ Test 4:", h4.isChildOf("padre-id")); // true

// ✅ Test 5: Añadir hijos (inmutable)
const h5 = new FlowHierarchy(1, 1);
const h5WithChildren = h5.withChildren(["hijo1", "hijo2"]);

console.log("✅ Test 5a:", h5.hasChildren()); // false (original)
console.log("✅ Test 5b:", h5WithChildren.hasChildren()); // true (nuevo)
```

---

## 🎓 PASO 3: Crear Value Object FlowNavigation

### Archivo: `app/modules/flow-system/domain/value-objects/FlowNavigation.ts`

```typescript
/**
 * FlowNavigation Value Object
 *
 * Representa la navegación de un FlowItem.
 * Un item navega por RUTA (path) o ANCLA (href), NUNCA ambos.
 *
 * Propiedades agrupadas:
 * - path: Ruta de página (/registro/datos-sociedad)
 * - href: Ancla en la misma página (#seccion-1)
 * - type: "page" | "anchor" | "none"
 */
export class FlowNavigation {
  public readonly path?: string;
  public readonly href?: string;
  public readonly type: "page" | "anchor" | "none";

  private constructor(path?: string, href?: string) {
    // VALIDACIÓN: no puede tener ambos
    if (path && href) {
      throw new Error("FlowNavigation: no puede tener 'path' y 'href' al mismo tiempo");
    }

    // VALIDACIÓN: path debe empezar con /
    if (path !== undefined && !path.startsWith("/")) {
      throw new Error("FlowNavigation: path debe empezar con '/'");
    }

    // VALIDACIÓN: path no puede tener espacios
    if (path !== undefined && path.includes(" ")) {
      throw new Error("FlowNavigation: path no puede contener espacios");
    }

    // VALIDACIÓN: href debe empezar con #
    if (href !== undefined && !href.startsWith("#")) {
      throw new Error("FlowNavigation: href debe empezar con '#'");
    }

    // VALIDACIÓN: href mínimo 2 chars
    if (href !== undefined && href.length < 2) {
      throw new Error("FlowNavigation: href debe tener al menos 2 caracteres");
    }

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

  // Métodos de consulta
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

  static fromJSON(json: any): FlowNavigation {
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

### 🧪 Testear FlowNavigation

```typescript
import { FlowNavigation } from "./FlowNavigation";

// ✅ Test 1: Navegación por página
const nav1 = FlowNavigation.fromPath("/registro/datos-sociedad");
console.log("✅ Test 1a:", nav1.isPage()); // true
console.log("✅ Test 1b:", nav1.getUrl()); // "/registro/datos-sociedad"

// ✅ Test 2: Navegación por ancla
const nav2 = FlowNavigation.fromHref("#seccion-1");
console.log("✅ Test 2a:", nav2.isAnchor()); // true
console.log("✅ Test 2b:", nav2.getUrl()); // "#seccion-1"

// ✅ Test 3: Sin navegación
const nav3 = FlowNavigation.none();
console.log("✅ Test 3:", nav3.hasNavigation()); // false

// ❌ Test 4: Path sin / (debe fallar)
try {
  const nav4 = FlowNavigation.fromPath("registro/datos");
  console.log("❌ Test 4 NO debió pasar");
} catch (error) {
  console.log("✅ Test 4 pasó:", error.message);
}

// ❌ Test 5: Href sin # (debe fallar)
try {
  const nav5 = FlowNavigation.fromHref("seccion-1");
  console.log("❌ Test 5 NO debió pasar");
} catch (error) {
  console.log("✅ Test 5 pasó:", error.message);
}
```

---

## 🎓 PASO 4: Crear Entity FlowItem

Ahora que tienes los 3 Value Objects, puedes crear la Entity `FlowItem`.

### Archivo: `app/modules/flow-system/domain/entities/FlowItem.ts`

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
 * COMPOSICIÓN con Value Objects:
 * - identity: FlowIdentity (¿Quién soy?)
 * - hierarchy: FlowHierarchy (¿Dónde estoy?)
 * - navigation: FlowNavigation (¿Cómo navego?)
 */
export class FlowItem {
  // Value Objects (readonly)
  public readonly identity: FlowIdentity;
  public readonly hierarchy: FlowHierarchy;
  public readonly navigation: FlowNavigation;

  // Comportamiento
  public readonly isOptional: boolean;
  public readonly isLocked: boolean;
  public readonly requiresCompletion: boolean;

  // Hijos (mutables)
  private _children: FlowItem[] = [];

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
  // GETTERS (acceso rápido)
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

  setChildren(children: FlowItem[]): void {
    // VALIDACIÓN: todos los hijos deben tener este item como padre
    for (const child of children) {
      if (!child.hierarchy.isChildOf(this.id)) {
        throw new Error(`FlowItem: el hijo ${child.id} no tiene a ${this.id} como padre`);
      }
    }

    this._children = [...children];
  }

  addChild(child: FlowItem): void {
    if (!child.hierarchy.isChildOf(this.id)) {
      throw new Error(`FlowItem: el hijo ${child.id} no tiene a ${this.id} como padre`);
    }

    this._children = [...this._children, child];
  }

  hasChildren(): boolean {
    return this._children.length > 0;
  }

  isRoot(): boolean {
    return this.hierarchy.isRoot();
  }

  getAllDescendants(): FlowItem[] {
    const descendants: FlowItem[] = [];

    for (const child of this._children) {
      descendants.push(child);
      descendants.push(...child.getAllDescendants());
    }

    return descendants;
  }

  equals(other: FlowItem): boolean {
    return this.identity.equals(other.identity);
  }

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

### 🧪 Testear FlowItem

```typescript
import { FlowItem } from "./FlowItem";
import { FlowIdentity } from "../value-objects/FlowIdentity";
import { FlowHierarchy } from "../value-objects/FlowHierarchy";
import { FlowNavigation } from "../value-objects/FlowNavigation";

// ✅ Test 1: Crear FlowItem simple
const item1 = new FlowItem(
  new FlowIdentity("datos-sociedad", "Datos de Sociedad", undefined, "Building"),
  new FlowHierarchy(1, 1),
  FlowNavigation.fromPath("/registro/datos-sociedad"),
  { requiresCompletion: true }
);

console.log("✅ Test 1:", item1.toString());
console.log("  - ID:", item1.id);
console.log("  - Label:", item1.label);
console.log("  - Level:", item1.level);
console.log("  - Is Root:", item1.isRoot());

// ✅ Test 2: Crear FlowItem con hijo
const parentItem = new FlowItem(
  new FlowIdentity("juntas", "Juntas", undefined, "Users"),
  new FlowHierarchy(1, 1),
  FlowNavigation.none()
);

const childItem = new FlowItem(
  new FlowIdentity("convocatoria", "Convocatoria", undefined, "Mail"),
  new FlowHierarchy(2, 1, "juntas"), // ← Tiene padre "juntas"
  FlowNavigation.fromHref("#convocatoria")
);

parentItem.addChild(childItem);

console.log("✅ Test 2:");
console.log("  - Parent:", parentItem.toString());
console.log("  - Child:", childItem.toString());
console.log("  - Parent has children:", parentItem.hasChildren());

// ✅ Test 3: Serialización
const json = item1.toJSON();
const restored = FlowItem.fromJSON(json);

console.log("✅ Test 3:", restored.equals(item1)); // true
```

---

## 🎯 PASO 5: Tu Primer Flujo Completo (Registro)

Ahora vas a crear el flujo completo de **Registro de Sociedades** con 10 items.

### Archivo: `app/modules/flow-system/config/flows/registro-sociedades.flow.ts`

```typescript
import { FlowItem } from "../../domain/entities/FlowItem";
import { FlowIdentity } from "../../domain/value-objects/FlowIdentity";
import { FlowHierarchy } from "../../domain/value-objects/FlowHierarchy";
import { FlowNavigation } from "../../domain/value-objects/FlowNavigation";

/**
 * Flujo: Registro de Sociedades
 * Tipo: Sequential (10 pasos)
 */

// ============================================
// PASO 1: Datos de Sociedad
// ============================================
const item1 = new FlowItem(
  new FlowIdentity(
    "datos-sociedad",
    "Datos de Sociedad",
    "Información básica de la sociedad",
    "Building"
  ),
  new FlowHierarchy(1, 1),
  FlowNavigation.fromPath("/registro-societario/sociedades/crear/datos-sociedad"),
  { requiresCompletion: true }
);

// ============================================
// PASO 2: Datos de Socios
// ============================================
const item2 = new FlowItem(
  new FlowIdentity("datos-socios", "Datos de Socios", "Información de los socios", "Users"),
  new FlowHierarchy(1, 2),
  FlowNavigation.fromPath("/registro-societario/sociedades/crear/datos-socios"),
  { requiresCompletion: true }
);

// ============================================
// PASO 3: Representantes Legales
// ============================================
const item3 = new FlowItem(
  new FlowIdentity(
    "datos-representantes",
    "Representantes Legales",
    "Información de representantes",
    "UserCheck"
  ),
  new FlowHierarchy(1, 3),
  FlowNavigation.fromPath("/registro-societario/sociedades/crear/datos-representantes"),
  { requiresCompletion: true }
);

// ============================================
// PASO 4: Capital Social
// ============================================
const item4 = new FlowItem(
  new FlowIdentity("capital-social", "Capital Social", "Definir capital social", "DollarSign"),
  new FlowHierarchy(1, 4),
  FlowNavigation.fromPath("/registro-societario/sociedades/crear/capital-social"),
  { requiresCompletion: true }
);

// ============================================
// PASO 5: Acciones
// ============================================
const item5 = new FlowItem(
  new FlowIdentity("acciones", "Acciones", "Configurar tipos de acciones", "TrendingUp"),
  new FlowHierarchy(1, 5),
  FlowNavigation.fromPath("/registro-societario/sociedades/crear/acciones"),
  { requiresCompletion: true }
);

// ============================================
// PASO 6: Asignación de Acciones
// ============================================
const item6 = new FlowItem(
  new FlowIdentity(
    "asignacion-acciones",
    "Asignación de Acciones",
    "Asignar acciones a socios",
    "Share"
  ),
  new FlowHierarchy(1, 6),
  FlowNavigation.fromPath("/registro-societario/sociedades/crear/asignacion-acciones"),
  { requiresCompletion: true }
);

// ============================================
// PASO 7: Directorio
// ============================================
const item7 = new FlowItem(
  new FlowIdentity("directorio", "Directorio", "Configurar directorio", "Shield"),
  new FlowHierarchy(1, 7),
  FlowNavigation.fromPath("/registro-societario/sociedades/crear/directorio"),
  { requiresCompletion: true }
);

// ============================================
// PASO 8: Registro de Apoderados
// ============================================
const item8 = new FlowItem(
  new FlowIdentity(
    "registro-apoderados",
    "Registro de Apoderados",
    "Definir apoderados",
    "UserCog"
  ),
  new FlowHierarchy(1, 8),
  FlowNavigation.fromPath("/registro-societario/sociedades/crear/registro-apoderados"),
  { isOptional: true }
);

// ============================================
// PASO 9: Régimen General de Poderes
// ============================================
const item9 = new FlowItem(
  new FlowIdentity(
    "regimen-poderes",
    "Régimen General de Poderes",
    "Configurar régimen de poderes",
    "Scale"
  ),
  new FlowHierarchy(1, 9),
  FlowNavigation.fromPath("/registro-societario/sociedades/crear/regimen-poderes"),
  { isOptional: true }
);

// ============================================
// PASO 10: Quorum y Mayorías
// ============================================
const item10 = new FlowItem(
  new FlowIdentity(
    "quorum-mayorias",
    "Quorum y Mayorías",
    "Definir quorum y mayorías",
    "Target"
  ),
  new FlowHierarchy(1, 10),
  FlowNavigation.fromPath("/registro-societario/sociedades/crear/quorum-mayorias"),
  { requiresCompletion: true }
);

// ============================================
// EXPORTAR TODOS LOS ITEMS
// ============================================
export const registroSociedadesItems: FlowItem[] = [
  item1,
  item2,
  item3,
  item4,
  item5,
  item6,
  item7,
  item8,
  item9,
  item10,
];
```

---

## 🎯 Siguiente Paso: FlowConfig

En el próximo documento, verás cómo crear el **Aggregate Root FlowConfig** que contiene todos estos FlowItems y provee métodos de navegación.

---

## ✅ Checklist de lo que hiciste

- [x] Creaste estructura de carpetas DDD Hexagonal
- [x] Creaste Value Object `FlowIdentity`
- [x] Creaste Value Object `FlowHierarchy`
- [x] Creaste Value Object `FlowNavigation`
- [x] Creaste Entity `FlowItem`
- [x] Creaste tu primer flujo con 10 items

---

## 🚀 ¿Qué Sigue?

1. **Crear FlowConfig** (Aggregate Root)
2. **Crear Composable useFlowNavigation** (Application Layer)
3. **Crear Pinia Store** (Infrastructure Layer)
4. **Actualizar Componentes** (Presentation Layer)

**¡Vas muy bien! 🎉**
