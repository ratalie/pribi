<template>
  <div class="tree-item" :style="{ paddingLeft: `${level * 1.5}rem` }">
    <!-- Toggle button para children -->
    <button
      v-if="hasChildren"
      type="button"
      class="toggle-btn"
      @click="toggleExpanded"
    >
      <span class="toggle-icon" :class="{ expanded: isExpanded }">▶</span>
    </button>
    <span v-else class="no-toggle">•</span>

    <!-- Info del item -->
    <div
      class="item-info"
      :class="{
        'is-current': isCurrentItem,
        [`level-${item.hierarchy.level}`]: true,
      }"
    >
      <!-- Badge de nivel -->
      <span class="level-badge" :class="`level-${item.hierarchy.level}`">
        L{{ item.hierarchy.level }}
      </span>

      <!-- ID y Label -->
      <span class="item-id" :title="item.identity.id">
        {{ item.identity.id }}
      </span>
      <span class="item-label">
        ({{ item.identity.label }})
      </span>

      <!-- Route -->
      <span class="item-route" :title="item.navigation.route || 'No route'">
        {{ formatRoute(item.navigation.route) }}
      </span>

      <!-- Children count -->
      <span v-if="hasChildren" class="children-count">
        [{{ item.children?.length }} children]
      </span>

      <!-- Link para navegar -->
      <NuxtLink
        v-if="item.navigation.route"
        :to="item.navigation.route"
        class="nav-link"
        :class="{ active: isCurrentItem }"
      >
        →
      </NuxtLink>
    </div>

    <!-- Children recursivos -->
    <div v-if="hasChildren && isExpanded" class="children">
      <TreeViewerItem
        v-for="child in item.children"
        :key="child.identity.id"
        :item="child"
        :level="level + 1"
        :current-path="currentPath"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import type { FlowItemTree } from "~/types/flow-system";

  /**
   * Props del componente
   */
  interface Props {
    item: FlowItemTree;
    level: number;
    currentPath?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    currentPath: "",
  });

  // Estado local
  const isExpanded = ref(true); // Expandido por defecto

  // Computeds
  const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0;
  });

  const isCurrentItem = computed(() => {
    return props.item.navigation.route === props.currentPath;
  });

  // Funciones
  function toggleExpanded() {
    isExpanded.value = !isExpanded.value;
  }

  function formatRoute(route: string | undefined): string {
    if (!route) return "❌ No route";
    // Acortar ruta para mejor visualización
    const parts = route.split("/");
    return parts.slice(-2).join("/"); // Últimas 2 partes
  }
</script>

<style scoped>
  .tree-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.25rem;
  }

  .tree-item > div:first-child {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .toggle-btn {
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: hsl(var(--muted-foreground));
    transition: color 0.2s;
  }

  .toggle-btn:hover {
    color: hsl(var(--foreground));
  }

  .toggle-icon {
    display: inline-block;
    transition: transform 0.2s;
  }

  .toggle-icon.expanded {
    transform: rotate(90deg);
  }

  .no-toggle {
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsl(var(--muted-foreground));
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    flex-wrap: wrap;
    flex: 1;
  }

  .item-info.is-current {
    background-color: hsl(var(--primary) / 0.1);
    border-left: 3px solid hsl(var(--primary));
    font-weight: 600;
  }

  .level-badge {
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .level-badge.level-0 {
    background-color: hsl(var(--destructive) / 0.2);
    color: hsl(var(--destructive));
  }

  .level-badge.level-1 {
    background-color: hsl(var(--primary) / 0.2);
    color: hsl(var(--primary));
  }

  .level-badge.level-2 {
    background-color: hsl(220 70% 50% / 0.2);
    color: hsl(220 70% 50%);
  }

  .level-badge.level-3 {
    background-color: hsl(140 70% 40% / 0.2);
    color: hsl(140 70% 40%);
  }

  .level-badge.level-4 {
    background-color: hsl(280 70% 50% / 0.2);
    color: hsl(280 70% 50%);
  }

  .item-id {
    color: hsl(var(--foreground));
    font-weight: 500;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-label {
    color: hsl(var(--muted-foreground));
    font-style: italic;
  }

  .item-route {
    color: hsl(var(--muted-foreground));
    font-size: 0.75rem;
    font-family: monospace;
  }

  .children-count {
    color: hsl(var(--primary));
    font-size: 0.75rem;
    font-weight: 600;
  }

  .nav-link {
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    background-color: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
    font-size: 0.75rem;
    text-decoration: none;
    transition: background-color 0.2s;
  }

  .nav-link:hover {
    background-color: hsl(var(--secondary) / 0.8);
  }

  .nav-link.active {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  .children {
    margin-top: 0.25rem;
  }
</style>

