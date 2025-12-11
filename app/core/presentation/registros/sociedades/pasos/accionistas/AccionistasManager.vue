<script setup lang="ts">
  import type { AccionistaDTO } from "@hexag/registros/sociedades/pasos/accionistas/application";
  import type { Accionista } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import { storeToRefs } from "pinia";
  import { computed, ref, toRef } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import ConfirmDeleteModal from "~/components/base/modal/ConfirmDeleteModal.vue";
  import { useConfirmDelete } from "~/composables/useConfirmDelete";
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
    forceInitial: true, // Forzar carga inicial para tener datos actualizados siempre
  });

  const { accionistas, status } = storeToRefs(store);

  const isLoading = computed(
    () => controller.isBootstrapping.value || status.value === "loading"
  );
  const isSaving = computed(() => status.value === "saving");

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
    }))
  );

  const openCreateModal = () => {
    editingAccionista.value = null;
    isModalOpen.value = true;
  };

  // Estado para el modal de confirmación de eliminación
  const idAccionistaAEliminar = ref<string | null>(null);

  const confirmDelete = useConfirmDelete(
    async () => {
      if (!idAccionistaAEliminar.value) {
        throw new Error("No se encontró el ID del accionista para eliminar");
      }
      const profileId = ensureSocietyId();
      await withAsyncToast(() => store.remove(profileId, idAccionistaAEliminar.value!), {
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
    },
    {
      title: "Confirmar eliminación",
      message:
        "¿Estás seguro de que deseas eliminar este accionista? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
    }
  );

  const handleEdit = (accionistaId: string) => {
    const current = accionistas.value.find((item) => item.id === accionistaId);
    if (!current) return;
    editingAccionista.value = current;
    isModalOpen.value = true;
  };

  const handleRemove = (accionistaId: string) => {
    // Guardar el ID y abrir el modal de confirmación
    idAccionistaAEliminar.value = accionistaId;
    confirmDelete.open();
  };

  // Acciones para el dropdown de la tabla
  const accionesActions = computed(() => {
    if (isReadonly.value) return undefined;
    return [
      {
        label: "Editar",
        icon: "Pencil",
        onClick: handleEdit,
      },
      {
        label: "Eliminar",
        icon: "Trash",
        separatorLine: true,
        onClick: handleRemove,
      },
    ];
  });

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

  useFlowLayoutNext(() => {});
</script>

<template>
  <div
    :class="[
      'h-full flex flex-col gap-12',
      mode !== EntityModeEnum.RESUMEN
        ? ' p-14 '
        : 'border border-gray-100 rounded-xl py-12 px-10',
    ]"
  >
    <CardTitle
      title="Accionistas"
      :body="mode !== EntityModeEnum.RESUMEN ? 'Complete todos los campos requeridos.' : ''"
    >
      <template #actions>
        <ActionButton
          v-if="!isReadonly && mode !== EntityModeEnum.RESUMEN"
          variant="secondary"
          label="Agregar"
          size="md"
          icon="Plus"
          @click="openCreateModal"
        />
      </template>
    </CardTitle>

    <AccionistasList
      :items="rows"
      :is-loading="isLoading"
      :readonly="isReadonly"
      title-menu="Accionistas"
      :actions="mode !== EntityModeEnum.RESUMEN ? accionesActions : undefined"
    />

    <AccionistaModal
      v-model="isModalOpen"
      :mode="editingAccionista ? 'edit' : 'create'"
      :is-saving="isSaving"
      :initial-accionista="editingAccionista ?? undefined"
      @close="closeModal"
      @submit="handleModalSubmit"
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
</template>
