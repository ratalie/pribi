<template>
  <div class="hierarchical-item" :class="itemClasses" :style="{ '--item-level': level }">
    <div class="item-content" @click="handleClick">
      <!-- Expand/Collapse Icon -->
      <button
        v-if="hasChildren"
        type="button"
        class="expand-icon"
        :aria-expanded="isExpanded"
        @click.stop="toggleExpand"
      >
        <span :class="{ rotated: isExpanded }">▶</span>
      </button>

      <!-- Status Icon -->
      <span v-if="showStatusIcons" class="status-icon">
        <CheckIcon v-if="item.behavior.isCompleted" class="w-4 h-4 text-green-600" />
        <span v-else-if="item.behavior.isActive" class="w-4 h-4 text-blue-600">◉</span>
        <span v-else class="w-4 h-4 text-gray-400">○</span>
      </span>

      <!-- Label -->
      <span class="item-label">{{ item.identity.label }}</span>
    </div>

    <!-- Children (recursive) -->
    <div v-if="hasChildren && isExpanded" class="children-container">
      <HierarchicalItem
        v-for="child in item.children"
        :key="child.identity.id"
        :item="child"
        :level="level + 1"
        :current-path="currentPath"
        :show-status-icons="showStatusIcons"
        :show-descriptions="showDescriptions"
        :allow-navigation="allowNavigation"
        @navigate="$emit('navigate', $event)"
        @toggle="$emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import CheckIcon from "~/components/flow-layout/CheckIcon.vue";
  import type { FlowItemTree } from "~/types/flow-system/flow-item";

  /**
   * Props
   */
  interface Props {
    item: FlowItemTree;
    level: number;
    currentPath?: string;
    showStatusIcons?: boolean;
    showDescriptions?: boolean;
    allowNavigation?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    currentPath: "",
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

  const emit = defineEmits<Emits>();

  // Estado local
  const isExpanded = ref(true);

  // Computeds
  const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0;
  });

  const isActive = computed(() => {
    return props.item.navigation.route === props.currentPath;
  });

  const itemClasses = computed(() => ({
    "is-active": isActive.value,
    "is-expanded": isExpanded.value,
    "has-children": hasChildren.value,
    [`level-${props.level}`]: true,
  }));

  // Methods
  function handleClick() {
    if (props.allowNavigation) {
      emit("navigate", props.item);
    }
  }

  function toggleExpand() {
    isExpanded.value = !isExpanded.value;
    emit("toggle", props.item);
  }
</script>

<style scoped>
  .hierarchical-item {
    display: flex;
    flex-direction: column;
  }

  .item-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    padding-left: calc(0.75rem + var(--item-level, 0) * 1.25rem);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .item-content:hover {
    background-color: hsl(var(--accent));
  }

  .is-active > .item-content {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    font-weight: 600;
  }

  .expand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .expand-icon span {
    display: inline-block;
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }

  .expand-icon span.rotated {
    transform: rotate(90deg);
  }

  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .item-label {
    flex: 1;
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .children-container {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    margin-top: 0.125rem;
  }
</style>
