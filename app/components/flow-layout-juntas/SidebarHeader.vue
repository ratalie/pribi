<script setup lang="ts">
  import ProboIcon from "~/components/base/ProboIcon.vue";
  import type { NavigationStep } from "~/types/navigationSteps";
  import { computed } from "vue";

  interface Props {
    title: string;
    progress: { current: number; total: number };
    icon?: string;
    steps?: NavigationStep[];
    currentStepId?: string;
    currentSubStepId?: string;
  }

  const props = defineProps<Props>();

  // Calcular breadcrumb dinámico
  const breadcrumb = computed(() => {
    if (!props.steps || !props.currentStepId) return null;

    const currentStep = props.steps.find(
      (s) => s.route.split("/").pop() === props.currentStepId
    );

    if (!currentStep) return null;

    // Si estamos en un sub-step de "puntos-acuerdo", mostrar breadcrumb
    if (props.currentStepId === "puntos-acuerdo" && props.currentSubStepId) {
      const subStep = currentStep.subSteps?.find(
        (ss) => ss.id === props.currentSubStepId
      );
      if (subStep) {
        return {
          parent: currentStep.title,
          child: subStep.title,
        };
      }
    }

    return null;
  });
</script>

<template>
  <div class="flex items-center gap-3 mb-6">
    <div
      class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-[linear-gradient(135deg,#7257FF_0%,#2E2078_100%)] shadow-[0_0_6px_rgba(114,87,255,0.35)]"
    >
      <ProboIcon :name="icon || 'Users'" class="w-6 h-6 text-white" />
    </div>
    <div class="flex-1">
      <!-- Breadcrumb dinámico para puntos de agenda -->
      <div v-if="breadcrumb" class="flex items-center gap-2">
        <h3 class="text-sm font-primary font-semibold text-gray-900">
          {{ breadcrumb.parent }}
        </h3>
        <span class="text-sm font-primary text-gray-500">></span>
        <h3 class="text-sm font-primary font-semibold text-gray-900">
          {{ breadcrumb.child }}
        </h3>
      </div>
      <!-- Título normal para otros pasos -->
      <div v-else>
        <h3 class="text-sm font-primary font-semibold text-gray-900">
          {{ title }}
        </h3>
        <p class="text-xs font-secondary text-gray-600">
          Paso {{ progress.current }} de {{ progress.total }}
        </p>
      </div>
    </div>
  </div>
</template>
