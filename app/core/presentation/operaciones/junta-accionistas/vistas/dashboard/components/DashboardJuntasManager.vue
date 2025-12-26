<template>
  <div class="min-h-full bg-gray-50">
    <DashboardJuntasHeader
      :selected-society-id="selectedSocietyId"
      @create="handleCreate"
    />

    <div class="vista-container">
      <!-- Selector de Sociedad -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <SociedadSelector
          :sociedades="sociedades"
          :selected-society-id="selectedSocietyId"
          label="Selecciona la sociedad"
          @update:selected-society-id="handleSociedadChange"
        />
      </div>

      <!-- Stats Cards -->
      <StatsSection v-if="selectedSocietyId" :stats="stats" />

      <!-- Tabla de Juntas -->
      <DashboardJuntasTable
        v-if="selectedSocietyId"
        :juntas="juntas"
        :selected-society-id="selectedSocietyId"
        :get-estado="getEstado"
      />

      <!-- Empty State -->
      <EmptyStateSelector v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { JuntaResumenDTO } from "~/core/hexag/juntas/application/dtos";
import type { EstadoJunta } from "../historial/types/historial.types";
import { useDashboardJuntas } from "../composables/useDashboardJuntas";
import DashboardJuntasHeader from "./organisms/DashboardJuntasHeader.vue";
import StatsSection from "~/core/presentation/shared/components/organisms/StatsSection.vue";
import DashboardJuntasTable from "./organisms/DashboardJuntasTable.vue";
import SociedadSelector from "~/core/presentation/shared/components/molecules/SociedadSelector.vue";
import EmptyStateSelector from "./organisms/EmptyStateSelector.vue";

const router = useRouter();
const {
  sociedades,
  juntas,
  selectedSocietyId,
  stats,
  handleCreate,
  handleSociedadChange,
} = useDashboardJuntas();

const getEstado = (junta: JuntaResumenDTO): EstadoJunta => {
  const estado = junta.estado;
  if (estado === "FINALIZADO") {
    return { label: "FINALIZADO", isComplete: true, isEnProceso: false };
  }
  if (estado === "EN_PROCESO") {
    return { label: "EN PROCESO", isComplete: false, isEnProceso: true };
  }
  return { label: "BORRADOR", isComplete: false, isEnProceso: false };
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




