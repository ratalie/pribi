<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import { useApoderadosFacultades } from "../../composables/useApoderadosFacultades";
  import { useTiposFacultades } from "../../composables/useTiposFacultades";
  import TipoFacultadesModal from "../modals/TipoFacultadesModal.vue";
  import FacultadesApoderados from "../regimen-poderes/FacultadesApoderados.vue";

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

  const { apoderadoFacultadHeaders, facultadActions } = useApoderadosFacultades();

  console.log(apoderadoFacultadHeaders);
  console.log(facultadActions);
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
        />
      </div>
    </SimpleCard>

    <!-- Poderes de Otros Apoderados -->
    <SimpleCard>
      <CardTitle title="Poderes de los Apoderados" body="" />

      <div class="flex flex-col gap-6" />
    </SimpleCard>

    <TipoFacultadesModal
      v-model="isTipoFacultadesModalOpen"
      :mode="modeModal"
      @close="handleCloseModal"
      @submit="handleSubmitTipoFacultad"
    />
  </div>
</template>
