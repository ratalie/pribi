<script setup lang="ts">
  const props = defineProps<{
    class?: string;
  }>();
</script>

<template>
  <div
    :class="['h-full border border-gray-100 rounded-xl flex flex-col gap-12 py-12 px-10', props.class]"
  >
    <slot />
</div>
</template>
