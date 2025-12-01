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
      :label="prevButtonLabel"
      size="md"
      variant="outline"
      :is-disabled="isPrevDisabled"
      icon="ArrowLeft"
      icon-position="left"
      @click="onPrev"
    />

    <!-- Botón Siguiente -->
    <ActionButton
      :label="nextButtonLabel"
      size="md"
      :is-loading="isLoading"
      :icon="nextButtonIcon"
      icon-position="right"
      @click="onNext"
    />
  </div>
</template>

