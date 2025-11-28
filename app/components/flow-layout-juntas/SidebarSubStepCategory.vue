<script setup lang="ts">
import type { NavigationSubStep } from "~/types/navigationSteps";
import { normalizeSubStepStatus } from "~/utils/juntas/sidebar.utils";
import { getIcon } from "~/utils/iconMapper";
import CheckIcon from "../flow-layout/CheckIcon.vue";

interface Props {
  category: string;
  subSteps: NavigationSubStep[];
  isExpanded: boolean;
  currentSubStepId?: string;
  onToggle: () => void;
  onSubStepClick: (subStep: NavigationSubStep) => void;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="space-y-1">
    <!-- Header de Categoría (colapsable) -->
    <button
      @click="onToggle"
      class="w-full flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 transition-colors"
    >
      <component
        :is="getIcon('ChevronRight')"
        v-if="getIcon('ChevronRight')"
        :class="[
          'w-4 h-4 text-gray-600 transition-transform',
          isExpanded ? 'rotate-90' : '',
        ]"
      />
      <span class="text-sm font-secondary font-semibold text-gray-700 flex-1 text-left">
        {{ category }}
      </span>
    </button>

    <!-- Sub-items de la categoría -->
    <div v-if="isExpanded" class="ml-6 mt-1 space-y-1">
      <div
        v-for="subStep in subSteps"
        :key="subStep.id"
        class="flex items-start gap-4"
      >
        <CheckIcon
          :status="normalizeSubStepStatus(subStep, currentSubStepId)"
          :is-final-item="false"
        />
        <NuxtLink
          :to="subStep.route"
          class="flex flex-col gap-1 cursor-pointer group"
          @click="onSubStepClick(subStep)"
        >
          <p
            class="font-primary font-medium text-gray-600 t-b1 group-hover:text-primary-800 transition-colors group-hover:underline"
          >
            {{ subStep.title }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

