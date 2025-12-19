<script setup lang="ts">
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import ValorNominalBadge from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/ValorNominalBadge.vue";
  import AporteModal from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AporteModal.vue";
  import AportesSection from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AportesSection.vue";
  import { useCapitalizacionesPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useCapitalizacionesPage";

  /**
   * Página: Capitalizaciones (Sub-sección de Capitalización de Créditos)
   *
   * Muestra tabla de acreedores que son contribuyentes (isContributor: true para CREDIT)
   * y permite agregar/editar/eliminar capitalizaciones para cada uno.
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

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
    openModalForAdd,
    openModalForEdit,
    closeModal,
    handleSaveCapitalizacion,
    handleDeleteCapitalizacion,
    societyId,
    flowId,
  } = useCapitalizacionesPage();
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Capitalizaciones"
      subtitle="Registra las capitalizaciones de créditos realizadas por los acreedores."
    />

    <!-- Valor Nominal (Top Right) -->
    <div class="flex justify-end mb-6">
      <ValorNominalBadge :valor-nominal="valorNominal" />
    </div>

    <AportesSection
      :aportantes="acreedoresConCapitalizaciones"
      :total-acciones="totalAcciones"
      :is-loading="isLoading"
      :error="error"
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
  </SlotWrapper>
</template>
