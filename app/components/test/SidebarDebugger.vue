<template>
  <div class="sidebar-debugger">
    <h3 class="text-xl font-semibold mb-4">Sidebar Debugger</h3>

    <!-- Current Item Info -->
    <div class="debug-section mb-6 p-4 border rounded-lg bg-card">
      <h4 class="font-semibold mb-2">Current Item</h4>
      <div v-if="currentItem" class="text-sm space-y-1">
        <div><span class="font-medium">ID:</span> {{ currentItem.identity.id }}</div>
        <div><span class="font-medium">Label:</span> {{ currentItem.identity.label }}</div>
        <div>
          <span class="font-medium">Level:</span>
          <span class="px-2 py-0.5 rounded text-xs font-semibold" :class="levelClass">
            {{ currentItem.hierarchy.level }}
          </span>
        </div>
        <div><span class="font-medium">Route:</span> {{ currentItem.navigation.route }}</div>
        <div><span class="font-medium">ParentId:</span> {{ currentItem.hierarchy.parentId || "null (root)" }}</div>
        <div>
          <span class="font-medium">Has children:</span>
          {{ hasChildren ? `Yes (${currentItem.children?.length})` : "No" }}
        </div>
      </div>
      <div v-else class="text-sm text-muted-foreground">
        ❌ No currentItem detected
      </div>
    </div>

    <!-- Active Sidebars -->
    <div class="debug-section mb-6 p-4 border rounded-lg bg-card">
      <h4 class="font-semibold mb-2">Active Sidebars</h4>
      <div class="text-sm">
        <div class="mb-2">
          <span class="font-medium">Count:</span>
          {{ activeSidebars.length }} / {{ totalSidebars }}
        </div>
        
        <div v-for="sidebar in activeSidebars" :key="sidebar.id" class="mb-3 p-3 border-l-4 border-primary bg-background rounded">
          <div class="font-semibold">{{ sidebar.id }}</div>
          <div class="space-y-1 mt-1 text-xs">
            <div><span class="font-medium">Position:</span> {{ sidebar.position }}</div>
            <div><span class="font-medium">Mode:</span> {{ sidebar.mode }}</div>
            <div><span class="font-medium">Items after filter:</span> {{ sidebar.items.length }}</div>
            <div v-if="sidebar.visibilityRule">
              <span class="font-medium text-orange-500">Has visibility rule:</span>
              {{ sidebar.visibilityRule.type }}
            </div>
          </div>
        </div>

        <div v-if="inactiveSidebars.length > 0" class="mt-4">
          <h5 class="font-semibold text-muted-foreground mb-2">Inactive Sidebars:</h5>
          <div v-for="sidebar in inactiveSidebars" :key="sidebar.id" class="mb-2 p-2 border-l-4 border-muted bg-muted/20 rounded">
            <div class="text-xs">
              <div class="font-semibold text-muted-foreground">{{ sidebar.id }}</div>
              <div class="text-muted-foreground">Reason: visibilityRule returned false</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visibility Rules Evaluation -->
    <div class="debug-section p-4 border rounded-lg bg-card">
      <h4 class="font-semibold mb-2">Visibility Rules Evaluation</h4>
      <div class="text-xs space-y-2">
        <div v-for="sidebar in allSidebars" :key="sidebar.id" class="p-2 border rounded bg-background">
          <div class="font-semibold mb-1">{{ sidebar.id }}</div>
          <div v-if="!sidebar.visibilityRule" class="text-green-500">
            ✓ Always visible (no visibility rule)
          </div>
          <div v-else class="space-y-1">
            <div><span class="font-medium">Rule type:</span> {{ sidebar.visibilityRule.type }}</div>
            <div v-if="sidebar.visibilityRule.type === 'property'">
              <span class="font-medium">Path:</span> {{ sidebar.visibilityRule.path }}
            </div>
            <div v-if="sidebar.visibilityRule.type === 'route'">
              <span class="font-medium">Pattern:</span> {{ sidebar.visibilityRule.pattern }}
            </div>
            <div class="mt-1">
              <span class="font-medium">Current level:</span>
              {{ currentItem?.hierarchy.level ?? "N/A" }}
            </div>
            <div>
              <span class="font-medium">Should be visible:</span>
              <span :class="isVisible(sidebar) ? 'text-green-500' : 'text-red-500'">
                {{ isVisible(sidebar) ? "✓ YES" : "✗ NO" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import type { FlowItemTree } from "~/types/flow-system";
  import type { SidebarConfig } from "~/types/flow-layout";

  /**
   * Props del componente
   */
  interface Props {
    currentItem?: FlowItemTree;
    allSidebars: SidebarConfig[];
    activeSidebars: SidebarConfig[];
    currentPath: string;
  }

  const props = defineProps<Props>();

  // Computeds
  const totalSidebars = computed(() => props.allSidebars.length);

  const inactiveSidebars = computed(() => {
    return props.allSidebars.filter(
      (sidebar) => !props.activeSidebars.find((active) => active.id === sidebar.id)
    );
  });

  const hasChildren = computed(() => {
    return props.currentItem?.children && props.currentItem.children.length > 0;
  });

  const levelClass = computed(() => {
    const level = props.currentItem?.hierarchy.level;
    return {
      "bg-red-500/20 text-red-700": level === 0,
      "bg-blue-500/20 text-blue-700": level === 1,
      "bg-indigo-500/20 text-indigo-700": level === 2,
      "bg-green-500/20 text-green-700": level === 3,
      "bg-purple-500/20 text-purple-700": level === 4,
    };
  });

  // Funciones
  function isVisible(sidebar: SidebarConfig): boolean {
    if (!sidebar.visibilityRule) return true;

    // Simular evaluación (simplificado)
    if (sidebar.visibilityRule.type === "custom" && sidebar.visibilityRule.fn) {
      return sidebar.visibilityRule.fn({
        currentPath: props.currentPath,
        currentItem: props.currentItem,
        allItems: [],
      });
    }

    if (sidebar.visibilityRule.type === "property") {
      const level = props.currentItem?.hierarchy.level;
      // Ejemplo simplificado para juntas-steps-sidebar
      if (sidebar.id === "juntas-steps-sidebar") {
        return level !== undefined && level >= 3;
      }
    }

    return true;
  }
</script>

<style scoped>
  .sidebar-debugger {
    font-size: 0.875rem;
  }

  .debug-section {
    background-color: hsl(var(--card));
  }
</style>

