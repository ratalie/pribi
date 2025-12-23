<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6">
    <div class="flex items-center justify-between mb-4">
      <p
        class="text-sm"
        style="
          color: var(--text-muted);
          font-family: var(--font-secondary);
        "
      >
        {{ label }}
      </p>
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        :style="{
          backgroundColor: `${color}15`,
          borderRadius: 'var(--radius-medium)',
        }"
      >
        <component :is="icon" class="w-5 h-5" :style="{ color }" />
      </div>
    </div>
    <p
      class="text-3xl font-bold"
      style="
        color: var(--text-primary);
        font-family: var(--font-primary);
      "
    >
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  value: number;
  icon: any;
  color: string;
}

defineProps<Props>();
</script>




