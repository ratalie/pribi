<script setup lang="ts">
import type { NavigationStep } from "~/types/navigationSteps";
import { getIcon } from "~/utils/iconMapper";

interface Props {
  step: NavigationStep;
  isExpanded: boolean;
  isCurrent: boolean;
  status: "completed" | "current" | "empty";
  isFinalItem: boolean;
  onToggle: () => void;
  onClick?: (stepId: string) => void;
}

const props = defineProps<Props>();

const stepSlug = computed(() => props.step.route.split("/").pop() || "");
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- "puntos-acuerdo" siempre es desplegable, incluso sin sub-steps -->
    <div
      v-if="step.route.includes('puntos-acuerdo') || (step.subSteps && step.subSteps.length > 0)"
      class="flex flex-col gap-1 cursor-pointer group flex-1"
      @click="onToggle"
    >
      <div class="flex items-center gap-2">
        <p
          class="font-primary font-medium text-gray-600 t-t1 group-hover:text-primary-800 transition-colors group-hover:underline"
        >
          {{ step.title }}
        </p>
        <component
          :is="getIcon(isExpanded ? 'ChevronDown' : 'ChevronRight')"
          v-if="getIcon('ChevronDown') && getIcon('ChevronRight')"
          class="w-4 h-4 text-gray-600 transition-transform"
          :class="isExpanded ? 'rotate-180' : ''"
        />
      </div>
      <span class="font-secondary font-medium text-gray-600 t-b2 group-hover:underline">
        {{ step.description }}
      </span>
    </div>
    <!-- Otros pasos sin sub-steps son links normales -->
    <NuxtLink
      v-else
      :to="step.route"
      class="flex flex-col gap-1 cursor-pointer group flex-1"
      @click="onClick?.(stepSlug)"
    >
      <p
        class="font-primary font-medium text-gray-600 t-t1 group-hover:text-primary-800 transition-colors group-hover:underline"
      >
        {{ step.title }}
      </p>
      <span class="font-secondary font-medium text-gray-600 t-b2 group-hover:underline">
        {{ step.description }}
      </span>
    </NuxtLink>
  </div>
</template>

