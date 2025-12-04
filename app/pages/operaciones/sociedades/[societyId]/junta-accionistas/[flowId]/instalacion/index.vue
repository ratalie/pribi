<script setup lang="ts">
import { computed } from "vue";
import DetallesCelebracionSection from "~/components/juntas/instalacion/DetallesCelebracionSection.vue";
import QuorumSection from "~/components/juntas/instalacion/QuorumSection.vue";
import AsistenciaRepresentacionSection from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/AsistenciaRepresentacionSection.vue";
import MesaDirectivaSection from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/MesaDirectivaSection.vue";

// ========================================
// PAGE META
// ========================================
definePageMeta({
  layout: "registros",
});

// ========================================
// ROUTE PARAMS
// ========================================
const route = useRoute();
const societyId = computed(() => parseInt(route.params.societyId as string, 10));
const flowId = computed(() => route.params.flowId as string);
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <!-- ========================================
         SECCIÓN 1: Detalles de la Celebración
         ======================================== -->
    <DetallesCelebracionSection />

    <!-- Quorum (debajo de detalles, solo si es GENERAL) -->
    <QuorumSection />

    <!-- ========================================
         SECCIÓN 2: Asistencia y Representación
         ======================================== -->
    <AsistenciaRepresentacionSection 
      :society-id="societyId" 
      :flow-id="flowId" 
    />

    <!-- ========================================
         SECCIÓN 3: Mesa Directiva (Presidente y Secretario)
         ======================================== -->
    <MesaDirectivaSection 
      :society-id="societyId" 
      :flow-id="flowId" 
    />
  </div>
</template>
