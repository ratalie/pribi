<template>
  <SlotWrapper>
    <TitleH2
      title="Capitalización de Créditos"
      subtitle="Prepara la información general antes de registrar acreedores, créditos y la votación del acuerdo."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Este módulo concentra todo el proceso para convertir créditos en aportes de capital. Revisa esta
        introducción y luego avanza por cada sección específica mediante el panel derecho.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

  /**
   * Página: Capitalización de Créditos (Introducción)
   *
   * Sub-step del Paso 4 (Puntos de Acuerdo).
   * Este sub-step tiene secciones que se muestran en el sidebar derecho.
   *
   * Ruta: /operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/capitalizacion-creditos
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    // Esta es solo una página de introducción, no requiere guardado
    // El botón "Siguiente" navegará automáticamente a la siguiente sección
  });
</script>
