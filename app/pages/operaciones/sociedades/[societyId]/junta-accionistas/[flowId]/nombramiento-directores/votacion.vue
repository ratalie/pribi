<template>
  <MetodoVotacionDirectorio
    v-model="metodoVotacion"
    v-model:candidatos-seleccionados="candidatosSeleccionados"
    title="Votación para la designación de directores"
    subtitle="Votación para aprobar la designación de los directores propuestos."
    title-color="text-primary-800"
    :preguntas="preguntas"
    :accionistas="accionistas"
    :mensaje-aprobacion="mensajeAprobacion"
    @cambiar-voto="handleCambiarVoto"
    @update:candidatos-seleccionados="handleCandidatosSeleccionados"
  />
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import MetodoVotacionDirectorio from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/components/votacion/MetodoVotacionDirectorio.vue";

  /**
   * Página: Votación (Sub-sección de Nombramiento de Directores)
   *
   * Sección dentro del sub-step "Nombramiento de Directores".
   * Se muestra en el sidebar derecho como sección navegable.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/nombramiento-directores/votacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const metodoVotacion = ref("unanimidad");
  const candidatosSeleccionados = ref<string[]>([]);

  // Pregunta para voto por mayoría
  const preguntas = ref<string[]>([
    "¿Se aprueba la designación de los directores propuestos?",
  ]);

  // Accionistas (hardcodeados por el momento)
  const accionistas = ref<string[]>([
    "Olenka Sanchez Aguilar",
    "Melanie Sanchez Aguilar",
    "Braulio Sanchez Aguilar",
  ]);

  // Mensaje de aprobación
  const mensajeAprobacion = "la designación de los directores propuestos.";

  // Manejar cambio de voto
  const handleCambiarVoto = (
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
  ) => {
    // TODO: Implementar lógica de guardado de votos
    console.log("Voto cambiado:", accionistaId, valor);
  };

  // Manejar candidatos seleccionados
  const handleCandidatosSeleccionados = (candidatos: string[]) => {
    candidatosSeleccionados.value = candidatos;
    console.log("Candidatos seleccionados:", candidatos);
  };

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    // TODO: Agregar validación y guardado de datos
    // Por ahora, solo permite navegar al siguiente paso
  });
</script>
