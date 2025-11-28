<script setup lang="ts">
  import { computed } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import ApoderadosTable from "./components/ApoderadosTable.vue";
  import ClasesApoderadoTable from "./components/ClasesApoderadoTable.vue";
  import GerenteGeneralTable from "./components/GerenteGeneralTable.vue";
  import OtrosApoderadosTable from "./components/OtrosApoderadosTable.vue";
  import ClaseApoderadoModal from "./components/modals/ClaseApoderadoModal.vue";
  import RegistroApoderadoModal from "./components/modals/RegistroApoderadoModal.vue";
  import { useApoderados } from "./composables/useApoderados";
  import { useClasesApoderado } from "./composables/useClasesApoderado";
  import { useGerenteGeneral } from "./composables/useGerenteGeneral";

  interface Props {
    societyId: string;
    mode?: EntityModeEnum;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: EntityModeEnum.EDITAR,
  });

  const isReadonly = computed(() => props.mode === EntityModeEnum.PREVISUALIZAR);

  const {
    clasesYApoderadoStore,
    valorInicialClase,
    claseActions,
    isOpenModalClase,
    isLoadingClase,
    modeModalClase,
    openModalClase,
    closeModalClase,
    handleSubmitClase,
  } = useClasesApoderado(props.societyId ?? "");

  const { gerenteActions } = useGerenteGeneral();

  const {
    selectedClaseId,
    mostrarSelectorClase,
    isOpenModalApoderado,
    isLoadingApoderado,
    modeModalApoderado,
    apoderadoActions,
    openModalApoderado,
    closeModalApoderado,
    handleSubmitApoderado,
  } = useApoderados(props.societyId ?? "");

  onMounted(async () => {
    if (props.societyId) {
      await Promise.all([
        clasesYApoderadoStore.loadClases(props.societyId),
        clasesYApoderadoStore.loadApoderados(props.societyId),
      ]);
    }
  });
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle title="Registro de Apoderados" body="Complete todos los campos requeridos." />
    <SimpleCard>
      <CardTitle title="Clases de apoderado">
        <template #actions>
          <ActionButton
            v-if="!isReadonly"
            variant="secondary"
            label="Agregar clase"
            size="md"
            icon="Plus"
            @click="openModalClase"
          />
        </template>
      </CardTitle>

      <ClasesApoderadoTable
        :items="clasesYApoderadoStore.datosTablaClases"
        :actions="claseActions"
      />
    </SimpleCard>

    <!-- Tabla 1: Gerente General -->
    <SimpleCard>
      <CardTitle
        title="Gerente General"
        body="Debe existir exactamente un Gerente General para completar el registro."
      >
        <template #actions>
          <ActionButton
            v-if="!isReadonly"
            variant="secondary"
            label="Agregar gerente"
            size="md"
            icon="Plus"
            @click="() => {}"
          />
        </template>
      </CardTitle>

      <GerenteGeneralTable :items="[]" :actions="gerenteActions" />
    </SimpleCard>

    <!-- Tabla 2: Apoderados (con clase) -->
    <SimpleCard>
      <CardTitle
        title="Apoderados"
        body="Registra apoderados con cargo según las clases definidas."
      >
        <template #actions>
          <ActionButton
            v-if="!isReadonly"
            variant="secondary"
            label="Agregar apoderado"
            size="md"
            icon="Plus"
            :disabled="clasesYApoderadoStore.datosTablaClases.length === 0"
            @click="openModalApoderado"
          />
        </template>
      </CardTitle>

      <ApoderadosTable
        :items="clasesYApoderadoStore.datosTablaApoderados"
        :actions="apoderadoActions"
      />
    </SimpleCard>

    <!-- Tabla 3: Otros Apoderados (sin cargo) -->
    <SimpleCard>
      <CardTitle title="Otros Apoderados" body="Registra apoderados sin cargo específico.">
        <template #actions>
          <ActionButton
            v-if="!isReadonly"
            variant="secondary"
            label="Agregar apoderado"
            size="md"
            icon="Plus"
            @click="openModalApoderado('Otros Apoderados')"
          />
        </template>
      </CardTitle>

      <OtrosApoderadosTable
        :items="clasesYApoderadoStore.datosTablaOtrosApoderados"
        :actions="apoderadoActions"
      />
    </SimpleCard>

    <ClaseApoderadoModal
      v-model="isOpenModalClase"
      :mode="modeModalClase"
      :is-saving="isLoadingClase"
      :initial-value="valorInicialClase"
      @close="closeModalClase"
      @submit="handleSubmitClase"
    />

    <!--     <GerenteGeneralModal
      v-model="isGerenteModalOpen"
      :mode="gerenteEditingApoderado ? 'edit' : 'create'"
      :is-saving="isSavingApoderado"
      :initial-apoderado="gerenteEditingApoderado"
      @close="closeGerenteModal"
      @submit="handleGerenteModalSubmit"
    /> -->

    <RegistroApoderadoModal
      v-model="isOpenModalApoderado"
      v-model:clase-apoderado-id="selectedClaseId"
      :mostrar-selector-clase="mostrarSelectorClase"
      :mode="modeModalApoderado"
      :is-saving="isLoadingApoderado"
      :clase-options="clasesYApoderadoStore.datosClasesOpciones"
      @close="closeModalApoderado"
      @submit="handleSubmitApoderado"
    />
  </div>
</template>
