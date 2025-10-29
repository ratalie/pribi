<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import ProgressNavBar from "~/components/flow-layout/ProgressNavBar.vue";
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <div class="h-26 border-y">
      <h1 class="text-2xl font-bold">Flow Layout</h1>
    </div>
    <!-- Body -->
    <div class="flex min-h-0 flex-1">
      <div class="w-[401px] border-r p-4">
        <ProgressNavBar />
      </div>

      <div class="flex-1 flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>

        <div
          class="h-[92px] border-t sticky bottom-0 bg-white z-10 shrink-0 flex items-center justify-end px-16"
        >
          <ActionButton label="Siguiente" size="md" />
        </div>
      </div>
    </div>
  </div>
</template>
