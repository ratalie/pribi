<script setup lang="ts">
  import { onMounted } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import ConfirmDeleteModal from "~/components/base/modal/ConfirmDeleteModal.vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import FacultadesApoderados from "./components/FacultadesApoderados.vue";
  import FacultadApoderadoModal from "./components/modals/FacultadApoderadoModal.vue";
  import TipoFacultadesModal from "./components/modals/TipoFacultadesModal.vue";
  import { useApoderadosFacultades } from "./composables/useApoderadosFacultades";
  import { useOtrosApoderadosFacultades } from "./composables/useOtrosApoderadosFacultades";
  import { useTiposFacultades } from "./composables/useTiposFacultades";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }

  const props = defineProps<Props>();

  const {
    regimenFacultadesStore,
    modeModal,
    isLoadingTipoFacultad,
    tipoFacultadesHeaders,
    tipoFacultadesActions,
    isTipoFacultadesModalOpen,
    handleSubmitTipoFacultad,
    handleCloseModal,
    confirmDelete: confirmDeleteTipoFacultad,
  } = useTiposFacultades(props.societyId ?? "");

  const {
    facultadActions,
    isApoderadoFacultadesModalOpen,
    modeModalApoderadoFacultad,
    openModalFacultadApoderado,
    handleCloseModalApoderadoFacultad,
    handleSubmitApoderadoFacultad,
    listaFacultadesDisponibles,
    confirmDelete,
  } = useApoderadosFacultades(props.societyId ?? "");

  const {
    facultadActions: facultadActionsOtros,
    isApoderadoFacultadesModalOpen: isOtrosApoderadosFacultadesModalOpen,
    modeModalApoderadoFacultad: modeModalOtroApoderadoFacultad,
    openModalFacultadApoderado: openModalFacultadOtroApoderado,
    handleCloseModalApoderadoFacultad: handleCloseModalOtroApoderadoFacultad,
    handleSubmitApoderadoFacultad: handleSubmitOtroApoderadoFacultad,
    listaFacultadesDisponibles: listaFacultadesDisponiblesOtros,
    confirmDelete: confirmDeleteOtros,
  } = useOtrosApoderadosFacultades(props.societyId ?? "");

  onMounted(async () => {
    if (props.societyId) {
      try {
        await regimenFacultadesStore.loadTipoFacultades(props.societyId);
        await regimenFacultadesStore.loadOtorgamientosPoderes(props.societyId);
      } catch (error) {
        console.error("Error al cargar otorgamientos de poderes:", error);
      }
    }
  });

  useFlowLayoutNext(() => {});
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle
      title="Regimen General de Poderes"
      body="Complete todos los campos requeridos."
    />
    <SimpleCard>
      <CardTitle title="Tipo de Poderes" body="">
        <template #actions>
          <ActionButton
            variant="secondary"
            label="Agregar tipo de Poder"
            size="large"
            icon="Plus"
            @click="isTipoFacultadesModalOpen = true"
          />
        </template>
      </CardTitle>
      <SimpleTable
        :columns="tipoFacultadesHeaders"
        :data="regimenFacultadesStore.tablaTipoFacultades"
        title-menu="Acciones"
        :actions="tipoFacultadesActions"
        icon-type="vertical"
      />
    </SimpleCard>

    <!-- Poderes de los Apoderados -->
    <SimpleCard>
      <CardTitle title="Poderes de los Apoderados" body="" />

      <div class="flex flex-col gap-6">
        <FacultadesApoderados
          v-for="apoderado in regimenFacultadesStore.tablaApoderadosFacultades"
          :key="apoderado.id"
          :apoderado-item="apoderado"
          :actions="facultadActions"
          @open-modal="openModalFacultadApoderado"
        />
      </div>
    </SimpleCard>

    <!-- Facultades de Otros Apoderados -->
    <SimpleCard>
      <CardTitle title="Facultades de Otros Apoderados" body="" />

      <div class="flex flex-col gap-6">
        <FacultadesApoderados
          v-for="apoderado in regimenFacultadesStore.tablaOtrosApoderadosFacultades"
          :key="apoderado.id"
          :apoderado-item="apoderado"
          :actions="facultadActionsOtros"
          @open-modal="openModalFacultadOtroApoderado"
        />
      </div>
    </SimpleCard>

    <!-- Modales -->

    <TipoFacultadesModal
      v-model="isTipoFacultadesModalOpen"
      :mode="modeModal"
      :is-loading="isLoadingTipoFacultad"
      @close="handleCloseModal"
      @submit="handleSubmitTipoFacultad"
    />

    <FacultadApoderadoModal
      v-model="isApoderadoFacultadesModalOpen"
      :mode="modeModalApoderadoFacultad"
      :lista-facultades-options="listaFacultadesDisponibles"
      @close="handleCloseModalApoderadoFacultad"
      @submit="handleSubmitApoderadoFacultad"
    />

    <FacultadApoderadoModal
      v-model="isOtrosApoderadosFacultadesModalOpen"
      :mode="modeModalOtroApoderadoFacultad"
      :lista-facultades-options="listaFacultadesDisponiblesOtros"
      @close="handleCloseModalOtroApoderadoFacultad"
      @submit="handleSubmitOtroApoderadoFacultad"
    />

    <!-- Modales de confirmación de eliminación -->
    <!-- Modal para tipos de facultades -->
    <ConfirmDeleteModal
      v-model="confirmDeleteTipoFacultad.isOpen.value"
      :title="confirmDeleteTipoFacultad.title"
      :message="confirmDeleteTipoFacultad.message"
      :confirm-label="confirmDeleteTipoFacultad.confirmLabel"
      :cancel-label="confirmDeleteTipoFacultad.cancelLabel"
      :is-loading="confirmDeleteTipoFacultad.isLoading.value"
      @confirm="confirmDeleteTipoFacultad.handleConfirm"
      @cancel="confirmDeleteTipoFacultad.handleCancel"
    />

    <!-- Modal para otorgamientos de poder (apoderados normales) -->
    <ConfirmDeleteModal
      v-model="confirmDelete.isOpen.value"
      :title="confirmDelete.title"
      :message="confirmDelete.message"
      :confirm-label="confirmDelete.confirmLabel"
      :cancel-label="confirmDelete.cancelLabel"
      :is-loading="confirmDelete.isLoading.value"
      @confirm="confirmDelete.handleConfirm"
      @cancel="confirmDelete.handleCancel"
    />

    <!-- Modal para otorgamientos de poder (otros apoderados) -->
    <ConfirmDeleteModal
      v-model="confirmDeleteOtros.isOpen.value"
      :title="confirmDeleteOtros.title"
      :message="confirmDeleteOtros.message"
      :confirm-label="confirmDeleteOtros.confirmLabel"
      :cancel-label="confirmDeleteOtros.cancelLabel"
      :is-loading="confirmDeleteOtros.isLoading.value"
      @confirm="confirmDeleteOtros.handleConfirm"
      @cancel="confirmDeleteOtros.handleCancel"
    />
  </div>
</template>
