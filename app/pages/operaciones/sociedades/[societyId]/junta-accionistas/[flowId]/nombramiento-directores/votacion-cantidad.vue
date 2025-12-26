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
    title="Votación para la configuración del directorio"
    subtitle="Votación para aprobar la cantidad de directores del directorio"
    title-color="text-primary-800"
    :mensaje-unanimidad="mensajeUnanimidad"
    :votantes="votantes"
    :texto-votacion="textoVotacion"
    :get-voto="getVoto"
    @cambiar-tipo="handleCambiarTipo"
    @cambiar-voto="handleCambiarVoto"
  />
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import type { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
  import { useVotacionCantidadController } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion-cantidad/composables/useVotacionCantidadController";
  import { useVotacionCantidadStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion-cantidad/stores/useVotacionCantidadStore";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const controller = useVotacionCantidadController();
  const votacionStore = useVotacionCantidadStore();

  // ✅ Obtener props del controller
  const isLoading = controller.isLoading;
  const error = controller.error;

  // ✅ Usar directamente los computed del controller
  const votantes = controller.votantes;
  const textoVotacion = controller.textoVotacion;
  const getVoto = controller.getVoto;
  const cantidadDirectores = controller.cantidadDirectores;

  // Mensaje de unanimidad
  const mensajeUnanimidad = computed(() => {
    return `Confirmo que todos los accionistas están de acuerdo en establecer un Directorio de ${cantidadDirectores.value} miembros.`;
  });

  // Método de votación (unanimidad/mayoría)
  const metodoVotacion = computed({
    get: () => {
      if (votacionStore.esUnanimidad) {
        return "unanimidad";
      }
      return "mayoria";
    },
    set: (value: string) => {
      handleCambiarTipo(value as "unanimidad" | "mayoria");
    },
  });

  /**
   * Manejar cambio de tipo de votación
   */
  async function handleCambiarTipo(tipo: "unanimidad" | "mayoria") {
    await controller.cambiarTipo(tipo);
  }

  /**
   * Manejar cambio de voto de un accionista
   */
  function handleCambiarVoto(
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
  ) {
    const voteValue = valor as VoteValue;
    controller.setVoto(accionistaId, voteValue);
  }

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    try {
      await controller.guardarVotacion();
    } catch (error: any) {
      console.error("[VotacionCantidad] Error al guardar:", error);
      throw error;
    }
  });
</script>
