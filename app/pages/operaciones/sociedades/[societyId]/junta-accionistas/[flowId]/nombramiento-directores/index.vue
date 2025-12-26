<template>
  <SlotWrapper>
    <TitleH2
      title="Nombramiento de Directores"
      subtitle="Gestiona la designación y aprobación de los miembros del directorio."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Usa esta introducción como punto de partida y continúa con cada sección desde el panel
        derecho.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

  /**
   * Página: Nombramiento de Directores
   *
   * Sub-step del Paso 4 (Puntos de Acuerdo).
   * Este sub-step tiene secciones que se muestran en el sidebar derecho.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/nombramiento-directores
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
