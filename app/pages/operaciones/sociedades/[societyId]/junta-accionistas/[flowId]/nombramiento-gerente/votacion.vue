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
  import { useVotacionPage } from "~/composables/useVotacionPage";
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

  // ✅ Usar composable reutilizable para lógica común
  const {
    isLoading,
    error,
    votantes,
    pregunta,
    mensajeAprobacion,
    metodoVotacion,
    handleCambiarTipo,
    handleCambiarVoto,
  } = useVotacionPage(controller);
</script>
