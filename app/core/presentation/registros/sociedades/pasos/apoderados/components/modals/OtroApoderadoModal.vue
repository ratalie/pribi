<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";

import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import CardTitle from "~/components/base/cards/CardTitle.vue";
import BaseModal from "~/components/base/modal/BaseModal.vue";
import PersonaNaturalForm from "~/components/composite/forms/PersonaNaturalForm.vue";
import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import type { ApoderadoDTO } from "@hexag/registros/sociedades/pasos/apoderados/application";
import type { PersonaNatural } from "@hexag/registros/sociedades/pasos/accionistas/domain";
import { useToast } from "@/components/ui/toast/use-toast";

interface Props {
  modelValue: boolean;
  mode?: "create" | "edit";
  isSaving?: boolean;
  initialPersona?: PersonaNatural | null;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "create",
  isSaving: false,
  initialPersona: null,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", payload: ApoderadoDTO): void;
  (e: "close"): void;
}>();

const isOpen = useVModel(props, "modelValue", emit);
const personaNaturalStore = usePersonaNaturalStore();
const { toast } = useToast();

const currentPersonaId = ref<string | null>(null);

const generateUuid = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

const resetPersonaData = () => {
  personaNaturalStore.$reset();
  currentPersonaId.value = null;
};

const initializeForm = () => {
  resetPersonaData();

  if (!props.initialPersona) {
    return;
  }

  currentPersonaId.value = props.initialPersona.id ?? null;
  personaNaturalStore.$patch({
    tipoDocumento: (props.initialPersona.tipoDocumento as TipoDocumentosEnum) || "DNI",
    numeroDocumento: props.initialPersona.numeroDocumento ?? "",
    nombre: props.initialPersona.nombre ?? "",
    apellidoPaterno: props.initialPersona.apellidoPaterno ?? "",
    apellidoMaterno: props.initialPersona.apellidoMaterno ?? "",
    paisPasaporte: props.initialPersona.paisEmision ?? "",
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

const buildPersonaNatural = (): PersonaNatural | null => {
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

  const personaId = currentPersonaId.value ?? generateUuid();
  return {
    id: personaId,
    tipo: "NATURAL" as const,
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
  const persona = buildPersonaNatural();
  if (!persona) return;

  // Para "Otros Apoderados", el backend probablemente requiere una clase especial
  // o permite claseApoderadoId null/opcional. Por ahora, enviamos sin claseApoderadoId
  // y el handler en el manager decidirá cómo manejarlo
  const payload: ApoderadoDTO = {
    id: generateUuid(),
    claseApoderadoId: "", // Los otros apoderados no tienen clase asignada
    persona,
  };

  emit("submit", payload);
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
        :title="mode === 'create' ? 'Registrar otro apoderado' : 'Editar otro apoderado'"
        body="Completa la información del apoderado sin cargo específico."
      />

      <div class="flex flex-col gap-6 rounded-xl border border-slate-200 p-6">
        <p class="t-b2 font-semibold text-slate-800">Datos personales</p>
        <PersonaNaturalForm :show-estado-civil="false" />
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

