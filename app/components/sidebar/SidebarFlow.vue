<template>
  <aside
    v-if="!isCollapsed"
    class="sidebar-flow border-r bg-background"
    :style="{ width: `${config.sidebarOptions.width || 280}px` }"
  >
    <!-- Navigation Items (sin header) -->
    <nav class="p-4 space-y-2 overflow-y-auto" style="max-height: calc(100vh - 80px)">
      <FlowSidebarItem
        v-for="item in config.items"
        :key="item.identity.id"
        :item="item"
        :level="0"
      />
    </nav>

    <!-- Toggle collapse button -->
    <button
      class="collapse-btn"
      type="button"
      aria-label="Colapsar sidebar de flujo"
      @click="$emit('toggle-collapse')"
    >
      <ChevronLeft class="w-4 h-4" />
    </button>
  </aside>

  <!-- Collapsed state indicator -->
  <div
    v-else
    class="sidebar-flow-collapsed border-r bg-background flex items-center justify-center"
    style="width: 48px"
  >
    <button
      class="expand-btn"
      type="button"
      aria-label="Expandir sidebar de flujo"
      @click="$emit('toggle-collapse')"
    >
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import type { FlowConfig, FlowItemTree } from "@/types/flow-system";
  import { ChevronLeft, ChevronRight } from "lucide-vue-next";

  type FlowConfigWithTree = Omit<FlowConfig, "items"> & {
    items: FlowItemTree[];
  };

  interface Props {
    config: FlowConfigWithTree;
    isCollapsed?: boolean;
  }

  defineProps<Props>();

  defineEmits<{
    "toggle-collapse": [];
  }>();
</script>

<style scoped>
  .sidebar-flow {
    position: relative;
    overflow-y: auto;
    transition: width 0.3s ease;
    height: 100vh;
  }

  .sidebar-flow-collapsed {
    position: relative;
    transition: width 0.3s ease;
    height: 100vh;
  }

  .collapse-btn,
  .expand-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 48px;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .collapse-btn {
    right: -12px;
    border-radius: 0 8px 8px 0;
  }

  .expand-btn {
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
  }

  .collapse-btn:hover,
  .expand-btn:hover {
    background: var(--color-accent);
  }
</style>
