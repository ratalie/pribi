<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { ref, watch } from "vue";

  import { useToast } from "@/components/ui/toast/use-toast";
  import type { PersonaNatural } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import type { ApoderadoDTO } from "@hexag/registros/sociedades/pasos/apoderados/application";
  import type { Apoderado } from "@hexag/registros/sociedades/pasos/apoderados/domain";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import PersonaNaturalForm from "~/components/composite/forms/PersonaNaturalForm.vue";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

  interface Props {
    modelValue: boolean;
    otrosClassId: string;
    mode?: "create" | "edit";
    isSaving?: boolean;
    initialApoderado?: Apoderado | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "create",
    isSaving: false,
    initialApoderado: null,
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "submit", payload: ApoderadoDTO): void;
    (e: "close"): void;
  }>();

  const isOpen = useVModel(props, "modelValue", emit);
  const personaNaturalStore = usePersonaNaturalStore();
  const { toast } = useToast();

  const currentApoderadoId = ref<string | null>(null);
  const currentPersonaId = ref<string | null>(null);

  const generateUuid = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  };

  const resetPersonaData = () => {
    personaNaturalStore.$reset();
    currentApoderadoId.value = null;
    currentPersonaId.value = null;
  };

  const initializeForm = () => {
    resetPersonaData();

    if (!props.initialApoderado) {
      return;
    }

    currentApoderadoId.value = props.initialApoderado.id ?? null;

    if (props.initialApoderado.persona.tipo !== "NATURAL") {
      console.error(
        "[OtroApoderadoModal] Otros apoderados solo pueden ser personas naturales"
      );
      return;
    }

    const persona = props.initialApoderado.persona as PersonaNatural;
    currentPersonaId.value = persona.id ?? null;

    personaNaturalStore.$patch({
      tipoDocumento: (persona.tipoDocumento as TipoDocumentosEnum) || "DNI",
      numeroDocumento: persona.numeroDocumento ?? "",
      nombre: persona.nombre ?? "",
      apellidoPaterno: persona.apellidoPaterno ?? "",
      apellidoMaterno: persona.apellidoMaterno ?? "",
      paisPasaporte: persona.paisEmision ?? "",
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
    console.log("[OtroApoderadoModal] handleSubmit start", {
      otrosClassId: props.otrosClassId,
      personaNatural: personaNaturalStore.$state,
    });

    if (!props.otrosClassId) {
      showError("No encontramos la clase Otros Apoderados.");
      return;
    }

    const persona = buildPersonaNatural();
    if (!persona) {
      console.log("[OtroApoderadoModal] handleSubmit failed: persona is null");
      return;
    }

    const apoderadoId = currentApoderadoId.value ?? generateUuid();

    const payload: ApoderadoDTO = {
      id: apoderadoId,
      claseApoderadoId: props.otrosClassId, // ← Usa la clase "Otros Apoderados"
      persona,
    };

    console.log("[OtroApoderadoModal] handleSubmit success", { payload });
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
