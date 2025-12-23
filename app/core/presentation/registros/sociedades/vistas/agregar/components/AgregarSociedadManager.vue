<template>
  <div class="min-h-full bg-gray-50">
    <!-- Header -->
    <VistaHeader
      :icon="Building2"
      title="Crear Nueva Sociedad"
      description="Completa el formulario guiado de 10 pasos para registrar una nueva sociedad"
    />

    <!-- Contenido Principal -->
    <div class="vista-container">
      <PasosTimeline
        :pasos="sociedadSteps"
        :get-color-classes="getColorClasses"
      />

      <FooterActions
        :is-submitting="isSubmitting"
        :error-message="errorMessage"
        @start-flow="handleStartFlow"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building2 } from "lucide-vue-next";
import { useAgregarSociedad } from "../composables/useAgregarSociedad";
import VistaHeader from "~/core/presentation/shared/components/VistaHeader.vue";
import PasosTimeline from "~/core/presentation/shared/components/organisms/PasosTimeline.vue";
import FooterActions from "~/core/presentation/shared/components/organisms/FooterActions.vue";

const {
  sociedadSteps,
  isSubmitting,
  errorMessage,
  handleStartFlow,
  getColorClasses,
} = useAgregarSociedad();
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

