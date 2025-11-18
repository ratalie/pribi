<script setup lang="ts">
import type { FlowItemTree } from "~/types/flow-system";

interface Props {
  items: FlowItemTree[];
  currentPath: string;
}

const props = defineProps<Props>();

const isActive = (item: FlowItemTree) => props.currentPath === item.navigation.route;

const scrollToSection = (hash: string) => {
  if (hash) {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};
</script>

<template>
  <div class="scroll-anchor-panel">
    <div class="panel-header">
      <h3 class="panel-title">Secciones</h3>
    </div>

    <nav class="sections-list">
      <a
        v-for="item in items"
        :key="item.identity.id"
        :href="item.navigation.hash || `#${item.identity.id}`"
        :class="['section-item', { active: isActive(item) }]"
        @click.prevent="scrollToSection(item.navigation.hash || `#${item.identity.id}`)"
      >
        <span v-if="isActive(item)" class="active-indicator" />
        <span class="section-title">{{ item.identity.label }}</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
  .scroll-anchor-panel {
    flex: 1;
    padding: 32px;
    min-width: 400px;
    background: white;
  }

  .panel-header {
    margin-bottom: 16px;
  }

  .panel-title {
    font-family: var(--font-primary);
    font-size: 14px;
    font-weight: 600;
    color: #2e293d;
    margin: 0;
  }

  .sections-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .section-item {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 12px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .active-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: #3c28a4;
  }

  .section-title {
    font-family: var(--font-secondary);
    line-height: 1.5;
    transition: color 0.2s ease;
  }

  .section-item.active .section-title {
    color: #3c28a4;
  }

  .section-item:not(.active) .section-title {
    color: #2e293d;
  }
</style>
