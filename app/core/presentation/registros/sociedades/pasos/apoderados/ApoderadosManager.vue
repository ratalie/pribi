<script setup lang="ts">
  import { computed } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import ConfirmDeleteModal from "~/components/base/modal/ConfirmDeleteModal.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import ApoderadosTable from "./components/ApoderadosTable.vue";
  import ClasesApoderadoTable from "./components/ClasesApoderadoTable.vue";
  import GerenteGeneralTable from "./components/GerenteGeneralTable.vue";
  import OtrosApoderadosTable from "./components/OtrosApoderadosTable.vue";
  import ClaseApoderadoModal from "./components/modals/ClaseApoderadoModal.vue";
  import GerenteGeneralModal from "./components/modals/GerenteGeneralModal.vue";
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
    confirmDelete: confirmDeleteClase,
  } = useClasesApoderado(props.societyId ?? "");

  const {
    isOpenModalGerenteGeneral,
    isLoadingGerenteGeneral,
    modeModalGerenteGeneral,
    tipoPersona,
    gerenteActions,
    openModalGerenteGeneral,
    closeModalGerenteGeneral,
    handleSubmitGerenteGeneral,
    confirmDelete: confirmDeleteGerente,
  } = useGerenteGeneral(props.societyId ?? "");

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
    confirmDelete: confirmDeleteApoderado,
  } = useApoderados(props.societyId ?? "");

  useFlowLayoutNext(() => {});

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
            size="lg"
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
            size="lg"
            icon="Plus"
            :is-disabled="clasesYApoderadoStore.tieneGerenteRegistrado"
            @click="openModalGerenteGeneral"
          />
        </template>
      </CardTitle>

      <GerenteGeneralTable
        :items="clasesYApoderadoStore.datosTablaGerenteGeneral"
        :actions="gerenteActions"
      />
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
            size="lg"
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
            size="lg"
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

    <GerenteGeneralModal
      v-model="isOpenModalGerenteGeneral"
      v-model:tipo-persona="tipoPersona"
      :mode="modeModalGerenteGeneral"
      :is-saving="isLoadingGerenteGeneral"
      @close="closeModalGerenteGeneral"
      @submit="handleSubmitGerenteGeneral"
    />

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

    <!-- Modales de confirmación de eliminación -->
    <!-- Modal para clases de apoderado -->
    <ConfirmDeleteModal
      v-model="confirmDeleteClase.isOpen.value"
      :title="confirmDeleteClase.title"
      :message="confirmDeleteClase.message"
      :confirm-label="confirmDeleteClase.confirmLabel"
      :cancel-label="confirmDeleteClase.cancelLabel"
      :is-loading="confirmDeleteClase.isLoading.value"
      @confirm="confirmDeleteClase.handleConfirm"
      @cancel="confirmDeleteClase.handleCancel"
    />

    <!-- Modal para gerente general -->
    <ConfirmDeleteModal
      v-model="confirmDeleteGerente.isOpen.value"
      :title="confirmDeleteGerente.title"
      :message="confirmDeleteGerente.message"
      :confirm-label="confirmDeleteGerente.confirmLabel"
      :cancel-label="confirmDeleteGerente.cancelLabel"
      :is-loading="confirmDeleteGerente.isLoading.value"
      @confirm="confirmDeleteGerente.handleConfirm"
      @cancel="confirmDeleteGerente.handleCancel"
    />

    <!-- Modal para apoderados -->
    <ConfirmDeleteModal
      v-model="confirmDeleteApoderado.isOpen.value"
      :title="confirmDeleteApoderado.title"
      :message="confirmDeleteApoderado.message"
      :confirm-label="confirmDeleteApoderado.confirmLabel"
      :cancel-label="confirmDeleteApoderado.cancelLabel"
      :is-loading="confirmDeleteApoderado.isLoading.value"
      @confirm="confirmDeleteApoderado.handleConfirm"
      @cancel="confirmDeleteApoderado.handleCancel"
    />
  </div>
</template>
