<template>
  <SlotWrapper>
    <TitleH2
      title="Aportantes"
      subtitle="Selecciona los aportantes que participarán en la junta de accionistas."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Aportantes (Sub-sección de Aporte Dinerario)
 * 
 * Sección dentro del sub-step "Aporte Dinerario".
 * Se muestra en el sidebar derecho como sección navegable.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario/aportantes
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
