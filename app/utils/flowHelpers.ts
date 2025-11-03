/**
 * Flow Helpers
 *
 * Utilidades para trabajar con FlowConfigs y FlowItems
 */

import type { FlowItem, FlowItemTree } from "@/types/flow-system";

/**
 * Convierte un array de FlowItems planos en FlowItemTree
 * Por ahora, simplemente agrega la propiedad children vacía
 * TODO: Implementar construcción de árbol jerárquico completo basado en parentId
 *
 * @param items Array de FlowItems
 * @returns Array de FlowItemTree
 */
export function buildFlowItemTree(items: FlowItem[]): FlowItemTree[] {
  return items.map((item) => ({
    ...item,
    children: [] as FlowItemTree[],
  }));
}

/**
 * Encuentra un FlowItem por su ruta
 *
 * @param items Array de FlowItems
 * @param route Ruta a buscar
 * @returns FlowItem encontrado o undefined
 */
export function findItemByRoute(items: FlowItem[], route: string): FlowItem | undefined {
  return items.find((item) => item.navigation.route === route);
}

/**
 * Calcula el progreso del flujo basado en items completados
 *
 * @param items Array de FlowItems
 * @returns Porcentaje de completación (0-100)
 */
export function calculateFlowProgress(items: FlowItem[]): number {
  if (items.length === 0) return 0;

  const completedCount = items.filter((item) => item.behavior.isCompleted).length;
  return Math.round((completedCount / items.length) * 100);
}
