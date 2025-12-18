<script setup lang="ts">
import { useAportesPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportesPage";
import AportesSection from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AportesSection.vue";
import ValorNominalBadge from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/atoms/ValorNominalBadge.vue";
import AporteModal from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/molecules/AporteModal.vue";

/**
 * Página: Aportes (Sub-sección de Aporte Dinerario)
 *
 * Muestra tabla de aportantes que son contribuyentes (isContributor: true)
 * y permite agregar/editar/eliminar aportes para cada uno.
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
  aportantesConAportes,
  isModalOpen,
  modalMode,
  selectedAccionistaId,
  selectedAporteId,
  openModalForAdd,
  openModalForEdit,
  closeModal,
  handleSaveAporte,
  handleDeleteAporte,
  societyId,
  flowId,
} = useAportesPage();
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Aportes"
      subtitle="Registra los aportes dinerarios realizados por los aportantes."
    />

    <!-- Valor Nominal (Top Right) -->
    <div class="flex justify-end mb-6">
      <ValorNominalBadge :valor-nominal="valorNominal" />
    </div>

    <AportesSection
      :aportantes="aportantesConAportes"
      :total-acciones="totalAcciones"
      :is-loading="isLoading"
      :error="error"
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
  </SlotWrapper>
</template>
