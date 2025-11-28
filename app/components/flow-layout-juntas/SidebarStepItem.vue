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
  <div class="flex items-center gap-2 w-full">
    <!-- Items colapsables (con sub-steps, pero NO puntos-acuerdo) -->
    <div
      v-if="
        step.subSteps && step.subSteps.length > 0 && !step.route.includes('puntos-acuerdo')
      "
      class="flex items-center justify-between gap-2 flex-1 cursor-pointer"
      @click="onToggle"
    >
      <div class="flex flex-col gap-1 flex-1">
        <p
          :class="[
            'font-primary transition-colors text-3xl',
            isCurrent
              ? 'text-primary-800 '
              : 'text-gray-600 font-medium group-hover:text-primary-800',
          ]"
        >
          {{ step.title }}
        </p>

        <span
          :class="[
            'font-secondary  text-xs transition-colors',
            isCurrent ? 'font-semibold text-gray-800' : 'font-normal text-gray-600',
          ]"
        >
          {{ step.description }}
        </span>
      </div>
      <component
        :is="getIcon(isExpanded ? 'ChevronDown' : 'ChevronRight')"
        v-if="getIcon('ChevronDown') && getIcon('ChevronRight')"
        class="w-4 h-4 text-gray-600 transition-transform shrink-0"
        :class="isExpanded ? 'rotate-180' : ''"
      />
    </div>
    <!-- Puntos de Acuerdo: link solo en contenido, chevron separado -->
    <template v-else-if="step.route.includes('puntos-acuerdo')">
      <NuxtLink
        :to="step.route"
        class="flex flex-col gap-1 flex-1 cursor-pointer"
        @click="onClick?.(stepSlug)"
      >
        <p
          :class="[
            'font-primary text-sm transition-colors',
            isCurrent
              ? 'text-primary-800 font-semibold'
              : 'text-gray-600 font-medium group-hover:text-primary-800',
          ]"
        >
          {{ step.title }}
        </p>
        <span
          :class="[
            'font-secondary font-medium text-xs transition-colors',
            isCurrent ? 'text-gray-800' : 'text-gray-600',
          ]"
        >
          {{ step.description }}
        </span>
      </NuxtLink>
      <button class="shrink-0 cursor-pointer p-1 -m-1" @click.stop="onToggle">
        <component
          :is="getIcon(isExpanded ? 'ChevronDown' : 'ChevronRight')"
          v-if="getIcon('ChevronDown') && getIcon('ChevronRight')"
          class="w-4 h-4 text-gray-600 transition-transform"
          :class="isExpanded ? 'rotate-180' : ''"
        />
      </button>
    </template>
    <!-- Otros pasos: siempre son links completos -->
    <NuxtLink
      v-else
      :to="step.route"
      class="flex items-center justify-between gap-2 flex-1 cursor-pointer"
      @click="onClick?.(stepSlug)"
    >
      <div class="flex flex-col gap-1 flex-1">
        <p
          :class="[
            'font-primary text-sm leading-5 transition-all',
            isCurrent
              ? 'text-primary-800 font-bold'
              : 'text-gray-600 font-medium group-hover:text-primary-800',
          ]"
        >
          {{ step.title }}
        </p>
        <span
          :class="[
            'font-secondary text-xs transition-colors',
            isCurrent ? 'font-semibold text-gray-700' : 'font-medium text-gray-600',
          ]"
        >
          {{ step.description }}
        </span>
      </div>
    </NuxtLink>
  </div>
</template>
