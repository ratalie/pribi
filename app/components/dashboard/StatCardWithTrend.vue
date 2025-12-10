<script setup lang="ts">
  import type { Component } from "vue";

  interface Props {
    label: string;
    value: string | number;
    trend?: string;
    icon?: Component;
    color?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    color: "var(--primary-700)",
  });
</script>

<template>
  <div
    class="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all"
    style="
      border-color: var(--border-default);
      border-radius: var(--radius-large);
    "
  >
    <!-- Icon -->
    <div class="flex items-start justify-between mb-4">
      <div
        v-if="props.icon"
        class="p-3 rounded-lg"
        :style="{ backgroundColor: `${props.color}15` }"
      >
        <component :is="props.icon" class="w-6 h-6" :style="{ color: props.color }" />
      </div>
    </div>

    <!-- Value -->
    <p
      class="text-3xl mb-1"
      style="
        color: var(--text-primary);
        font-family: var(--font-primary);
        font-weight: 700;
      "
    >
      {{ props.value }}
    </p>

    <!-- Label -->
    <p
      class="text-sm mb-2"
      style="
        color: var(--text-secondary);
        font-family: var(--font-secondary);
        font-weight: 500;
      "
    >
      {{ props.label }}
    </p>

    <!-- Trend (opcional) -->
    <p
      v-if="props.trend"
      class="text-xs"
      style="
        color: var(--text-muted);
        font-family: var(--font-secondary);
      "
    >
      {{ props.trend }}
    </p>
  </div>
</template>





