<template>
  <div class="flat-item" :class="itemClasses">
    <div class="item-content" @click="handleClick">
      <!-- Status Icon -->
      <span v-if="showStatusIcons" class="status-icon">
        <CheckIcon v-if="item.behavior.isCompleted" class="w-4 h-4 text-green-600" />
        <span v-else-if="item.behavior.isActive" class="w-4 h-4 text-blue-600">◉</span>
        <span v-else class="w-4 h-4 text-gray-400">○</span>
      </span>

      <!-- Label -->
      <span class="item-label">{{ item.identity.label }}</span>

      <!-- Description (opcional) -->
      <p v-if="showDescriptions && item.identity.description" class="item-description">
        {{ item.identity.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import CheckIcon from "~/components/flow-layout/CheckIcon.vue";
  import type { FlowItemTree } from "~/types/flow-system/flow-item";

  /**
   * Props
   */
  interface Props {
    item: FlowItemTree;
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
    (e: "navigate", item: FlowItemTree): void;
  }

  const emit = defineEmits<Emits>();

  // Computeds
  const isActive = computed(() => {
    return props.item.navigation.route === props.currentPath;
  });

  const itemClasses = computed(() => ({
    "is-active": isActive.value,
    "is-completed": props.item.behavior.isCompleted,
    "is-in-progress": props.item.behavior.isActive,
  }));

  // Methods
  function handleClick() {
    if (props.allowNavigation) {
      emit("navigate", props.item);
    }
  }
</script>

<style scoped>
  .flat-item {
    display: flex;
    flex-direction: column;
  }

  .item-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
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

  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .item-label {
    flex: 1;
    font-size: 0.875rem;
  }

  .item-description {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
    margin-top: 0.25rem;
  }
</style>
