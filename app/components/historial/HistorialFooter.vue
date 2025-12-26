<script setup lang="ts">
interface Props {
  total: number;
  label: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="sticky bottom-0 bg-white border-t border-gray-200">
    <div class="max-w-[1600px] mx-auto">
      <div
        class="container-div-button flex items-center pr-16 py-6 min-h-24 font-secondary pl-8 text-t1"
      >
        <span class="flex gap-1">
          <span class="font-bold">Total:</span>
          <span class="font-semibold">
            {{ total }}
          </span>
          <span>{{ label }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-div-button {
  border-top: 1px solid var(--primario-75, #e2dcff);
  background: var(--neutral_blanco-100, #fff);
}
</style>

