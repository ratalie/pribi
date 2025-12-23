<template>
  <div class="min-h-full bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-[1600px] mx-auto px-8 py-8">
        <div class="flex items-center gap-4 mb-3">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style="background: linear-gradient(135deg, var(--primary-700), var(--primary-500))"
          >
            <Building2 class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1
              class="text-3xl font-bold mb-1"
              style="
                color: var(--text-primary);
                font-family: var(--font-primary);
              "
            >
              Crear Nueva Sociedad
            </h1>
            <p
              class="text-base"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              Completa el formulario guiado de 10 pasos para registrar una nueva sociedad
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-[1600px] mx-auto px-8 py-12">
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
import PasosTimeline from "./organisms/PasosTimeline.vue";
import FooterActions from "./organisms/FooterActions.vue";

const {
  sociedadSteps,
  isSubmitting,
  errorMessage,
  handleStartFlow,
  getColorClasses,
} = useAgregarSociedad();
</script>

