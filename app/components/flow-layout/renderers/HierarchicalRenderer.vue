<template>
  <nav class="hierarchical-renderer">
    <HierarchicalItem
      v-for="item in items"
      :key="item.identity.id"
      :item="item"
      :level="level"
      :current-path="currentPath"
      :show-status-icons="showStatusIcons"
      :show-descriptions="showDescriptions"
      :allow-navigation="allowNavigation"
      @navigate="$emit('navigate', $event)"
      @toggle="$emit('toggle', $event)"
    />
  </nav>
</template>

<script setup lang="ts">
  import type { FlowItemTree } from "~/types/flow-system/flow-item";
  import HierarchicalItem from "./items/HierarchicalItem.vue";

  /**
   * Props del renderizador jerárquico
   */
  interface Props {
    items: FlowItemTree[];
    currentPath?: string;
    level?: number;
    showStatusIcons?: boolean;
    showDescriptions?: boolean;
    allowNavigation?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    currentPath: "",
    level: 0,
    showStatusIcons: true,
    showDescriptions: false,
    allowNavigation: true,
  });

  /**
   * Emits
   */
  interface Emits {
    (e: "navigate" | "toggle", item: FlowItemTree): void;
  }

  defineEmits<Emits>();
</script>

<style scoped>
  .hierarchical-renderer {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>
