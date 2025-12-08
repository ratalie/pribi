<script setup lang="ts">
  import { computed, onMounted, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import VDropdownComponent from "~/components/VDropdownComponent.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import ConfirmDeleteModal from "~/components/base/modal/ConfirmDeleteModal.vue";
  import { getColumns } from "~/components/base/tables/getColumns";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import Switch from "~/components/ui/switch/Switch.vue";
  import { useFlowLayoutNext } from "~/composables/useFlowLayoutNext";
  import AgregarDirectorModal from "~/core/presentation/registros/sociedades/pasos/directorio/components/AgregarDirectorModal.vue";
  import DirectorioConfigForm from "~/core/presentation/registros/sociedades/pasos/directorio/components/DirectorioConfigForm.vue";
  import DirectorioEmptyState from "~/core/presentation/registros/sociedades/pasos/directorio/components/DirectorioEmptyState.vue";
  import PresidenteDirectorioForm from "~/core/presentation/registros/sociedades/pasos/directorio/components/PresidenteDirectorioForm.vue";
  import { useDirectorioForm } from "~/core/presentation/registros/sociedades/pasos/directorio/components/forms/useDirectorioForm";
  import { useDirectorioDirectores } from "~/core/presentation/registros/sociedades/pasos/directorio/composables/useDirectorioDirectores";
  import {
    useDirectorioFormSync,
    type DirectorioFormUI,
  } from "~/core/presentation/registros/sociedades/pasos/directorio/composables/useDirectorioFormSync";
  import { useDirectorioModals } from "~/core/presentation/registros/sociedades/pasos/directorio/composables/useDirectorioModals";
  import {
    directoresColumns,
    termOptions,
  } from "~/core/presentation/registros/sociedades/pasos/directorio/constants/directorio.constants";
  import { useDirectores } from "~/core/presentation/registros/sociedades/pasos/directorio/useDirectores";
  import { useDirectoresComputed } from "~/core/presentation/registros/sociedades/pasos/directorio/utils/useDirectoresComputed";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    mode?: EntityModeEnum;
    societyId?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: EntityModeEnum.CREAR,
    societyId: "",
  });

  const route = useRoute();
  // const router = useRouter(); // Ya no es necesario, la navegación la maneja useFlowLayoutNext

  const societyId = computed(
    () => props.societyId || (route.params.id as string | undefined) || ""
  );

  // Columnas de la tabla de directores
  const directoresColumnsDef = getColumns(directoresColumns);

  // Stores y composables
  const { directores, fetchAll, delete: deleteDirector } = useDirectores(societyId);

  // Ref para el presidente del directorio (necesario para useDirectoresComputed)
  const presidenteDirectorioRef = ref("");

  // Usar el composable para transformar directores a formato de tabla
  const { directoresData, presidenteOptions: computedPresidenteOptions } =
    useDirectoresComputed(directores, presidenteDirectorioRef);

  // Composable para el formulario de directorio
  const {
    form: directorioForm,
    load: loadDirectorio,
    submit: submitDirectorio,
    isReadonly: isReadonlyDirectorio,
  } = useDirectorioForm({
    societyId,
    mode: computed(() => props.mode),
  });

  // Formulario local para sincronizar con el DTO
  const form = ref<DirectorioFormUI>({
    cantidadDirectores: "3", // Valor por defecto: 3
    cantidadPersonalizado: false,
    minimoDirectores: "3",
    maximoDirectores: "3",
    duracionDirectorio: "",
    fechaInicioDirectorio: "",
    fechaFinDirectorio: "",
    quorumMinimo: "",
    quorumMayoria: "",
    nombraPresidente: "opcion-a",
    ejerceSecretaria: "opcion-a",
    reeleccionDirectores: false,
    presideJuntas: false,
    votoDirimente: false,
    presidenteDirectorio: "",
  });

  // Usar el composable para sincronizar el formulario UI con el DTO
  const { syncFormFromDirectorio } = useDirectorioFormSync({
    form,
    directorioForm,
    presidenteDirectorioRef,
    directores,
    presidenteOptions: computedPresidenteOptions,
  });

  // Watch para sincronizar cuando directorioForm cambie completamente (después de cargar)
  // Usamos cantidadDirectores como indicador de que hay datos cargados
  watch(
    () => directorioForm.cantidadDirectores,
    (newVal) => {
      if (newVal > 0) {
        // Si hay cantidadDirectores, significa que se cargaron datos del backend
        syncFormFromDirectorio();
      }
    },
    { immediate: true }
  );

  // También sincronizar cuando cambien los valores principales
  watch(
    [
      () => directorioForm.conteoPersonalizado,
      () => directorioForm.periodo,
      () => directorioForm.inicioMandato,
      () => directorioForm.finMandato,
      () => directorioForm.quorumMinimo,
      () => directorioForm.mayoria,
      () => directorioForm.presidenteDesignado,
      () => directorioForm.secretarioAsignado,
      () => directorioForm.reeleccionPermitida,
      () => directorioForm.presidentePreside,
      () => directorioForm.presidenteDesempata,
      () => directorioForm.presidenteId,
    ],
    () => {
      if (directorioForm.cantidadDirectores > 0) {
        syncFormFromDirectorio();
      }
    },
    { deep: true }
  );

  // Cargar directores y directorio al montar
  onMounted(async () => {
    if (societyId.value) {
      try {
        await Promise.all([fetchAll(), loadDirectorio()]);
        // Sincronizar después de cargar
        syncFormFromDirectorio();
      } catch {
        console.warn("⚠️ No se pudieron cargar los datos del servidor (bug del backend).");
      }
    }
  });

  // Recargar cuando cambie el societyId
  watch(societyId, async (newId) => {
    if (newId) {
      try {
        await Promise.all([fetchAll(), loadDirectorio()]);
        // Sincronizar después de cargar
        syncFormFromDirectorio();
      } catch {
        console.warn("⚠️ No se pudieron cargar los datos del servidor (bug del backend).");
      }
    }
  });

  // Composable para manejar la lógica de modales
  const {
    modalMode,
    directorToEdit,
    isModalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useDirectorioModals({
    directores,
  });

  // Composable para manejar la lógica de directores
  const { handleDeleteDirector, handleDirectorSaved, confirmDelete } = useDirectorioDirectores(
    {
      directores,
      deleteDirector,
      directorioForm,
      form,
      presidenteDirectorioRef,
    }
  );

  // Acciones para el menú de opciones
  const directoresActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (id: string) => {
        openEditModal(id);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (id: string) => {
        handleDeleteDirector(id);
      },
    },
  ];

  // Opciones para presidente (solo titulares) - usando el composable
  const presidenteOptions = computedPresidenteOptions;

  const tieneDirectorio = ref(true);

  // El nextRoute ya no es necesario porque useFlowLayoutNext maneja la navegación automáticamente
  // const nextRoute = computed(() => {
  //   const segments = route.path.split("/");
  //   segments[segments.length - 1] = "quorums-mayorias";
  //   return segments.join("/");
  // });

  const handleNext = async () => {
    if (isReadonlyDirectorio.value) {
      // Si es readonly, solo navegar (sin guardar)
      return;
    }

    // Asegurar que cantidadDirectores tenga un valor por defecto de 3 si está vacío o es 0
    if (
      !form.value.cantidadDirectores ||
      form.value.cantidadDirectores.trim() === "" ||
      Number(form.value.cantidadDirectores) === 0
    ) {
      form.value.cantidadDirectores = "3";
      directorioForm.cantidadDirectores = 3;
    }

    // Asegurar que el presidenteId se sincronice antes del submit
    directorioForm.presidenteId = form.value.presidenteDirectorio || null;
    console.debug("[DirectorioManager] handleNext: antes de submit", {
      formCantidadDirectores: form.value.cantidadDirectores,
      directorioFormCantidadDirectores: directorioForm.cantidadDirectores,
      formPresidenteDirectorio: form.value.presidenteDirectorio,
      directorioFormPresidenteId: directorioForm.presidenteId,
    });

    await submitDirectorio();
    // Nota: La navegación al siguiente paso la maneja automáticamente useFlowLayoutNext
  };

  // Registrar la función handleNext en el store del layout
  // Esto conecta el botón "Siguiente" del layout con nuestra función handleNext
  useFlowLayoutNext(handleNext);
</script>

<template>
  <div :class="tieneDirectorio ? '' : 'h-full'">
    <div
      :class="[
        'flex flex-col gap-12',
        mode !== EntityModeEnum.RESUMEN
          ? 'p-14'
          : 'border border-gray-100 rounded-xl py-12 px-10',
      ]"
    >
      <CardTitle
        title="Directorio"
        :body="mode !== EntityModeEnum.RESUMEN ? 'Complete todos los campos requeridos.' : ''"
      >
        <template v-if="mode !== EntityModeEnum.RESUMEN" #switch>
          <Switch v-model="tieneDirectorio" />
          <VDropdownComponent
            message-dropdown="Este paso es opcional. Puedes activar o desactivar el Directorio según corresponda a tu sociedad. Para las S.A., el Directorio está siempre activo."
            :button-add-visible="true"
          />
        </template>
      </CardTitle>
      <DirectorioConfigForm
        v-if="tieneDirectorio"
        v-model:form="form"
        :term-options="termOptions"
        :mode="mode"
      />

      <PresidenteDirectorioForm
        v-if="tieneDirectorio"
        v-model:form="form"
        :presidente-options="presidenteOptions"
      />

      <SimpleCard v-if="tieneDirectorio">
        <CardTitle title="Directores" body="">
          <template #actions>
            <ActionButton
              variant="secondary"
              label="Agregar Director"
              size="xl"
              icon="UserRoundPlus"
              @click="openCreateModal"
            />
          </template>
        </CardTitle>
        <SimpleTable
          :columns="directoresColumnsDef"
          :data="directoresData"
          title-menu="Acciones"
          :actions="directoresActions"
        />
      </SimpleCard>

      <DirectorioEmptyState v-else />

      <AgregarDirectorModal
        v-model="isModalOpen"
        :mode="modalMode"
        :director-to-edit="directorToEdit"
        :society-id="props.societyId"
        @close="closeModal"
        @saved="handleDirectorSaved"
      />

      <!-- Modal de confirmación de eliminación -->
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
    </div>
  </div>
</template>
