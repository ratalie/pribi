<template>
  <SlotWrapper>
    <TitleH2
      title="Pronunciamiento sobre Gestión"
      subtitle="Organiza la revisión de la gestión social y prepara la documentación correspondiente."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Revisa este resumen introductorio y continúa con los apartados de informe, votación y acta desde el panel derecho.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Pronunciamiento sobre Gestión
 * 
 * Sub-step del Paso 4 (Puntos de Acuerdo).
 * Este sub-step tiene secciones que se muestran en el sidebar derecho.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/pronunciamiento-gestion
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
