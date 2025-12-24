<template>
  <div class="min-h-full bg-gray-50">
    <CrearJuntasHeader />

    <div class="vista-container">
      <div class="space-y-8">
        <!-- Selector de Sociedades -->
        <SociedadSelectorSection
          :sociedades="sociedades"
          :selected-society-id="selectedSocietyId"
          :selected-sociedad="selectedSociedad"
          :is-loading-sociedades="isLoadingSociedades"
          :is-submitting="isSubmitting"
          @update:selected-society-id="handleSociedadChange"
        />

        <!-- Timeline -->
        <PasosTimeline
          :pasos="sociedadSteps"
          :get-color-classes="getColorClasses"
        />

        <!-- Footer con Botón -->
        <FooterActions
          :is-submitting="isSubmitting"
          :error-message="errorMessage"
          :disabled="!canStart"
          message="Puedes reanudar un borrador guardado desde el módulo de historial cuando esté disponible."
          :button-label="canStart ? 'Comenzar formulario guiado' : 'Selecciona una sociedad para continuar'"
          :icon="Crown"
          @start-flow="handleStartFlow"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useCrearJunta } from "../composables/useCrearJunta";
import CrearJuntasHeader from "./organisms/CrearJuntasHeader.vue";
import SociedadSelectorSection from "./organisms/SociedadSelectorSection.vue";
import PasosTimeline from "~/core/presentation/shared/components/organisms/PasosTimeline.vue";
import FooterActions from "~/core/presentation/shared/components/organisms/FooterActions.vue";

const {
  sociedadSteps,
  selectedSocietyId,
  selectedSociedad,
  sociedades,
  isSubmitting,
  isLoadingSociedades,
  errorMessage,
  canStart,
  handleStartFlow,
  getColorClasses,
} = useCrearJunta();

// Logs para debuggear
onMounted(() => {
  console.log("🔍 [CrearJuntaManager] onMounted:", {
    sociedades: sociedades.value,
    sociedadesLength: sociedades.value?.length || 0,
    selectedSocietyId: selectedSocietyId.value,
    selectedSociedad: selectedSociedad.value,
    isLoadingSociedades: isLoadingSociedades.value,
  });
});

watch(
  () => sociedades.value,
  (newVal) => {
    console.log("👀 [CrearJuntaManager] sociedades changed:", {
      newVal,
      length: newVal?.length || 0,
      isArray: Array.isArray(newVal),
    });
  },
  { immediate: true, deep: true }
);

const handleSociedadChange = (value: number | null) => {
  console.log("🔄 [CrearJuntaManager] handleSociedadChange:", value);
  selectedSocietyId.value = value;
};
</script>

<style scoped>
  /* Sistema de estilos responsivos consistente */
  .vista-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 1.5rem 1rem; /* Default: < 1280px */
  }

  /* Breakpoint >= 1280px y < 1440px */
  @media (min-width: 1280px) and (max-width: 1439px) {
    .vista-container {
      padding: 2rem 1.5rem;
    }
  }

  /* Breakpoint >= 1440px */
  @media (min-width: 1440px) {
    .vista-container {
      padding: 2.5rem 2rem;
    }
  }
</style>

