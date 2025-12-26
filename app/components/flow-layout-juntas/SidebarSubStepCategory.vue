<script setup lang="ts">
  import type { NavigationSubStep } from "~/types/navigationSteps";
  import { getIcon } from "~/utils/iconMapper";
  import { normalizeSubStepStatus } from "~/utils/juntas/sidebar.utils";

  const CheckIcon = getIcon("Check");

  interface Props {
    category: string;
    subSteps: NavigationSubStep[];
    isExpanded: boolean;
    currentSubStepId?: string;
    onToggle: () => void;
    onSubStepClick: (subStep: NavigationSubStep) => void;
  }

  const props = defineProps<Props>();

  // Función para determinar si un sub-step está activo
  const isSubStepActive = (subStep: NavigationSubStep): boolean => {
    return subStep.id === props.currentSubStepId;
  };
</script>

<template>
  <div class="space-y-1 pl-2 pr-3">
    <!-- Header de Categoría (colapsable) -->
    <button
      @click="onToggle"
      class="w-full flex items-center justify-between gap-2 py-1 pl-2 pr-1 rounded hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <span class="text-sm font-primary font-semibold text-gray-600 flex-1 text-left">
        {{ category }}
      </span>
      <component
        :is="getIcon('ChevronRight')"
        v-if="getIcon('ChevronRight')"
        :class="[
          'w-4 h-4 text-gray-600 transition-transform shrink-0',
          isExpanded ? 'rotate-90' : '',
        ]"
      />
    </button>

    <!-- Sub-items de la categoría -->
    <div v-if="isExpanded" class="space-y-1 pl-2">
      <NuxtLink
        v-for="subStep in subSteps"
        :key="subStep.id"
        :to="subStep.route"
        class="group flex items-center gap-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        @click="onSubStepClick(subStep)"
      >
        <!-- CheckIcon sin línea (nivel 3) - centrado verticalmente -->
        <div class="flex items-center justify-center shrink-0 py-1.5 pl-2">
          <div class="flex items-center justify-center">
            <!-- Solo el círculo, sin línea -->
            <div
              v-if="normalizeSubStepStatus(subStep, currentSubStepId) === 'empty'"
              class="w-5 h-5 flex items-center justify-center border-2 border-gray-300 rounded-full"
            />
            <div
              v-else-if="normalizeSubStepStatus(subStep, currentSubStepId) === 'current'"
              class="w-5 h-5 flex items-center justify-center border-2 border-primary-800 rounded-full"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-primary-800" />
            </div>
            <div
              v-else-if="normalizeSubStepStatus(subStep, currentSubStepId) === 'completed'"
              class="w-5 h-5 flex items-center justify-center border-2 bg-primary-800 border-primary-800 rounded-full"
            >
              <component v-if="CheckIcon" :is="CheckIcon" class="text-white w-3.5 h-3.5" />
            </div>
          </div>
        </div>
        <!-- Contenido del texto -->
        <div class="flex flex-col gap-1 flex-1">
          <p
            :class="[
              'font-primary text-xs transition-all',
              // Estado activo
              isSubStepActive(subStep)
                ? 'text-primary-800 font-semibold'
                : // Estado normal
                  'text-gray-600 font-medium group-hover:font-semibold group-hover:scale-[1.001]',
            ]"
          >
            {{ subStep.title }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
