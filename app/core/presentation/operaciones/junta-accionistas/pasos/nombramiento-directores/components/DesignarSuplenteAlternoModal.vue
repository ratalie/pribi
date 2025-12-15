<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, ref, watch } from "vue";
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
  import { TiposDirectoresEnum } from "~/core/presentation/registros/sociedades/pasos/directorio/enums/TiposDirectoresEnum";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

  interface DirectorToEdit {
    id: number;
    nombreCompleto: string;
    tipoDirector: "suplente" | "alterno";
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte?: string;
    reemplazaId?: string;
  }

  interface TitularOption {
    id: string;
    value: string;
    label: string;
  }

  interface Props {
    modelValue?: boolean;
    mode?: "create" | "edit";
    directorToEdit?: DirectorToEdit | null;
    titularesOptions?: TitularOption[];
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    mode: "create",
    directorToEdit: null,
    titularesOptions: () => [],
  });

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close"): void;
    (
      e: "saved",
      director: {
        id?: number;
        nombreCompleto: string;
        tipoDirector: "suplente" | "alterno";
        tipoDocumento: string;
        numeroDocumento: string;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        paisPasaporte?: string;
        reemplazaId?: string;
      }
    ): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits);

  const personaNaturalStore = usePersonaNaturalStore();
  const optionalString = z.string().optional();

  const tipoDirector = ref<"suplente" | "alterno" | "">("");
  const reemplazoAsignado = ref("");

  const isEditMode = computed(() => props.mode === "edit" && !!props.directorToEdit);
  const modalTitle = computed(() =>
    isEditMode.value ? "Editar Director" : "Designar Director"
  );
  const submitLabel = computed(() => (isEditMode.value ? "Guardar" : "Guardar"));

  // Opciones para el select de Tipo de Director
  const tipoDirectorOptions = [
    { id: "suplente", value: TiposDirectoresEnum.SUPLENTE, label: "Suplente" },
    { id: "alterno", value: TiposDirectoresEnum.ALTERNO, label: "Alterno" },
  ];

  // Schema para tipo director
  const tipoDirectorSchema = z.enum(
    [TiposDirectoresEnum.SUPLENTE, TiposDirectoresEnum.ALTERNO],
    {
      required_error: "Debe seleccionar un tipo de director",
    }
  );

  // Schema para reemplazo asignado (solo requerido si es alterno)
  const reemplazoAsignadoSchema = z.string().optional();

  const isSubmitDisabled = computed(() => {
    if (
      !personaNaturalStore.tipoDocumento ||
      !personaNaturalStore.numeroDocumento ||
      !personaNaturalStore.nombre ||
      !personaNaturalStore.apellidoPaterno ||
      !personaNaturalStore.apellidoMaterno ||
      !tipoDirector.value
    ) {
      return true;
    }

    // Si es alterno, debe tener reemplazo asignado
    if (tipoDirector.value === TiposDirectoresEnum.ALTERNO && !reemplazoAsignado.value) {
      return true;
    }

    return false;
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
        tipoDirector.value = "";
        reemplazoAsignado.value = "";
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
        tipoDirector.value = director.tipoDirector;
        reemplazoAsignado.value = director.reemplazaId || "";
      }
    },
    { immediate: true }
  );

  // Resetear reemplazo asignado cuando cambia el tipo de director
  watch(tipoDirector, (tipo) => {
    if (tipo !== TiposDirectoresEnum.ALTERNO) {
      reemplazoAsignado.value = "";
    } else if (tipo === TiposDirectoresEnum.ALTERNO && props.titularesOptions.length > 0) {
      // Si es alterno y hay opciones, seleccionar la primera por defecto
      if (!reemplazoAsignado.value) {
        reemplazoAsignado.value = props.titularesOptions[0]?.value || "";
      }
    }
  });

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;
    personaNaturalStore.$reset();
    tipoDirector.value = "";
    reemplazoAsignado.value = "";
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
      tipoDirector: tipoDirector.value as "suplente" | "alterno",
      tipoDocumento: personaNaturalStore.tipoDocumento || "",
      numeroDocumento: personaNaturalStore.numeroDocumento || "",
      nombre: personaNaturalStore.nombre || "",
      apellidoPaterno: personaNaturalStore.apellidoPaterno || "",
      apellidoMaterno: personaNaturalStore.apellidoMaterno || "",
      ...(personaNaturalStore.paisPasaporte
        ? { paisPasaporte: personaNaturalStore.paisPasaporte }
        : {}),
      ...(tipoDirector.value === TiposDirectoresEnum.ALTERNO && reemplazoAsignado.value
        ? { reemplazaId: reemplazoAsignado.value }
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
          v-model="tipoDirector"
          name="tipo_director"
          label="Tipo de Director"
          placeholder="Selecciona el tipo de director"
          :options="tipoDirectorOptions"
          :schema="tipoDirectorSchema"
        />

        <div
          :class="{
            'opacity-0 pointer-events-none': tipoDirector !== TiposDirectoresEnum.ALTERNO,
          }"
        >
          <SelectInputZod
            v-model="reemplazoAsignado"
            name="reemplazo_asignado"
            label="Reemplazo Asignado"
            placeholder="Selecciona el director titular"
            :options="titularesOptions"
            :schema="reemplazoAsignadoSchema"
          />
        </div>

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
