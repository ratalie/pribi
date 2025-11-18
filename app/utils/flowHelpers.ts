/**
 * Flow Helpers
 *
 * Utilidades para trabajar con FlowConfigs y FlowItems
 */

import type { FlowItem, FlowItemTree } from "@/types/flow-system";

/**
 * Convierte un array de FlowItems planos en un árbol jerárquico (FlowItemTree)
 *
 * Algoritmo:
 * 1. Crear un mapa de items por ID para acceso rápido
 * 2. Iterar los items y construir relaciones parent-child usando parentId
 * 3. Devolver solo los items raíz (parentId === null)
 *
 * La jerarquía se construye basándose en:
 * - item.hierarchy.parentId: ID del padre (null = raíz)
 * - item.hierarchy.children: Array de IDs de hijos
 *
 * Ejemplo de entrada (flat):
 * [
 *   { id: "puntos-acuerdo", parentId: null, children: ["aumento-capital"] },
 *   { id: "aumento-capital", parentId: "puntos-acuerdo", children: ["aporte-dinerario"] },
 *   { id: "aporte-dinerario", parentId: "aumento-capital", children: [] }
 * ]
 *
 * Ejemplo de salida (tree):
 * [
 *   {
 *     id: "puntos-acuerdo",
 *     children: [
 *       {
 *         id: "aumento-capital",
 *         children: [
 *           { id: "aporte-dinerario", children: [] }
 *         ]
 *       }
 *     ]
 *   }
 * ]
 *
 * @param items Array de FlowItems planos
 * @returns Array de FlowItemTree (solo items raíz con children anidados)
 */
export function buildFlowItemTree(items: FlowItem[]): FlowItemTree[] {
  // Paso 1: Crear un mapa de items por ID para acceso O(1)
  const itemMap = new Map<string, FlowItemTree>();

  // Inicializar todos los items con children vacío
  items.forEach((item) => {
    itemMap.set(item.identity.id, {
      ...item,
      children: [] as FlowItemTree[],
    });
  });

  // Paso 2: Construir relaciones parent-child
  const roots: FlowItemTree[] = [];

  items.forEach((item) => {
    const currentItem = itemMap.get(item.identity.id);
    if (!currentItem) return;

    const parentId = item.hierarchy.parentId;

    if (parentId === null || parentId === undefined) {
      // Item raíz (Nivel 0)
      roots.push(currentItem);
    } else {
      // Item hijo - agregar al array children del padre
      const parent = itemMap.get(parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(currentItem);
      } else {
        // Si el padre no existe, tratarlo como raíz
        // (puede pasar si hay inconsistencias en los datos)
        console.warn(
          `[buildFlowItemTree] Padre "${parentId}" no encontrado para item "${item.identity.id}". Tratando como raíz.`
        );
        roots.push(currentItem);
      }
    }
  });

  // Paso 3: Ordenar items en cada nivel por hierarchy.order
  const sortByOrder = (items: FlowItemTree[]): FlowItemTree[] => {
    return items
      .sort((a, b) => a.hierarchy.order - b.hierarchy.order)
      .map((item) => ({
        ...item,
        children: item.children ? sortByOrder(item.children) : [],
      }));
  };

  return sortByOrder(roots);
}

/**
 * Encuentra un FlowItem por su ruta (recursivo)
 *
 * @param items Array de FlowItemTree (puede ser jerárquico)
 * @param route Ruta a buscar
 * @returns FlowItemTree encontrado o undefined
 */
export function findItemByRoute(
  items: FlowItemTree[],
  route: string
): FlowItemTree | undefined {
  for (const item of items) {
    // Verificar el item actual
    if (item.navigation.route === route) {
      return item;
    }

    // Buscar recursivamente en children
    if (item.children && item.children.length > 0) {
      const found = findItemByRoute(item.children, route);
      if (found) return found;
    }
  }

  return undefined;
}

/**
 * Calcula el progreso del flujo basado en items completados (recursivo)
 *
 * @param items Array de FlowItemTree (puede ser jerárquico)
 * @returns Porcentaje de completación (0-100)
 */
export function calculateFlowProgress(items: FlowItemTree[]): number {
  let totalCount = 0;
  let completedCount = 0;

  const countItems = (itemList: FlowItemTree[]) => {
    itemList.forEach((item) => {
      totalCount++;
      if (item.behavior.isCompleted) {
        completedCount++;
      }
      // Contar recursivamente children
      if (item.children && item.children.length > 0) {
        countItems(item.children);
      }
    });
  };

  countItems(items);

  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
}
