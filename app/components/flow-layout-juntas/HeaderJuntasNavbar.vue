<script setup lang="ts">
  import { useJuntasHeaderNavigation } from "~/composables/useJuntasHeaderNavigation";
  import type { NavigationStep } from "~/types/navigationSteps";
  import { getIcon } from "~/utils/iconMapper";
  import BaseButton from "../base/buttons/BaseButton.vue";
  import HeaderActions from "./HeaderActions.vue";
  import HeaderTitle from "./HeaderTitle.vue";

  interface Props {
    steps: NavigationStep[];
    currentStepIndex: number;
    onBack?: () => void;
    onSave?: () => void;
    onReset?: () => void;
  }

  const props = defineProps<Props>();

  // Usar composable para navegación
  const { goBackStep, currentStep } = useJuntasHeaderNavigation(
    computed(() => props.steps),
    computed(() => props.currentStepIndex),
    props.onBack
  );
</script>

<template>
  <div class="bg-white border-b border-gray-200 shadow-sm px-8 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <HeaderTitle :current-step="currentStep" />
      </div>
      <HeaderActions :on-save="onSave" :on-reset="onReset" />
    </div>
  </div>
</template>
