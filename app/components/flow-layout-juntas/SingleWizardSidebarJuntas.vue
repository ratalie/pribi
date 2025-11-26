<script setup lang="ts">
  import type { NavigationStep, NavigationSubStep } from "~/types/navigationSteps";
  import { getIcon } from "~/utils/iconMapper";
  import CheckIcon from "../flow-layout/CheckIcon.vue";
  import ProgressBarJuntas from "./ProgressBarJuntas.vue";

  interface Props {
    steps: NavigationStep[];
    currentStepId: string;
    currentSubStepId?: string;
    onStepClick?: (stepId: string) => void;
    onSubStepClick?: (subStepId: string) => void;
    title: string;
    icon?: string;
    progress: { current: number; total: number };
  }

  const props = defineProps<Props>();

  const router = useRouter();

  // Estado para controlar qué pasos están expandidos
  const expandedSteps = ref<string[]>([]);
  const expandedCategories = ref<string[]>([]);

  // Expandir automáticamente el paso actual si tiene sub-steps
  watch(
    () => props.currentStepId,
    (newStepId) => {
      const currentStep = props.steps.find((s) => {
        const stepSlug = s.route.split("/").pop();
        return stepSlug === newStepId || s.route.includes(newStepId);
      });
      if (currentStep?.subSteps && currentStep.subSteps.length > 0) {
        if (!expandedSteps.value.includes(newStepId)) {
          expandedSteps.value.push(newStepId);
        }
      }
    },
    { immediate: true }
  );

  // Normalizar estado para CheckIcon
  const normalizeStatus = (
    status: NavigationStep["status"]
  ): "completed" | "current" | "empty" => {
    if (status === "completed" || status === "current") {
      return status;
    }
    return "empty";
  };

  // Normalizar estado de sub-step
  const normalizeSubStepStatus = (
    subStep: NavigationSubStep
  ): "completed" | "current" | "empty" => {
    if (subStep.status === "completed" || subStep.status === "current") {
      return subStep.status;
    }
    if (subStep.id === props.currentSubStepId) {
      return "current";
    }
    return "empty";
  };

  // Toggle paso (expandir/colapsar)
  const toggleStep = (step: NavigationStep) => {
    const stepSlug = step.route.split("/").pop() || "";
    if (expandedSteps.value.includes(stepSlug)) {
      expandedSteps.value = expandedSteps.value.filter((id) => id !== stepSlug);
    } else {
      expandedSteps.value.push(stepSlug);
    }
    if (props.onStepClick) {
      props.onStepClick(stepSlug);
    }
  };

  // Toggle categoría
  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.value.includes(categoryId)) {
      expandedCategories.value = expandedCategories.value.filter((id) => id !== categoryId);
    } else {
      expandedCategories.value.push(categoryId);
    }
  };

  // Agrupar sub-steps por categoría
  const getGroupedSubSteps = (subSteps: NavigationSubStep[]) => {
    const categories: Record<string, NavigationSubStep[]> = {};

    subSteps.forEach((subStep) => {
      const category = subStep.category || "General";
      if (!categories[category]) {
        categories[category] = [];
      }
      const categoryArray = categories[category];
      if (categoryArray) {
        categoryArray.push(subStep);
      }
    });

    return categories;
  };

  // Determinar si un paso está expandido
  const isStepExpanded = (step: NavigationStep) => {
    const stepSlug = step.route.split("/").pop() || "";
    return expandedSteps.value.includes(stepSlug);
  };

  // Determinar si un paso es el actual
  const isStepCurrent = (step: NavigationStep) => {
    const stepSlug = step.route.split("/").pop() || "";
    return stepSlug === props.currentStepId || step.route.includes(props.currentStepId);
  };

  // Obtener estilo del círculo (estilo probo-figma-ai)
  const getCircleStyle = (step: NavigationStep) => {
    const status = normalizeStatus(step.status);
    const isCurrent = isStepCurrent(step);

    if (status === "completed") {
      return {
        backgroundColor: "var(--primary-800, #6d28d9)",
        borderColor: "var(--primary-800, #6d28d9)",
        color: "white",
      };
    }
    if (status === "current" || isCurrent) {
      return {
        backgroundColor: "white",
        borderColor: "var(--primary-800, #6d28d9)",
        borderWidth: "2px",
        color: "var(--primary-800, #6d28d9)",
      };
    }
    return {
      backgroundColor: "white",
      borderColor: "var(--gray-300, #d1d5db)",
      borderWidth: "2px",
      color: "var(--gray-400, #9ca3af)",
    };
  };

  // Obtener color del texto
  const getTextColor = (step: NavigationStep) => {
    const status = normalizeStatus(step.status);
    const isCurrent = isStepCurrent(step);

    if (status === "completed" || status === "current" || isCurrent) {
      return "var(--text-primary, #111827)";
    }
    return "var(--text-muted, #6b7280)";
  };

  // Manejar click en sub-step
  const handleSubStepClick = (subStep: NavigationSubStep) => {
    router.push(subStep.route);
    props.onSubStepClick?.(subStep.id);
  };
</script>

<template>
  <div class="w-80 bg-white border-r overflow-y-auto h-full">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          style="
            background: linear-gradient(
              135deg,
              var(--primary-700, #6d28d9),
              var(--primary-500, #8b5cf6)
            );
            border-radius: var(--radius-medium, 0.5rem);
          "
        >
          <span v-if="icon" class="text-white text-xl">{{ icon }}</span>
          <span v-else class="text-white text-xl">📋</span>
        </div>
        <div>
          <h3
            class="text-sm font-primary font-semibold text-gray-900"
            style="
              color: var(--text-primary, #111827);
              font-family: var(--font-primary, sans-serif);
              font-weight: 600;
            "
          >
            {{ title }}
          </h3>
          <p
            class="text-xs font-secondary text-gray-600"
            style="
              color: var(--text-muted, #6b7280);
              font-family: var(--font-secondary, sans-serif);
            "
          >
            Paso {{ progress.current }} de {{ progress.total }}
          </p>
        </div>
      </div>

      <!-- Progress Bar -->
      <ProgressBarJuntas :current="progress.current" :total="progress.total" />

      <!-- Steps List -->
      <div class="space-y-1">
        <div v-for="(step, index) in steps" :key="index" class="relative">
          <!-- Línea conectora vertical -->
          <div
            v-if="
              index < steps.length - 1 || (index === steps.length - 1 && isStepExpanded(step))
            "
            class="absolute top-10 w-0.5"
            :style="{
              left: '15px',
              height: isStepExpanded(step) ? 'auto' : '100%',
              backgroundColor:
                normalizeStatus(step.status) === 'completed' ||
                normalizeStatus(step.status) === 'current'
                  ? 'var(--primary-800, #6d28d9)'
                  : 'var(--gray-300, #d1d5db)',
            }"
          />

          <!-- Step Content -->
          <div
            @click="
              () => {
                if (step.subSteps && step.subSteps.length > 0) {
                  toggleStep(step);
                } else {
                  router.push(step.route);
                  props.onStepClick?.(step.route.split('/').pop() || '');
                }
              }
            "
            :class="[
              'flex gap-3 py-3 px-2 rounded-lg transition-colors cursor-pointer',
              isStepCurrent(step) ? 'bg-purple-50' : 'hover:bg-gray-50',
            ]"
          >
            <!-- Circle (estilo probo-figma-ai) -->
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 relative z-10"
              :style="getCircleStyle(step)"
            >
              <component
                v-if="normalizeStatus(step.status) === 'completed'"
                :is="getIcon('Check')"
                v-bind="getIcon('Check') ? {} : {}"
                class="w-4 h-4 text-white"
              />
              <span
                v-else-if="normalizeStatus(step.status) === 'current' || isStepCurrent(step)"
                class="w-2 h-2 rounded-full"
                style="background-color: var(--primary-800, #6d28d9)"
              />
              <span
                v-else
                class="w-2 h-2 rounded-full"
                style="background-color: var(--gray-400, #9ca3af)"
              />
            </div>

            <!-- Text -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4
                  class="text-sm mb-1 flex-1 font-secondary"
                  :style="{
                    color: getTextColor(step),
                    fontFamily: 'var(--font-secondary, sans-serif)',
                    fontWeight: isStepCurrent(step) ? 600 : 500,
                  }"
                >
                  {{ step.title }}
                </h4>
                <component
                  v-if="step.subSteps && step.subSteps.length > 0"
                  :is="getIcon(isStepExpanded(step) ? 'ChevronDown' : 'ChevronRight')"
                  v-bind="
                    getIcon(isStepExpanded(step) ? 'ChevronDown' : 'ChevronRight') ? {} : {}
                  "
                  class="w-4 h-4"
                  style="color: var(--text-muted, #6b7280)"
                />
              </div>
              <p
                class="text-xs line-clamp-2 font-secondary"
                :style="{
                  color:
                    normalizeStatus(step.status) === 'empty'
                      ? 'var(--text-muted, #6b7280)'
                      : 'var(--text-secondary, #4b5563)',
                  fontFamily: 'var(--font-secondary, sans-serif)',
                }"
              >
                {{ step.description }}
              </p>
            </div>
          </div>

          <!-- Sub-steps (solo si está expandido) -->
          <div
            v-if="isStepExpanded(step) && step.subSteps && step.subSteps.length > 0"
            class="ml-8 mt-2 space-y-2"
          >
            <!-- Agrupar por categoría -->
            <div
              v-for="(subStepsInCategory, category) in getGroupedSubSteps(step.subSteps)"
              :key="category"
              class="space-y-1"
            >
              <!-- Header de Categoría (colapsable) -->
              <button
                @click="toggleCategory(category)"
                class="w-full flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 transition-colors"
              >
                <component
                  :is="getIcon('ChevronRight')"
                  v-if="getIcon('ChevronRight')"
                  :class="[
                    'w-4 h-4 text-gray-600 transition-transform',
                    expandedCategories.includes(category) ? 'rotate-90' : '',
                  ]"
                />
                <span
                  class="text-sm font-secondary font-semibold text-gray-700 flex-1 text-left"
                >
                  {{ category }}
                </span>
              </button>

              <!-- Sub-items de la categoría -->
              <div v-if="expandedCategories.includes(category)" class="ml-6 mt-1 space-y-1">
                <div
                  v-for="subStep in subStepsInCategory"
                  :key="subStep.id"
                  class="flex items-start gap-2"
                >
                  <CheckIcon
                    :status="normalizeSubStepStatus(subStep)"
                    :is-final-item="false"
                  />
                  <button
                    @click="handleSubStepClick(subStep)"
                    :class="[
                      'flex flex-col gap-1 cursor-pointer group text-left',
                      subStep.id === currentSubStepId
                        ? 'text-primary-800'
                        : 'text-gray-600 hover:text-primary-800',
                    ]"
                  >
                    <p
                      class="font-primary font-medium t-b1 transition-colors group-hover:underline"
                    >
                      {{ subStep.title }}
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
