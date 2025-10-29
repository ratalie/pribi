<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import HeaderProgressNavbar from "~/components/flow-layout/HeaderProgressNavbar.vue";
  import ProgressNavbar from "~/components/flow-layout/ProgressNavbar.vue";

  const { steps, currentStepIndex } = useProgressNavbarRoutes();
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <HeaderProgressNavbar :steps="steps" :current-step-index="currentStepIndex" />

    <!-- Body -->
    <div class="flex min-h-0 flex-1">
      <div class="w-[401px] border-r p-4">
        <ProgressNavbar :steps="steps" />
      </div>

      <div class="flex-1 flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>

        <!-- Footer -->
        <div
          class="h-[92px] border-t sticky bottom-0 bg-white z-10 shrink-0 flex items-center justify-end px-16"
        >
          <ActionButton label="Siguiente" size="md" />
        </div>
      </div>
    </div>
  </div>
</template>
