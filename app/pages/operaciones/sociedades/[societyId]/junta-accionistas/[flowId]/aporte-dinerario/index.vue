<template>
  <SlotWrapper>
    <TitleH2
      title="Aportes Dinerarios"
      subtitle="Conoce el acuerdo y prepara la documentación previa antes de registrar aportantes, aportes y la votación."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Esta sección reúne toda la información necesaria para los acuerdos de aumento de
        capital vía aporte dinerario. Revisa la descripción general y luego avanza por los
        apartados específicos desde el panel derecho.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Aporte Dinerario
 * 
 * Sub-step del Paso 4 (Puntos de Acuerdo).
 * Este sub-step tiene secciones que se muestran en el sidebar derecho.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario
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
