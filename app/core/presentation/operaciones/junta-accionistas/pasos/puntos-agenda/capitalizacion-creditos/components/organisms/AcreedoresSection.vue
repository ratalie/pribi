<template>
  <div class="space-y-6">
    <AportantesHeader @open-modal="isModalOpen.value = true" />

    <ErrorMessage :message="error" />
    <LoadingState :is-loading="isLoading" message="Cargando acreedores..." />

    <AportantesTable
      v-if="!isLoading && !error"
      :aportantes="acreedores"
      :is-loading="isLoading"
      :error="error"
      module="CREDIT"
      @toggle="toggleAcreedor"
      @edit="() => {}"
      @delete="eliminarAcreedor"
    />

    <AportantesResumen
      :total-seleccionados="totalSeleccionados"
      :total-acciones="totalAcciones"
    />

    <!-- Modal: Agregar Nuevo Acreedor -->
    <AportanteModal
      v-model="isModalOpen"
      mode="create"
      :is-saving="isSaving"
      @submit="agregarNuevoAcreedor"
      @close="isModalOpen.value = false"
    />
  </div>
</template>

<script setup lang="ts">
  import ErrorMessage from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/ErrorMessage.vue";
  import LoadingState from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/LoadingState.vue";
  import AportantesHeader from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AportantesHeader.vue";
  import AportantesResumen from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AportantesResumen.vue";
  import AportanteModal from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AportanteModal.vue";
  import AportantesTable from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AportantesTable.vue";
  import { useAcreedoresPage } from "../../composables/useAcreedoresPage";

  // ✅ Organism usa composable directamente (no recibe props de datos)
  const {
    acreedores,
    isLoading,
    error,
    totalSeleccionados,
    totalAcciones,
    isModalOpen,
    isSaving,
    toggleAcreedor,
    agregarNuevoAcreedor,
    eliminarAcreedor,
  } = useAcreedoresPage();
</script>
