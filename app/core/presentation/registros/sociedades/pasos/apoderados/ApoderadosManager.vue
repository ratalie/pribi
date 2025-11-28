<script setup lang="ts">
  import { useToast } from "@/components/ui/toast/use-toast";
  import type { Persona } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import type { ApoderadoDTO } from "@hexag/registros/sociedades/pasos/apoderados/application";
  import type { Apoderado } from "@hexag/registros/sociedades/pasos/apoderados/domain";
  import { computed, ref, toRef } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import { useApoderadosController } from "~/core/presentation/registros/sociedades/composables/useApoderadosController";
  import { useToastFeedback } from "~/core/presentation/shared/composables/useToastFeedback";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import ApoderadosTable from "./components/ApoderadosTable.vue";
  import ClasesApoderadoTable from "./components/ClasesApoderadoTable.vue";
  import GerenteGeneralTable from "./components/GerenteGeneralTable.vue";
  import ClaseApoderadoModal from "./components/modals/ClaseApoderadoModal.vue";
  import GerenteGeneralModal from "./components/modals/GerenteGeneralModal.vue";
  import OtroApoderadoModal from "./components/modals/OtroApoderadoModal.vue";
  import RegistroApoderadoModal from "./components/modals/RegistroApoderadoModal.vue";
  import { useApoderados } from "./composables/useApoderados";
  import { useClasesApoderado } from "./composables/useClasesApoderado";
  import { useGerenteGeneral } from "./composables/useGerenteGeneral";
  import { useApoderadosStore } from "./stores/apoderados.store";
  import { ClasesApoderadoEspecialesEnum } from "./types/enums/ClasesApoderadoEspecialesEnum";

  interface Props {
    societyId: string;
    mode?: EntityModeEnum;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: EntityModeEnum.EDITAR,
  });

  const societyId = toRef(props, "societyId");
  const store = useApoderadosStore();
  const controller = useApoderadosController({
    societyId,
    ttlMs: 60_000,
  });
  const isControllerLoading = computed(() => controller.isEnsuring.value);
  const { withAsyncToast } = useToastFeedback();
  const { toast } = useToast();

  const normalize = (value: string) => value;
  const GERENTE_PLACEHOLDER_ID = "__placeholder_gerente__";

  const isReadonly = computed(() => props.mode === EntityModeEnum.PREVISUALIZAR);
  const ensureSocietyId = () => {
    if (!societyId.value) {
      throw new Error("No encontramos el identificador de la sociedad.");
    }
    return societyId.value;
  };

  // Gerente General
  const gerenteClass = computed(() =>
    store.clases.find(
      (clase) =>
        normalize(clase.nombre) === normalize(ClasesApoderadoEspecialesEnum.GERENTE_GENERAL)
    )
  );
  const gerenteClassId = computed(() => gerenteClass.value?.id ?? null);
  const hasGerenteApoderado = computed(() =>
    gerenteClassId.value
      ? store.apoderados.some((item) => item.claseApoderadoId === gerenteClassId.value)
      : false
  );
  const isGerenteClassId = (classId?: string | null) =>
    Boolean(classId && gerenteClassId.value && classId === gerenteClassId.value);
  const isGerenteApoderado = (apoderado: Apoderado) =>
    isGerenteClassId(apoderado.claseApoderadoId);
  const gerentePlaceholderRow = computed<any | null>(() => {
    if (!gerenteClass.value || hasGerenteApoderado.value) return null;
    return {
      id: GERENTE_PLACEHOLDER_ID,
      clase: gerenteClass.value.nombre,
      nombre: "Completa al Gerente General",
      documento: "—",
      isPlaceholder: true,
    };
  });

  // Otros Apoderados
  const otrosClass = computed(() =>
    store.clases.find(
      (clase) =>
        normalize(clase.nombre) === normalize(ClasesApoderadoEspecialesEnum.OTROS_APODERADOS)
    )
  );
  const otrosClassId = computed(() => otrosClass.value?.id ?? null);
  const isOtrosClassId = (classId?: string | null) =>
    Boolean(classId && otrosClassId.value && classId === otrosClassId.value);
  const isOtroApoderado = (apoderado: Apoderado) => isOtrosClassId(apoderado.claseApoderadoId);

  const toApoderadoRow = (apoderado: Apoderado): any => ({
    id: apoderado.id,
    clase:
      store.clases.find((clase) => clase.id === apoderado.claseApoderadoId)?.nombre ?? "—",
    nombre: getPersonaLabel(apoderado.persona),
    documento: getPersonaDocument(apoderado.persona),
  });

  // Tabla 1: Gerente General
  const gerenteRows = computed<any[]>(() => {
    const rows = store.apoderados.filter(isGerenteApoderado).map(toApoderadoRow);
    if (rows.length === 0 && gerentePlaceholderRow.value) {
      return [gerentePlaceholderRow.value];
    }
    return rows;
  });

  // Tabla 3: Otros Apoderados (con clase especial "Otros Apoderados")
  const otrosApoderadosRows = computed<any[]>(() =>
    store.apoderados.filter(isOtroApoderado).map(toApoderadoRow)
  );

  const isGerenteModalOpen = ref(false);
  const gerenteEditingApoderado = ref<Apoderado | null>(null);
  const isOtroApoderadoModalOpen = ref(false);
  const otroApoderadoEditingApoderado = ref<Apoderado | null>(null);

  const isSavingApoderado = computed(() => store.apoderadosStatus === "saving");

  const openGerenteModal = (apoderado: Apoderado | null = null) => {
    if (!gerenteClassId.value) {
      toast({
        variant: "destructive",
        title: "Clase Gerente General no disponible",
        description: "Crea la clase “Gerente General” antes de registrar el apoderado.",
      });
      return;
    }

    // Si no se pasó un apoderado, buscar si existe uno en el store
    if (!apoderado) {
      const existingApoderado = store.apoderados.find(
        (item) => item.claseApoderadoId === gerenteClassId.value
      );
      if (existingApoderado) {
        apoderado = existingApoderado;
      }
    }

    gerenteEditingApoderado.value = apoderado;
    isGerenteModalOpen.value = true;
  };

  const closeGerenteModal = () => {
    gerenteEditingApoderado.value = null;
    isGerenteModalOpen.value = false;
  };

  const handleGerenteModalSubmit = async (payload: ApoderadoDTO) => {
    const profileId = ensureSocietyId();

    // Verificar si realmente existe un apoderado con esta clase en el store
    const existingApoderado = store.apoderados.find(
      (apoderado) => apoderado.claseApoderadoId === gerenteClassId.value
    );

    // Es edición si: 1) se pasó un apoderado al abrir el modal, O 2) existe uno en el store
    const isEditing =
      gerenteEditingApoderado.value !== null || existingApoderado !== undefined;

    // Si es edición y existe en el store, usar el ID existente
    if (isEditing && existingApoderado) {
      payload.id = existingApoderado.id;
      // También preservar el ID de la persona si existe
      if (existingApoderado.persona?.id) {
        payload.persona.id = existingApoderado.persona.id;
      }
    }

    const action = isEditing
      ? () => store.updateApoderado(profileId, payload)
      : () => store.createApoderado(profileId, payload);

    await withAsyncToast(action, {
      loading: { title: isEditing ? "Actualizando…" : "Guardando…" },
      success: {
        title: "Gerente General",
        description: isEditing
          ? "Gerente actualizado correctamente."
          : "Gerente registrado correctamente.",
      },
      error: () => ({
        title: "No se pudo guardar",
        description: "Revisa la información e inténtalo nuevamente.",
      }),
    });

    closeGerenteModal();
  };

  const getPersonaLabel = (persona: Persona) => {
    switch (persona.tipo) {
      case "NATURAL":
        return `${persona.nombre} ${persona.apellidoPaterno} ${
          persona.apellidoMaterno ?? ""
        }`.trim();
      case "JURIDICA":
        return (
          persona.razonSocial ??
          persona.nombreComercial ??
          persona.numeroDocumento ??
          "Persona jurídica"
        );
      default:
        return persona.tipo;
    }
  };

  const getPersonaDocument = (persona: Persona) => {
    switch (persona.tipo) {
      case "NATURAL":
        return `${persona.tipoDocumento ?? "DNI"} · ${persona.numeroDocumento ?? "—"}`;
      case "JURIDICA":
        return `${persona.tipoDocumento ?? "RUC"} · ${persona.numeroDocumento ?? "—"}`;
      default:
        return "—";
    }
  };

  const openOtroApoderadoModal = () => {
    if (!otrosClassId.value) {
      toast({
        variant: "destructive",
        title: "Clase Otros Apoderados no disponible",
        description: 'Crea la clase "Otros Apoderados" antes de registrar el apoderado.',
      });
      return;
    }
    otroApoderadoEditingApoderado.value = null;
    isOtroApoderadoModalOpen.value = true;
  };

  const handleEditarOtroApoderado = (apoderadoId: string) => {
    const apoderado = store.apoderados.find((item) => item.id === apoderadoId);
    if (!apoderado) return;

    if (!isOtroApoderado(apoderado)) {
      console.error(
        "[ApoderadosManager] El apoderado no pertenece a la clase Otros Apoderados"
      );
      return;
    }

    otroApoderadoEditingApoderado.value = apoderado;
    isOtroApoderadoModalOpen.value = true;
  };

  const handleEliminarOtroApoderado = async (apoderadoId: string) => {
    const target = store.apoderados.find((item) => item.id === apoderadoId);
    if (!target) return;

    if (!isOtroApoderado(target)) {
      console.error(
        "[ApoderadosManager] El apoderado no pertenece a la clase Otros Apoderados"
      );
      return;
    }

    const confirmed = window.confirm("¿Deseas eliminar este apoderado?");
    if (!confirmed) return;

    const profileId = ensureSocietyId();
    await withAsyncToast(
      () => store.deleteApoderado(profileId, target.claseApoderadoId, apoderadoId),
      {
        loading: { title: "Eliminando apoderado…" },
        success: { title: "Apoderado eliminado" },
        error: () => ({
          title: "No se pudo eliminar al apoderado",
          description: "Intenta nuevamente.",
        }),
      }
    );
  };

  const handleOtroApoderadoSubmit = async (payload: ApoderadoDTO) => {
    const profileId = ensureSocietyId();
    const isEditing = otroApoderadoEditingApoderado.value !== null;

    console.log("[ApoderadosManager] handleOtroApoderadoSubmit", { isEditing, payload });

    const action = isEditing
      ? () => store.updateApoderado(profileId, payload)
      : () => store.createApoderado(profileId, payload);

    await withAsyncToast(action, {
      loading: { title: isEditing ? "Actualizando…" : "Guardando…" },
      success: {
        title: "Otros Apoderados",
        description: isEditing
          ? "Apoderado actualizado correctamente."
          : "Apoderado creado correctamente.",
      },
      error: () => ({
        title: "No se pudo guardar",
        description: "Revisa la información e inténtalo nuevamente.",
      }),
    });

    closeOtroApoderadoModal();
  };

  const closeOtroApoderadoModal = () => {
    isOtroApoderadoModalOpen.value = false;
    otroApoderadoEditingApoderado.value = null;
  };

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
            v-if="!isReadonly && !hasGerenteApoderado"
            variant="secondary"
            label="Agregar gerente"
            size="md"
            icon="Plus"
            @click="openGerenteModal"
          />
        </template>
      </CardTitle>

      <GerenteGeneralTable :items="gerenteRows" :actions="gerenteActions" />
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
            @click="openOtroApoderadoModal"
          />
        </template>
      </CardTitle>

      <ApoderadosTable
        :items="otrosApoderadosRows"
        :is-loading="isControllerLoading"
        :readonly="isReadonly"
        @edit="handleEditarOtroApoderado"
        @remove="handleEliminarOtroApoderado"
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
      v-if="gerenteClassId"
      v-model="isGerenteModalOpen"
      :mode="gerenteEditingApoderado ? 'edit' : 'create'"
      :is-saving="isSavingApoderado"
      :gerente-class-id="gerenteClassId"
      :initial-apoderado="gerenteEditingApoderado"
      @close="closeGerenteModal"
      @submit="handleGerenteModalSubmit"
    />

    <RegistroApoderadoModal
      v-model="isOpenModalApoderado"
      v-model:clase-apoderado-id="selectedClaseId"
      :mode="modeModalApoderado"
      :is-saving="isLoadingApoderado"
      :clase-options="clasesYApoderadoStore.datosClasesOpciones"
      @close="closeModalApoderado"
      @submit="handleSubmitApoderado"
    />

    <OtroApoderadoModal
      v-model="isOtroApoderadoModalOpen"
      :otros-class-id="otrosClassId ?? ''"
      :initial-apoderado="otroApoderadoEditingApoderado"
      @submit="handleOtroApoderadoSubmit"
    />
  </div>
</template>
