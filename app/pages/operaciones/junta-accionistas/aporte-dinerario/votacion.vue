<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Registra la votación del acuerdo de aumento de capital vía aporte dinerario."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Votación (Sub-sección de Aporte Dinerario)
 * 
 * Sección dentro del sub-step "Aporte Dinerario".
 * Se muestra en el sidebar derecho como sección navegable.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario/votacion
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
