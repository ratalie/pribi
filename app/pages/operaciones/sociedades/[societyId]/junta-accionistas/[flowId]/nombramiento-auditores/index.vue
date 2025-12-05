<template>
  <SlotWrapper>
    <TitleH2
      title="Nombramiento de Auditores"
      subtitle="Gestiona la designación y aprobación de los auditores externos."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Utiliza esta sección como introducción y avanza por las etapas específicas con el panel derecho.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Nombramiento de Auditores
 * 
 * Sub-step del Paso 4 (Puntos de Acuerdo).
 * Este sub-step tiene secciones que se muestran en el sidebar derecho.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/nombramiento-auditores
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
