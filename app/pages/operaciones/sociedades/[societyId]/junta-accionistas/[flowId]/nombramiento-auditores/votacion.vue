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
    title="Votación para la designación de auditores externos"
    subtitle="Votación sobre la designación del auditor externo"
    title-color="text-primary-800"
    :mensaje-unanimidad="mensajeUnanimidad"
    :mensaje-aprobacion="mensajeAprobacion"
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
  import { useVotacionAuditoresExternosController } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/delegacion-auditores/votacion/composables/useVotacionAuditoresExternosController";
  import { useVotacionAuditoresExternosStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/delegacion-auditores/votacion/stores/useVotacionAuditoresExternosStore";
  import { useAuditoresExternosStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/delegacion-auditores/stores/useAuditoresExternosStore";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";

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

  const controller = useVotacionAuditoresExternosController();
  const votacionStore = useVotacionAuditoresExternosStore();
  const auditoresStore = useAuditoresExternosStore();

  // ✅ Obtener props del controller
  const isLoading = controller.isLoading;
  const error = controller.error;

  // ✅ Usar directamente los computed del controller
  const votantes = controller.votantes;
  const textoVotacion = controller.textoVotacion;
  const getVoto = controller.getVoto;

  // Nombre del auditor para los mensajes
  const nombreAuditor = computed(() => auditoresStore.nombreCompletoAuditor || "el auditor externo");

  // Mensaje de unanimidad con el nombre del auditor
  const mensajeUnanimidad = computed(() => {
    return `Confirmo que todos los accionistas están de acuerdo con la designación de ${nombreAuditor.value} como auditor externo.`;
  });

  // Mensaje de aprobación para voto por mayoría con el nombre del auditor
  const mensajeAprobacion = computed(() => {
    return `la propuesta de la designación de ${nombreAuditor.value} como auditor externo.`;
  });

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
      console.error("[VotacionAuditoresExternos] Error al guardar:", error);
      throw error; // Esto previene la navegación si hay error
    }
  });
</script>
