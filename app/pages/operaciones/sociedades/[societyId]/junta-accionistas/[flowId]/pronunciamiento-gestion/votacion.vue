<template>
  <MetodoVotacio
    v-model="metodoVotacion"
    title="Votación sobre resultados y gestión social"
    subtitle="Votación para aprobar los estados financieros y la gestión social"
    title-color="text-primary-800"
    mensaje-unanimidad="Confirmo que todos los accionistas están de acuerdo con la memoria, los estados financieros y la gestión social presentados en la junta."
    :preguntas="preguntas"
    :accionistas="accionistas"
  />
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";

  /**
   * Página: Votación (Sub-sección de Pronunciamiento de Gestión)
   *
   * Sección dentro del sub-step "Pronunciamiento de Gestión".
   * Se muestra en el sidebar derecho como sección navegable.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/pronunciamiento-gestion/votacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const metodoVotacion = ref("unanimidad");

  // Pregunta para esta votación
  const preguntas = ref<string[]>([
    "¿Se aprueba la memoria, los estados financieros y la gestión social presentados en la junta?",
  ]);

  // Accionistas (hardcodeados por el momento)
  const accionistas = ref<string[]>([
    "Olenka Sanchez Aguilar",
    "Melanie Sanchez Aguilar",
    "Braulio Sanchez Aguilar",
  ]);

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    // TODO: Agregar validación y guardado de datos
    // Por ahora, solo permite navegar al siguiente paso
  });
</script>
