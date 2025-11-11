<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import { useRegistroAccionistas } from "../../composables/useRegistroAccionistas";
  import AccionistasModal from "../modals/AccionistasModal.vue";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }

  defineProps<Props>();

  const {
    registroAccionistasStore,
    columns,
    actions,
    isModalOpen,
    tipoAccionista,
    modalMode,
    openModal,
  } = useRegistroAccionistas();
</script>

<template>
  <div class="h-full p-14 flex flex-col gap-12">
    <CardTitle title="Accionistas" body="Complete todos los campos requeridos.">
      <template #actions>
        <ActionButton
          variant="secondary"
          label="Agregar"
          size="md"
          icon="Plus"
          @click="openModal"
        />
      </template>
    </CardTitle>

    <SimpleTable
      :columns="columns"
      :data="registroAccionistasStore.tablaAccionistas"
      title-menu="Actions"
      :actions="actions"
    />

    <AccionistasModal
      v-model="isModalOpen"
      v-model:tipo-accionista="tipoAccionista"
      :mode="modalMode"
      @close="isModalOpen = false"
    />
  </div>
</template>
