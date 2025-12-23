<template>
  <div class="min-h-full bg-gray-50">
    <DashboardSociedadesHeader @create="handleCreate" />

    <div class="vista-container">
      <StatsSection :stats="stats" />

      <DashboardSociedadesTable
        :sociedades="sociedades"
        :get-estado="getEstado"
        @sociedad-click="(id) => router.push(`/registros/sociedades/${id}/datos-sociedad`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";
import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";
import type { EstadoSociedad } from "~/core/presentation/registros/sociedades/vistas/historial/types/historial.types";
import { useDashboardSociedades } from "../composables/useDashboardSociedades";
import DashboardSociedadesHeader from "./organisms/DashboardSociedadesHeader.vue";
import StatsSection from "~/core/presentation/shared/components/organisms/StatsSection.vue";
import DashboardSociedadesTable from "./organisms/DashboardSociedadesTable.vue";

const router = useRouter();
const { sociedades, stats, handleCreate } = useDashboardSociedades();

const getEstado = (sociedad: SociedadResumenDTO): EstadoSociedad => {
  const paso = sociedad.pasoActual;
  if (paso === SocietyRegisterStep.FINALIZAR) {
    return { label: "Completado", isComplete: true };
  }
  return { label: "Pendiente", isComplete: false };
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

