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
    title="Votación de Nombramiento de Gerente"
    subtitle="Registra el resultado de la votación sobre el nombramiento del gerente general."
    :preguntas="[pregunta]"
    :votantes="votantes"
    :mensaje-aprobacion="mensajeAprobacion"
    @cambiar-tipo="handleCambiarTipo"
    @cambiar-voto="handleCambiarVoto"
  />
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
  import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";
  import { useVotacionNombramientoGerenteController } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/votacion/composables/useVotacionNombramientoGerenteController";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";

  /**
   * Página: Votación (Sub-sección de Nombramiento de Gerente)
   *
   * Sección dentro del sub-step "Nombramiento de Gerente".
   * Se muestra en el sidebar derecho como sección navegable.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/nombramiento-gerente/votacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const controller = useVotacionNombramientoGerenteController();
  const votacionStore = useVotacionStore();

  // ✅ Obtener props del controller
  const isLoading = controller.isLoading;
  const error = controller.error;

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

  const pregunta = computed(() => {
    const preguntaValue = controller.pregunta;
    if (preguntaValue && typeof preguntaValue === "object" && "value" in preguntaValue) {
      const value = (preguntaValue as any).value;
      return typeof value === "string" ? value : "";
    }
    if (typeof preguntaValue === "string") {
      return preguntaValue;
    }
    return "";
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

  // Método de votación (unanimidad/mayoría) basado en tipoAprobacion del store
  const metodoVotacion = computed({
    get: () => {
      if (!votacionStore.hasVotacion) return "unanimidad"; // Por defecto
      return votacionStore.esUnanimidad ? "unanimidad" : "mayoria";
    },
    set: (value: string) => {
      // Solo actualizar estado local, NO guardar
      controller.cambiarTipoAprobacion(value as "unanimidad" | "mayoria");
    },
  });

  function handleCambiarTipo(tipo: "unanimidad" | "mayoria") {
    // Solo actualizar estado local, NO guardar
    controller.cambiarTipoAprobacion(tipo);
  }

  function handleCambiarVoto(
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
  ) {
    const voteValue =
      valor === "A_FAVOR"
        ? VoteValue.A_FAVOR
        : valor === "EN_CONTRA"
        ? VoteValue.EN_CONTRA
        : VoteValue.ABSTENCION;

    controller.setVoto(accionistaId, voteValue as VoteValue);
  }

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    await controller.guardarVotacion();
  });
</script>
