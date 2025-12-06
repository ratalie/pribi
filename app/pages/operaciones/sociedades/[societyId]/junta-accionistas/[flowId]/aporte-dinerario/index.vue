<template>
  <MetodoVotacio v-model="metodoVotacion" />
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";

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

  const metodoVotacion = ref("unanimidad");

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    // TODO: Agregar validación y guardado de datos
    // Por ahora, solo permite navegar al siguiente paso
  });
</script>
