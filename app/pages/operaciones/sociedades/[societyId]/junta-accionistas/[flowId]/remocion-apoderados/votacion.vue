<template>
  <div v-if="isLoading" class="flex items-center justify-center p-8">
    <p class="text-gray-600">Cargando votación...</p>
  </div>
  <div v-else-if="error" class="flex items-center justify-center p-8">
    <p class="text-red-600">Error: {{ error }}</p>
  </div>
  <SlotWrapper v-else>
    <TitleH2
      title="Votación de Remoción de Apoderados"
      subtitle="Registra el resultado de la votación sobre la remoción de los apoderados seleccionados."
    />

    <!-- Iterar sobre cada item de votación -->
    <div class="flex flex-col gap-8">
      <ItemVotacionCompleto
        v-for="(pregunta, index) in preguntas"
        :key="index"
        :item-index="index"
        :pregunta="pregunta"
        :descripcion="getDescripcionItem(index)"
        :votantes="votantes"
        :get-voto="getVotoForItem(index)"
        :votacion-store="votacionStore"
        :mensaje-aprobacion="getMensajeAprobacionItem(index)"
        :tipo-aprobacion-inicial="getTipoAprobacionItem(index)"
        @cambiar-tipo="handleCambiarTipo"
        @cambiar-voto="handleCambiarVoto"
      />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
  import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
  import ItemVotacionCompleto from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/components/ItemVotacionCompleto.vue";
  import { useVotacionRemocionApoderadosController } from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController";

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

  // Función para obtener voto por item
  function getVotoForItem(itemIndex: number) {
    return (accionistaId: string) => {
      return controller.getVoto(itemIndex, accionistaId);
    };
  }

  // Verificar que el store existe
  if (!votacionStore) {
    throw new Error("VotacionStore no está disponible");
  }

  // Función para obtener descripción del item
  function getDescripcionItem(itemIndex: number): string {
    const item = votacionStore?.sesionVotacion?.items?.[itemIndex];
    if (item) {
      return item.descripción || "";
    }
    return "";
  }

  // Función para obtener mensaje de aprobación por item
  function getMensajeAprobacionItem(_itemIndex: number): string {
    const mensajeBase = controller.mensajeAprobacion;
    const mensajeValue =
      mensajeBase && typeof mensajeBase === "object" && "value" in mensajeBase
        ? (mensajeBase as any).value
        : typeof mensajeBase === "string"
        ? mensajeBase
        : "la remoción del apoderado.";
    return mensajeValue;
  }

  // Función para obtener tipo de aprobación por item
  function getTipoAprobacionItem(itemIndex: number): VoteAgreementType {
    const item = votacionStore?.sesionVotacion?.items?.[itemIndex];
    if (item) {
      return item.tipoAprobacion || VoteAgreementType.SOMETIDO_A_VOTACION;
    }
    return VoteAgreementType.SOMETIDO_A_VOTACION;
  }

  function handleCambiarTipo(itemIndex: number, tipo: "unanimidad" | "mayoria") {
    controller.cambiarTipoAprobacionItem(itemIndex, tipo);
  }

  function handleCambiarVoto(
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION",
    preguntaIndex: number
  ) {
    const voteValue =
      valor === "A_FAVOR"
        ? VoteValue.A_FAVOR
        : valor === "EN_CONTRA"
        ? VoteValue.EN_CONTRA
        : VoteValue.ABSTENCION;

    controller.setVoto(preguntaIndex, accionistaId, voteValue as VoteValue);
  }

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    await controller.guardarVotacion();
  });
</script>
