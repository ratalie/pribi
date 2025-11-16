<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, ref, watch } from "vue";

  import { useToast } from "@/components/ui/toast/use-toast";
  import type { Persona } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import type { ApoderadoDTO } from "@hexag/registros/sociedades/pasos/apoderados/application";
  import type { Apoderado } from "@hexag/registros/sociedades/pasos/apoderados/domain";
  import { z } from "zod";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import LabeledCardSwitch from "~/components/base/Switch/LabeledCardSwitch.vue";
  import PersonaJuridicaExtranjeraForm from "~/components/composite/forms/PersonaJuridicaExtranjeraForm.vue";
  import PersonaJuridicaForm from "~/components/composite/forms/PersonaJuridicaForm.vue";
  import PersonaNaturalForm from "~/components/composite/forms/PersonaNaturalForm.vue";
  import { useRegistroApoderadoModalStore } from "~/modules/registro-sociedades/stores/modal/useRegistroApoderadoModalStore";
  import {
    usePersonaJuridicaStore,
    type PersonaJuridicaState,
  } from "~/stores/usePersonaJuridicaStore";
  import {
    usePersonaNaturalStore,
    type PersonaNaturalState,
  } from "~/stores/usePersonaNaturalStore";
  import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

  interface SelectOption {
    id: string;
    value: string;
    label: string;
  }

  interface Props {
    modelValue: boolean;
    mode?: "create" | "edit";
    isSaving?: boolean;
    initialApoderado?: Apoderado | null;
    claseOptions: SelectOption[];
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
  const personaJuridicaStore = usePersonaJuridicaStore();
  const modalStore = useRegistroApoderadoModalStore();
  const { toast } = useToast();
  const isInitializing = ref(false);

  const selectedClaseId = ref<string>("");

  const personaOptions = [
    { value: "natural", label: "Persona Natural", description: "" },
    { value: "juridica", label: "Persona Jurídica", description: "" },
  ];

  const isPersonaNatural = computed(() => modalStore.tipoPersona === "natural");
  const isPersonaJuridica = computed(() => modalStore.tipoPersona === "juridica");

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
    personaJuridicaStore.$reset();
    personaJuridicaStore.setJurisdiccion("peruana");
    modalStore.setTipoPersona("natural");
    modalStore.esEmpresaConstituidaEnPeru = true;
    modalStore.tieneRepresentante = false;
  };

  const initializeForm = () => {
    isInitializing.value = true;
    modalStore.$reset();
    resetPersonaData();
    selectedClaseId.value = "";
    currentApoderadoId.value = null;
    currentPersonaId.value = null;

    if (!props.initialApoderado) {
      isInitializing.value = false;
      return;
    }

    currentApoderadoId.value = props.initialApoderado.id ?? null;
    currentPersonaId.value = props.initialApoderado.persona.id ?? null;
    selectedClaseId.value = props.initialApoderado.claseApoderadoId ?? "";

    if (props.initialApoderado.persona.tipo === "JURIDICA") {
      modalStore.setTipoPersona("juridica");
      const persona = props.initialApoderado.persona;
      modalStore.esEmpresaConstituidaEnPeru = persona.jurisdiccion !== "extranjera";
      personaJuridicaStore.setJurisdiccion(
        persona.jurisdiccion === "extranjera" ? "extranjera" : "peruana"
      );
      personaJuridicaStore.$patch({
        tipoDocumento: persona.tipoDocumento ?? "RUC",
        numeroDocumento: persona.numeroDocumento ?? "",
        nombreComercial: persona.nombreComercial ?? "",
        razonSocial: persona.razonSocial ?? "",
        pais: persona.pais ?? (persona.jurisdiccion === "extranjera" ? "" : "PER"),
        direccion: persona.direccion ?? "",
        provincia: persona.provincia ?? "",
        distrito: persona.distrito ?? "",
        departamento: persona.departamento ?? "",
      } as PersonaJuridicaState);

      if (persona.representadoPor) {
        modalStore.tieneRepresentante = true;
        personaNaturalStore.$patch({
          tipoDocumento:
            (persona.representadoPor.tipoDocumento as TipoDocumentosEnum) || "DNI",
          numeroDocumento: persona.representadoPor.numeroDocumento ?? "",
          nombre: persona.representadoPor.nombre ?? "",
          apellidoPaterno: persona.representadoPor.apellidoPaterno ?? "",
          apellidoMaterno: persona.representadoPor.apellidoMaterno ?? "",
          paisPasaporte: persona.representadoPor.paisEmision ?? "",
          estadoCivil: null,
        } as PersonaNaturalState);
      } else {
        modalStore.tieneRepresentante = false;
      }
    } else if (props.initialApoderado.persona.tipo === "NATURAL") {
      modalStore.setTipoPersona("natural");
      const persona = props.initialApoderado.persona;
      personaNaturalStore.$patch({
        tipoDocumento: (persona.tipoDocumento as TipoDocumentosEnum) || "DNI",
        numeroDocumento: persona.numeroDocumento ?? "",
        nombre: persona.nombre ?? "",
        apellidoPaterno: persona.apellidoPaterno ?? "",
        apellidoMaterno: persona.apellidoMaterno ?? "",
        paisPasaporte: persona.paisEmision ?? "",
        estadoCivil: null,
      } as PersonaNaturalState);
    }
    isInitializing.value = false;
  };

  const cleanup = () => {
    modalStore.$reset();
    personaNaturalStore.$reset();
    personaJuridicaStore.$reset();
    selectedClaseId.value = "";
    currentApoderadoId.value = null;
    currentPersonaId.value = null;
    isInitializing.value = false;
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

  watch(
    () => modalStore.esEmpresaConstituidaEnPeru,
    (isPeruana) => {
      if (isInitializing.value) return;
      personaJuridicaStore.setJurisdiccion(isPeruana ? "peruana" : "extranjera");
    },
    { immediate: true }
  );

  watch(
    () => modalStore.tipoPersona,
    () => {
      if (isInitializing.value) return;
      personaNaturalStore.$reset();
      modalStore.tieneRepresentante = false;
    }
  );

  const showError = (message: string) => {
    toast({
      variant: "destructive",
      title: "Formulario incompleto",
      description: message,
    });
  };

  const buildNaturalPersona = () => {
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

  const buildRepresentante = () => {
    if (!modalStore.tieneRepresentante) return undefined;
    if (!personaNaturalStore.nombre || !personaNaturalStore.apellidoPaterno) {
      showError("Completa los datos del representante.");
      return null;
    }
    if (!personaNaturalStore.tipoDocumento || !personaNaturalStore.numeroDocumento) {
      showError("Ingresa el documento del representante.");
      return null;
    }

    return {
      nombre: personaNaturalStore.nombre,
      apellidoPaterno: personaNaturalStore.apellidoPaterno,
      apellidoMaterno: personaNaturalStore.apellidoMaterno || undefined,
      tipoDocumento: personaNaturalStore.tipoDocumento || "DNI",
      numeroDocumento: personaNaturalStore.numeroDocumento,
      paisEmision:
        personaNaturalStore.tipoDocumento === TipoDocumentosEnum.PASAPORTE
          ? personaNaturalStore.paisPasaporte || undefined
          : undefined,
    };
  };

  const buildJuridicaPersona = () => {
    if (!personaJuridicaStore.numeroDocumento) {
      showError("Ingresa el documento de la empresa.");
      return null;
    }
    if (!personaJuridicaStore.razonSocial) {
      showError("Ingresa la razón social.");
      return null;
    }

    const representante = buildRepresentante();
    if (representante === null) {
      return null;
    }

    const personaId = currentPersonaId.value ?? generateUuid();
    return {
      id: personaId,
      tipo: "JURIDICA" as const,
      tipoDocumento: personaJuridicaStore.tipoDocumento || "RUC",
      numeroDocumento: personaJuridicaStore.numeroDocumento,
      razonSocial: personaJuridicaStore.razonSocial,
      nombreComercial: personaJuridicaStore.nombreComercial || undefined,
      direccion: personaJuridicaStore.direccion || undefined,
      provincia:
        personaJuridicaStore.jurisdiccion === "peruana"
          ? personaJuridicaStore.provincia || undefined
          : undefined,
      distrito:
        personaJuridicaStore.jurisdiccion === "peruana"
          ? personaJuridicaStore.distrito || undefined
          : undefined,
      departamento:
        personaJuridicaStore.jurisdiccion === "peruana"
          ? personaJuridicaStore.departamento || undefined
          : undefined,
      pais:
        personaJuridicaStore.jurisdiccion === "peruana"
          ? personaJuridicaStore.pais || "PER"
          : personaJuridicaStore.pais || undefined,
      jurisdiccion: personaJuridicaStore.jurisdiccion,
      representadoPor: modalStore.tieneRepresentante ? representante ?? undefined : undefined,
    };
  };

  const handleSubmit = () => {
    console.log("[RegistroApoderadoModal] handleSubmit start", {
      selectedClaseId: selectedClaseId.value,
      tipoPersona: modalStore.tipoPersona,
      personaNatural: isPersonaNatural.value ? personaNaturalStore.$state : null,
      personaJuridica: isPersonaJuridica.value ? personaJuridicaStore.$state : null,
    });

    if (!selectedClaseId.value) {
      showError("Selecciona la clase de apoderado.");
      return;
    }

    let persona: Persona | null = null;
    if (isPersonaJuridica.value) {
      persona = buildJuridicaPersona();
    } else {
      persona = buildNaturalPersona();
    }

    if (!persona) {
      console.log("[RegistroApoderadoModal] handleSubmit failed: persona is null");
      return;
    }

    const payload: ApoderadoDTO = {
      id: currentApoderadoId.value ?? generateUuid(),
      claseApoderadoId: selectedClaseId.value,
      persona,
    };

    console.log("[RegistroApoderadoModal] handleSubmit success", { payload });
    emit("submit", payload);
  };
  const handleClose = () => {
    emit("close");
    isOpen.value = false;
  };

  const title = computed(() =>
    props.mode === "create" ? "Registrar apoderado" : "Editar apoderado"
  );
</script>

<template>
  <BaseModal v-model="isOpen" size="xl" @close="handleClose" @submit="handleSubmit">
    <div class="flex flex-col gap-8">
      <!-- HEADER -->
      <CardTitle :title="title" body="Completa la información solicitada.">
        <template #actions>
          <div class="w-[340px]">
            <SelectInputZod
              v-model="selectedClaseId"
              name="clase_apoderado"
              label="Clase de apoderado"
              placeholder="Selecciona una clase"
              :options="claseOptions"
              :schema="z.string().min(1, 'Selecciona una clase')"
            />
          </div>
        </template>
      </CardTitle>

      <!-- TIPO PERSONA -->
      <div class="flex flex-col gap-6">
        <p class="t-b2 font-semibold text-slate-800">¿Qué tipo de persona es el apoderado?</p>
        <SimpleCardDropDown v-model="modalStore.tipoPersona" :options="personaOptions" />
      </div>

      <!-- PERSONA NATURAL -->
      <div v-if="isPersonaNatural" class="flex flex-col gap-6">
        <PersonaNaturalForm />
      </div>

      <!-- PERSONA JURÍDICA -->
      <div v-if="isPersonaJuridica" class="flex flex-col gap-6">
        <!-- Switch: ¿Empresa constituida en Perú? -->
        <LabeledCardSwitch
          v-model="modalStore.esEmpresaConstituidaEnPeru"
          title="¿La empresa está constituida en Perú?"
        />

        <!-- Form: Peruana o Extranjera -->
        <PersonaJuridicaForm v-if="modalStore.esEmpresaConstituidaEnPeru" />
        <PersonaJuridicaExtranjeraForm v-else />

        <!-- Switch: ¿Tiene representante? -->
        <LabeledCardSwitch
          v-model="modalStore.tieneRepresentante"
          title="¿La empresa tiene un representante?"
        />

        <!-- Representante -->
        <div v-if="modalStore.tieneRepresentante" class="flex flex-col gap-6">
          <p class="t-b2 font-semibold text-slate-800">Datos del representante</p>
          <PersonaNaturalForm />
        </div>
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
