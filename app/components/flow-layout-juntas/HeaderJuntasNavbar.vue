<script setup lang="ts">
  import type { NavigationStep } from "~/types/navigationSteps";
  import { getIcon } from "~/utils/iconMapper";
  import BaseButton from "../base/buttons/BaseButton.vue";

  interface Props {
    steps: NavigationStep[];
    currentStepIndex: number;
    onBack?: () => void;
    onSave?: () => void;
    onReset?: () => void;
  }

  const props = defineProps<Props>();

  const router = useRouter();

  const goBackStep = () => {
    if (props.currentStepIndex > 0) {
      const prevStep = props.steps[props.currentStepIndex - 1];
      if (prevStep) {
        router.push(prevStep.route);
      }
    } else {
      props.onBack?.();
    }
  };

  const currentStep = computed(() => {
    return props.steps[props.currentStepIndex];
  });
</script>

<template>
  <div
    class="bg-white border-b px-8 py-4"
    style="
      border-color: var(--border-light, #e5e7eb);
      box-shadow: var(--shadow-card, 0 1px 3px 0 rgba(0, 0, 0, 0.1));
    "
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <BaseButton variant="ghost" @click="goBackStep" class="flex items-center gap-2">
          <component :is="getIcon('ArrowLeft')" v-if="getIcon('ArrowLeft')" class="w-4 h-4" />
          Salir
        </BaseButton>
        <div class="h-8 w-px bg-gray-200"></div>
        <div>
          <h1 class="text-xl mb-0.5 font-primary font-semibold text-gray-900">
            {{ currentStep?.title || "Junta de Accionistas" }}
          </h1>
          <p class="text-sm font-secondary text-gray-600">
            {{ currentStep?.description || "" }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <BaseButton
          v-if="onSave"
          variant="outline"
          @click="onSave"
          class="flex items-center gap-2"
        >
          <component :is="getIcon('FileCheck')" v-if="getIcon('FileCheck')" class="w-4 h-4" />
          Guardar Cambios
        </BaseButton>
        <BaseButton
          v-if="onReset"
          variant="outline"
          @click="onReset"
          class="flex items-center gap-2"
        >
          <component :is="getIcon('RotateCcw')" v-if="getIcon('RotateCcw')" class="w-4 h-4" />
          Restablecer
        </BaseButton>
      </div>
    </div>
  </div>
</template>
