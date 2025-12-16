<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, watch } from "vue";
  import { z } from "zod";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { countriesOptions } from "~/constants/inputs/countries-options";
  import { tipoDocumentoOptions } from "~/constants/inputs/document-type";
  import {
    apellidoMaternoSchema,
    apellidoPaternoSchema,
    nombreAccionistaSchema,
    numeroDocumentoSchema,
    tipoDocumentoSchema,
  } from "~/core/presentation/registros/sociedades/pasos/accionistas/schemas/modalAccionistas";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

  interface DirectorToEdit {
    id: number;
    nombreCompleto: string;
    tipoDirector: "titular" | "suplente" | "alterno";
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte?: string;
  }

  interface Props {
    modelValue?: boolean;
    mode?: "create" | "edit";
    directorToEdit?: DirectorToEdit | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    mode: "create",
    directorToEdit: null,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close"): void;
    (
      e: "saved",
      director: {
        id?: number;
        nombreCompleto: string;
        tipoDirector: "titular";
        tipoDocumento: string;
        numeroDocumento: string;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        paisPasaporte?: string;
      }
    ): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits);

  const personaNaturalStore = usePersonaNaturalStore();
  const optionalString = z.string().optional();

  const isEditMode = computed(() => props.mode === "edit" && !!props.directorToEdit);
  const modalTitle = computed(() =>
    isEditMode.value ? "Editar Director" : "Designar Director"
  );
  const submitLabel = computed(() => (isEditMode.value ? "Guardar" : "Guardar"));

  const isSubmitDisabled = computed(() => {
    return (
      !personaNaturalStore.tipoDocumento ||
      !personaNaturalStore.numeroDocumento ||
      !personaNaturalStore.nombre ||
      !personaNaturalStore.apellidoPaterno ||
      !personaNaturalStore.apellidoMaterno
    );
  });

  // Precargar datos cuando se abre en modo edición
  watch(
    () => ({
      isOpen: modelValue.value,
      mode: props.mode,
      director: props.directorToEdit,
    }),
    ({ isOpen, mode, director }) => {
      if (!isOpen) {
        personaNaturalStore.$reset();
        return;
      }

      if (mode === "edit" && director) {
        personaNaturalStore.$patch({
          tipoDocumento: director.tipoDocumento as TipoDocumentosEnum,
          numeroDocumento: director.numeroDocumento,
          nombre: director.nombre,
          apellidoPaterno: director.apellidoPaterno,
          apellidoMaterno: director.apellidoMaterno,
          paisPasaporte: director.paisPasaporte || "",
        });
      }
    },
    { immediate: true }
  );

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;
    personaNaturalStore.$reset();
  };

  const handleSave = () => {
    if (isSubmitDisabled.value) {
      return;
    }

    const nombreCompleto =
      `${personaNaturalStore.nombre} ${personaNaturalStore.apellidoPaterno} ${personaNaturalStore.apellidoMaterno}`.trim();

    const director = {
      ...(isEditMode.value && props.directorToEdit ? { id: props.directorToEdit.id } : {}),
      nombreCompleto,
      tipoDirector: "titular" as const,
      tipoDocumento: personaNaturalStore.tipoDocumento || "",
      numeroDocumento: personaNaturalStore.numeroDocumento || "",
      nombre: personaNaturalStore.nombre || "",
      apellidoPaterno: personaNaturalStore.apellidoPaterno || "",
      apellidoMaterno: personaNaturalStore.apellidoMaterno || "",
      ...(personaNaturalStore.paisPasaporte
        ? { paisPasaporte: personaNaturalStore.paisPasaporte }
        : {}),
    };

    emits("saved", director);
    handleCancel();
  };

  const handleInvalidSubmit = () => {
    console.log("Formulario inválido");
  };
</script>

<template>
  <BaseModal
    v-model="modelValue"
    size="lg"
    @close="handleCancel"
    @submit="handleSave"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-12">
      <CardTitle :title="modalTitle" body="Completa los campos requeridos" />

      <div class="grid grid-cols-2 gap-12">
        <SelectInputZod
          v-model="personaNaturalStore.tipoDocumento"
          name="tipo_documento"
          label="Tipo de documento"
          placeholder="Selecciona el tipo de documento"
          :options="tipoDocumentoOptions"
          :schema="tipoDocumentoSchema"
        />

        <SearchInputZod
          v-model="personaNaturalStore.numeroDocumento"
          name="numero_documento"
          label="Número de documento"
          placeholder="Ingrese número de documento"
          :schema="numeroDocumentoSchema"
        />

        <SelectInputZod
          v-if="personaNaturalStore.tipoDocumento === TipoDocumentosEnum.PASAPORTE"
          v-model="personaNaturalStore.paisPasaporte"
          name="pais-emision"
          label="País de emisión"
          placeholder="Selecciona el país"
          :options="countriesOptions"
          :schema="optionalString"
        />

        <TextInputZod
          v-model="personaNaturalStore.nombre"
          name="nombre"
          label="Nombres"
          placeholder="Nombres"
          :schema="nombreAccionistaSchema"
        />

        <TextInputZod
          v-model="personaNaturalStore.apellidoPaterno"
          name="apellido_paterno"
          label="Apellido paterno"
          placeholder="Apellido paterno"
          :schema="apellidoPaternoSchema"
        />

        <TextInputZod
          v-model="personaNaturalStore.apellidoMaterno"
          name="apellido_materno"
          label="Apellido materno"
          placeholder="Apellido materno"
          :schema="apellidoMaternoSchema"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleCancel"
        />

        <ActionButton
          type="submit"
          variant="primary"
          :label="submitLabel"
          size="md"
          :is-disabled="isSubmitDisabled"
        />
      </div>
    </template>
  </BaseModal>
</template>
