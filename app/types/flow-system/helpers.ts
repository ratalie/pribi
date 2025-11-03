/**
 * Helper Functions
 *
 * Funciones utilitarias para trabajar con FlowItems y FlowConfigs.
 *
 * @module Helpers
 */

import { FlowItemType } from "./enums";
import type { FlowConfig } from "./flow-config";
import type { FlowItem, FlowItemTree } from "./flow-item";

// ============================================================================
// BÚSQUEDA Y FILTRADO
// ============================================================================

/**
 * Buscar FlowItem por ID
 *
 * @param items - Array de FlowItems
 * @param id - ID a buscar
 * @returns FlowItem encontrado o undefined
 *
 * @example
 * ```typescript
 * const item = findItemById(flowConfig.items, 'paso-1');
 * ```
 */
export function findItemById(items: FlowItem[], id: string): FlowItem | undefined {
  return items.find((item) => item.identity.id === id);
}

/**
 * Buscar múltiples FlowItems por IDs
 *
 * @param items - Array de FlowItems
 * @param ids - Array de IDs a buscar
 * @returns Array de FlowItems encontrados
 *
 * @example
 * ```typescript
 * const items = findItemsByIds(flowConfig.items, ['paso-1', 'paso-2']);
 * ```
 */
export function findItemsByIds(items: FlowItem[], ids: string[]): FlowItem[] {
  return items.filter((item) => ids.includes(item.identity.id));
}

/**
 * Filtrar FlowItems por tipo
 *
 * @param items - Array de FlowItems
 * @param type - Tipo a filtrar
 * @returns Array de FlowItems del tipo especificado
 *
 * @example
 * ```typescript
 * const sections = filterItemsByType(flowConfig.items, FlowItemType.SECTION);
 * ```
 */
export function filterItemsByType(items: FlowItem[], type: FlowItemType): FlowItem[] {
  return items.filter((item) => item.identity.type === type);
}

/**
 * Filtrar FlowItems por nivel jerárquico
 *
 * @param items - Array de FlowItems
 * @param level - Nivel a filtrar
 * @returns Array de FlowItems del nivel especificado
 *
 * @example
 * ```typescript
 * const rootItems = filterItemsByLevel(flowConfig.items, 0);
 * ```
 */
export function filterItemsByLevel(items: FlowItem[], level: number): FlowItem[] {
  return items.filter((item) => item.hierarchy.level === level);
}

/**
 * Obtener items raíz (level 0)
 *
 * @param items - Array de FlowItems
 * @returns Array de FlowItems raíz
 *
 * @example
 * ```typescript
 * const roots = getRootItems(flowConfig.items);
 * ```
 */
export function getRootItems(items: FlowItem[]): FlowItem[] {
  return filterItemsByLevel(items, 0);
}

/**
 * Obtener hijos directos de un item
 *
 * @param items - Array de FlowItems
 * @param parentId - ID del item padre
 * @returns Array de FlowItems hijos
 *
 * @example
 * ```typescript
 * const children = getChildrenOf(flowConfig.items, 'seccion-1');
 * ```
 */
export function getChildrenOf(items: FlowItem[], parentId: string): FlowItem[] {
  return items
    .filter((item) => item.hierarchy.parentId === parentId)
    .sort((a, b) => a.hierarchy.order - b.hierarchy.order);
}

// ============================================================================
// MANIPULACIÓN DE JERARQUÍA
// ============================================================================

/**
 * Construir árbol completo de FlowItems
 *
 * Convierte un array plano de FlowItems en una estructura de árbol
 * con hijos anidados.
 *
 * @param items - Array plano de FlowItems
 * @returns Array de FlowItemTree (solo raíces con hijos anidados)
 *
 * @example
 * ```typescript
 * const tree = buildItemTree(flowConfig.items);
 * // tree[0].children[0].children...
 * ```
 */
export function buildItemTree(items: FlowItem[]): FlowItemTree[] {
  const itemMap = new Map<string, FlowItemTree>();

  // Crear mapa de items
  items.forEach((item) => {
    itemMap.set(item.identity.id, { ...item, children: [] });
  });

  const roots: FlowItemTree[] = [];

  // Construir árbol
  itemMap.forEach((item) => {
    if (item.hierarchy.parentId === null) {
      roots.push(item);
    } else {
      const parent = itemMap.get(item.hierarchy.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      }
    }
  });

  // Ordenar hijos en cada nivel
  const sortChildren = (node: FlowItemTree) => {
    if (node.children && node.children.length > 0) {
      node.children.sort((a, b) => a.hierarchy.order - b.hierarchy.order);
      node.children.forEach(sortChildren);
    }
  };

  roots.forEach(sortChildren);
  roots.sort((a, b) => a.hierarchy.order - b.hierarchy.order);

  return roots;
}

/**
 * Aplanar árbol de FlowItems a array
 *
 * Convierte un árbol de FlowItems en un array plano.
 * Útil para búsquedas y operaciones batch.
 *
 * @param tree - Array de FlowItemTree
 * @returns Array plano de FlowItem
 *
 * @example
 * ```typescript
 * const flat = flattenItemTree(tree);
 * ```
 */
export function flattenItemTree(tree: FlowItemTree[]): FlowItem[] {
  const result: FlowItem[] = [];

  const traverse = (node: FlowItemTree) => {
    // Añadir nodo sin children (volver a FlowItem)
    const { children, ...flowItem } = node;
    result.push(flowItem as FlowItem);

    // Procesar hijos
    if (node.children) {
      node.children.forEach(traverse);
    }
  };

  tree.forEach(traverse);
  return result;
}

/**
 * Obtener todos los ancestros de un item
 *
 * @param items - Array de FlowItems
 * @param itemId - ID del item
 * @returns Array de FlowItems ancestros (del más cercano al más lejano)
 *
 * @example
 * ```typescript
 * const ancestors = getAncestors(flowConfig.items, 'paso-1-1-1');
 * // ['paso-1-1', 'paso-1', 'seccion-1']
 * ```
 */
export function getAncestors(items: FlowItem[], itemId: string): FlowItem[] {
  const ancestors: FlowItem[] = [];
  let currentItem = findItemById(items, itemId);

  while (currentItem && currentItem.hierarchy.parentId !== null) {
    const parent = findItemById(items, currentItem.hierarchy.parentId);
    if (parent) {
      ancestors.push(parent);
      currentItem = parent;
    } else {
      break;
    }
  }

  return ancestors;
}

/**
 * Obtener todos los descendientes de un item
 *
 * @param items - Array de FlowItems
 * @param itemId - ID del item
 * @returns Array de FlowItems descendientes
 *
 * @example
 * ```typescript
 * const descendants = getDescendants(flowConfig.items, 'seccion-1');
 * ```
 */
export function getDescendants(items: FlowItem[], itemId: string): FlowItem[] {
  const descendants: FlowItem[] = [];
  const children = getChildrenOf(items, itemId);

  children.forEach((child) => {
    descendants.push(child);
    descendants.push(...getDescendants(items, child.identity.id));
  });

  return descendants;
}

// ============================================================================
// ESTADO Y PROGRESO
// ============================================================================

/**
 * Calcular progreso del flujo
 *
 * @param items - Array de FlowItems
 * @returns Objeto con estadísticas de progreso
 *
 * @example
 * ```typescript
 * const progress = calculateProgress(flowConfig.items);
 * console.log(progress.percentage); // 75
 * ```
 */
export function calculateProgress(items: FlowItem[]) {
  const total = items.filter(
    (item) => item.identity.type === FlowItemType.STEP && !item.behavior.isOptional
  ).length;

  const completed = items.filter(
    (item) =>
      item.identity.type === FlowItemType.STEP &&
      !item.behavior.isOptional &&
      item.behavior.isCompleted
  ).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    remaining: total - completed,
    percentage,
  };
}

/**
 * Obtener item activo
 *
 * @param items - Array de FlowItems
 * @returns FlowItem activo o undefined
 *
 * @example
 * ```typescript
 * const active = getActiveItem(flowConfig.items);
 * ```
 */
export function getActiveItem(items: FlowItem[]): FlowItem | undefined {
  return items.find((item) => item.behavior.isActive);
}

/**
 * Obtener siguiente item no completado
 *
 * @param items - Array de FlowItems
 * @param currentItemId - ID del item actual (opcional)
 * @returns FlowItem siguiente o undefined
 *
 * @example
 * ```typescript
 * const next = getNextIncompleteItem(flowConfig.items, 'paso-1');
 * ```
 */
export function getNextIncompleteItem(
  items: FlowItem[],
  currentItemId?: string
): FlowItem | undefined {
  const steps = items
    .filter((item) => item.identity.type === FlowItemType.STEP)
    .sort((a, b) => {
      // Ordenar por nivel y luego por order
      if (a.hierarchy.level !== b.hierarchy.level) {
        return a.hierarchy.level - b.hierarchy.level;
      }
      return a.hierarchy.order - b.hierarchy.order;
    });

  if (!currentItemId) {
    // Retornar primer item no completado
    return steps.find((item) => !item.behavior.isCompleted);
  }

  // Encontrar índice del item actual
  const currentIndex = steps.findIndex((item) => item.identity.id === currentItemId);

  if (currentIndex === -1) {
    return steps.find((item) => !item.behavior.isCompleted);
  }

  // Buscar siguiente no completado
  for (let i = currentIndex + 1; i < steps.length; i++) {
    const step = steps[i];
    if (step && !step.behavior.isCompleted) {
      return step;
    }
  }

  return undefined;
}

// ============================================================================
// VALIDACIÓN
// ============================================================================

/**
 * Verificar si un item puede ser navegado
 *
 * Considera: isDisabled, dependencias, validaciones, etc.
 *
 * @param item - FlowItem a verificar
 * @param allItems - Array de todos los FlowItems (para check de dependencias)
 * @returns true si se puede navegar
 *
 * @example
 * ```typescript
 * const canNavigate = canNavigateToItem(item, flowConfig.items);
 * ```
 */
export function canNavigateToItem(item: FlowItem, allItems: FlowItem[]): boolean {
  // Si está deshabilitado, no se puede navegar
  if (item.behavior.isDisabled) {
    return false;
  }

  // Si no es visible, no se puede navegar
  if (!item.behavior.isVisible) {
    return false;
  }

  // Verificar dependencias
  if (item.validation.dependsOn && item.validation.dependsOn.length > 0) {
    const dependencies = findItemsByIds(allItems, item.validation.dependsOn);
    const allDependenciesCompleted = dependencies.every((dep) => dep.behavior.isCompleted);

    if (!allDependenciesCompleted) {
      return false;
    }
  }

  return true;
}

/**
 * Verificar si el flujo está completado
 *
 * @param items - Array de FlowItems
 * @returns true si todos los items obligatorios están completados
 *
 * @example
 * ```typescript
 * const isDone = isFlowCompleted(flowConfig.items);
 * ```
 */
export function isFlowCompleted(items: FlowItem[]): boolean {
  const requiredItems = items.filter(
    (item) => item.identity.type === FlowItemType.STEP && !item.behavior.isOptional
  );

  return requiredItems.every((item) => item.behavior.isCompleted);
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Clonar profundamente un FlowItem
 *
 * @param item - FlowItem a clonar
 * @returns Nuevo FlowItem clonado
 *
 * @example
 * ```typescript
 * const cloned = cloneFlowItem(originalItem);
 * ```
 */
export function cloneFlowItem(item: FlowItem): FlowItem {
  return JSON.parse(JSON.stringify(item));
}

/**
 * Clonar profundamente un FlowConfig
 *
 * @param config - FlowConfig a clonar
 * @returns Nuevo FlowConfig clonado
 *
 * @example
 * ```typescript
 * const cloned = cloneFlowConfig(originalConfig);
 * ```
 */
export function cloneFlowConfig(config: FlowConfig): FlowConfig {
  return JSON.parse(JSON.stringify(config));
}

/**
 * Merge parcial de FlowItem
 *
 * Útil para actualizaciones parciales.
 *
 * @param original - FlowItem original
 * @param updates - Cambios a aplicar
 * @returns FlowItem actualizado
 *
 * @example
 * ```typescript
 * const updated = mergeFlowItem(item, {
 *   behavior: { isCompleted: true }
 * });
 * ```
 */
export function mergeFlowItem(original: FlowItem, updates: Partial<FlowItem>): FlowItem {
  return {
    ...original,
    ...updates,
    identity: { ...original.identity, ...updates.identity },
    hierarchy: { ...original.hierarchy, ...updates.hierarchy },
    navigation: { ...original.navigation, ...updates.navigation },
    behavior: { ...original.behavior, ...updates.behavior },
    rightSidebar: { ...original.rightSidebar, ...updates.rightSidebar },
    validation: { ...original.validation, ...updates.validation },
  };
}
