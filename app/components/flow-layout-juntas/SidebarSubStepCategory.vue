<script setup lang="ts">
  import type { NavigationSubStep } from "~/types/navigationSteps";
  import { getIcon } from "~/utils/iconMapper";
  import { normalizeSubStepStatus } from "~/utils/juntas/sidebar.utils";

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
  <div class="space-y-1">
    <!-- Header de Categoría (colapsable) -->
    <button
      @click="onToggle"
      class="w-full flex items-center justify-between gap-2 py-1 pl-4 rounded hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <span class="text-sm font-secondary font-semibold text-gray-700 flex-1 text-left">
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
    <div v-if="isExpanded" class="ml-3 mt-1 space-y-1">
      <div
        v-for="subStep in subSteps"
        :key="subStep.id"
        class="group flex items-center gap-3 rounded-md hover:bg-gray-50 transition-colors p-2 -m-2"
      >
        <!-- CheckIcon sin línea (nivel 3) - centrado verticalmente -->
        <div class="flex items-center justify-center shrink-0 mt-0.5">
          <div class="flex items-center justify-center">
            <!-- Solo el círculo, sin línea -->
            <div
              v-if="normalizeSubStepStatus(subStep, currentSubStepId) === 'empty'"
              class="w-7 h-7 flex items-center justify-center border-2 border-gray-300 rounded-full"
            />
            <div
              v-else-if="normalizeSubStepStatus(subStep, currentSubStepId) === 'current'"
              class="w-7 h-7 flex items-center justify-center border-2 border-primary-800 rounded-full"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-primary-800" />
            </div>
            <div
              v-else-if="normalizeSubStepStatus(subStep, currentSubStepId) === 'completed'"
              class="w-7 h-7 flex items-center justify-center border-2 bg-primary-800 border-primary-800 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                class="text-white"
                width="20"
                height="20"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <!-- Link con hover limitado al contenido -->
        <NuxtLink
          :to="subStep.route"
          class="flex flex-col gap-1 flex-1 cursor-pointer"
          @click="onSubStepClick(subStep)"
        >
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
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
