<template>
  <aside
    class="flow-sidebar border-r bg-background"
    :style="{ width: `${config.sidebarOptions.width}px` }"
  >
    <!-- Header -->
    <div v-if="config.sidebarOptions.showHeader" class="p-4 border-b">
      <h2 class="text-lg font-semibold">
        {{ config.sidebarOptions.headerTitle || config.name }}
      </h2>
      <p class="text-xs text-muted-foreground mt-1">
        {{ config.description }}
      </p>
    </div>

    <!-- Navigation Items -->
    <nav class="p-4 space-y-2 overflow-y-auto" style="max-height: calc(100vh - 120px)">
      <FlowSidebarItem
        v-for="item in config.items"
        :key="item.identity.id"
        :item="item"
        :level="0"
      />
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import type { FlowConfig, FlowItemTree } from "@/types/flow-system";

  type FlowConfigWithTree = Omit<FlowConfig, "items"> & {
    items: FlowItemTree[];
  };

  interface Props {
    config: FlowConfigWithTree;
  }

  defineProps<Props>();
</script>

<style scoped>
  .flow-sidebar {
    height: 100vh;
    position: sticky;
    top: 0;
    overflow-y: auto;
  }
</style>
