<template>
  <SlotWrapper>
    <TitleH2
      title="Remoción de Gerente"
      subtitle="Coordina el proceso de remoción del gerente general y comunica los acuerdos correspondientes."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Revisa esta introducción y luego avanza por los apartados de selección, revocatoria y votación desde el panel derecho.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Remoción de Gerente General
 * 
 * Sub-step del Paso 4 (Puntos de Acuerdo).
 * Este sub-step tiene secciones que se muestran en el sidebar derecho.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/remocion-gerente
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
