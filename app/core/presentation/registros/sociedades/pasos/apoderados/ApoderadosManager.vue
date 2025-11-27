<script setup lang="ts">
  import { computed, ref, toRef, watch } from "vue";

  import { useToast } from "@/components/ui/toast/use-toast";
  import type { Persona } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import type {
    ApoderadoDTO,
    ClaseApoderadoDTO,
  } from "@hexag/registros/sociedades/pasos/apoderados/application";
  import type { Apoderado } from "@hexag/registros/sociedades/pasos/apoderados/domain";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import { useApoderadosController } from "~/core/presentation/registros/sociedades/composables/useApoderadosController";
  import { useToastFeedback } from "~/core/presentation/shared/composables/useToastFeedback";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import ApoderadosTable from "./components/ApoderadosTable.vue";
  import ClasesApoderadoTable from "./components/ClasesApoderadoTable.vue";
  import ClaseApoderadoModal from "./components/modals/ClaseApoderadoModal.vue";
  import GerenteGeneralModal from "./components/modals/GerenteGeneralModal.vue";
  import OtroApoderadoModal from "./components/modals/OtroApoderadoModal.vue";
  import RegistroApoderadoModal from "./components/modals/RegistroApoderadoModal.vue";
  import { ClasesApoderadoEspecialesEnum } from "./enums/ClasesApoderadoEspecialesEnum";
  import type { ClaseApoderadoForm } from "./schemas/claseApoderado.schema";
  import { useApoderadosStore } from "./stores/apoderados.store";
  import type { ApoderadoRow, ClaseApoderadoRow } from "./types";

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
  const controllerError = controller.error;
  const { withAsyncToast } = useToastFeedback();
  const { toast } = useToast();

  const normalize = (value: string) => value.trim().toLowerCase();
  const defaultClassesEnsuredFor = ref<string | null>(null);
  const GERENTE_PLACEHOLDER_ID = "__placeholder_gerente__";
  const _OTROS_PLACEHOLDER_ID = "__placeholder_otros__";

  const generateUuid = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  };

  const isReadonly = computed(() => props.mode === EntityModeEnum.PREVISUALIZAR);
  const errorMessage = computed(() => controllerError.value);
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
  const gerentePlaceholderRow = computed<ApoderadoRow | null>(() => {
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

  const claseRows = computed<ClaseApoderadoRow[]>(() =>
    store.clases.map((clase) => ({
      id: clase.id,
      nombre: clase.nombre,
      numeroApoderados: store.apoderados.filter(
        (apoderado) => apoderado.claseApoderadoId === clase.id
      ).length,
    }))
  );

  const toApoderadoRow = (apoderado: Apoderado): ApoderadoRow => ({
    id: apoderado.id,
    clase:
      store.clases.find((clase) => clase.id === apoderado.claseApoderadoId)?.nombre ?? "—",
    nombre: getPersonaLabel(apoderado.persona),
    documento: getPersonaDocument(apoderado.persona),
  });

  // Tabla 1: Gerente General
  const gerenteRows = computed<ApoderadoRow[]>(() => {
    const rows = store.apoderados.filter(isGerenteApoderado).map(toApoderadoRow);
    if (rows.length === 0 && gerentePlaceholderRow.value) {
      return [gerentePlaceholderRow.value];
    }
    return rows;
  });

  // Tabla 2: Apoderados (con clase, excluyendo Gerente General y Otros Apoderados)
  const apoderadosRows = computed<ApoderadoRow[]>(() =>
    store.apoderados
      .filter(
        (apoderado) =>
          !isGerenteApoderado(apoderado) &&
          !isOtroApoderado(apoderado) &&
          apoderado.claseApoderadoId
      )
      .map(toApoderadoRow)
  );

  // Tabla 3: Otros Apoderados (con clase especial "Otros Apoderados")
  const otrosApoderadosRows = computed<ApoderadoRow[]>(() =>
    store.apoderados.filter(isOtroApoderado).map(toApoderadoRow)
  );

  const claseSelectOptions = computed(() =>
    store.clases
      .filter((clase) => !isGerenteClassId(clase.id) && !isOtrosClassId(clase.id))
      .map((clase) => ({
        id: clase.id,
        value: clase.id,
        label: clase.nombre,
      }))
  );

  const _hasAnyClaseDisponible = computed(
    () => Boolean(gerenteClassId.value) || claseSelectOptions.value.length > 0
  );

  const isClaseModalOpen = ref(false);
  const editingClaseId = ref<string | null>(null);
  const claseInitialValues = ref<ClaseApoderadoForm | null>(null);

  const isApoderadoModalOpen = ref(false);
  const editingApoderado = ref<Apoderado | null>(null);
  const isGerenteModalOpen = ref(false);
  const gerenteEditingApoderado = ref<Apoderado | null>(null);
  const isOtroApoderadoModalOpen = ref(false);
  const otroApoderadoEditingApoderado = ref<Apoderado | null>(null);

  const openCreateClaseModal = () => {
    editingClaseId.value = null;
    claseInitialValues.value = { nombre: "" };
    isClaseModalOpen.value = true;
  };

  const handleEditarClase = (claseId: string) => {
    const clase = store.clases.find((item) => item.id === claseId);
    if (!clase) return;
    editingClaseId.value = clase.id;
    claseInitialValues.value = { nombre: clase.nombre };
    isClaseModalOpen.value = true;
  };

  const handleEliminarClase = async (claseId: string) => {
    const confirmed = window.confirm("¿Deseas eliminar esta clase de apoderado?");
    if (!confirmed) return;
    const profileId = ensureSocietyId();
    await withAsyncToast(() => store.deleteClase(profileId, claseId), {
      loading: { title: "Eliminando clase…" },
      success: { title: "Clase eliminada" },
      error: () => ({
        title: "No se pudo eliminar la clase",
        description: "Intenta nuevamente.",
      }),
    });
  };

  const isSavingClase = computed(() => store.clasesStatus === "saving");
  const isSavingApoderado = computed(() => store.apoderadosStatus === "saving");

  const handleSubmitClase = async (values: ClaseApoderadoForm) => {
    const profileId = ensureSocietyId();
    const dto: ClaseApoderadoDTO = {
      id: editingClaseId.value ?? generateUuid(),
      nombre: values.nombre.trim(),
    };

    if (isDuplicateClassName(dto.nombre, editingClaseId.value ?? null)) {
      toast({
        variant: "destructive",
        title: "Nombre duplicado",
        description: "Ya existe una clase con ese nombre.",
      });
      return;
    }

    const action =
      editingClaseId.value !== null
        ? () => store.updateClase(profileId, dto)
        : () => store.createClase(profileId, dto);
    await withAsyncToast(action, {
      loading: { title: editingClaseId.value ? "Actualizando…" : "Guardando…" },
      success: {
        title: "Clases de apoderado",
        description:
          editingClaseId.value !== null
            ? "Clase actualizada correctamente."
            : "Clase creada correctamente.",
      },
      error: () => ({
        title: "No se pudo guardar",
        description: "Revisa la información e inténtalo nuevamente.",
      }),
    });
    closeClaseModal();
  };

  const closeClaseModal = () => {
    isClaseModalOpen.value = false;
    editingClaseId.value = null;
    claseInitialValues.value = null;
  };

  const openCreateApoderadoModal = () => {
    if (claseSelectOptions.value.length === 0) {
      toast({
        variant: "destructive",
        title: "Agrega una clase de apoderado",
        description:
          "Debes crear al menos una clase (además de Gerente General) para registrar apoderados.",
      });
      return;
    }

    editingApoderado.value = null;
    isApoderadoModalOpen.value = true;
  };

  const handleEditarApoderado = (apoderadoId: string) => {
    if (apoderadoId === GERENTE_PLACEHOLDER_ID) {
      openGerenteModal();
      return;
    }

    const apoderado = store.apoderados.find((item) => item.id === apoderadoId);
    if (!apoderado) return;

    if (isGerenteApoderado(apoderado)) {
      openGerenteModal(apoderado);
      return;
    }

    editingApoderado.value = apoderado;
    isApoderadoModalOpen.value = true;
  };

  const handleEliminarApoderado = async (apoderadoId: string) => {
    if (apoderadoId === GERENTE_PLACEHOLDER_ID) {
      openGerenteModal();
      return;
    }

    const target = store.apoderados.find((item) => item.id === apoderadoId);
    if (!target) return;
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

  const handleSubmitApoderado = async (payload: ApoderadoDTO) => {
    const profileId = ensureSocietyId();
    const isEditing = !!editingApoderado.value;

    // Si es edición, asegurar que se usen los IDs correctos
    if (isEditing && editingApoderado.value) {
      payload.id = editingApoderado.value.id;
      // Verificar que la clase seleccionada existe
      const claseExists = claseSelectOptions.value.some(
        (opt) => opt.id === payload.claseApoderadoId
      );
      if (!claseExists) {
        toast({
          variant: "destructive",
          title: "Clase inválida",
          description: "La clase seleccionada no es válida.",
        });
        console.error("[ApoderadosManager] Clase no encontrada:", {
          selectedClaseId: payload.claseApoderadoId,
          availableOptions: claseSelectOptions.value,
        });
        return;
      }
      // Preservar el ID de la persona si existe
      if (editingApoderado.value.persona?.id) {
        payload.persona.id = editingApoderado.value.persona.id;
      }
    }

    console.log("[ApoderadosManager] handleSubmitApoderado", {
      isEditing,
      editingApoderadoId: editingApoderado.value?.id,
      payload,
      claseId: payload.claseApoderadoId,
      claseOptions: claseSelectOptions.value,
    });

    await withAsyncToast(
      () =>
        isEditing
          ? store.updateApoderado(profileId, payload)
          : store.createApoderado(profileId, payload),
      {
        loading: { title: isEditing ? "Actualizando apoderado…" : "Guardando apoderado…" },
        success: { title: isEditing ? "Apoderado actualizado" : "Apoderado registrado" },
        error: () => ({
          title: isEditing
            ? "No se pudo actualizar el apoderado"
            : "No se pudo guardar el apoderado",
        }),
      }
    );

    closeApoderadoModal();
  };

  const closeApoderadoModal = () => {
    isApoderadoModalOpen.value = false;
    editingApoderado.value = null;
  };

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

    console.log("[ApoderadosManager] handleGerenteModalSubmit", {
      isEditing,
      existingApoderado: existingApoderado?.id,
      payload,
    });

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

  const isDuplicateClassName = (nombre: string, excludeId: string | null) => {
    const normalizedName = normalize(nombre);
    return store.clases.some(
      (clase) => normalize(clase.nombre) === normalizedName && clase.id !== excludeId
    );
  };

  const ensureDefaultClasses = async () => {
    const profileId = societyId.value;
    if (!profileId) return;
    if (defaultClassesEnsuredFor.value === profileId) return;
    if (store.clasesStatus !== "idle") return;

    const gerenteExists = store.clases.some(
      (clase) =>
        normalize(clase.nombre) === normalize(ClasesApoderadoEspecialesEnum.GERENTE_GENERAL)
    );
    const otrosExists = store.clases.some(
      (clase) =>
        normalize(clase.nombre) === normalize(ClasesApoderadoEspecialesEnum.OTROS_APODERADOS)
    );

    try {
      // Crear Gerente General si no existe
      if (!gerenteExists) {
        await store.createClase(profileId, {
          id: generateUuid(),
          nombre: ClasesApoderadoEspecialesEnum.GERENTE_GENERAL,
        });
      }

      // Crear Otros Apoderados si no existe
      if (!otrosExists) {
        await store.createClase(profileId, {
          id: generateUuid(),
          nombre: ClasesApoderadoEspecialesEnum.OTROS_APODERADOS,
        });
      }

      defaultClassesEnsuredFor.value = profileId;
    } catch (error) {
      console.error("[ApoderadosManager] ensureDefaultClasses error", error);
    }
  };

  watch(
    () => ({
      status: store.clasesStatus,
      society: societyId.value,
      length: store.clases.length,
    }),
    ({ status }) => {
      if (status === "idle") {
        ensureDefaultClasses();
      }
    },
    { immediate: true }
  );

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
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle title="Registro de Apoderados" body="Complete todos los campos requeridos." />

    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>

    <SimpleCard>
      <CardTitle title="Clases de apoderado">
        <template #actions>
          <ActionButton
            v-if="!isReadonly"
            variant="secondary"
            label="Agregar clase"
            size="md"
            icon="Plus"
            @click="openCreateClaseModal"
          />
        </template>
      </CardTitle>

      <ClasesApoderadoTable
        :items="claseRows"
        :is-loading="isControllerLoading"
        :readonly="isReadonly"
        @edit="handleEditarClase"
        @remove="handleEliminarClase"
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
      <ApoderadosTable
        :items="gerenteRows"
        :is-loading="isControllerLoading"
        :readonly="isReadonly"
        @edit="handleEditarApoderado"
        @remove="handleEliminarApoderado"
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
            size="md"
            icon="Plus"
            :disabled="claseSelectOptions.length === 0"
            @click="openCreateApoderadoModal"
          />
        </template>
      </CardTitle>
      <ApoderadosTable
        :items="apoderadosRows"
        :is-loading="isControllerLoading"
        :readonly="isReadonly"
        @edit="handleEditarApoderado"
        @remove="handleEliminarApoderado"
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
      v-model="isClaseModalOpen"
      :mode="editingClaseId ? 'edit' : 'create'"
      :is-saving="isSavingClase"
      :initial-value="claseInitialValues"
      @close="closeClaseModal"
      @submit="handleSubmitClase"
    />

    <RegistroApoderadoModal
      v-model="isApoderadoModalOpen"
      :mode="editingApoderado ? 'edit' : 'create'"
      :is-saving="isSavingApoderado"
      :initial-apoderado="editingApoderado"
      :clase-options="claseSelectOptions"
      @submit="handleSubmitApoderado"
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

    <OtroApoderadoModal
      v-model="isOtroApoderadoModalOpen"
      :otros-class-id="otrosClassId ?? ''"
      :initial-apoderado="otroApoderadoEditingApoderado"
      @submit="handleOtroApoderadoSubmit"
    />
  </div>
</template>
