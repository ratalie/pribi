<script setup lang="ts">
import type { NavigationStep } from "~/types/navigationSteps";
import type { SectionItem } from "~/types/junta-navigation.types";
import { useJuntasFooterLabels } from "~/composables/useJuntasFooterLabels";
import FooterContextualInfo from "./FooterContextualInfo.vue";
import FooterNavigationButtons from "./FooterNavigationButtons.vue";

interface Props {
  steps: NavigationStep[];
  currentStepIndex: number;
  currentSubStepId?: string;
  detectedCurrentSection?: string;
  sectionsWithCurrent: SectionItem[];
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const props = defineProps<Props>();

// Usar composable para obtener todos los labels y títulos
const {
  currentStepTitle,
  currentSectionTitle,
  prevButtonLabel,
  nextButtonLabel,
  nextButtonIcon,
  stepCounter,
} = useJuntasFooterLabels(
  computed(() => props.steps),
  computed(() => props.currentStepIndex),
  computed(() => props.currentSubStepId),
  computed(() => props.detectedCurrentSection),
  computed(() => props.sectionsWithCurrent)
);

// Determinar si el botón anterior está deshabilitado
const isPrevDisabled = computed(
  () => props.currentStepIndex === 0 && !props.currentSubStepId
);
</script>

<template>
  <div
    class="bg-white border-t px-8 py-4 shrink-0"
    style="border-color: var(--border-light, #e5e7eb)"
  >
    <div class="flex flex-col gap-3 max-w-5xl mx-auto">
      <!-- Información contextual -->
      <FooterContextualInfo
        :current-sub-step-id="currentSubStepId"
        :current-step-title="currentStepTitle"
        :current-section-title="currentSectionTitle"
        :step-counter="stepCounter"
      />

      <!-- Botones de navegación -->
      <FooterNavigationButtons
        :prev-button-label="prevButtonLabel"
        :next-button-label="nextButtonLabel"
        :next-button-icon="nextButtonIcon"
        :is-loading="isLoading"
        :is-prev-disabled="isPrevDisabled"
        :on-prev="onPrev"
        :on-next="onNext"
      />
    </div>
  </div>
</template>
