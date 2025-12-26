<template>
  <SlotWrapper>
    <TitleH2
      title="Aplicación de Resultados"
      subtitle="Organiza la revisión de la gestión social y prepara la documentación correspondiente."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Revisa este resumen introductorio y continúa con los apartados de utilidades y montos, votación y resumen desde el panel derecho.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Aplicación de Resultados
 * 
 * Sub-step del Paso 4 (Puntos de Acuerdo).
 * Este sub-step tiene secciones que se muestran en el sidebar derecho.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aplicacion-resultados
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
