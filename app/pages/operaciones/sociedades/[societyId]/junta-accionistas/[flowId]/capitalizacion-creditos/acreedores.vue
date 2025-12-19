<script setup lang="ts">
  import ErrorMessage from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/ErrorMessage.vue";
  import LoadingState from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/LoadingState.vue";
  import AportanteModal from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AportanteModal.vue";
  import AportantesHeader from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AportantesHeader.vue";
  import AportantesResumen from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AportantesResumen.vue";
  import AportantesTable from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AportantesTable.vue";
  import { useAcreedoresPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useAcreedoresPage";

  /**
   * VISTA: Acreedores para Capitalización de Créditos
   *
   * Muestra tabla de accionistas existentes + permite agregar nuevos acreedores.
   * - EXISTENTES: Solo se seleccionan con checkbox
   * - NUEVOS: Se pueden editar/eliminar
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

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

<template>
  <div class="space-y-6 p-6">
    <AportantesHeader @open-modal="isModalOpen = true" />

    <ErrorMessage :message="error" />
    <LoadingState :is-loading="isLoading" message="Cargando acreedores..." />

    <AportantesTable
      :aportantes="acreedores"
      :is-loading="isLoading"
      :error="error"
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
      @close="isModalOpen = false"
    />
  </div>
</template>
