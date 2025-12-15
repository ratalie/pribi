<template>
  <MetodoVotacio
    v-model="metodoVotacion"
    title="Votación para la dessignación de auditores externos"
    subtitle="Votación sobre la propuestas de aplicacion de los resultados del ejercicio"
    title-color="text-primary-800"
    :mensaje-unanimidad="mensajeUnanimidad"
    :mensaje-aprobacion="mensajeAprobacion"
    :preguntas="preguntas"
    :accionistas="accionistas"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";
  import { useAuditoresExternosStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/delegacion-auditores/stores/useAuditoresExternosStore";

  /**
   * Página: Votación (Sub-sección de Nombramiento de Auditores)
   *
   * Sección dentro del sub-step "Nombramiento de Auditores".
   * Se muestra en el sidebar derecho como sección navegable.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/nombramiento-auditores/votacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const auditoresStore = useAuditoresExternosStore();
  const nombreAuditor = computed(() => auditoresStore.nombreCompletoAuditor);
  const metodoVotacion = ref("unanimidad");

  // Mensaje de unanimidad con el nombre del auditor
  const mensajeUnanimidad = computed(() => {
    const nombre = nombreAuditor.value || "el auditor externo";
    return `Confirmo que todos los accionistas están de acuerdo con la designación de ${nombre} como auditor externo.`;
  });

  // Mensaje de aprobación para voto por mayoría con el nombre del auditor
  const mensajeAprobacion = computed(() => {
    const nombre = nombreAuditor.value || "el auditor externo";
    return `la propuesta de la designación de ${nombre} como auditor externo.`;
  });

  // Pregunta para voto por mayoría con el nombre del auditor
  const preguntas = computed(() => {
    const nombre = nombreAuditor.value || "el auditor externo";
    return [`¿Se aprueba la designación de ${nombre} como auditor externo?`];
  });

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
