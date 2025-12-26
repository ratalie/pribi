<template>
  <div class="min-h-full">
    <HistorialJuntasHeader
      :title="'Registro de Juntas'"
      :description="`${juntasList.length} ${
        juntasList.length === 1 ? 'junta registrada' : 'juntas registradas'
      }`"
      @create="handleCreate"
    />

    <!-- Responsive container: px-4 (<1280), px-6 (1280-1440), px-8 (>1440) -->
    <div class="vista-container">
      <div class="space-y-6">
        <!-- Selector de Sociedades -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <SociedadSelector
            :sociedades="sociedades"
            :selected-society-id="selectedSocietyId"
            :is-loading="isLoadingSociedades"
            @update:selected-society-id="handleSocietyChange"
          />
        </div>

        <!-- Tabla de Juntas -->
        <HistorialTable
          v-if="selectedSocietyId"
          :data="juntas"
          :is-loading="isLoading"
          :actions="tableActions"
          :get-estado="getEstado"
          :get-fecha-junta="getFechaJunta"
          :get-nombre-junta="getNombreJunta"
          :get-tipo-junta="getTipoJunta"
        />

        <!-- Empty State -->
        <div
          v-else
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
        >
          <History class="w-16 h-16 mx-auto mb-4" style="color: var(--text-muted)" />
          <h3
            class="text-xl font-semibold mb-2"
            style="
              color: var(--text-primary);
              font-family: var(--font-primary);
            "
          >
            Selecciona una sociedad
          </h3>
          <p
            class="text-sm"
            style="
              color: var(--text-muted);
              font-family: var(--font-secondary);
            "
          >
            Elige una sociedad del selector para ver su histórico de juntas
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { History } from "lucide-vue-next";
import { computed } from "vue";
import { useHistorialJuntas } from "../composables/useHistorialJuntas";
import HistorialJuntasHeader from "./organisms/HistorialJuntasHeader.vue";
import HistorialTable from "./organisms/HistorialTable.vue";
import SociedadSelector from "~/core/presentation/shared/components/molecules/SociedadSelector.vue";

const {
  sociedades,
  juntas,
  isLoading,
  isLoadingSociedades,
  selectedSocietyId,
  getEstado,
  getFechaJunta,
  getNombreJunta,
  getTipoJunta,
  handleSocietyChange,
  handleCreate,
  tableActions,
} = useHistorialJuntas();

// Asegurar que juntas siempre sea un array para el contador
const juntasList = computed(() => {
  return Array.isArray(juntas.value) ? juntas.value : [];
});
</script>

<style scoped>
  /* Sistema de estilos responsivos consistente - Estilo v2.5 */
  .vista-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 1rem; /* Default: < 1280px */
    min-height: calc(100vh - 200px);
  }

  /* Breakpoint >= 1280px y < 1440px */
  @media (min-width: 1280px) and (max-width: 1439px) {
    .vista-container {
      padding: 1.5rem;
    }
  }

  /* Breakpoint >= 1440px */
  @media (min-width: 1440px) {
    .vista-container {
      padding: 2rem;
    }
  }
</style>




