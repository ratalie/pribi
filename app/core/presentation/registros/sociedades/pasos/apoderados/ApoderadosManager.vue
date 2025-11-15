<script setup lang="ts">
import { computed, ref, toRef } from "vue";

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
import type { ClaseApoderadoForm } from "./schemas/claseApoderado.schema";
import type { ApoderadoForm } from "./schemas/apoderado.schema";
import type { ApoderadoDTO, ClaseApoderadoDTO } from "@hexag/registros/sociedades/pasos/apoderados/application";
import { type ApoderadoRow, type ClaseApoderadoRow } from "./types";
import type { Persona, PersonaNatural } from "@hexag/registros/sociedades/pasos/accionistas/domain";
import type { TerminoCargo } from "@hexag/registros/sociedades/pasos/apoderados/domain";

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

const isReadonly = computed(() => props.mode === EntityModeEnum.PREVISUALIZAR);
const errorMessage = computed(() => controllerError.value);
const ensureSocietyId = () => {
  if (!societyId.value) {
    throw new Error("No encontramos el identificador de la sociedad.");
  }
  return societyId.value;
};

const claseRows = computed<ClaseApoderadoRow[]>(() =>
  store.clases.map((clase) => ({
    id: clase.id,
    nombre: clase.nombre,
    numeroApoderados: store.apoderados.filter(
      (apoderado) => apoderado.claseApoderadoId === clase.id
    ).length,
  }))
);

const apoderadoRows = computed<ApoderadoRow[]>(() =>
  store.apoderados.map((apoderado) => ({
    id: apoderado.id,
    clase: store.clases.find((clase) => clase.id === apoderado.claseApoderadoId)?.nombre ?? "—",
    nombre: getPersonaLabel(apoderado.persona),
    documento: getPersonaDocument(apoderado.persona),
    termino: apoderado.terminoCargo === "INDEFINIDO" ? "Indefinido" : "Determinado",
  }))
);

const DEFAULT_TERMINO: TerminoCargo = "INDEFINIDO";

const claseSelectOptions = computed(() =>
  store.clases.map((clase) => ({
    id: clase.id,
    value: clase.id,
    label: clase.nombre,
  }))
);

const isClaseModalOpen = ref(false);
const editingClaseId = ref<string | null>(null);
const claseInitialValues = ref<ClaseApoderadoForm | null>(null);

const isApoderadoModalOpen = ref(false);
const editingApoderadoId = ref<string | null>(null);
const apoderadoInitialValues = ref<ApoderadoForm | null>(null);

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
  editingApoderadoId.value = null;
  apoderadoInitialValues.value = {
    claseApoderadoId: store.clases[0]?.id ?? "",
    personaId: undefined,
    tipoDocumento: "DNI",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisEmision: "",
    terminoCargo: DEFAULT_TERMINO,
    fechaInicio: "",
    fechaFin: "",
  };
  isApoderadoModalOpen.value = true;
};

const handleEditarApoderado = (apoderadoId: string) => {
  const apoderado = store.apoderados.find((item) => item.id === apoderadoId);
  if (!apoderado) return;
  editingApoderadoId.value = apoderado.id;
  apoderadoInitialValues.value = mapApoderadoToForm(apoderado);
  isApoderadoModalOpen.value = true;
};

const handleEliminarApoderado = async (apoderadoId: string) => {
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
    terminoCargo: values.terminoCargo,
    fechaInicio: values.fechaInicio,
    fechaFin: values.terminoCargo === "DETERMINADO" ? values.fechaFin ?? undefined : undefined,
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
    terminoCargo: apoderado.terminoCargo,
    fechaInicio: apoderado.fechaInicio ? apoderado.fechaInicio.split("T")[0] : "",
    fechaFin: apoderado.fechaFin ? apoderado.fechaFin.split("T")[0] : "",
  } as ApoderadoForm;
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

    <SimpleCard>
      <CardTitle title="Apoderados registrados">
        <template #actions>
          <ActionButton
            v-if="!isReadonly"
            variant="secondary"
            label="Agregar apoderado"
            size="md"
            icon="Plus"
            @click="openCreateApoderadoModal"
          />
        </template>
      </CardTitle>

      <ApoderadosTable
        :items="apoderadoRows"
        :is-loading="isControllerLoading"
        :readonly="isReadonly"
        @edit="handleEditarApoderado"
        @remove="handleEliminarApoderado"
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
  </section>
</template>



