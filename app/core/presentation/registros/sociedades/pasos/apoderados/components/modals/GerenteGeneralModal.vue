<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, ref, watch } from "vue";

  import { useToast } from "@/components/ui/toast/use-toast";
  import type { Persona } from "@hexag/registros/sociedades/pasos/accionistas/domain";
  import type { ApoderadoDTO } from "@hexag/registros/sociedades/pasos/apoderados/application";
  import type { Apoderado } from "@hexag/registros/sociedades/pasos/apoderados/domain";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import LabeledCardSwitch from "~/components/base/Switch/LabeledCardSwitch.vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
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

  interface Props {
    modelValue: boolean;
    gerenteClassId: string;
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
  const personaJuridicaStore = usePersonaJuridicaStore();
  const modalStore = useRegistroApoderadoModalStore();
  const { toast } = useToast();
  const isInitializing = ref(false);

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
    modalStore.setTipoApoderado(props.gerenteClassId);
    resetPersonaData();
    currentApoderadoId.value = null;
    currentPersonaId.value = null;

    if (!props.initialApoderado) {
      isInitializing.value = false;
      return;
    }

    console.log(
      "[GerenteGeneralModal] initializeForm - Editing existing apoderado:",
      props.initialApoderado
    );
    currentApoderadoId.value = props.initialApoderado?.id ?? null;
    currentPersonaId.value = props.initialApoderado?.persona?.id ?? null;

    if (props.initialApoderado?.persona?.tipo === "JURIDICA") {
      modalStore.setTipoPersona("juridica");
      const persona = props.initialApoderado?.persona;
      if (!persona) return;

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
    } else if (props.initialApoderado?.persona?.tipo === "NATURAL") {
      modalStore.setTipoPersona("natural");
      const persona = props.initialApoderado?.persona;
      if (!persona) return;
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
    console.log("[GerenteGeneralModal] handleSubmit start", {
      gerenteClassId: props.gerenteClassId,
      tipoPersona: modalStore.tipoPersona,
      personaNatural: isPersonaNatural.value ? personaNaturalStore.$state : null,
      personaJuridica: isPersonaJuridica.value ? personaJuridicaStore.$state : null,
      tieneRepresentante: modalStore.tieneRepresentante,
    });

    if (!props.gerenteClassId) {
      showError("No encontramos la clase Gerente General.");
      return;
    }

    let persona: Persona | null = null;
    if (isPersonaJuridica.value) {
      persona = buildJuridicaPersona();
    } else {
      persona = buildNaturalPersona();
    }

    if (!persona) {
      console.log("[GerenteGeneralModal] handleSubmit failed: persona is null");
      return;
    }

    const payload: ApoderadoDTO = {
      id: currentApoderadoId.value ?? generateUuid(),
      claseApoderadoId: props.gerenteClassId,
      persona,
    };

    console.log("[GerenteGeneralModal] handleSubmit success", { payload });
    emit("submit", payload);
  };
  const handleClose = () => {
    emit("close");
    isOpen.value = false;
  };
</script>

<template>
  <BaseModal v-model="isOpen" size="lg" @close="handleClose" @submit="handleSubmit">
    <div class="flex flex-col gap-10">
      <CardTitle
        title="Gerente General"
        body="Registra al representante principal de la sociedad."
      />

      <LabeledCardSwitch
        v-model="modalStore.tipoPersona"
        label="Tipo de persona"
        sub-label="Selecciona Persona Natural o Persona Jurídica."
        :options="personaOptions"
        :columns="2"
        default-value="natural"
      />

      <div v-if="isPersonaNatural" class="rounded-xl border border-slate-200 p-6">
        <PersonaNaturalForm :show-estado-civil="false" />
      </div>

      <div v-else class="flex flex-col gap-6">
        <SimpleCardDropDown>
          <template #title>
            <div class="flex items-center justify-between gap-4 px-8 py-4">
              <span class="t-t2 font-semibold text-slate-800">
                La empresa se constituyó en Perú
              </span>
              <SimpleSwitchYesNo v-model="modalStore.esEmpresaConstituidaEnPeru" />
            </div>
          </template>
          <template #content>
            <div class="p-8">
              <PersonaJuridicaForm v-if="modalStore.esEmpresaConstituidaEnPeru" />
              <PersonaJuridicaExtranjeraForm v-else />
            </div>
          </template>
        </SimpleCardDropDown>

        <div class="flex flex-col gap-4 rounded-xl border border-slate-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="t-h6 font-semibold text-slate-800">Registrar representante</p>
              <p class="t-b3 text-slate-500">
                El representante es necesario cuando la empresa es apoderada.
              </p>
            </div>
            <CustomSwitch
              :checked="modalStore.tieneRepresentante"
              @update:checked="modalStore.tieneRepresentante = $event"
            />
          </div>
          <SimpleCardDropDown v-if="modalStore.tieneRepresentante">
            <template #title>
              <div class="px-8 py-4 font-semibold text-slate-800">Datos del representante</div>
            </template>
            <template #content>
              <div class="p-8">
                <PersonaNaturalForm :show-estado-civil="false" />
              </div>
            </template>
          </SimpleCardDropDown>
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
          type="submit"
          :is-loading="isSaving"
        />
      </div>
    </template>
  </BaseModal>
</template>
