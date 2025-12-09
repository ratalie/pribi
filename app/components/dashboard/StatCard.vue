<script setup lang="ts">
  import type { Component } from "vue";

  interface Props {
    label: string;
    value: string | number;
    description?: string;
    icon?: Component;
    color?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    description: "",
    color: "var(--primary-700)",
  });
</script>

<template>
  <div
    class="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
    style="
      border-color: var(--border-default);
      box-shadow: var(--shadow-card);
      border-radius: var(--radius-large);
    "
  >
    <!-- Header - Label + Icon -->
    <div class="flex items-center justify-between mb-3">
      <p
        class="text-sm"
        style="
          color: var(--text-muted);
          font-family: var(--font-secondary);
        "
      >
        {{ props.label }}
      </p>
      <div
        v-if="props.icon"
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        :style="{
          backgroundColor: `${props.color}15`,
          borderRadius: 'var(--radius-medium)',
        }"
      >
        <component :is="props.icon" class="w-5 h-5" :style="{ color: props.color }" />
      </div>
    </div>

    <!-- Value -->
    <p
      class="text-3xl mb-1"
      style="
        color: var(--text-primary);
        font-family: var(--font-primary);
        font-weight: 600;
      "
    >
      {{ props.value }}
    </p>

    <!-- Description -->
    <p
      v-if="props.description"
      class="text-xs mt-2"
      style="
        color: var(--text-muted);
        font-family: var(--font-secondary);
      "
    >
      {{ props.description }}
    </p>
  </div>
</template>

