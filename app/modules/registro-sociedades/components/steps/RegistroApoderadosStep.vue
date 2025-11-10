<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import { useClasesApoderado } from "../../composables/useClasesApoderado";
  import { useOtrosApoderados } from "../../composables/useOtrosApoderados";
  import { useRegistroApoderados } from "../../composables/useRegistroApoderados";
  import ClaseApoderadoModal from "../modals/ClaseApoderadoModal.vue";
  import RegistroApoderadoModal from "../modals/RegistroApoderadoModal.vue";
  import RegistroOtroApoderadoModal from "../modals/RegistroOtroApoderadoModal.vue";

  interface Props {
    societyId?: string;
  }

  defineProps<Props>();

  const {
    tablaClases,
    claseHeaders,
    claseActions,
    showActionsFor,
    isClaseModalOpen,
    modeModalClase,
    handleCreateClase,
    handleSubmitClase,
    handleCloseClaseModal,
  } = useClasesApoderado();

  const {
    registroData,
    registroHeaders,
    registroActions,
    isRegistroModalOpen,
    openModalRegistroApoderado,
    handleSubmitRegistroApoderado,
    handleCloseRegistroModal,
  } = useRegistroApoderados();

  const {
    otrosApoderadosData,
    otrosHeaders,
    otrosApoderadosActions,
    isOtroApoderadoModalOpen,
    openModalRegistroOtroApoderado,
    handleSubmitRegistroOtroApoderado,
    handleCloseOtroApoderadoModal,
  } = useOtrosApoderados();
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle title="Registro de Apoderados" body="Complete todos los campos requeridos." />
    <SimpleCard>
      <CardTitle title="Clase de Apoderados" body="">
        <template #actions>
          <ActionButton
            variant="secondary"
            label="Agregar Clase de Apoderado"
            size="xl"
            icon="Plus"
            @click="handleCreateClase"
          />
        </template>
      </CardTitle>
      <SimpleTable
        :columns="claseHeaders"
        :data="tablaClases"
        title-menu="Acciones"
        :actions="claseActions"
        :show-actions-for="showActionsFor"
      />
    </SimpleCard>

    <SimpleCard>
      <CardTitle title="Registro de Apoderados" body="">
        <template #actions>
          <ActionButton
            variant="secondary"
            label="Agregar Apoderado"
            size="xl"
            icon="Plus"
            @click="openModalRegistroApoderado"
          />
        </template>
      </CardTitle>
      <SimpleTable
        :columns="registroHeaders"
        :data="registroData"
        title-menu="Acciones"
        :actions="registroActions"
      />
    </SimpleCard>

    <SimpleCard>
      <CardTitle title="Otros Apoderados" body="">
        <template #actions>
          <ActionButton
            variant="secondary"
            label="Agregar Otro Apoderado"
            size="xl"
            icon="Plus"
            @click="openModalRegistroOtroApoderado"
          />
        </template>
      </CardTitle>
      <SimpleTable
        :columns="otrosHeaders"
        :data="otrosApoderadosData"
        title-menu="Acciones"
        :actions="otrosApoderadosActions"
      />
    </SimpleCard>

    <ClaseApoderadoModal
      v-if="isClaseModalOpen"
      v-model="isClaseModalOpen"
      :mode="modeModalClase"
      @close="handleCloseClaseModal"
      @submit="handleSubmitClase"
    />
    <RegistroApoderadoModal
      v-if="isRegistroModalOpen"
      v-model="isRegistroModalOpen"
      @close="handleCloseRegistroModal"
      @submit="handleSubmitRegistroApoderado"
    />
    <RegistroOtroApoderadoModal
      v-if="isOtroApoderadoModalOpen"
      v-model="isOtroApoderadoModalOpen"
      @close="handleCloseOtroApoderadoModal"
      @submit="handleSubmitRegistroOtroApoderado"
    />
  </div>
</template>
