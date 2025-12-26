<template>
  <div class="space-y-6">
    <AportantesHeader @open-modal="isModalOpen = true" />

    <ErrorMessage :message="error" />
    <LoadingState :is-loading="isLoading" message="Cargando aportantes..." />

    <AportantesTable
      v-if="!isLoading && !error"
      :aportantes="aportantes"
      :is-loading="isLoading"
      :error="error"
      module="CASH"
      @toggle="toggleAportante"
      @edit="() => {}"
      @delete="eliminarAportante"
    />

    <AportantesResumen
      :total-seleccionados="totalSeleccionados"
      :total-acciones="totalAcciones"
    />

    <!-- Modal: Agregar Nuevo Aportante -->
    <AportanteModal
      v-model="isModalOpen"
      mode="create"
      :is-saving="isSaving"
      @submit="agregarNuevoAportante"
      @close="isModalOpen.value = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { useAportantesPage } from "../../composables/useAportantesPage";
  import ErrorMessage from "../atoms/ErrorMessage.vue";
  import LoadingState from "../atoms/LoadingState.vue";
  import AportantesHeader from "../molecules/AportantesHeader.vue";
  import AportantesResumen from "../molecules/AportantesResumen.vue";
  import AportanteModal from "./AportanteModal.vue";
  import AportantesTable from "./AportantesTable.vue";

  // ✅ Organism usa composable directamente (no recibe props de datos)
  const {
    aportantes,
    isLoading,
    error,
    totalSeleccionados,
    totalAcciones,
    isModalOpen,
    isSaving,
    toggleAportante,
    agregarNuevoAportante,
    eliminarAportante,
  } = useAportantesPage();
</script>
