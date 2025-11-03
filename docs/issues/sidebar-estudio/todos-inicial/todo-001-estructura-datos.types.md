# TODO-001: Estructura de Datos - TYPES

**Objetivo:** Definiciones TypeScript completas + Schemas Zod + Helpers

---

## 📋 Contenido

1. [Value Objects (TypeScript)](#value-objects)
2. [Entities (TypeScript)](#entities)
3. [Zod Schemas](#zod-schemas)
4. [Helper Functions](#helper-functions)
5. [Type Guards](#type-guards)

---

## Value Objects

### **1. FlowItemIdentity**

```typescript
// app/types/flow-system/identity.ts

/**
 * Información de identidad de un FlowItem
 *
 * Agrupa todos los datos de identificación visual y semántica
 * del item en la navegación
 */
export interface FlowItemIdentity {
  /**
   * Identificador único del item
   *
   * Usado para:
   * - Guardar progreso en localStorage
   * - Buscar items en el árbol
   * - Sincronizar con backend
   * - Rutas de navegación
   *
   * @example "datos-sociedad"
   * @example "convocatoria-datos-basicos"
   */
  id: string;

  /**
   * Texto visible en el sidebar
   *
   * @example "Datos principales"
   * @example "Convocatoria"
   */
  label: string;

  /**
   * Descripción opcional
   *
   * Se muestra en:
   * - Tooltip al hover
   * - Ayuda contextual
   * - Aria-label para accesibilidad
   *
   * @example "Completa todos los datos básicos de la sociedad"
   */
  description?: string;

  /**
   * Icono de Lucide Icons
   *
   * @see https://lucide.dev/icons
   * @example "building"
   * @example "users"
   * @example "calendar"
   */
  icon?: string;

  /**
   * Badge opcional
   *
   * Usado para:
   * - Resaltar items especiales ("Nuevo", "Beta")
   * - Indicar estado ("Requerido", "Opcional")
   * - Mostrar paso actual ("Paso 1", "Final")
   */
  badge?: {
    /** Texto del badge */
    text: string;

    /**
     * Variante visual (basado en shadcn/ui)
     * - default: Azul
     * - secondary: Gris
     * - destructive: Rojo
     * - outline: Borde sin relleno
     */
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}
```

---

### **2. FlowItemHierarchy**

````typescript
// app/types/flow-system/hierarchy.ts

import type { FlowItem } from "./flow-item";

/**
 * Información jerárquica y posición en el árbol
 *
 * Define la estructura de navegación del flujo
 */
export interface FlowItemHierarchy {
  /**
   * Nivel en la jerarquía
   *
   * - Level 1: Items principales (visibles en leftSidebar)
   * - Level 2: Sub-items (visibles en rightSidebar)
   * - Level 3: Sub-sub-items (ej: votaciones individuales)
   * - Level 4: Items más profundos (ej: enmiendas)
   *
   * @min 1
   * @max 4
   */
  level: 1 | 2 | 3 | 4;

  /**
   * Orden dentro del mismo nivel
   *
   * Se usa para ordenar items hermanos
   *
   * @min 1
   * @example 1, 2, 3, ...
   */
  order: number;

  /**
   * ID del item padre
   *
   * - Undefined si es raíz (level 1 sin padre)
   * - String si tiene padre
   *
   * @example "convocatoria" (para "convocatoria-datos-basicos")
   */
  parentId?: string;

  /**
   * Items hijos (recursivo)
   *
   * Array de FlowItems que son hijos directos de este item
   *
   * Solo usado en estructura hierarchical
   * En sequential, este array está vacío o undefined
   *
   * @example
   * ```ts
   * // Convocatoria tiene 3 children:
   * children: [
   *   { identity: { id: "convocatoria-datos-basicos" }, ... },
   *   { identity: { id: "convocatoria-accionistas" }, ... },
   *   { identity: { id: "convocatoria-citacion" }, ... }
   * ]
   * ```
   */
  children?: FlowItem[];
}
````

---

### **3. FlowItemNavigation**

```typescript
// app/types/flow-system/navigation.ts

/**
 * Información de navegación y rutas
 *
 * Define cómo navegar a este item
 */
export interface FlowItemNavigation {
  /**
   * Ruta interna de Vue Router
   *
   * Debe coincidir con la estructura de carpetas en `app/pages/`
   *
   * @example "/registro-societario/datos-principales"
   * @example "/juntas-accionistas/convocatoria/datos-basicos"
   */
  path: string;

  /**
   * URL externa (opcional)
   *
   * Si se define, al clickear el item se abre esta URL
   * en lugar de navegar con Vue Router
   *
   * Usado para:
   * - Links a documentación externa
   * - Integración con otros sistemas
   * - Salir del flujo temporalmente
   *
   * @example "https://docs.probo.cl/registro"
   * @example "https://panel.sii.cl"
   */
  href?: string;
}
```

---

### **4. FlowItemBehavior**

```typescript
// app/types/flow-system/behavior.ts

/**
 * Comportamiento del item
 *
 * Define reglas de negocio y UX
 */
export interface FlowItemBehavior {
  /**
   * Item es opcional
   *
   * Si true:
   * - Badge dice "Opcional"
   * - No bloquea siguiente paso
   * - Se puede saltar
   *
   * @default false
   * @example Duración en Registro de Sociedades
   */
  isOptional?: boolean;

  /**
   * Item está bloqueado
   *
   * Si true:
   * - No se puede clickear
   * - Aparece grisado
   * - Tooltip explica por qué está bloqueado
   *
   * Se desbloquea cuando se completa el paso anterior
   *
   * @default false
   * @example Todos los items excepto el primero empiezan bloqueados
   */
  isLocked?: boolean;

  /**
   * Requiere completarse antes de avanzar
   *
   * Si true:
   * - Se valida que el item esté completo
   * - Botón "Siguiente" deshabilitado si no está completo
   * - Siguiente item permanece bloqueado
   *
   * @default true
   */
  requiresCompletion?: boolean;
}
```

---

### **5. FlowItemRightSidebar**

````typescript
// app/types/flow-system/right-sidebar.ts

import type { FlowItem } from "./flow-item";

/**
 * Configuración del sidebar derecho
 *
 * Solo usado en Juntas de Accionistas
 */
export interface FlowItemRightSidebar {
  /**
   * Habilitar rightSidebar para este item
   *
   * Si true, al seleccionar este item se muestra
   * el rightSidebar con sus children
   *
   * @default false
   */
  enabled: boolean;

  /**
   * Título del rightSidebar
   *
   * Se muestra como header del sidebar
   *
   * @example "Pasos de Convocatoria"
   * @example "Documentos de Preparación"
   */
  title: string;

  /**
   * Items a mostrar en el rightSidebar
   *
   * Típicamente se mapean desde `hierarchy.children`
   * Pero se pueden filtrar u ordenar diferente
   *
   * @example
   * ```ts
   * items: [
   *   { identity: { id: "convocatoria-datos-basicos" }, ... },
   *   { identity: { id: "convocatoria-accionistas" }, ... }
   * ]
   * ```
   */
  items: FlowItem[];
}
````

---

### **6. FlowItemValidation**

````typescript
// app/types/flow-system/validation.ts

/**
 * Reglas de validación del item
 *
 * Define cómo validar que el item está completo
 */
export interface FlowItemValidation {
  /**
   * Item es requerido
   *
   * Si true, debe completarse para avanzar
   *
   * @default true
   */
  required: boolean;

  /**
   * Función de validación custom (opcional)
   *
   * Se ejecuta para verificar si el item está completo
   *
   * @returns true si válido, false si inválido
   * @returns string con mensaje de error si inválido
   *
   * @example
   * ```ts
   * validator: (data) => {
   *   if (!data.nombre || !data.rut) {
   *     return 'Faltan datos obligatorios'
   *   }
   *   return true
   * }
   * ```
   */
  validator?: (data: any) => boolean | string;
}
````

---

## Entities

### **7. FlowItem (Entity)**

````typescript
// app/types/flow-system/flow-item.ts

import type { FlowItemIdentity } from "./identity";
import type { FlowItemHierarchy } from "./hierarchy";
import type { FlowItemNavigation } from "./navigation";
import type { FlowItemBehavior } from "./behavior";
import type { FlowItemRightSidebar } from "./right-sidebar";
import type { FlowItemValidation } from "./validation";

/**
 * Entidad FlowItem
 *
 * Representa un item individual en la navegación del flujo
 *
 * Es la pieza fundamental del sistema de sidebars
 * Todos los items (independiente del flujo) usan esta estructura
 *
 * @example
 * ```ts
 * const datosSociedad: FlowItem = {
 *   identity: {
 *     id: 'datos-sociedad',
 *     label: 'Datos de la Sociedad',
 *     icon: 'building'
 *   },
 *   hierarchy: {
 *     level: 1,
 *     order: 1
 *   },
 *   navigation: {
 *     path: '/registro-societario/datos-principales'
 *   },
 *   behavior: {
 *     isOptional: false,
 *     isLocked: false,
 *     requiresCompletion: true
 *   },
 *   validation: {
 *     required: true
 *   }
 * }
 * ```
 */
export interface FlowItem {
  /** Información de identificación */
  identity: FlowItemIdentity;

  /** Información jerárquica */
  hierarchy: FlowItemHierarchy;

  /** Información de navegación */
  navigation: FlowItemNavigation;

  /** Comportamiento del item */
  behavior: FlowItemBehavior;

  /** Configuración del sidebar derecho (opcional) */
  rightSidebar?: FlowItemRightSidebar;

  /** Reglas de validación (opcional) */
  validation?: FlowItemValidation;

  /** Metadata custom para casos específicos */
  metadata?: Record<string, any>;
}
````

---

### **8. FlowConfig (Entity)**

````typescript
// app/types/flow-system/flow-config.ts

import type { FlowItem } from "./flow-item";

/**
 * Entidad FlowConfig
 *
 * Configuración completa de un flujo
 *
 * Define:
 * - Identidad del flujo
 * - Estructura de navegación
 * - Reglas de navegación
 * - Configuración de UI
 * - Persistencia
 * - Event handlers
 * - Metadata custom
 *
 * @example
 * ```ts
 * const registroConfig: FlowConfig = {
 *   identity: {
 *     id: 'registro-sociedades',
 *     name: 'Registro de Sociedades'
 *   },
 *   structure: {
 *     type: 'sequential',
 *     maxLevels: 1,
 *     navigation: [item1, item2, ...]
 *   },
 *   // ... resto de configuración
 * }
 * ```
 */
export interface FlowConfig {
  /**
   * Identidad del flujo
   */
  identity: {
    /** ID único del flujo */
    id: string;

    /** Nombre visible */
    name: string;

    /** Descripción (opcional) */
    description?: string;
  };

  /**
   * Estructura del flujo
   */
  structure: {
    /**
     * Tipo de navegación
     *
     * - sequential: Items en orden lineal (1→2→3)
     * - hierarchical: Items con sub-items (árbol)
     * - mixed: Combinación de ambos
     */
    type: "sequential" | "hierarchical" | "mixed";

    /**
     * Niveles máximos permitidos
     *
     * @min 1
     * @max 4
     */
    maxLevels: 1 | 2 | 3 | 4;

    /**
     * Items de navegación (Level 1)
     *
     * Array de FlowItems que conforman el flujo
     * Cada item puede tener children (Level 2, 3, 4)
     */
    navigation: FlowItem[];
  };

  /**
   * Reglas de navegación
   */
  navigationRules: {
    /**
     * Permitir saltar pasos adelante
     *
     * Si false, usuario debe completar paso actual antes de avanzar
     */
    allowJumpAhead: boolean;

    /**
     * Requiere completar pasos secuencialmente
     *
     * Si true, no se puede saltar del paso 1 al paso 5
     */
    requireSequential: boolean;

    /**
     * Desbloquear siguiente paso automáticamente
     *
     * Si true, al completar paso N, paso N+1 se desbloquea
     */
    autoUnlock: boolean;
  };

  /**
   * Configuración de UI
   */
  ui: {
    /**
     * Sidebar izquierdo (navegación principal)
     */
    leftSidebar: {
      enabled: boolean;
      collapsible: boolean;
      defaultCollapsed: boolean;
    };

    /**
     * Sidebar derecho (sub-navegación)
     */
    rightSidebar: {
      enabled: boolean;
      collapsible: boolean;
      defaultCollapsed: boolean;
    };

    /**
     * Header (opcional)
     */
    header?: {
      enabled: boolean;
      title?: string;
      showProgress: boolean;
    };

    /**
     * Footer (opcional)
     */
    footer?: {
      enabled: boolean;
      showButtons: boolean;
    };
  };

  /**
   * Persistencia de datos
   */
  persistence: {
    enabled: boolean;
    key: string;
    autosave: boolean;
    autosaveInterval?: number;
  };

  /**
   * Event handlers (callbacks)
   */
  events?: {
    onProgressUpdate?: (progress: number) => void;
    onFlowComplete?: () => void;
    onItemClick?: (itemId: string) => void;
    onItemComplete?: (itemId: string) => void;
  };

  /**
   * Metadata custom
   */
  metadata?: Record<string, any>;
}
````

---

## Zod Schemas

```typescript
// app/types/flow-system/schemas.ts

import { z } from "zod";

/**
 * Schema para FlowItemIdentity
 */
export const FlowItemIdentitySchema = z.object({
  id: z.string().min(1, "ID no puede estar vacío"),
  label: z.string().min(1, "Label no puede estar vacío"),
  description: z.string().optional(),
  icon: z.string().optional(),
  badge: z
    .object({
      text: z.string(),
      variant: z.enum(["default", "secondary", "destructive", "outline"]),
    })
    .optional(),
});

/**
 * Schema para FlowItemHierarchy
 *
 * Nota: children es lazy-evaluated para evitar recursión infinita
 */
export const FlowItemHierarchySchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    order: z.number().int().min(1),
    parentId: z.string().optional(),
    children: z.array(FlowItemSchema).optional(),
  })
);

/**
 * Schema para FlowItemNavigation
 */
export const FlowItemNavigationSchema = z.object({
  path: z.string().min(1, "Path no puede estar vacío"),
  href: z.string().url().optional(),
});

/**
 * Schema para FlowItemBehavior
 */
export const FlowItemBehaviorSchema = z.object({
  isOptional: z.boolean().optional().default(false),
  isLocked: z.boolean().optional().default(false),
  requiresCompletion: z.boolean().optional().default(true),
});

/**
 * Schema para FlowItemRightSidebar
 */
export const FlowItemRightSidebarSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    enabled: z.boolean(),
    title: z.string(),
    items: z.array(FlowItemSchema),
  })
);

/**
 * Schema para FlowItemValidation
 */
export const FlowItemValidationSchema = z.object({
  required: z.boolean(),
  validator: z.function().optional(),
});

/**
 * Schema para FlowItem (Entity)
 */
export const FlowItemSchema = z.object({
  identity: FlowItemIdentitySchema,
  hierarchy: FlowItemHierarchySchema,
  navigation: FlowItemNavigationSchema,
  behavior: FlowItemBehaviorSchema,
  rightSidebar: FlowItemRightSidebarSchema.optional(),
  validation: FlowItemValidationSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Schema para FlowConfig (Entity)
 */
export const FlowConfigSchema = z.object({
  identity: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
  }),

  structure: z.object({
    type: z.enum(["sequential", "hierarchical", "mixed"]),
    maxLevels: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    navigation: z.array(FlowItemSchema).min(1, "Debe haber al menos 1 item"),
  }),

  navigationRules: z.object({
    allowJumpAhead: z.boolean(),
    requireSequential: z.boolean(),
    autoUnlock: z.boolean(),
  }),

  ui: z.object({
    leftSidebar: z.object({
      enabled: z.boolean(),
      collapsible: z.boolean(),
      defaultCollapsed: z.boolean(),
    }),
    rightSidebar: z.object({
      enabled: z.boolean(),
      collapsible: z.boolean(),
      defaultCollapsed: z.boolean(),
    }),
    header: z
      .object({
        enabled: z.boolean(),
        title: z.string().optional(),
        showProgress: z.boolean(),
      })
      .optional(),
    footer: z
      .object({
        enabled: z.boolean(),
        showButtons: z.boolean(),
      })
      .optional(),
  }),

  persistence: z.object({
    enabled: z.boolean(),
    key: z.string(),
    autosave: z.boolean(),
    autosaveInterval: z.number().int().positive().optional(),
  }),

  events: z
    .object({
      onProgressUpdate: z.function().optional(),
      onFlowComplete: z.function().optional(),
      onItemClick: z.function().optional(),
      onItemComplete: z.function().optional(),
    })
    .optional(),

  metadata: z.record(z.any()).optional(),
});

/**
 * Validators (funciones helper)
 */

/**
 * Valida un FlowItem
 *
 * @param item - FlowItem a validar
 * @returns FlowItem validado
 * @throws ZodError si inválido
 */
export function validateFlowItem(item: unknown) {
  return FlowItemSchema.parse(item);
}

/**
 * Valida un FlowConfig
 *
 * @param config - FlowConfig a validar
 * @returns FlowConfig validado
 * @throws ZodError si inválido
 */
export function validateFlowConfig(config: unknown) {
  return FlowConfigSchema.parse(config);
}

/**
 * Valida un FlowItem sin lanzar error
 *
 * @param item - FlowItem a validar
 * @returns { success: true, data } si válido
 * @returns { success: false, error } si inválido
 */
export function safeValidateFlowItem(item: unknown) {
  return FlowItemSchema.safeParse(item);
}

/**
 * Valida un FlowConfig sin lanzar error
 *
 * @param config - FlowConfig a validar
 * @returns { success: true, data } si válido
 * @returns { success: false, error } si inválido
 */
export function safeValidateFlowConfig(config: unknown) {
  return FlowConfigSchema.safeParse(config);
}
```

---

## Helper Functions

````typescript
// app/types/flow-system/helpers.ts

import type { FlowItem } from "./flow-item";

/**
 * Aplana un árbol de FlowItems a un array flat
 *
 * Útil para:
 * - Buscar en todo el árbol
 * - Calcular progreso total
 * - Validar IDs únicos
 *
 * @param items - Array de FlowItems (puede tener children)
 * @returns Array flat de todos los items (sin children)
 *
 * @example
 * ```ts
 * const tree = [
 *   { id: 'parent', children: [
 *     { id: 'child1' },
 *     { id: 'child2', children: [
 *       { id: 'grandchild' }
 *     ]}
 *   ]}
 * ]
 *
 * const flat = flattenFlowItems(tree)
 * // ['parent', 'child1', 'child2', 'grandchild']
 * ```
 */
export function flattenFlowItems(items: FlowItem[]): FlowItem[] {
  const result: FlowItem[] = [];

  function traverse(item: FlowItem) {
    result.push(item);

    if (item.hierarchy.children) {
      item.hierarchy.children.forEach(traverse);
    }
  }

  items.forEach(traverse);
  return result;
}

/**
 * Encuentra un FlowItem por ID (DFS)
 *
 * @param items - Array de FlowItems donde buscar
 * @param id - ID del item a buscar
 * @returns FlowItem si encontrado, null si no
 *
 * @example
 * ```ts
 * const found = findFlowItemById(items, 'datos-sociedad')
 * if (found) {
 *   console.log(found.identity.label)
 * }
 * ```
 */
export function findFlowItemById(items: FlowItem[], id: string): FlowItem | null {
  for (const item of items) {
    if (item.identity.id === id) {
      return item;
    }

    if (item.hierarchy.children) {
      const found = findFlowItemById(item.hierarchy.children, id);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Obtiene todos los IDs de un árbol de FlowItems
 *
 * @param items - Array de FlowItems
 * @returns Array de IDs
 *
 * @example
 * ```ts
 * const ids = getAllFlowItemIds(items)
 * // ['datos-sociedad', 'datos-principales', ...]
 * ```
 */
export function getAllFlowItemIds(items: FlowItem[]): string[] {
  return flattenFlowItems(items).map((item) => item.identity.id);
}

/**
 * Calcula la profundidad máxima de un árbol
 *
 * @param items - Array de FlowItems
 * @returns Profundidad máxima (1-4)
 *
 * @example
 * ```ts
 * const depth = getMaxDepth(items)
 * console.log(`Máximo nivel: ${depth}`)
 * ```
 */
export function getMaxDepth(items: FlowItem[]): number {
  let maxDepth = 0;

  function traverse(item: FlowItem, depth: number) {
    maxDepth = Math.max(maxDepth, depth);

    if (item.hierarchy.children) {
      item.hierarchy.children.forEach((child) => {
        traverse(child, depth + 1);
      });
    }
  }

  items.forEach((item) => traverse(item, 1));
  return maxDepth;
}

/**
 * Cuenta el total de items (incluyendo children)
 *
 * @param items - Array de FlowItems
 * @returns Número total de items
 */
export function getTotalItemsCount(items: FlowItem[]): number {
  return flattenFlowItems(items).length;
}

/**
 * Obtiene todos los items de un nivel específico
 *
 * @param items - Array de FlowItems
 * @param level - Nivel a filtrar (1-4)
 * @returns Array de items de ese nivel
 *
 * @example
 * ```ts
 * const level1Items = getItemsByLevel(items, 1)
 * // Solo items principales
 * ```
 */
export function getItemsByLevel(items: FlowItem[], level: 1 | 2 | 3 | 4): FlowItem[] {
  return flattenFlowItems(items).filter((item) => item.hierarchy.level === level);
}

/**
 * Obtiene los children directos de un item
 *
 * @param items - Array de FlowItems donde buscar
 * @param parentId - ID del item padre
 * @returns Array de children
 *
 * @example
 * ```ts
 * const children = getChildrenOf(items, 'convocatoria')
 * // [datos-basicos, accionistas, citacion]
 * ```
 */
export function getChildrenOf(items: FlowItem[], parentId: string): FlowItem[] {
  const parent = findFlowItemById(items, parentId);
  return parent?.hierarchy.children || [];
}

/**
 * Verifica si un item tiene children
 *
 * @param item - FlowItem a verificar
 * @returns true si tiene children
 */
export function hasChildren(item: FlowItem): boolean {
  return (item.hierarchy.children?.length || 0) > 0;
}

/**
 * Obtiene el path completo de un item (incluyendo ancestros)
 *
 * @param items - Array de FlowItems
 * @param itemId - ID del item
 * @returns Array de IDs desde raíz hasta el item
 *
 * @example
 * ```ts
 * const path = getItemPath(items, 'votacion-tema-1')
 * // ['celebracion', 'celebracion-votaciones', 'votacion-tema-1']
 * ```
 */
export function getItemPath(items: FlowItem[], itemId: string): string[] {
  const path: string[] = [];

  function findPath(items: FlowItem[], targetId: string): boolean {
    for (const item of items) {
      path.push(item.identity.id);

      if (item.identity.id === targetId) {
        return true;
      }

      if (item.hierarchy.children) {
        if (findPath(item.hierarchy.children, targetId)) {
          return true;
        }
      }

      path.pop();
    }

    return false;
  }

  findPath(items, itemId);
  return path;
}
````

---

## Type Guards

````typescript
// app/types/flow-system/type-guards.ts

import type { FlowItem, FlowConfig } from "./index";

/**
 * Type guard para FlowItem
 *
 * @param obj - Objeto a verificar
 * @returns true si es FlowItem
 *
 * @example
 * ```ts
 * if (isFlowItem(obj)) {
 *   console.log(obj.identity.label)
 * }
 * ```
 */
export function isFlowItem(obj: unknown): obj is FlowItem {
  if (typeof obj !== "object" || obj === null) return false;

  const item = obj as any;

  return (
    typeof item.identity === "object" &&
    typeof item.identity.id === "string" &&
    typeof item.identity.label === "string" &&
    typeof item.hierarchy === "object" &&
    [1, 2, 3, 4].includes(item.hierarchy.level) &&
    typeof item.navigation === "object" &&
    typeof item.navigation.path === "string" &&
    typeof item.behavior === "object"
  );
}

/**
 * Type guard para FlowConfig
 *
 * @param obj - Objeto a verificar
 * @returns true si es FlowConfig
 */
export function isFlowConfig(obj: unknown): obj is FlowConfig {
  if (typeof obj !== "object" || obj === null) return false;

  const config = obj as any;

  return (
    typeof config.identity === "object" &&
    typeof config.identity.id === "string" &&
    typeof config.structure === "object" &&
    ["sequential", "hierarchical", "mixed"].includes(config.structure.type) &&
    Array.isArray(config.structure.navigation) &&
    typeof config.navigationRules === "object" &&
    typeof config.ui === "object" &&
    typeof config.persistence === "object"
  );
}

/**
 * Verifica si un item es raíz (level 1 sin padre)
 *
 * @param item - FlowItem a verificar
 * @returns true si es raíz
 */
export function isRootItem(item: FlowItem): boolean {
  return item.hierarchy.level === 1 && !item.hierarchy.parentId;
}

/**
 * Verifica si un item es hoja (sin children)
 *
 * @param item - FlowItem a verificar
 * @returns true si es hoja
 */
export function isLeafItem(item: FlowItem): boolean {
  return !item.hierarchy.children || item.hierarchy.children.length === 0;
}

/**
 * Verifica si un FlowConfig es sequential
 *
 * @param config - FlowConfig a verificar
 * @returns true si es sequential
 */
export function isSequentialFlow(config: FlowConfig): boolean {
  return config.structure.type === "sequential";
}

/**
 * Verifica si un FlowConfig es hierarchical
 *
 * @param config - FlowConfig a verificar
 * @returns true si es hierarchical
 */
export function isHierarchicalFlow(config: FlowConfig): boolean {
  return config.structure.type === "hierarchical";
}

/**
 * Verifica si un FlowConfig tiene rightSidebar habilitado
 *
 * @param config - FlowConfig a verificar
 * @returns true si rightSidebar está habilitado
 */
export function hasRightSidebar(config: FlowConfig): boolean {
  return config.ui.rightSidebar.enabled;
}
````

---

## Export Centralizado

```typescript
// app/types/flow-system/index.ts

// Value Objects
export type { FlowItemIdentity } from "./identity";
export type { FlowItemHierarchy } from "./hierarchy";
export type { FlowItemNavigation } from "./navigation";
export type { FlowItemBehavior } from "./behavior";
export type { FlowItemRightSidebar } from "./right-sidebar";
export type { FlowItemValidation } from "./validation";

// Entities
export type { FlowItem } from "./flow-item";
export type { FlowConfig } from "./flow-config";

// Zod Schemas
export {
  FlowItemIdentitySchema,
  FlowItemHierarchySchema,
  FlowItemNavigationSchema,
  FlowItemBehaviorSchema,
  FlowItemRightSidebarSchema,
  FlowItemValidationSchema,
  FlowItemSchema,
  FlowConfigSchema,
  validateFlowItem,
  validateFlowConfig,
  safeValidateFlowItem,
  safeValidateFlowConfig,
} from "./schemas";

// Helpers
export {
  flattenFlowItems,
  findFlowItemById,
  getAllFlowItemIds,
  getMaxDepth,
  getTotalItemsCount,
  getItemsByLevel,
  getChildrenOf,
  hasChildren,
  getItemPath,
} from "./helpers";

// Type Guards
export {
  isFlowItem,
  isFlowConfig,
  isRootItem,
  isLeafItem,
  isSequentialFlow,
  isHierarchicalFlow,
  hasRightSidebar,
} from "./type-guards";
```

---

## 🎯 Resumen

### **Value Objects (6):**

1. ✅ FlowItemIdentity - Identificación y visualización
2. ✅ FlowItemHierarchy - Estructura y jerarquía
3. ✅ FlowItemNavigation - Rutas y navegación
4. ✅ FlowItemBehavior - Comportamiento y reglas
5. ✅ FlowItemRightSidebar - Sidebar derecho (Juntas)
6. ✅ FlowItemValidation - Validación de completitud

### **Entities (2):**

7. ✅ FlowItem - Composición de Value Objects
8. ✅ FlowConfig - Configuración completa del flujo

### **Zod Schemas (8):**

- ✅ Schemas para cada Value Object
- ✅ Schemas para Entities
- ✅ Validators (parse, safeParse)
- ✅ Lazy evaluation para recursión

### **Helpers (9):**

- ✅ flattenFlowItems - Aplanar árbol
- ✅ findFlowItemById - Buscar por ID
- ✅ getAllFlowItemIds - Obtener todos los IDs
- ✅ getMaxDepth - Calcular profundidad
- ✅ getTotalItemsCount - Contar items
- ✅ getItemsByLevel - Filtrar por nivel
- ✅ getChildrenOf - Obtener hijos
- ✅ hasChildren - Verificar si tiene hijos
- ✅ getItemPath - Path completo del item

### **Type Guards (7):**

- ✅ isFlowItem - Verificar FlowItem
- ✅ isFlowConfig - Verificar FlowConfig
- ✅ isRootItem - Verificar raíz
- ✅ isLeafItem - Verificar hoja
- ✅ isSequentialFlow - Verificar sequential
- ✅ isHierarchicalFlow - Verificar hierarchical
- ✅ hasRightSidebar - Verificar rightSidebar

---

**Estado:** ✅ Types Completos - Listo para Implementación  
**Última Actualización:** 2 de Noviembre, 2025  
**Archivos Totales:** 10 archivos TypeScript + 1 index.ts
