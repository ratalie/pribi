/**
 * Adaptador: FlowConfig → NavigationStep[]
 * 
 * Convierte nuestro sistema de FlowConfig (jerarquías 0-4) al formato
 * NavigationStep[] usado por Registro de Sociedades (flat list con status)
 */

import type { NavigationStep } from "~/types/navigationSteps";
import type { FlowItemTree } from "~/types/flow-system";
import { useFlowProgressStore } from "~/stores/flowProgress.store";

/**
 * Convierte un FlowItemTree (con jerarquía) a lista flat de NavigationStep[]
 * 
 * @param items - Árbol de FlowItems
 * @param currentPath - Ruta actual para determinar estado
 * @param options - Opciones de conversión
 * @returns NavigationStep[] (lista flat con status)
 */
export function flowConfigToSteps(
  items: FlowItemTree[],
  currentPath: string,
  options?: {
    includeChildren?: boolean; // Si true, incluye hijos en la lista flat
    maxLevel?: number; // Nivel máximo a incluir (ej: 2 para solo nivel 0-2)
    startLevel?: number; // Nivel mínimo a incluir (ej: 3 para solo nivel 3+)
    flowId?: string; // Identificador del flujo para leer estados desde el store
  }
): NavigationStep[] {
  const steps: NavigationStep[] = [];
  const includeChildren = options?.includeChildren ?? false;
  const maxLevel = options?.maxLevel ?? Infinity;
  const startLevel = options?.startLevel ?? 0;
  const flowId = options?.flowId;
  const progressStore = useFlowProgressStore();

  // Función recursiva para aplanar el árbol
  function flattenTree(items: FlowItemTree[], parentCompleted: boolean = false) {
    for (const item of items) {
      const level = item.hierarchy.level;

      // Filtrar por nivel si está configurado
      if (level < startLevel || level > maxLevel) {
        // Pero seguir recursivamente si tiene hijos que podrían cumplir
        if (includeChildren && item.children && item.children.length > 0) {
          flattenTree(item.children, parentCompleted || isItemCompleted(item));
        }
        continue;
      }

      // Determinar el status del item
      const storeStatus = flowId ? progressStore.getStepStatus(flowId, item.identity.id) : undefined;
      const status = storeStatus ?? determineStatus(item, currentPath, parentCompleted);

      // Crear NavigationStep
      const step: NavigationStep = {
        title: item.identity.label,
        description: item.behavior.description || `Completa ${item.identity.label}`,
        status,
        route: item.navigation.route,
        hash: item.navigation.hash,
        isCategory: item.identity.isCategory || false,  // Para separadores visuales
        level: item.hierarchy.level,  // Para determinar tamaño de círculo
      };

      steps.push(step);

      // Si includeChildren, agregar hijos recursivamente
      if (includeChildren && item.children && item.children.length > 0) {
        flattenTree(item.children, status === "completed");
      }
    }
  }

  flattenTree(items);
  return steps;
}

/**
 * Determina el status de un FlowItemTree
 * 
 * @param item - FlowItemTree a evaluar
 * @param currentPath - Ruta actual
 * @param parentCompleted - Si el padre está completado
 * @returns Status del item
 */
function determineStatus(
  item: FlowItemTree,
  currentPath: string,
  parentCompleted: boolean = false
): NavigationStep["status"] {
  // 1. Completado: behavior.isCompleted = true
  if (item.behavior.isCompleted) {
    return "completed";
  }

  // 2. Actual: route === currentPath
  if (item.navigation.route === currentPath) {
    return "current";
  }

  // 3. Bloqueado: padre no completado (opcional, por ahora no)
  // if (!parentCompleted && item.hierarchy.level > 0) {
  //   return "locked";
  // }

  // 4. Vacío: default
  return "empty";
}

/**
 * Verifica si un item está completado
 */
function isItemCompleted(item: FlowItemTree): boolean {
  return item.behavior.isCompleted === true;
}

/**
 * Convierte un FlowItemTree específico y sus hijos a NavigationStep[]
 * Útil para el sidebar derecho contextual
 * 
 * @param item - Item padre
 * @param currentPath - Ruta actual
 * @returns NavigationStep[] de los hijos
 */
export function childrenToSteps(
  item: FlowItemTree | undefined,
  currentPath: string
): NavigationStep[] {
  if (!item || !item.children || item.children.length === 0) {
    return [];
  }

  return flowConfigToSteps(item.children, currentPath, {
    includeChildren: true, // Incluir todos los niveles de hijos
  });
}

/**
 * Convierte hermanos (siblings) de un item a NavigationStep[]
 * Útil para mostrar opciones del mismo nivel
 * 
 * @param items - Árbol completo
 * @param currentItem - Item actual
 * @param currentPath - Ruta actual
 * @returns NavigationStep[] de los hermanos
 */
export function siblingsToSteps(
  items: FlowItemTree[],
  currentItem: FlowItemTree | undefined,
  currentPath: string
): NavigationStep[] {
  if (!currentItem) return [];

  const parentId = currentItem.hierarchy.parentId;

  // Si no tiene padre, los hermanos son los items del nivel raíz
  if (!parentId) {
    return flowConfigToSteps(items, currentPath, {
      maxLevel: currentItem.hierarchy.level,
    });
  }

  // Buscar el padre en el árbol
  const parent = findItemById(items, parentId);
  if (!parent || !parent.children) return [];

  // Convertir los hijos del padre (hermanos del item actual)
  return flowConfigToSteps(parent.children, currentPath, {
    includeChildren: false,
  });
}

/**
 * Busca un item por ID en el árbol
 */
function findItemById(
  items: FlowItemTree[],
  id: string
): FlowItemTree | undefined {
  for (const item of items) {
    if (item.identity.id === id) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Convierte items de un nivel específico a NavigationStep[]
 * 
 * @param items - Árbol completo
 * @param level - Nivel a extraer (ej: 2 para solo nivel 2)
 * @param currentPath - Ruta actual
 * @returns NavigationStep[] del nivel especificado
 */
export function levelToSteps(
  items: FlowItemTree[],
  level: number,
  currentPath: string
): NavigationStep[] {
  return flowConfigToSteps(items, currentPath, {
    startLevel: level,
    maxLevel: level,
    includeChildren: false,
  });
}

