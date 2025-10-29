<script setup lang="ts">
  import type { NavigationStep } from "~/types/navigationSteps";
  import BaseButton from "../base/buttons/BaseButton.vue";

  interface Props {
    steps: NavigationStep[];
    currentStepIndex: number;
  }

  const props = defineProps<Props>();

  const router = useRouter();

  const goBackStep = () => {
    if (props.currentStepIndex > 0) {
      const prevStep = props.steps[props.currentStepIndex - 1];
      router.push(prevStep!.route);
    }
  };

  const isShort = (text: string, max: number = 15) => {
    return text.length <= max;
  };
</script>

<template>
  <div class="h-26 flex flex-col justify-center px-4 gap-4 border-y">
    <div class="flex gap-2">
      <BaseButton variant="ghost" @click="goBackStep">
        <component :is="getIcon('ArrowLeft')" v-if="getIcon('ArrowLeft')" class="w-5 h-5" />
      </BaseButton>
      <h1 class="text-2xl font-bold">Agregar nueva sociedad</h1>
    </div>
    <div class="flex gap-4">
      <div
        v-for="step in steps"
        :key="step.title"
        class="flex items-center gap-2 t-b1 font-secondary text-gray-600"
      >
        <p :class="isShort(step.title) ? '' : 'truncate max-w-16 whitespace-nowrap'">
          {{ step.title }}
        </p>
        <component
          :is="getIcon('ChevronRight')"
          v-if="getIcon('ChevronRight')"
          class="w-3 h-3"
        />
      </div>
    </div>
  </div>
</template>
