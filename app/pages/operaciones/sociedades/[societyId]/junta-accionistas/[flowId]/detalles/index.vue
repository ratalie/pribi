<template>
  <SlotWrapper>
    <TitleH2
      title="Detalles de la Junta"
      subtitle="Configura los datos esenciales de la junta antes de iniciar el flujo."
    />

    <div class="flex flex-col gap-10">
      <TipoJuntaSection />
      <ModalidadJuntaSection />
      <ConvocatoriaJuntaSection />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import TipoJuntaSection from "~/components/juntas/detalles/TipoJuntaSection.vue";
import ModalidadJuntaSection from "~/components/juntas/detalles/ModalidadJuntaSection.vue";
import ConvocatoriaJuntaSection from "~/components/juntas/detalles/ConvocatoriaJuntaSection.vue";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Detalles de la Junta
 * 
 * Paso 2 del flujo de Juntas de Accionistas.
 * Configura los datos esenciales de la junta (tipo, modalidad, convocatoria).
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/detalles
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
