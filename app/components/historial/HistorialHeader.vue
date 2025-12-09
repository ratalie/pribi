<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  description: "",
  showActions: false,
});

defineSlots<{
  actions?: () => any;
}>();
</script>

<template>
  <div class="px-6 py-6 border-b border-gray-200 bg-white">
    <div class="max-w-[1600px] mx-auto flex justify-between items-center">
      <div class="flex flex-col gap-2 flex-1">
        <span class="text-h5 text-layout-gray-800 font-primary font-bold">
          {{ title }}
        </span>
        <span v-if="description" class="text-t1 text-layout-gray-500 font-primary">
          {{ description }}
        </span>
      </div>
      <div v-if="showActions || $slots.actions" class="flex gap-2 ml-4">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

