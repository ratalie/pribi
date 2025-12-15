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
    title="Votación sobre la aplicación de resultados"
    subtitle="Votación sobre la propuesta de aplicación de resultados"
    title-color="text-primary-800"
    mensaje-unanimidad="Confirmo que todos los accionistas están de acuerdo con la propuesta de aplicación de los resultados del ejercicio."
    mensaje-aprobacion="la propuesta de aplicación de los resultados del ejercicio."
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
  import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useVotacionAplicacionResultadosController } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aplicacion-resultados/votacion/composables/useVotacionAplicacionResultadosController";
import { useVotacionAplicacionResultadosStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aplicacion-resultados/votacion/stores/useVotacionAplicacionResultadosStore";
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

  const controller = useVotacionAplicacionResultadosController();
  const votacionStore = useVotacionAplicacionResultadosStore();

  // ✅ Obtener props del controller
  const isLoading = controller.isLoading;
  const error = controller.error;

  // ✅ Usar directamente los computed del controller
  const votantes = controller.votantes;
  const textoVotacion = controller.textoVotacion;
  const getVoto = controller.getVoto;

  // Método de votación (unanimidad/mayoría)
  const metodoVotacion = computed({
    get: () => {
      // Determinar según tipo de aprobación del item
      if (votacionStore.esUnanimidad) {
        return "unanimidad";
      }
      return "mayoria";
    },
    set: (value: string) => {
      // Se maneja en handleCambiarTipo
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
  function handleCambiarVoto(accionistaId: string, valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION") {
    const voteValue = valor as VoteValue;
    controller.setVoto(accionistaId, voteValue);
  }

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    try {
      await controller.guardarVotacion();
      // Si se guarda exitosamente, permite navegar al siguiente paso
    } catch (error: any) {
      console.error("[VotacionAplicacionResultados] Error al guardar:", error);
      throw error; // Esto previene la navegación si hay error
    }
  });
</script>
