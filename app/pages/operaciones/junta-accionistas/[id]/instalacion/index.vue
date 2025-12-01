<template>
  <SlotWrapper>
    <TitleH2
      title="Instalación de la Junta"
      subtitle="Realiza la convocatoria, registra la asistencia y conforma la mesa directiva."
    />

    <div class="flex flex-col gap-10">
      <ConvocatoriaRealizadaSection />
      <AsistenciaRepresentacionSection />
      <MesaDirectivaSection />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import ConvocatoriaRealizadaSection from "~/components/juntas/instalacion/ConvocatoriaRealizadaSection.vue";
import AsistenciaRepresentacionSection from "~/components/juntas/instalacion/AsistenciaRepresentacionSection.vue";
import MesaDirectivaSection from "~/components/juntas/instalacion/MesaDirectivaSection.vue";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Instalación de la Junta
 * 
 * Paso 3 del flujo de Juntas de Accionistas.
 * Realiza la convocatoria, registra la asistencia y conforma la mesa directiva.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/instalacion
 */

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  // TODO: Agregar validación y guardado de datos
  // Por ahora, solo permite navegar al siguiente paso
});
</script>
