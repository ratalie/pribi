import type { NavigationStep } from "~/types/navigationSteps";
import type { FlowItemTree } from "~/types/flow-system";
import { useFlowProgressStore } from "~/stores/flowProgress.store";

export function flowConfigToSteps(
  items: FlowItemTree[],
  currentPath: string,
  options?: {
    includeChildren?: boolean;
    maxLevel?: number;
    startLevel?: number;
    flowId?: string;
  }
): NavigationStep[] {
  const steps: NavigationStep[] = [];
  const includeChildren = options?.includeChildren ?? false;
  const maxLevel = options?.maxLevel ?? Infinity;
  const startLevel = options?.startLevel ?? 0;
  const flowId = options?.flowId;
  const progressStore = useFlowProgressStore();

  function flattenTree(items: FlowItemTree[], parentCompleted: boolean = false) {
    for (const item of items) {
      const level = item.hierarchy.level;

      if (level < startLevel || level > maxLevel) {
        if (includeChildren && item.children && item.children.length > 0) {
          flattenTree(item.children, parentCompleted || isItemCompleted(item));
        }
        continue;
      }

      const storeStatus = flowId ? progressStore.getStepStatus(flowId, item.identity.id) : undefined;
      const status = storeStatus ?? determineStatus(item, currentPath, parentCompleted);

      const metadataDescription = item.metadata?.description;
      const stepDescription = typeof metadataDescription === "string"
        ? metadataDescription
        : `Completa ${item.identity.label}`;

      const step: NavigationStep = {
        title: item.identity.label,
        description: stepDescription,
        status,
        route: item.navigation.route,
        hash: item.navigation.hash,
        isCategory: item.identity.isCategory || false,
        level: item.hierarchy.level,
      };

      steps.push(step);

      if (includeChildren && item.children && item.children.length > 0) {
        flattenTree(item.children, status === "completed");
      }
    }
  }

  flattenTree(items);
  return steps;
}

function determineStatus(
  item: FlowItemTree,
  currentPath: string,
  parentCompleted: boolean = false
): NavigationStep["status"] {
  if (item.behavior.isCompleted) {
    return "completed";
  }

  if (item.navigation.route === currentPath) {
    return "current";
  }

  return "empty";
}

function isItemCompleted(item: FlowItemTree): boolean {
  return item.behavior.isCompleted === true;
}

export function childrenToSteps(
  item: FlowItemTree | undefined,
  currentPath: string
): NavigationStep[] {
  if (!item || !item.children || item.children.length === 0) {
    return [];
  }

  return flowConfigToSteps(item.children, currentPath, {
    includeChildren: true,
  });
}

export function siblingsToSteps(
  items: FlowItemTree[],
  currentItem: FlowItemTree | undefined,
  currentPath: string
): NavigationStep[] {
  if (!currentItem) return [];

  const parentId = currentItem.hierarchy.parentId;

  if (!parentId) {
    return flowConfigToSteps(items, currentPath, {
      maxLevel: currentItem.hierarchy.level,
    });
  }

  const parent = findItemById(items, parentId);
  if (!parent || !parent.children) return [];

  return flowConfigToSteps(parent.children, currentPath, {
    includeChildren: false,
  });
}

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
