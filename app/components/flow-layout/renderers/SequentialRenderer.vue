<template>
  <nav class="sequential-renderer">
    <SequentialItem
      v-for="(item, index) in items"
      :key="item.identity.id"
      :item="item"
      :index="index"
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
  import SequentialItem from "./items/SequentialItem.vue";

  /**
   * Props del renderizador secuencial
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
  .sequential-renderer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
