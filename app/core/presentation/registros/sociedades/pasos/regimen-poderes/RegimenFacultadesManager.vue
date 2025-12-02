<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
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

  defineProps<Props>();

  const {
    regimenFacultadesStore,
    modeModal,
    tipoFacultadesHeaders,
    tipoFacultadesActions,
    isTipoFacultadesModalOpen,
    handleSubmitTipoFacultad,
    handleCloseModal,
  } = useTiposFacultades();

  const {
    facultadActions,
    isApoderadoFacultadesModalOpen,
    modeModalApoderadoFacultad,
    openModalFacultadApoderado,
    handleCloseModalApoderadoFacultad,
    handleSubmitApoderadoFacultad,
  } = useApoderadosFacultades();

  const {
    facultadActions: facultadActionsOtros,
    isApoderadoFacultadesModalOpen: isOtrosApoderadosFacultadesModalOpen,
    modeModalApoderadoFacultad: modeModalOtroApoderadoFacultad,
    openModalFacultadApoderado: openModalFacultadOtroApoderado,
    handleCloseModalApoderadoFacultad: handleCloseModalOtroApoderadoFacultad,
    handleSubmitApoderadoFacultad: handleSubmitOtroApoderadoFacultad,
  } = useOtrosApoderadosFacultades();

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
      @close="handleCloseModal"
      @submit="handleSubmitTipoFacultad"
    />

    <FacultadApoderadoModal
      v-model="isApoderadoFacultadesModalOpen"
      :mode="modeModalApoderadoFacultad"
      :lista-facultades-options="regimenFacultadesStore.listaFacultadesOptions"
      @close="handleCloseModalApoderadoFacultad"
      @submit="handleSubmitApoderadoFacultad"
    />

    <FacultadApoderadoModal
      v-model="isOtrosApoderadosFacultadesModalOpen"
      :mode="modeModalOtroApoderadoFacultad"
      :lista-facultades-options="regimenFacultadesStore.listaFacultadesOptions"
      @close="handleCloseModalOtroApoderadoFacultad"
      @submit="handleSubmitOtroApoderadoFacultad"
    />
  </div>
</template>
