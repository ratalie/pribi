<template>
  <div class="min-h-full bg-gray-50">
    <!-- Header -->
    <CrearJuntasHeader
      :is-submitting="isSubmitting"
      :can-start="canStart"
      @start="handleStartFlow"
    />

    <!-- Contenido Principal -->
    <div class="vista-container">
      <div class="space-y-6">
        <!-- Selector de Sociedades -->
        <SociedadSelectorSection
          :sociedades="sociedades"
          :selected-society-id="selectedSocietyId"
          :selected-sociedad="selectedSociedad"
          :is-loading-sociedades="isLoadingSociedades"
          :is-submitting="isSubmitting"
          @update:selected-society-id="handleSociedadChange"
        />

        <!-- Información inicial -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style="
                background: linear-gradient(135deg, var(--primary-600), var(--primary-400));
              "
            >
              <Users class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1">
              <p
                class="text-sm leading-relaxed mb-3"
                style="color: var(--text-muted); font-family: var(--font-secondary)"
              >
                Completarás la información de la junta, puntos de agenda, detalles, instalación
                y generarás toda la documentación legal necesaria de forma automática.
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
                  6 pasos
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
        <PasosTimelineGrid :pasos="sociedadSteps" :get-color-classes="getColorClasses" />

        <!-- Footer con Mensaje -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div
            class="text-sm flex items-center gap-2"
            style="color: var(--text-muted); font-family: var(--font-secondary)"
          >
            <CheckCircle2 class="w-4 h-4 text-green-500 shrink-0" />
            <p>
              Puedes reanudar un borrador guardado desde el módulo de historial cuando esté
              disponible.
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
  import { onMounted, watch } from "vue";
  import { Users, FileText, CheckCircle2 } from "lucide-vue-next";
  import { useCrearJunta } from "../composables/useCrearJunta";
  import CrearJuntasHeader from "./organisms/CrearJuntasHeader.vue";
  import SociedadSelectorSection from "./organisms/SociedadSelectorSection.vue";
  import PasosTimelineGrid from "~/core/presentation/shared/components/organisms/PasosTimelineGrid.vue";

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
