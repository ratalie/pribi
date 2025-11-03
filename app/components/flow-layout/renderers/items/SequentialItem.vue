<template>
  <div class="sequential-item" :class="itemClasses">
    <div class="item-content" @click="handleClick">
      <!-- Step Number -->
      <div class="step-number">
        <span v-if="!item.behavior.isCompleted">{{ index + 1 }}</span>
        <CheckIcon v-else class="w-4 h-4" />
      </div>

      <!-- Content -->
      <div class="step-content">
        <span class="step-label">{{ item.identity.label }}</span>
        <p v-if="showDescriptions && item.identity.description" class="step-description">
          {{ item.identity.description }}
        </p>
      </div>

      <!-- Status Icon -->
      <div v-if="showStatusIcons" class="status-icon">
        <CheckIcon v-if="item.behavior.isCompleted" class="w-5 h-5 text-green-600" />
        <span v-else-if="item.behavior.isActive" class="w-5 h-5 text-blue-600">◉</span>
        <span v-else-if="item.behavior.isDisabled" class="w-5 h-5 text-gray-400">🔒</span>
        <span v-else class="w-5 h-5 text-gray-400">○</span>
      </div>
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
    index: number;
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

  const isLocked = computed(() => {
    return props.item.behavior.isDisabled;
  });

  const itemClasses = computed(() => ({
    "is-active": isActive.value,
    "is-locked": isLocked.value,
    "is-completed": props.item.behavior.isCompleted,
    "is-in-progress": props.item.behavior.isActive,
  }));

  // Methods
  function handleClick() {
    if (props.allowNavigation && !isLocked.value) {
      emit("navigate", props.item);
    }
  }
</script>

<style scoped>
  .sequential-item {
    display: flex;
    flex-direction: column;
  }

  .item-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }

  .item-content:hover:not(.is-locked .item-content) {
    background-color: hsl(var(--accent));
  }

  .is-active > .item-content {
    background-color: hsl(var(--primary) / 0.1);
    border-color: hsl(var(--primary));
  }

  .is-locked {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .is-completed > .item-content {
    background-color: hsl(var(--success) / 0.1);
  }

  .step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: hsl(var(--muted));
    font-weight: 600;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .is-active .step-number {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  .is-completed .step-number {
    background-color: hsl(var(--success));
    color: white;
  }

  .step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .step-label {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .step-description {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
  }

  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
</style>
