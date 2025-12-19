<script setup lang="ts">
  import ErrorMessage from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/ErrorMessage.vue";
  import LoadingState from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/LoadingState.vue";
  import AportanteModal from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AportanteModal.vue";
  import AportantesHeader from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AportantesHeader.vue";
  import AportantesResumen from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AportantesResumen.vue";
  import AportantesTable from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AportantesTable.vue";
  import { useAportantesPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage";

  /**
   * VISTA: Aportantes para Aporte Dinerario
   *
   * Muestra tabla de accionistas existentes + permite agregar nuevos aportantes.
   * - EXISTENTES: Solo se seleccionan con checkbox
   * - NUEVOS: Se pueden editar/eliminar
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

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

<template>
  <div class="space-y-6 p-6">
    <AportantesHeader @open-modal="isModalOpen = true" />

    <ErrorMessage :message="error" />
    <LoadingState :is-loading="isLoading" message="Cargando aportantes..." />

    <AportantesTable
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
      @close="isModalOpen = false"
    />
  </div>
</template>
