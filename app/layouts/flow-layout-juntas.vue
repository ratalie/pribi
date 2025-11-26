<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import HeaderJuntasNavbar from "~/components/flow-layout-juntas/HeaderJuntasNavbar.vue";
  import SingleWizardSidebarJuntas from "~/components/flow-layout-juntas/SingleWizardSidebarJuntas.vue";
  import WizardRightSidebar from "~/components/flow-layout-juntas/WizardRightSidebar.vue";
  import { useJuntasNavbarRoutes } from "~/composables/useJuntasNavbarRoutes";
  import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
  import type { SectionItem } from "~/types/junta-navigation.types";

  /**
   * FlowLayoutJuntas - Layout para el flujo de Juntas de Accionistas
   *
   * Este layout será usado cuando las páginas de juntas definan:
   * definePageMeta({
   *   layout: "registros",
   *   flowLayoutJuntas: true,
   * });
   *
   * Estructura:
   * - Header: Breadcrumbs y botones de acción
   * - Sidebar Izquierdo: Pasos principales y sub-steps colapsables
   * - Contenido: Área principal con slot
   * - Sidebar Derecho: Secciones dentro de un sub-step (condicional)
   * - Footer: Botón "Siguiente"
   */

  const { steps, currentStepIndex, currentStepSlug, currentSubStepId, currentSectionId } =
    useJuntasNavbarRoutes();

  const juntasFlowStore = useJuntasFlowStore();

  // Determinar si debe mostrarse el sidebar derecho
  const hasRightSidebar = computed(() => juntasFlowStore.hasRightSidebar);

  // Obtener las secciones del sub-step actual
  // TODO: Esto debería venir de una configuración o del store
  // Por ahora, creamos secciones básicas según el sub-step
  const getSectionsForSubStep = (subStepId?: string): SectionItem[] => {
    if (!subStepId) return [];

    // Mapeo básico de sub-steps a secciones
    // Esto se puede expandir con una configuración más completa
    const sectionsMap: Record<string, SectionItem[]> = {
      "aporte-dinerarios": [
        {
          id: "seleccion-aportantes",
          title: "Selección de Aportantes",
          description: "Selecciona los aportantes",
          status: "current",
        },
        {
          id: "aportes-dinerarios",
          title: "Aportes Dinerarios",
          description: "Completa los montos de aporte",
          status: "upcoming",
        },
        {
          id: "votacion",
          title: "Votación",
          description: "Registra la votación",
          status: "upcoming",
        },
        {
          id: "resumen",
          title: "Resumen",
          description: "Revisa el resumen",
          status: "upcoming",
        },
      ],
      // Agregar más mapeos según sea necesario
    };

    return sectionsMap[subStepId] || [];
  };

  const sections = computed(() => {
    return getSectionsForSubStep(currentSubStepId.value);
  });

  // Manejar click en sección (scroll a la sección)
  const handleSectionClick = (sectionId: string) => {
    juntasFlowStore.setCurrentSection(sectionId);
    // Scroll a la sección usando el hash
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Manejar click en paso
  const handleStepClick = (_stepId: string) => {
    // La navegación se maneja automáticamente por el NuxtLink en el sidebar
  };

  // Manejar click en sub-step
  const handleSubStepClick = (_subStepId: string) => {
    // La navegación se maneja automáticamente por el router en el sidebar
  };

  const router = useRouter();

  // Manejar botón "Salir"
  const handleBack = () => {
    router.push("/operaciones/junta-accionistas");
  };

  // Manejar botón "Guardar"
  const handleSave = () => {
    // TODO: Implementar lógica de guardado
    console.log("Guardar cambios");
  };

  // Manejar botón "Restablecer"
  const handleReset = () => {
    // TODO: Implementar lógica de restablecimiento
    console.log("Restablecer formulario");
  };

  // Manejar botón "Anterior"
  const handlePrev = () => {
    const currentIdx = currentStepIndex.value;
    if (currentIdx > 0) {
      const prevStep = steps[currentIdx - 1];
      if (prevStep) {
        router.push(prevStep.route);
      }
    }
  };
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- Header -->
    <HeaderJuntasNavbar
      :steps="steps"
      :current-step-index="currentStepIndex"
      :on-back="handleBack"
      :on-save="handleSave"
      :on-reset="handleReset"
    />

    <!-- Body -->
    <div class="flex min-h-0 flex-1">
      <!-- Sidebar Izquierdo -->
      <SingleWizardSidebarJuntas
        :steps="steps"
        :current-step-id="currentStepSlug"
        :current-sub-step-id="currentSubStepId"
        :on-step-click="handleStepClick"
        :on-sub-step-click="handleSubStepClick"
        title="Junta de Accionistas"
        :progress="{
          current: currentStepIndex + 1,
          total: steps.length,
        }"
      />

      <!-- Contenido Principal + Sidebar Derecho -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Área de Contenido -->
        <div class="flex-1 overflow-hidden">
          <div v-if="hasRightSidebar" class="flex h-full">
            <!-- Contenido Principal (con sidebar derecho) -->
            <div class="flex-1 overflow-y-auto px-8 py-6">
              <slot />
            </div>

            <!-- Sidebar Derecho (solo cuando hay sub-step activo) -->
            <WizardRightSidebar
              :sections="sections"
              :current-section-id="currentSectionId || sections[0]?.id || ''"
              :on-section-click="handleSectionClick"
              :title="
                steps.find((s) => s.subSteps?.some((ss) => ss.id === currentSubStepId))
                  ?.title || 'Secciones'
              "
            />
          </div>

          <!-- Contenido Principal (sin sidebar derecho) -->
          <div v-else class="overflow-y-auto px-8 py-6">
            <slot />
          </div>
        </div>

        <!-- Footer -->
        <div
          class="bg-white border-t px-8 py-4 shrink-0"
          style="border-color: var(--border-light, #e5e7eb)"
        >
          <div class="flex items-center justify-between max-w-5xl mx-auto">
            <!-- Botón Anterior -->
            <ActionButton
              label="Anterior"
              size="md"
              variant="outline"
              :is-disabled="currentStepIndex === 0"
              icon="ArrowLeft"
              icon-position="left"
              @click="handlePrev"
            />

            <!-- Paso actual -->
            <div
              class="text-sm font-secondary"
              style="
                color: var(--text-muted, #6b7280);
                font-family: var(--font-secondary, sans-serif);
              "
            >
              Paso {{ currentStepIndex + 1 }} de {{ steps.length }}
            </div>

            <!-- Botón Siguiente -->
            <ActionButton
              :label="currentStepIndex === steps.length - 1 ? 'Finalizar' : 'Siguiente'"
              size="md"
              :is-loading="juntasFlowStore.isLoading"
              :icon="currentStepIndex === steps.length - 1 ? 'Check' : 'ArrowRight'"
              icon-position="right"
              @click="juntasFlowStore.onClickNext"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .flow-layout-juntas {
    display: flex;
    min-height: 100vh;
    background-color: var(--color-background, #f9fafb);
  }
</style>
