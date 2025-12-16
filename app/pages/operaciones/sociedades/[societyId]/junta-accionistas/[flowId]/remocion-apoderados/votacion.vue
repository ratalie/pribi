<template>
  <div v-if="isLoading" class="flex items-center justify-center p-8">
    <p class="text-gray-600">Cargando votación...</p>
  </div>
  <div v-else-if="error" class="flex items-center justify-center p-8">
    <p class="text-red-600">Error: {{ error }}</p>
  </div>
  <MetodoVotacio
    v-else
    v-model="metodoVotacion"
    title="Votación de Remoción de Apoderados"
    subtitle="Registra el resultado de la votación sobre la remoción de los apoderados seleccionados."
    :preguntas="preguntas"
    :votantes="votantes"
    :mensaje-aprobacion="mensajeAprobacion"
    :get-voto="getVotoForComponent"
    :votacion-store="votacionStore"
    @cambiar-tipo="handleCambiarTipo"
    @cambiar-voto="handleCambiarVoto"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
  import { useVotacionRemocionApoderadosController } from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";

  /**
   * Página: Votación (Sub-sección de Remoción de Apoderados)
   *
   * Sección dentro del sub-step "Remoción de Apoderados".
   * Se muestra en el sidebar derecho como sección navegable.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/remocion-apoderados/votacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const controller = useVotacionRemocionApoderadosController();
  const votacionStore = controller.votacionStore; // ✅ Store dedicado para MayoriaVotacion

  // ✅ Obtener props del controller
  const isLoading = controller.isLoading;
  const error = controller.error;
  const getVotoForComponent = controller.getVotoForComponent;

  // ✅ Extraer valores de los computed
  const votantes = computed(() => {
    const votantesValue = controller.votantes;
    if (votantesValue && typeof votantesValue === "object" && "value" in votantesValue) {
      const value = (votantesValue as any).value;
      return Array.isArray(value) ? value : [];
    }
    if (Array.isArray(votantesValue)) {
      return votantesValue;
    }
    return [];
  });

  const preguntas = computed(() => {
    const preguntasValue = controller.preguntas;
    if (preguntasValue && typeof preguntasValue === "object" && "value" in preguntasValue) {
      const value = (preguntasValue as any).value;
      return Array.isArray(value) ? value : [];
    }
    if (Array.isArray(preguntasValue)) {
      return preguntasValue;
    }
    return [];
  });

  const mensajeAprobacion = computed(() => {
    const mensajeValue = controller.mensajeAprobacion;
    if (mensajeValue && typeof mensajeValue === "object" && "value" in mensajeValue) {
      const value = (mensajeValue as any).value;
      return typeof value === "string" ? value : "";
    }
    if (typeof mensajeValue === "string") {
      return mensajeValue;
    }
    return "";
  });

  // Método de votación (unanimidad/mayoría) controlado localmente (sin depender del backend)
  const metodoVotacion = ref<"unanimidad" | "mayoria">("unanimidad");

  function handleCambiarTipo(tipo: "unanimidad" | "mayoria") {
    controller.cambiarTipoAprobacion(tipo);
  }

  function handleCambiarVoto(
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION",
    preguntaIndex?: number
  ) {
    const voteValue =
      valor === "A_FAVOR"
        ? VoteValue.A_FAVOR
        : valor === "EN_CONTRA"
        ? VoteValue.EN_CONTRA
        : VoteValue.ABSTENCION;

    // Usar el índice de la pregunta si está disponible, sino usar 0 por defecto
    const itemIndex = preguntaIndex !== undefined ? preguntaIndex : 0;
    controller.setVoto(itemIndex, accionistaId, voteValue as VoteValue);
  }

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    await controller.guardarVotacion();
  });
</script>
