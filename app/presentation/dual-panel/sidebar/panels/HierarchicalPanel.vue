<script setup lang="ts">
import { toRefs } from "vue";
import type { FlowItemTree } from "~/types/flow-system";
import HierarchicalItem from "../shared/HierarchicalItem.vue";

interface Props {
  items: FlowItemTree[];
  currentPath: string;
  title?: string;
  showTitle?: boolean;
  showLevelBadges?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  showTitle: false,
  showLevelBadges: false,
});

const { items, currentPath, title, showTitle, showLevelBadges } = toRefs(props);
</script>

<template>
  <div class="hierarchical-panel">
    <h3 v-if="showTitle && title" class="panel-title">{{ title }}</h3>

    <div class="items-list">
      <HierarchicalItem
        v-for="(item, index) in items"
        :key="item.identity.id"
        :item="item"
        :current-path="currentPath"
        :level="0"
        :show-level-badge="showLevelBadges"
        :is-last="index === items.length - 1"
      />
    </div>

    <div v-if="items.length === 0" class="empty-state">
      <p class="text-gray-500 text-sm">No hay items disponibles</p>
    </div>
  </div>
</template>

<style scoped>
  .hierarchical-panel {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .panel-title {
    font-family: var(--font-primary);
    font-weight: 600;
    font-size: 18px;
    color: #1f2937;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .empty-state {
    padding: 24px;
    text-align: center;
  }
</style>
