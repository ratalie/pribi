<template>
  <div class="flex flex-col gap-10">
    <!-- Valor Nominal (Top Right) -->
    <div class="flex justify-end mb-6">
      <ValorNominalBadge :valor-nominal="valorNominal" />
    </div>

    <ErrorMessage :message="error" />
    <LoadingState :is-loading="isLoading" message="Cargando aportes..." />
    <AportesTable
      v-if="!isLoading && !error"
      :aportantes="aportantesConAportes"
      :total-acciones="totalAcciones"
      title-menu="Acciones"
      @add="openModalForAdd"
      @edit="openModalForEdit"
      @delete="handleDeleteAporte"
    />

    <!-- Modal de Aporte -->
    <AporteModal
      v-model="isModalOpen"
      :mode="modalMode"
      :accionista-id="selectedAccionistaId"
      :aporte-id="selectedAporteId"
      :society-id="societyId"
      :flow-id="flowId"
      @close="closeModal"
      @submit="handleSaveAporte"
    />
  </div>
</template>

<script setup lang="ts">
  import { useAportesPage } from "../../composables/useAportesPage";
  import ErrorMessage from "../atoms/ErrorMessage.vue";
  import LoadingState from "../atoms/LoadingState.vue";
  import ValorNominalBadge from "../atoms/ValorNominalBadge.vue";
  import AportesTable from "../molecules/AportesTable.vue";
  import AporteModal from "./AporteModal.vue";

  // ✅ Organism usa composable directamente (no recibe props de datos)
  const {
    isLoading,
    error,
    valorNominal,
    totalAcciones,
    aportantesConAportes,
    isModalOpen,
    modalMode,
    selectedAccionistaId,
    selectedAporteId,
    societyId,
    flowId,
    openModalForAdd,
    openModalForEdit,
    closeModal,
    handleSaveAporte,
    handleDeleteAporte,
  } = useAportesPage();
</script>
