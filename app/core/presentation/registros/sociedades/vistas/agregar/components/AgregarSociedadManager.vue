<template>
  <div class="min-h-full bg-gray-50">
    <!-- Header -->
    <VistaHeader
      :icon="Building2"
      title="Crear Nueva Sociedad"
      description="Inicia el proceso guiado para crear una nueva sociedad"
    >
      <template #right>
        <Button
          variant="primary"
          size="lg"
          class="shadow-lg hover:shadow-xl transition-all font-semibold px-8 py-2.5"
          :disabled="isSubmitting"
          @click="handleStartFlow"
          style="
            background: linear-gradient(135deg, var(--primary-800), var(--primary-600));
            font-family: var(--font-secondary);
            font-weight: 600;
          "
        >
          <LoaderCircle
            v-if="isSubmitting"
            class="mr-2 h-5 w-5 animate-spin"
          />
          <Play
            v-else
            class="mr-2 h-5 w-5"
          />
          Iniciar Proceso
        </Button>
      </template>
    </VistaHeader>

    <!-- Contenido Principal -->
    <div class="vista-container">
      <div class="space-y-6">
        <!-- Información inicial -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style="
                background: linear-gradient(135deg, var(--primary-600), var(--primary-400));
              "
            >
              <Building2 class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1">
              <p
                class="text-sm leading-relaxed mb-3"
                style="
                  color: var(--text-muted);
                  font-family: var(--font-secondary);
                "
              >
                Completarás la información básica, socios, directores, estatutos y generarás toda la documentación legal necesaria de forma automática.
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style="
                    background-color: var(--primary-50);
                    color: var(--primary-700);
                    border: 1px solid var(--primary-200);
                    font-family: var(--font-secondary);
                  "
                >
                  <FileText class="w-3 h-3" />
                  9 pasos
                </span>
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style="
                    background-color: var(--primary-50);
                    color: var(--primary-700);
                    border: 1px solid var(--primary-200);
                    font-family: var(--font-secondary);
                  "
                >
                  <CheckCircle2 class="w-3 h-3" />
                  15-20 minutos
                </span>
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style="
                    background-color: var(--primary-50);
                    color: var(--primary-700);
                    border: 1px solid var(--primary-200);
                    font-family: var(--font-secondary);
                  "
                >
                  <CheckCircle2 class="w-3 h-3" />
                  Guardado automático
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pasos del Proceso en Grid -->
        <PasosTimelineGrid
          :pasos="sociedadSteps"
          :get-color-classes="getColorClasses"
        />

        <!-- Footer con Mensaje -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div
            class="text-sm flex items-center gap-2"
            style="
              color: var(--text-muted);
              font-family: var(--font-secondary);
            "
          >
            <CheckCircle2 class="w-4 h-4 text-green-500 flex-shrink-0" />
            <p>
              Puedes reanudar un borrador guardado desde el módulo de historial cuando esté disponible.
            </p>
          </div>
          <p
            v-if="errorMessage"
            class="text-sm text-red-500 font-medium mt-2"
            style="font-family: var(--font-secondary)"
          >
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building2, FileText, CheckCircle2, Play, LoaderCircle } from "lucide-vue-next";
import { useAgregarSociedad } from "../composables/useAgregarSociedad";
import VistaHeader from "~/core/presentation/shared/components/VistaHeader.vue";
import PasosTimelineGrid from "~/core/presentation/shared/components/organisms/PasosTimelineGrid.vue";
import { Button } from "@/components/ui/button";

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

