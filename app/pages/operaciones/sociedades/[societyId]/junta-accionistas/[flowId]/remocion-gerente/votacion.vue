<template>
  <div>
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <p class="text-gray-600">Cargando votación...</p>
    </div>
    <!-- ⚠️ Mostrar siempre el componente, incluso si hay errores (errores no críticos) -->
    <MetodoVotacio
      v-if="!isLoading"
      v-model="metodoVotacion"
      mensaje-aprobacion="la remoción del gerente general."
      :votantes="votantes"
      :texto-votacion="textoVotacion"
      @cambiar-tipo="handleCambiarTipo"
      @cambiar-voto="handleCambiarVoto"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
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

  // ✅ Obtener props del controller
  const isLoading = controller.isLoading;
  // const error = controller.error; // ⚠️ No se usa, errores no bloquean el renderizado

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

  const textoVotacion = computed(() => {
    const textoValue = controller.textoVotacion;
    if (textoValue && typeof textoValue === "object" && "value" in textoValue) {
      const value = (textoValue as any).value;
      return typeof value === "string" ? value : "";
    }
    if (typeof textoValue === "string") {
      return textoValue;
    }
    return "";
  });

  // Método de votación (unanimidad/mayoría) - lee del store
  const metodoVotacion = computed({
    get: () => {
      const esUnanimidadValue = controller.esUnanimidad;
      // Si esUnanimidad es un computed, extraer su valor
      if (
        esUnanimidadValue &&
        typeof esUnanimidadValue === "object" &&
        "value" in esUnanimidadValue
      ) {
        return (esUnanimidadValue as any).value ? "unanimidad" : "mayoria";
      }
      // Si es un boolean directo
      return esUnanimidadValue ? "unanimidad" : "mayoria";
    },
    set: (tipo: "unanimidad" | "mayoria") => {
      controller.cambiarTipoAprobacion(tipo);
    },
  });

  function handleCambiarTipo(tipo: "unanimidad" | "mayoria") {
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
