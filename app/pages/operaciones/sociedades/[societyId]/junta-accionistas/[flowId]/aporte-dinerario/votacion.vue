<template>
  <MetodoVotacio v-model="metodoVotacion" />
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";

  /**
   * Página: Votación (Sub-sección de Aporte Dinerario)
   *
   * Sección dentro del sub-step "Aporte Dinerario".
   * Se muestra en el sidebar derecho como sección navegable.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario/votacion
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
