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

  // Función para actualizar el estado expandido basado en los steps actuales
  const updateExpandedSteps = () => {
    console.log("🔴 [SingleWizardSidebarJuntas] updateExpandedSteps ejecutado");
    console.log("🔴 [SingleWizardSidebarJuntas] props.steps:", props.steps);
    console.log("🔴 [SingleWizardSidebarJuntas] props.currentStepId:", props.currentStepId);
    
    const newSteps = props.steps;
    
    // Expandir paso actual si tiene sub-steps
    const currentStep = newSteps.find((s) => {
      const stepSlug = s.route.split("/").pop();
      return stepSlug === props.currentStepId || s.route.includes(props.currentStepId);
    });
    if (currentStep?.subSteps && currentStep.subSteps.length > 0) {
      const stepSlug = currentStep.route.split("/").pop() || "";
      if (!expandedSteps.value.includes(stepSlug)) {
        expandedSteps.value.push(stepSlug);
        console.log("🔴 [SingleWizardSidebarJuntas] Expandido paso actual:", stepSlug);
      }
    }
    
    // ⭐ SIEMPRE expandir "puntos-acuerdo" si existe (incluso si no tiene sub-steps aún)
    const puntosAcuerdoStep = newSteps.find((s) => {
      const stepSlug = s.route.split("/").pop();
      return stepSlug === "puntos-acuerdo";
    });
    
    if (puntosAcuerdoStep) {
      const subStepsCount = puntosAcuerdoStep.subSteps?.length || 0;
      console.log("🔴 [SingleWizardSidebarJuntas] Paso 'puntos-acuerdo' encontrado, sub-steps:", subStepsCount);
      console.log("🔴 [SingleWizardSidebarJuntas] Sub-steps IDs:", puntosAcuerdoStep.subSteps?.map(s => s.id) || []);
      
      // Siempre expandir "puntos-acuerdo" si existe
      if (!expandedSteps.value.includes("puntos-acuerdo")) {
        expandedSteps.value.push("puntos-acuerdo");
        console.log("🔴 [SingleWizardSidebarJuntas] Expandido 'puntos-acuerdo'");
      }
      
      // Expandir todas las categorías de "puntos-acuerdo" si tiene sub-steps
      if (subStepsCount > 0) {
        const categories = new Set(puntosAcuerdoStep.subSteps?.map(s => s.category) || []);
        categories.forEach(category => {
          if (!expandedCategories.value.includes(category)) {
            expandedCategories.value.push(category);
            console.log("🔴 [SingleWizardSidebarJuntas] Expandida categoría:", category);
          }
        });
      }
    } else {
      console.log("🔴 [SingleWizardSidebarJuntas] Paso 'puntos-acuerdo' NO encontrado en steps");
    }
  };

  // Watch para props.steps (cambios en el array completo)
  watch(
    () => props.steps,
    (newSteps, oldSteps) => {
      console.log("🔴 [SingleWizardSidebarJuntas] Watch props.steps cambiaron");
      console.log("🔴 [SingleWizardSidebarJuntas] Old steps count:", oldSteps?.length || 0);
      console.log("🔴 [SingleWizardSidebarJuntas] New steps count:", newSteps.length);
      
      // Verificar si "puntos-acuerdo" cambió
      const oldPuntosAcuerdo = oldSteps?.find(s => s.route.includes("puntos-acuerdo"));
      const newPuntosAcuerdo = newSteps.find(s => s.route.includes("puntos-acuerdo"));
      
      if (oldPuntosAcuerdo && newPuntosAcuerdo) {
        const oldSubStepsCount = oldPuntosAcuerdo.subSteps?.length || 0;
        const newSubStepsCount = newPuntosAcuerdo.subSteps?.length || 0;
        console.log("🔴 [SingleWizardSidebarJuntas] 'puntos-acuerdo' sub-steps:", { old: oldSubStepsCount, new: newSubStepsCount });
      }
      
      updateExpandedSteps();
    },
    { immediate: true, deep: true }
  );

  // Watch para props.currentStepId
  watch(
    () => props.currentStepId,
    () => {
      console.log("🔴 [SingleWizardSidebarJuntas] Watch currentStepId cambiaron:", props.currentStepId);
      updateExpandedSteps();
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


  // Manejar click en sub-step
  const handleSubStepClick = (subStep: NavigationSubStep) => {
    router.push(subStep.route);
    props.onSubStepClick?.(subStep.id);
  };
</script>

<template>
  <div class="w-[401px] shrink-0 border-r bg-white overflow-y-auto h-full">
    <div class="px-6 py-14">
      <!-- Header con ícono y título -->
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style="
            background: linear-gradient(135deg, #673AB7, #9C27B0);
            border-radius: 8px;
          "
        >
          <component
            :is="getIcon('Users')"
            v-if="getIcon('Users')"
            class="w-5 h-5 text-white"
          />
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-white"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-primary font-semibold text-gray-900" style="color: #212121">
            {{ title }}
          </h3>
          <p class="text-xs font-secondary text-gray-600" style="color: #757575">
            Paso {{ progress.current }} de {{ progress.total }}
          </p>
        </div>
      </div>

      <!-- Progress Bar -->
      <ProgressBarJuntas :current="progress.current" :total="progress.total" />

      <!-- Steps List -->
      <div>
        <div v-for="(step, index) in steps" :key="index" class="flex items-start gap-4">
          <!-- CheckIcon (estilo registros) -->
          <CheckIcon
            :status="normalizeStatus(step.status)"
            :is-final-item="index === steps.length - 1 && !isStepExpanded(step)"
          />

          <!-- Step Content -->
          <div class="flex-1">
            <!-- Step Principal -->
            <div class="flex items-center gap-2">
              <!-- "puntos-acuerdo" siempre es desplegable, incluso sin sub-steps -->
              <div
                v-if="step.route.includes('puntos-acuerdo') || (step.subSteps && step.subSteps.length > 0)"
                class="flex flex-col gap-1 cursor-pointer group flex-1"
                @click="toggleStep(step)"
              >
                <div class="flex items-center gap-2">
                  <p
                    class="font-primary font-medium text-gray-600 t-t1 group-hover:text-primary-800 transition-colors group-hover:underline"
                  >
                    {{ step.title }}
                  </p>
                  <component
                    :is="getIcon(isStepExpanded(step) ? 'ChevronDown' : 'ChevronRight')"
                    v-if="getIcon('ChevronDown') && getIcon('ChevronRight')"
                    class="w-4 h-4 text-gray-600 transition-transform"
                    :class="isStepExpanded(step) ? 'rotate-180' : ''"
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
                @click="props.onStepClick?.(step.route.split('/').pop() || '')"
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
                    class="flex items-start gap-4"
                  >
                    <CheckIcon
                      :status="normalizeSubStepStatus(subStep)"
                      :is-final-item="false"
                    />
                    <NuxtLink
                      :to="subStep.route"
                      class="flex flex-col gap-1 cursor-pointer group"
                      @click="handleSubStepClick(subStep)"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
