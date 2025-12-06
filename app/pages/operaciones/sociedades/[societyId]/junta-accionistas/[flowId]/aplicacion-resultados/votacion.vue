<template>
  <MetodoVotacio
    v-model="metodoVotacion"
    title="Votación sobre la aplicacion de resultados"
    subtitle="Votación sobre la propuestas de aplicacion de resultadosl"
    title-color="text-primary-800"
    mensaje-unanimidad="Se aprobó la propuesta de aplicación de los resultados del ejercicio"
    :preguntas="preguntas"
    :accionistas="accionistas"
  />
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";

  /**
   * Página: Votación (Sub-sección de Aplicación de Resultados)
   *
   * Sección dentro del sub-step "Aplicación de Resultados".
   * Se muestra en el sidebar derecho como sección navegable.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/aplicacion-resultados/votacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const metodoVotacion = ref("unanimidad");

  // Pregunta para esta votación
  const preguntas = ref<string[]>([
    "¿Se aprueba la propuesta de aplicación de los rsultados del ejercicio?",
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
