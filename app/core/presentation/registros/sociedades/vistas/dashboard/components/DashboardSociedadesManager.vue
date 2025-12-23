<template>
  <div class="min-h-full bg-gray-50">
    <DashboardHeader @create="handleCreate" />

    <div class="max-w-[1600px] mx-auto px-8 py-10">
      <StatsSection :stats="stats" />

      <SociedadesTable
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
import DashboardHeader from "./organisms/DashboardHeader.vue";
import StatsSection from "./organisms/StatsSection.vue";
import SociedadesTable from "./organisms/SociedadesTable.vue";

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

