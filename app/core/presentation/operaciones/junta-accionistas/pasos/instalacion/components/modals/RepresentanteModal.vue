<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { ref, watch } from "vue";

import { useToast } from "@/components/ui/toast/use-toast";
import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import CardTitle from "~/components/base/cards/CardTitle.vue";
import BaseModal from "~/components/base/modal/BaseModal.vue";
import PersonaNaturalForm from "~/components/composite/forms/PersonaNaturalForm.vue";
import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

interface Props {
  modelValue: boolean;
  mode?: "create" | "edit";
  isSaving?: boolean;
  initialRepresentante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  } | null;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "create",
  isSaving: false,
  initialRepresentante: null,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", payload: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  }): void;
  (e: "close"): void;
}>();

const isOpen = useVModel(props, "modelValue", emit);
const personaNaturalStore = usePersonaNaturalStore();
const { toast } = useToast();

const resetPersonaData = () => {
  personaNaturalStore.$reset();
};

const initializeForm = () => {
  resetPersonaData();

  if (!props.initialRepresentante) {
    return;
  }

  console.log(
    "[RepresentanteModal] initializeForm - Editing existing representante:",
    props.initialRepresentante
  );

  personaNaturalStore.$patch({
    tipoDocumento: (props.initialRepresentante.tipoDocumento as TipoDocumentosEnum) || "DNI",
    numeroDocumento: props.initialRepresentante.numeroDocumento ?? "",
    nombre: props.initialRepresentante.nombre ?? "",
    apellidoPaterno: props.initialRepresentante.apellidoPaterno ?? "",
    apellidoMaterno: props.initialRepresentante.apellidoMaterno ?? "",
    paisPasaporte: props.initialRepresentante.paisEmision ?? "",
    estadoCivil: null,
  });
};

const cleanup = () => {
  resetPersonaData();
};

watch(
  () => isOpen.value,
  (open) => {
    if (open) {
      initializeForm();
    } else {
      cleanup();
    }
  }
);

const showError = (message: string) => {
  toast({
    variant: "destructive",
    title: "Formulario incompleto",
    description: message,
  });
};

const buildRepresentante = (): {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  tipoDocumento: string;
  numeroDocumento: string;
  paisEmision?: string;
} | null => {
  if (!personaNaturalStore.tipoDocumento) {
    showError("Selecciona el tipo de documento.");
    return null;
  }
  if (!personaNaturalStore.numeroDocumento) {
    showError("Ingresa el número de documento.");
    return null;
  }
  if (!personaNaturalStore.nombre) {
    showError("Ingresa los nombres.");
    return null;
  }
  if (!personaNaturalStore.apellidoPaterno) {
    showError("Ingresa el apellido paterno.");
    return null;
  }

  return {
    tipoDocumento: personaNaturalStore.tipoDocumento || "DNI",
    numeroDocumento: personaNaturalStore.numeroDocumento,
    nombre: personaNaturalStore.nombre,
    apellidoPaterno: personaNaturalStore.apellidoPaterno,
    apellidoMaterno: personaNaturalStore.apellidoMaterno || undefined,
    paisEmision:
      personaNaturalStore.tipoDocumento === TipoDocumentosEnum.PASAPORTE
        ? personaNaturalStore.paisPasaporte || undefined
        : undefined,
  };
};

const handleSubmit = () => {
  console.log("[RepresentanteModal] handleSubmit start", {
    personaNatural: personaNaturalStore.$state,
  });

  const representante = buildRepresentante();
  if (!representante) {
    console.log("[RepresentanteModal] handleSubmit failed: representante is null");
    return;
  }

  console.log("[RepresentanteModal] handleSubmit success", { representante });
  emit("submit", representante);
};

const handleClose = () => {
  emit("close");
  isOpen.value = false;
};
</script>

<template>
  <BaseModal v-model="isOpen" size="lg" @close="handleClose" @submit="handleSubmit">
    <div class="flex flex-col gap-8">
      <CardTitle
        :title="mode === 'create' ? 'Agregar Representante' : 'Editar Representante'"
        body="Completa la información del representante (Persona Natural)."
      />

      <div class="flex flex-col gap-6 rounded-xl border border-slate-200 p-6">
        <p class="t-b2 font-semibold text-slate-800">Datos personales</p>
        <PersonaNaturalForm :show-estado-civil="false" />
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleClose"
        />
        <ActionButton
          :label="mode === 'create' ? 'Guardar' : 'Actualizar'"
          size="md"
          :is-loading="isSaving"
          type="submit"
        />
      </div>
    </template>
  </BaseModal>
</template>



