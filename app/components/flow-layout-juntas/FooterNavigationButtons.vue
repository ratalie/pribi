<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";

  interface Props {
    prevButtonLabel: string;
    nextButtonLabel: string;
    nextButtonIcon: "Check" | "ArrowRight";
    isLoading: boolean;
    isPrevDisabled: boolean;
    onPrev: () => void;
    onNext: () => void;
  }

  const _props = defineProps<Props>();
</script>

<template>
  <div class="flex items-center justify-between">
    <!-- Botón Anterior -->
    <ActionButton
      v-if="!isPrevDisabled"
      :label="prevButtonLabel"
      size="md"
      variant="outline"
      icon="ArrowLeft"
      icon-position="left"
      @click="onPrev"
    />
    <!-- Placeholder cuando está deshabilitado (paso 1) -->
    <div v-else class="opacity-0 pointer-events-none cursor-none">
      <ActionButton
        :label="prevButtonLabel"
        size="md"
        variant="outline"
        :is-disabled="true"
        icon="ArrowLeft"
        icon-position="left"
      />
    </div>

    <!-- Botón Siguiente -->
    <ActionButton
      :label="nextButtonLabel"
      size="md"
      :is-loading="isLoading"
      :icon="nextButtonIcon"
      icon-position="right"
      @click="() => {
        console.log('🖱️ [FooterNavigationButtons] Click en botón Siguiente');
        console.log('🖱️ [FooterNavigationButtons] onNext es:', typeof onNext);
        console.log('🖱️ [FooterNavigationButtons] onNext función:', onNext.toString());
        onNext();
      }"
    />
  </div>
</template>
