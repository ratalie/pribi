<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { computed, ref, toRef } from "vue";

  import type { AccionistaDTO } from "@hexag/registros/sociedades/pasos/accionistas/application";
  import type { Accionista } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import { useToastFeedback } from "~/core/presentation/shared/composables/useToastFeedback";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import { useAccionistasController } from "../../composables/useAccionistasController";
  import { useAccionistasStore } from "../../stores/accionistas.store";
  import AccionistaModal from "./components/AccionistaModal.vue";
  import AccionistasList from "./components/AccionistasList.vue";
  import { personaTypeLabels, type AccionistaRow } from "./types";

  interface Props {
    societyId: string;
    mode?: EntityModeEnum;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: EntityModeEnum.CREAR,
  });

  const societyId = toRef(props, "societyId");
  const isReadonly = computed(() => props.mode === EntityModeEnum.PREVISUALIZAR);

  const { withAsyncToast } = useToastFeedback();
  const store = useAccionistasStore();
  const controller = useAccionistasController({
    societyId,
    ttlMs: 60_000,
  });

  const { accionistas, status, errorMessage: storeError } = storeToRefs(store);

  const isLoading = computed(
    () => controller.isBootstrapping.value || status.value === "loading"
  );
  const isSaving = computed(() => status.value === "saving");
  const errorMessage = computed(() => controller.error.value ?? storeError.value);

  const isModalOpen = ref(false);
  const editingAccionista = ref<Accionista | null>(null);

  const ensureSocietyId = () => {
    if (!societyId.value) {
      throw new Error("No encontramos el identificador de la sociedad.");
    }
    return societyId.value;
  };

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

  const openCreateModal = () => {
    editingAccionista.value = null;
    isModalOpen.value = true;
  };

  const handleEdit = (accionistaId: string) => {
    const current = accionistas.value.find((item) => item.id === accionistaId);
    if (!current) return;
    editingAccionista.value = current;
    isModalOpen.value = true;
  };

  const handleRemove = async (accionistaId: string) => {
    const confirmed = window.confirm("¿Deseas eliminar este accionista?");
    if (!confirmed) return;
    const profileId = ensureSocietyId();

    await withAsyncToast(() => store.remove(profileId, accionistaId), {
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

  const handleModalSubmit = async (payload: AccionistaDTO) => {
    const profileId = ensureSocietyId();
    const action =
      editingAccionista.value !== null
        ? () => store.update(profileId, payload)
        : () => store.create(profileId, payload);

    await withAsyncToast(action, {
      loading: {
        title: editingAccionista.value ? "Actualizando…" : "Guardando…",
      },
      success: {
        title: "Accionistas",
        description: editingAccionista.value
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

  const getPersonaLabel = (persona: Accionista["persona"]) => {
    switch (persona.tipo) {
      case "NATURAL":
        return `${persona.nombre} ${persona.apellidoPaterno} ${
          persona.apellidoMaterno ?? ""
        }`.trim();
      case "JURIDICA":
        return persona.razonSocial;
      case "SUCURSAL":
        return persona.nombreSucursal;
      case "FONDO_INVERSION":
      case "FIDEICOMISO":
      case "SUCESION_INDIVISA":
        return persona.razonSocial ?? persona.tipo;
      default:
        return "—";
    }
  };

  const getPersonaDocument = (persona: Accionista["persona"]) => {
    switch (persona.tipo) {
      case "NATURAL":
        return `${persona.tipoDocumento} · ${persona.numeroDocumento}`;
      case "JURIDICA":
        return `${persona.tipoDocumento ?? "RUC"} · ${persona.numeroDocumento}`;
      case "SUCURSAL":
      case "FONDO_INVERSION":
        return persona.ruc ? `RUC · ${persona.ruc}` : "Sin RUC";
      case "SUCESION_INDIVISA":
        return persona.ruc ? `RUC · ${persona.ruc}` : "Sin RUC";
      case "FIDEICOMISO":
        if (persona.tieneRuc && persona.ruc) {
          return `RUC · ${persona.ruc}`;
        }
        return persona.numeroRegistroFideicomiso
          ? `Registro · ${persona.numeroRegistroFideicomiso}`
          : "Sin registro";
      default:
        return "—";
    }
  };

  const closeModal = () => {
    isModalOpen.value = false;
    editingAccionista.value = null;
  };
</script>

<template>
  <div class="h-full p-14 flex flex-col gap-12">
    <CardTitle title="Accionistas" body="Complete todos los campos requeridos.">
      <template #actions>
        <ActionButton
          v-if="!isReadonly"
          variant="secondary"
          label="Agregar"
          size="md"
          icon="Plus"
          @click="openCreateModal"
        />
      </template>
    </CardTitle>

    <p v-if="errorMessage" class="text-sm text-red-500">
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
      :mode="editingAccionista ? 'edit' : 'create'"
      :is-saving="isSaving"
      :initial-accionista="editingAccionista ?? undefined"
      @close="closeModal"
      @submit="handleModalSubmit"
    />
  </div>
</template>
