<template>
  <SlotWrapper>
    <TitleH2
      title="Nombramiento de Gerente"
      subtitle="Administra la propuesta y aprobación del gerente general."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Usa esta vista introductoria para contextualizar el proceso antes de avanzar por las secciones detalladas.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Nombramiento de Gerente General
 * 
 * Sub-step del Paso 4 (Puntos de Acuerdo).
 * Este sub-step tiene secciones que se muestran en el sidebar derecho.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/nombramiento-gerente
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
