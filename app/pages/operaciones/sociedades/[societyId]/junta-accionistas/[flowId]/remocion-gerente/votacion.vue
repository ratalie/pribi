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
    mensaje-aprobacion="la remoción del gerente general."
    :votantes="votantes"
    :texto-votacion="textoVotacion"
    @cambiar-tipo="handleCambiarTipo"
    @cambiar-voto="handleCambiarVoto"
  />
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
  import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";
  import { useVotacionRemocionController } from "~/core/presentation/juntas/puntos-acuerdo/remocion-gerente/votacion/composables/useVotacionRemocionController";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";

  /**
   * Página: Votación (Sub-sección de Remoción de Gerente)
   *
   * Sección dentro del sub-step "Remoción de Gerente".
   * Se muestra en el sidebar derecho como sección navegable.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/remocion-gerente/votacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const controller = useVotacionRemocionController();
  const votacionStore = useVotacionStore();

  // ✅ Obtener props del controller
  const isLoading = controller.isLoading;
  const error = controller.error;

  // ✅ Extraer valores de los computed
  const votantes = computed(() => {
    const votantesValue = controller.votantes;
    console.log("[VotacionRemocionPage] Votantes del controller (raw):", votantesValue);

    // Si es un computed, obtener su valor
    if (votantesValue && typeof votantesValue === "object" && "value" in votantesValue) {
      const value = (votantesValue as any).value;
      console.log("[VotacionRemocionPage] Votantes (value):", value);
      return Array.isArray(value) ? value : [];
    }

    // Si ya es un array, devolverlo directamente
    if (Array.isArray(votantesValue)) {
      return votantesValue;
    }

    console.warn("[VotacionRemocionPage] Votantes no es array ni computed:", votantesValue);
    return [];
  });

  const textoVotacion = computed(() => {
    const textoValue = controller.textoVotacion;
    console.log("[VotacionRemocionPage] Texto del controller (raw):", textoValue);

    // Si es un computed, obtener su valor
    if (textoValue && typeof textoValue === "object" && "value" in textoValue) {
      const value = (textoValue as any).value;
      return typeof value === "string" ? value : "";
    }

    // Si ya es string, devolverlo directamente
    if (typeof textoValue === "string") {
      return textoValue;
    }

    console.warn("[VotacionRemocionPage] Texto no es string ni computed:", textoValue);
    return "";
  });

  // Método de votación (unanimidad/mayoría) basado en tipoAprobacion
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
    // Solo actualizar estado local, NO guardar
    // Convertir string literal a enum VoteValue
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
