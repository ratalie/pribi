<script setup lang="ts">
import { computed, ref } from "vue";
import type { FlowItemTree } from "~/types/flow-system";
import StatusIcon from "./StatusIcon.vue";
import CategorySeparator from "./CategorySeparator.vue";

interface Props {
  item: FlowItemTree;
  currentPath: string;
  level?: number;
  showLevelBadge?: boolean;
  isLast?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
  showLevelBadge: false,
  isLast: false,
});

const isExpanded = ref(true);

const hasChildren = computed(() => props.item.children && props.item.children.length > 0);
const isCategory = computed(() => props.item.identity.isCategory === true);

const toggleExpand = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const itemStatus = computed(() => {
  if (props.item.behavior.isCompleted) {
    return "completed";
  }

  if (props.item.navigation.route === props.currentPath) {
    return "current";
  }

  return "empty";
});

const titleClasses = computed(() => {
  const classes = ["item-title"];
  const level = props.item.hierarchy.level ?? 0;

  if (level <= 0) {
    classes.push("item-title-root");
  } else if (level === 2) {
    classes.push("item-title-level2");
  } else if (level >= 3) {
    classes.push("item-title-level3");
  }

  if (itemStatus.value === "current") {
    classes.push("item-title-current");
  } else if (itemStatus.value === "completed") {
    classes.push("item-title-completed");
  }

  return classes;
});

const indentStyle = computed(() => ({
  paddingLeft: `${props.level * 16}px`,
}));

const shouldShowLine = computed(() => {
  const level = props.item.hierarchy.level ?? 0;
  return level <= 1;
});

const levelBadgeClass = computed(() => {
  switch (props.item.hierarchy.level) {
    case 0:
      return "bg-purple-100 text-purple-700";
    case 1:
      return "bg-blue-100 text-blue-700";
    case 2:
      return "bg-green-100 text-green-700";
    case 3:
      return "bg-yellow-100 text-yellow-700";
    case 4:
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
});
</script>

<template>
  <div class="hierarchical-item">
    <CategorySeparator v-if="isCategory" :label="item.identity.label" />

    <div v-else class="item-row" :style="indentStyle">
      <StatusIcon
        :status="itemStatus"
        :is-final-item="isLast && !hasChildren"
        :show-line="shouldShowLine && (!isLast || hasChildren)"
        :level="item.hierarchy.level"
      />

      <div class="item-content">
        <button
          v-if="hasChildren"
          @click="toggleExpand"
          class="expand-button"
          :aria-expanded="isExpanded"
        >
          <svg
            class="h-4 w-4 transition-transform"
            :class="{ 'rotate-90': isExpanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <NuxtLink :to="item.navigation.route" class="item-link group">
          <div class="flex items-center gap-2">
            <span
              v-if="showLevelBadge"
              class="level-badge"
              :class="levelBadgeClass"
            >
              L{{ item.hierarchy.level }}
            </span>

            <p :class="titleClasses">
              {{ item.identity.label }}
            </p>
          </div>

          <span
            v-if="item.metadata?.description && (item.hierarchy.level ?? 0) <= 1"
            class="item-description"
          >
            {{ item.metadata?.description }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <div v-if="hasChildren && isExpanded && !isCategory" class="children-container">
      <HierarchicalItem
        v-for="(child, index) in item.children"
        :key="child.identity.id"
        :item="child"
        :current-path="currentPath"
        :level="level + 1"
        :show-level-badge="showLevelBadge"
        :is-last="index === item.children!.length - 1"
      />
    </div>
  </div>
</template>

<style scoped>
  .hierarchical-item {
    display: flex;
    flex-direction: column;
  }

  .item-row {
    display: flex;
    align-items: start;
    gap: 12px;
    transition: padding-left 0.2s ease;
  }

  .item-content {
    display: flex;
    align-items: start;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .expand-button {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: #6b7280;
    transition: all 0.2s ease;
    margin-top: 2px;
  }

  .expand-button:hover {
    background-color: #f3f4f6;
    color: #374151;
  }

  .item-link {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
    text-decoration: none;
    min-width: 0;
  }

  .item-title {
    font-family: var(--font-primary);
    font-size: 14px;
    line-height: 1.3;
    font-weight: 500;
    color: var(--sidebar-text-secondary);
    transition: color 0.2s ease;
  }

  .item-title-root {
    font-size: 15px;
    font-weight: 600;
    color: var(--sidebar-text-primary);
  }

  .item-title-level2 {
    font-weight: 500;
    color: var(--sidebar-text-secondary);
  }

  .item-title-level3 {
    font-size: 13px;
    color: var(--sidebar-text-secondary);
  }

  .item-title-completed {
    color: var(--sidebar-primary);
  }

  .item-title-current {
    color: var(--sidebar-primary);
    font-weight: 600;
  }

  .item-link:hover .item-title {
    color: var(--sidebar-primary);
    text-decoration: underline;
  }

  .item-description {
    font-family: var(--font-secondary);
    font-weight: 400;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
  }

  .item-link:hover .item-description {
    text-decoration: underline;
  }

  .level-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .children-container {
    display: flex;
    flex-direction: column;
  }
</style>
