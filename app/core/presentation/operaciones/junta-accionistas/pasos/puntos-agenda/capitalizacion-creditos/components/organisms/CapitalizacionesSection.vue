<template>
  <div class="flex flex-col gap-10">
    <!-- Valor Nominal (Top Right) -->
    <div class="flex justify-end mb-6">
      <ValorNominalBadge :valor-nominal="valorNominal" />
    </div>

    <ErrorMessage :message="error" />
    <LoadingState :is-loading="isLoading" message="Cargando capitalizaciones..." />
    <AportesTable
      v-if="!isLoading && !error"
      :aportantes="acreedoresConCapitalizaciones"
      :total-acciones="totalAcciones"
      title-menu="Acciones"
      @add="openModalForAdd"
      @edit="openModalForEdit"
      @delete="handleDeleteCapitalizacion"
    />

    <!-- Modal de Capitalización -->
    <AporteModal
      v-model="isModalOpen"
      :mode="modalMode"
      :accionista-id="selectedAccionistaId"
      :aporte-id="selectedCapitalizacionId"
      :society-id="societyId"
      :flow-id="flowId"
      @close="closeModal"
      @submit="handleSaveCapitalizacion"
    />
  </div>
</template>

<script setup lang="ts">
  import ErrorMessage from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/ErrorMessage.vue";
  import LoadingState from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/LoadingState.vue";
  import ValorNominalBadge from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/ValorNominalBadge.vue";
  import AportesTable from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AportesTable.vue";
  import AporteModal from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AporteModal.vue";
  import { useCapitalizacionesPage } from "../../composables/useCapitalizacionesPage";

  // ✅ Organism usa composable directamente (no recibe props de datos)
  const {
    isLoading,
    error,
    valorNominal,
    totalAcciones,
    acreedoresConCapitalizaciones,
    isModalOpen,
    modalMode,
    selectedAccionistaId,
    selectedCapitalizacionId,
    societyId,
    flowId,
    openModalForAdd,
    openModalForEdit,
    closeModal,
    handleSaveCapitalizacion,
    handleDeleteCapitalizacion,
  } = useCapitalizacionesPage();
</script>
