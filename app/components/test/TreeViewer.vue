<template>
  <div class="tree-viewer">
    <TreeViewerItem
      v-for="item in items"
      :key="item.identity.id"
      :item="item"
      :level="0"
      :current-path="currentPath"
    />
  </div>
</template>

<script setup lang="ts">
  import type { FlowItemTree } from "~/types/flow-system";
  import TreeViewerItem from "./TreeViewerItem.vue";

  /**
   * Props del componente
   */
  interface Props {
    items: FlowItemTree[];
    currentPath?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    currentPath: "",
  });
</script>

<style scoped>
  .tree-viewer {
    font-family: "Monaco", "Menlo", "Courier New", monospace;
    font-size: 0.875rem;
    line-height: 1.6;
  }
</style>

