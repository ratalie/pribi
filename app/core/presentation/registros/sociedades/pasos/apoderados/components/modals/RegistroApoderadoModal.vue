<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";

import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import CardTitle from "~/components/base/cards/CardTitle.vue";
import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
import BaseModal from "~/components/base/modal/BaseModal.vue";
import { tipoDocumentoOptions } from "~/constants/inputs/document-type";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import {
  apoderadoFieldSchemas,
  type ApoderadoForm,
} from "../../schemas/apoderado.schema";

interface SelectOption {
  id: string;
  value: string;
  label: string;
}

type ApoderadoFormState = Omit<ApoderadoForm, "apellidoMaterno" | "paisEmision"> & {
  apellidoMaterno: string;
  paisEmision: string;
};

interface Props {
  modelValue: boolean;
  mode?: "create" | "edit";
  isSaving?: boolean;
  initialValue?: ApoderadoForm | null;
  claseOptions: SelectOption[];
}

const props = withDefaults(defineProps<Props>(), {
  mode: "create",
  isSaving: false,
  initialValue: null,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", payload: ApoderadoForm): void;
  (e: "close"): void;
}>();

const isOpen = useVModel(props, "modelValue", emit);
const formModel = ref<ApoderadoFormState>({
  claseApoderadoId: "",
  tipoDocumento: "DNI",
  numeroDocumento: "",
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  paisEmision: "",
});

watch(
  () => props.initialValue,
  (value) => {
    formModel.value = {
      claseApoderadoId: value?.claseApoderadoId ?? "",
      personaId: value?.personaId,
      tipoDocumento: value?.tipoDocumento ?? "DNI",
      numeroDocumento: value?.numeroDocumento ?? "",
      nombre: value?.nombre ?? "",
      apellidoPaterno: value?.apellidoPaterno ?? "",
      apellidoMaterno: value?.apellidoMaterno ?? "",
      paisEmision: value?.paisEmision ?? "",
    };
  },
  { immediate: true }
);

const title = computed(() =>
  props.mode === "create" ? "Registrar apoderado" : "Editar apoderado"
);

const handleSubmit = () => {
  const payload: ApoderadoForm = {
    ...formModel.value,
    apellidoMaterno: formModel.value.apellidoMaterno || undefined,
    paisEmision: formModel.value.paisEmision || undefined,
  };
  emit("submit", payload);
};

const handleClose = () => {
  emit("close");
  isOpen.value = false;
};

const showPaisEmision = computed(() => formModel.value.tipoDocumento === TipoDocumentosEnum.PASAPORTE);

watch(
  () => formModel.value.tipoDocumento,
  (tipo) => {
    if (tipo !== TipoDocumentosEnum.PASAPORTE) {
      formModel.value.paisEmision = "";
    }
  }
);

</script>

<template>
  <BaseModal v-model="isOpen" size="lg" @close="handleClose" @submit="handleSubmit">
    <div class="flex flex-col gap-8">
      <CardTitle :title="title" body="Completa la información solicitada.">
        <template #actions>
          <div class="w-[340px]">
            <SelectInputZod
              v-model="formModel.claseApoderadoId"
              name="clase_apoderado"
              label="Clase de apoderado"
              placeholder="Selecciona una clase"
              :options="claseOptions"
              :schema="apoderadoFieldSchemas.claseApoderadoId"
            />
          </div>
        </template>
      </CardTitle>

      <div class="flex flex-col gap-6 rounded-xl border border-slate-200 p-6">
        <p class="t-b2 font-semibold text-slate-800">Datos personales</p>
        <div class="grid grid-cols-2 gap-6">
          <SelectInputZod
            v-model="formModel.tipoDocumento"
            name="tipo_documento"
            label="Tipo de documento"
            placeholder="Selecciona el tipo de documento"
            :options="tipoDocumentoOptions"
            :schema="apoderadoFieldSchemas.tipoDocumento"
          />

          <TextInputZod
            v-model="formModel.numeroDocumento"
            name="numero_documento"
            label="Número de documento"
            placeholder="Ingresa el documento"
            :schema="apoderadoFieldSchemas.numeroDocumento"
          />

          <TextInputZod
            v-model="formModel.nombre"
            name="nombre"
            label="Nombres"
            placeholder="Ingresa los nombres"
            :schema="apoderadoFieldSchemas.nombre"
          />

          <TextInputZod
            v-model="formModel.apellidoPaterno"
            name="apellido_paterno"
            label="Apellido paterno"
            placeholder="Ingresa el apellido paterno"
            :schema="apoderadoFieldSchemas.apellidoPaterno"
          />

          <TextInputZod
            v-model="formModel.apellidoMaterno"
            name="apellido_materno"
            label="Apellido materno"
            placeholder="Ingresa el apellido materno"
            :schema="apoderadoFieldSchemas.apellidoMaterno"
          />

          <TextInputZod
            v-if="showPaisEmision"
            v-model="formModel.paisEmision"
            name="pais_emision"
            label="País de emisión"
            placeholder="Ej. PE"
            :schema="apoderadoFieldSchemas.paisEmision"
          />
        </div>
      </div>

    </div>

    <template #footer>
      <div class="flex w-full flex-col gap-3 border-t border-slate-200 pt-4 md:flex-row md:justify-end">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          class="w-full md:w-auto"
          @click="handleClose"
        />
        <ActionButton
          :label="mode === 'create' ? 'Guardar' : 'Actualizar'"
          size="md"
          :is-loading="isSaving"
          class="w-full md:w-auto"
          type="submit"
        />
      </div>
    </template>
  </BaseModal>
</template>


