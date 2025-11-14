<script setup lang="ts">
  import { computed, onMounted, ref, toRef, watch } from "vue";

  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import { useToastFeedback } from "~/core/presentation/shared/composables/useToastFeedback";
  import type {
    Accionista,
    Persona,
  } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import type { AccionistaDTO } from "@hexag/registros/sociedades/pasos/accionistas/application";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import AccionistaModal from "./components/AccionistaModal.vue";
  import AccionistasList from "./components/AccionistasList.vue";
  import {
    personaTypeLabels,
    personaToFormValues,
    type AccionistaFormValues,
    type AccionistaRow,
  } from "./types";
  import { useAccionistas } from "./useAccionistas";

  interface Props {
    societyId: string;
    mode?: EntityModeEnum;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: EntityModeEnum.CREAR,
  });

  const societyId = toRef(props, "societyId");
  const isReadonly = computed(() => props.mode === EntityModeEnum.PREVISUALIZAR);

  const {
    accionistas,
    isLoading,
    isSaving,
    error,
    fetchAll,
    create,
    update,
    remove,
  } = useAccionistas(societyId);

  const { withAsyncToast } = useToastFeedback();

  const isModalOpen = ref(false);
  const editingId = ref<string | null>(null);
  const initialValues = ref<AccionistaFormValues | undefined>();

  const rows = computed<AccionistaRow[]>(() =>
    accionistas.value.map((item) => ({
      id: item.id,
      etiqueta: getPersonaLabel(item.persona),
      tipo: personaTypeLabels[item.persona.tipo as keyof typeof personaTypeLabels] ?? "—",
      documento: getPersonaDocument(item.persona),
      participacion: item.participacionPorcentual
        ? `${item.participacionPorcentual.toFixed(2)}%`
        : "—",
    }))
  );

  const errorMessage = computed(() => error.value?.message ?? null);

  const loadData = async () => {
    if (!societyId.value) return;
    await fetchAll();
  };

  watch(
    () => societyId.value,
    (value, previous) => {
      if (!value || value === previous) return;
      loadData();
    },
    { immediate: true }
  );

  onMounted(() => {
    if (societyId.value) {
      loadData();
    }
  });

  const openCreateModal = () => {
    editingId.value = null;
    initialValues.value = undefined;
    isModalOpen.value = true;
  };

  const handleEdit = (accionistaId: string) => {
    const current = accionistas.value.find((item) => item.id === accionistaId);
    if (!current) return;
    editingId.value = accionistaId;
    initialValues.value = personaToFormValues(current.persona, {
      id: current.id,
      participacionPorcentual: current.participacionPorcentual ?? null,
    });
    isModalOpen.value = true;
  };

  const handleRemove = async (accionistaId: string) => {
    const confirmed = window.confirm("¿Deseas eliminar este accionista?");
    if (!confirmed) return;

    await withAsyncToast(() => remove(accionistaId), {
      loading: {
        title: "Eliminando accionista…",
      },
      success: {
        title: "Accionista eliminado",
        description: "Se eliminó correctamente.",
      },
      error: () => ({
        title: "No se pudo eliminar",
        description: "Inténtalo nuevamente.",
      }),
    });
  };

  const handleModalSubmit = async (values: AccionistaFormValues) => {
    const dto = buildDto(values);
    if (!dto) return;

    const action =
      editingId.value !== null
        ? () => update(editingId.value as string, dto)
        : () => create(dto);

    await withAsyncToast(action, {
      loading: {
        title: editingId.value ? "Actualizando…" : "Guardando…",
      },
      success: {
        title: "Accionistas",
        description: editingId.value
          ? "Accionista actualizado correctamente."
          : "Accionista creado correctamente.",
      },
      error: () => ({
        title: "No se pudo guardar",
        description: "Revisa la información e inténtalo nuevamente.",
      }),
    });

    closeModal();
  };

  const buildDto = (values: AccionistaFormValues): AccionistaDTO | null => {
    const persona = mapFormToPersona(values);
    if (!persona) return null;

    return {
      id: editingId.value ?? undefined,
      persona,
      participacionPorcentual: values.participacionPorcentual ?? undefined,
    };
  };

  const mapFormToPersona = (values: AccionistaFormValues): Persona | null => {
    if (values.personaType === "NATURAL") {
      return {
        tipo: "NATURAL",
        nombre: values.nombre,
        apellidoPaterno: values.apellidoPaterno,
        apellidoMaterno: values.apellidoMaterno,
        tipoDocumento: values.tipoDocumento,
        numeroDocumento: values.numeroDocumento,
        paisEmision: values.paisEmision,
      };
    }

    if (values.personaType === "JURIDICA") {
      return {
        tipo: "JURIDICA",
        tipoDocumento: values.tipoDocumento,
        numeroDocumento: values.numeroDocumento,
        razonSocial: values.razonSocial,
        nombreComercial: values.nombreComercial,
        direccion: values.direccion,
        pais: values.pais,
      };
    }

    return null;
  };

  const getPersonaLabel = (persona: Persona) => {
    if (persona.tipo === "NATURAL") {
      return `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno ?? ""}`.trim();
    }
    if (persona.tipo === "JURIDICA") {
      return persona.razonSocial;
    }
    return persona.tipo;
  };

  const getPersonaDocument = (persona: Persona) => {
    if ("numeroDocumento" in persona) {
      return `${persona.tipo === "NATURAL" ? persona.tipoDocumento : persona.tipoDocumento ?? "RUC"} · ${
        persona.numeroDocumento
      }`;
    }
    if ("ruc" in persona && persona.ruc) {
      return `RUC · ${persona.ruc}`;
    }
    return "—";
  };

  const closeModal = () => {
    isModalOpen.value = false;
    editingId.value = null;
    initialValues.value = undefined;
  };
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <CardTitle
        title="Accionistas"
        body="Administra los accionistas registrados para esta sociedad."
      />

      <ActionButton
        v-if="!isReadonly"
        variant="primary"
        label="Agregar accionista"
        size="md"
        icon="Plus"
        @click="openCreateModal"
      />
    </div>

    <p v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <AccionistasList
      :items="rows"
      :is-loading="isLoading"
      :readonly="isReadonly"
      @edit="handleEdit"
      @remove="handleRemove"
    />

    <AccionistaModal
      v-model="isModalOpen"
      :mode="editingId ? 'edit' : 'create'"
      :is-saving="isSaving"
      :initial-values="initialValues"
      @close="closeModal"
      @submit="handleModalSubmit"
    />
  </div>
</template>

