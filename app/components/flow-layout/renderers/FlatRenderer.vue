<template>
  <nav class="flat-renderer">
    <FlatItem
      v-for="item in items"
      :key="item.identity.id"
      :item="item"
      :current-path="currentPath"
      :show-status-icons="showStatusIcons"
      :show-descriptions="showDescriptions"
      :allow-navigation="allowNavigation"
      @navigate="$emit('navigate', $event)"
    />
  </nav>
</template>

<script setup lang="ts">
  import type { FlowItemTree } from "~/types/flow-system/flow-item";
  import FlatItem from "./items/FlatItem.vue";

  /**
   * Props del renderizador plano
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
    (e: "navigate", item: FlowItemTree): void;
  }

  defineEmits<Emits>();
</script>

<style scoped>
  .flat-renderer {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>
