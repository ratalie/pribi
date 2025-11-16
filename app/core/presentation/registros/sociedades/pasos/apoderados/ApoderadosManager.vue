<script setup lang="ts">
import { computed, ref, toRef, watch } from "vue";

import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import CardTitle from "~/components/base/cards/CardTitle.vue";
import SimpleCard from "~/components/base/cards/SimpleCard.vue";
import { useToastFeedback } from "~/core/presentation/shared/composables/useToastFeedback";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
import { useApoderadosController } from "~/core/presentation/registros/sociedades/composables/useApoderadosController";
import { useApoderadosStore } from "./stores/apoderados.store";
import ClasesApoderadoTable from "./components/ClasesApoderadoTable.vue";
import ApoderadosTable from "./components/ApoderadosTable.vue";
import ClaseApoderadoModal from "./components/modals/ClaseApoderadoModal.vue";
import RegistroApoderadoModal from "./components/modals/RegistroApoderadoModal.vue";
import GerenteGeneralModal from "./components/modals/GerenteGeneralModal.vue";
import OtroApoderadoModal from "./components/modals/OtroApoderadoModal.vue";
import type { ClaseApoderadoForm } from "./schemas/claseApoderado.schema";
import type { ApoderadoForm } from "./schemas/apoderado.schema";
import type { ApoderadoDTO, ClaseApoderadoDTO } from "@hexag/registros/sociedades/pasos/apoderados/application";
import type { Apoderado } from "@hexag/registros/sociedades/pasos/apoderados/domain";
import { type ApoderadoRow, type ClaseApoderadoRow } from "./types";
import type { Persona, PersonaNatural } from "@hexag/registros/sociedades/pasos/accionistas/domain";
import { useToast } from "@/components/ui/toast/use-toast";

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

const DEFAULT_CLASS_NAME = "Gerente General";
const GERENTE_PLACEHOLDER_ID = "__placeholder_gerente__";
const normalize = (value: string) => value.trim().toLowerCase();
const defaultClassEnsuredFor = ref<string | null>(null);

const isReadonly = computed(() => props.mode === EntityModeEnum.PREVISUALIZAR);
const errorMessage = computed(() => controllerError.value);
const ensureSocietyId = () => {
  if (!societyId.value) {
    throw new Error("No encontramos el identificador de la sociedad.");
  }
  return societyId.value;
};

const gerenteClass = computed(() =>
  store.clases.find((clase) => normalize(clase.nombre) === normalize(DEFAULT_CLASS_NAME))
);
const gerenteClassId = computed(() => gerenteClass.value?.id ?? null);
const hasGerenteApoderado = computed(() =>
  gerenteClassId.value
    ? store.apoderados.some((item) => item.claseApoderadoId === gerenteClassId.value)
    : false
);
const isGerenteClassId = (classId?: string | null) =>
  Boolean(classId && gerenteClassId.value && classId === gerenteClassId.value);
const isGerenteApoderado = (apoderado: Apoderado) => isGerenteClassId(apoderado.claseApoderadoId);
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
  clase: store.clases.find((clase) => clase.id === apoderado.claseApoderadoId)?.nombre ?? "—",
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

// Tabla 2: Apoderados (con clase, excluyendo Gerente General)
const apoderadosRows = computed<ApoderadoRow[]>(() =>
  store.apoderados
    .filter((apoderado) => !isGerenteApoderado(apoderado) && apoderado.claseApoderadoId)
    .map(toApoderadoRow)
);

// Tabla 3: Otros Apoderados (sin clase - se manejan localmente o con clase especial)
// Por ahora, estos no se envían al backend, se mantienen en estado local
const otrosApoderadosRows = computed<ApoderadoRow[]>(() => {
  // TODO: Implementar cuando el backend soporte apoderados sin clase
  // Por ahora retornamos array vacío
  return [];
});

const claseSelectOptions = computed(() =>
  store.clases
    .filter((clase) => !isGerenteClassId(clase.id))
    .map((clase) => ({
      id: clase.id,
      value: clase.id,
      label: clase.nombre,
    }))
);

const hasAnyClaseDisponible = computed(
  () => Boolean(gerenteClassId.value) || claseSelectOptions.value.length > 0
);

const isClaseModalOpen = ref(false);
const editingClaseId = ref<string | null>(null);
const claseInitialValues = ref<ClaseApoderadoForm | null>(null);

const isApoderadoModalOpen = ref(false);
const editingApoderadoId = ref<string | null>(null);
const apoderadoInitialValues = ref<ApoderadoForm | null>(null);
const isGerenteModalOpen = ref(false);
const gerenteEditingApoderado = ref<Apoderado | null>(null);
const isOtroApoderadoModalOpen = ref(false);
const otroApoderadoEditingPersona = ref<PersonaNatural | null>(null);

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
      description: "Debes crear al menos una clase (además de Gerente General) para registrar apoderados.",
    });
    return;
  }

  editingApoderadoId.value = null;
  apoderadoInitialValues.value = {
    claseApoderadoId: claseSelectOptions.value[0]?.id ?? "",
    personaId: undefined,
    tipoDocumento: "DNI",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisEmision: "",
  };
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

  editingApoderadoId.value = apoderado.id;
  apoderadoInitialValues.value = mapApoderadoToForm(apoderado);
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

const handleSubmitApoderado = async (values: ApoderadoForm) => {
  const profileId = ensureSocietyId();
  const apoderadoId = editingApoderadoId.value ?? generateUuid();
  const personaId =
    values.personaId ??
    apoderadoInitialValues.value?.personaId ??
    store.apoderados.find((item) => item.id === editingApoderadoId.value)?.persona.id ??
    generateUuid();

  const dto: ApoderadoDTO = {
    id: apoderadoId,
    claseApoderadoId: values.claseApoderadoId,
    persona: {
      id: personaId,
      tipo: "NATURAL",
      nombre: values.nombre.trim(),
      apellidoPaterno: values.apellidoPaterno.trim(),
      apellidoMaterno: values.apellidoMaterno?.trim() || undefined,
      tipoDocumento: values.tipoDocumento,
      numeroDocumento: values.numeroDocumento,
      paisEmision: values.paisEmision?.trim() || undefined,
    },
  };

  const action =
    editingApoderadoId.value !== null
      ? () => store.updateApoderado(profileId, dto)
      : () => store.createApoderado(profileId, dto);

  await withAsyncToast(action, {
    loading: { title: editingApoderadoId.value ? "Actualizando…" : "Guardando…" },
    success: {
      title: "Apoderados",
      description:
        editingApoderadoId.value !== null
          ? "Apoderado actualizado correctamente."
          : "Apoderado creado correctamente.",
    },
    error: () => ({
      title: "No se pudo guardar",
      description: "Revisa la información e inténtalo nuevamente.",
    }),
  });

  closeApoderadoModal();
};

const closeApoderadoModal = () => {
  isApoderadoModalOpen.value = false;
  editingApoderadoId.value = null;
  apoderadoInitialValues.value = null;
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
  gerenteEditingApoderado.value = apoderado;
  isGerenteModalOpen.value = true;
};

const closeGerenteModal = () => {
  gerenteEditingApoderado.value = null;
  isGerenteModalOpen.value = false;
};

const handleGerenteModalSubmit = async (payload: ApoderadoDTO) => {
  const profileId = ensureSocietyId();
  const action =
    gerenteEditingApoderado.value !== null
      ? () => store.updateApoderado(profileId, payload)
      : () => store.createApoderado(profileId, payload);

  await withAsyncToast(action, {
    loading: { title: gerenteEditingApoderado.value ? "Actualizando…" : "Guardando…" },
    success: {
      title: "Gerente General",
      description:
        gerenteEditingApoderado.value !== null
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
      return `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno ?? ""}`.trim();
    case "JURIDICA":
      return persona.razonSocial ?? persona.nombreComercial ?? persona.numeroDocumento ?? "Persona jurídica";
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

const mapApoderadoToForm = (apoderado: (typeof store.apoderados)[number]): ApoderadoForm => {
  if (apoderado.persona.tipo !== "NATURAL") {
    throw new Error("Los apoderados deben ser personas naturales.");
  }
  const persona = apoderado.persona as PersonaNatural;
  return {
    personaId: persona.id,
    claseApoderadoId: apoderado.claseApoderadoId,
    tipoDocumento: persona.tipoDocumento ?? "DNI",
    numeroDocumento: persona.numeroDocumento ?? "",
    nombre: persona.nombre ?? "",
    apellidoPaterno: persona.apellidoPaterno ?? "",
    apellidoMaterno: persona.apellidoMaterno ?? "",
    paisEmision: persona.paisEmision ?? "",
  };
};

const isDuplicateClassName = (nombre: string, excludeId: string | null) => {
  const normalizedName = normalize(nombre);
  return store.clases.some(
    (clase) => normalize(clase.nombre) === normalizedName && clase.id !== excludeId
  );
};

const ensureDefaultClass = async () => {
  const profileId = societyId.value;
  if (!profileId) return;
  if (defaultClassEnsuredFor.value === profileId) return;
  if (store.clasesStatus !== "idle") return;

  const exists = store.clases.some(
    (clase) => normalize(clase.nombre) === normalize(DEFAULT_CLASS_NAME)
  );

  if (exists) {
    defaultClassEnsuredFor.value = profileId;
    return;
  }

  try {
    await store.createClase(profileId, {
      id: generateUuid(),
      nombre: DEFAULT_CLASS_NAME,
    });
    defaultClassEnsuredFor.value = profileId;
  } catch (error) {
    console.error("[ApoderadosManager] ensureDefaultClass error", error);
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
      ensureDefaultClass();
    }
  },
  { immediate: true }
);

const openOtroApoderadoModal = () => {
  otroApoderadoEditingPersona.value = null;
  isOtroApoderadoModalOpen.value = true;
};

const handleEditarOtroApoderado = (apoderadoId: string) => {
  // TODO: Implementar cuando se integre con backend
  // Por ahora, los otros apoderados se manejan localmente
  console.warn("[ApoderadosManager] Editar otro apoderado no implementado aún", apoderadoId);
};

const handleEliminarOtroApoderado = async (apoderadoId: string) => {
  // TODO: Implementar cuando se integre con backend
  console.warn("[ApoderadosManager] Eliminar otro apoderado no implementado aún", apoderadoId);
};

const handleOtroApoderadoSubmit = async (payload: ApoderadoDTO) => {
  // TODO: Implementar cuando el backend soporte apoderados sin clase
  // Por ahora, solo mostramos un mensaje
  toast({
    variant: "default",
    title: "Funcionalidad en desarrollo",
    description: "Los otros apoderados se guardarán próximamente.",
  });
  closeOtroApoderadoModal();
};

const closeOtroApoderadoModal = () => {
  isOtroApoderadoModalOpen.value = false;
  otroApoderadoEditingPersona.value = null;
};

const generateUuid = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};
</script>

<template>
  <section class="flex flex-col gap-12">
    <CardTitle
      title="Registro de Apoderados"
      body="Gestiona las clases y los apoderados de la sociedad."
    />

    <p
      v-if="errorMessage"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
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
      <CardTitle
        title="Otros Apoderados"
        body="Registra apoderados sin cargo específico."
      >
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
      :mode="editingApoderadoId ? 'edit' : 'create'"
      :is-saving="isSavingApoderado"
      :initial-value="apoderadoInitialValues"
      :clase-options="claseSelectOptions"
      @close="closeApoderadoModal"
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
      :mode="otroApoderadoEditingPersona ? 'edit' : 'create'"
      :is-saving="isSavingApoderado"
      :initial-persona="otroApoderadoEditingPersona"
      @close="closeOtroApoderadoModal"
      @submit="handleOtroApoderadoSubmit"
    />
  </section>
</template>



