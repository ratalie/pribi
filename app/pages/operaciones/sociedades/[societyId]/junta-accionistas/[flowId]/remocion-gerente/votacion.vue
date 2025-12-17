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
  import { useVotacionPage } from "~/composables/useVotacionPage";
  import { useVotacionRemocionController } from "~/core/presentation/juntas/puntos-acuerdo/remocion-gerente/votacion/composables/useVotacionRemocionController";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const controller = useVotacionRemocionController();

  // ✅ Usar composable reutilizable para lógica común
  const {
    isLoading,
    error,
    votantes,
    textoVotacion,
    metodoVotacion,
    handleCambiarTipo,
    handleCambiarVoto,
  } = useVotacionPage(controller, { useTextoVotacion: true });
</script>
