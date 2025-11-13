import { computed, reactive, toRefs, unref, watch } from "vue";
import type { MaybeRef } from "vue";

import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
import type { DatosSociedadDTO } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application";
import { useDatosSociedadStore } from "../stores/datos-sociedad.store";

const createEmptyForm = (): DatosSociedadDTO => ({
  numeroRuc: "",
  tipoSocietario: "",
  razonSocial: "",
  nombreComercial: "",
  direccion: "",
  distrito: "",
  provincia: "",
  departamento: "",
  fechaInscripcionRuc: "",
  actividadExterior: "",
  fechaEscrituraPublica: "",
  fechaRegistrosPublicos: "",
  partidaRegistral: "",
  oficinaRegistral: "",
});

const REQUIRED_FIELDS: Array<keyof DatosSociedadDTO> = [
  "numeroRuc",
  "tipoSocietario",
  "razonSocial",
  "nombreComercial",
  "direccion",
  "distrito",
  "provincia",
  "departamento",
];

interface UseDatosSociedadFormOptions {
  societyId: MaybeRef<string>;
  mode?: MaybeRef<EntityModeEnum>;
}

export function useDatosSociedadForm(options: UseDatosSociedadFormOptions) {
  const store = useDatosSociedadStore();
  const form = reactive<DatosSociedadDTO>(createEmptyForm());

  const mode = computed(() => unref(options.mode) ?? EntityModeEnum.CREAR);
  const societyId = computed(() => unref(options.societyId));

  const datos = computed(() => store.datos);
  const isLoading = computed(() => store.status === "loading");
  const isSaving = computed(() => store.status === "saving");
  const isReadonly = computed(() => mode.value === EntityModeEnum.PREVISUALIZAR);
  const hasData = computed(() => store.datos !== null);

  const missingRequiredFields = computed(() =>
    REQUIRED_FIELDS.filter((field) => {
      const currentValue = form[field];
      if (typeof currentValue !== "string") {
        return true;
      }
      return currentValue.trim().length === 0;
    })
  );

  const isComplete = computed(() => missingRequiredFields.value.length === 0);

  const errorMessage = computed(() => store.errorMessage);

  watch(
    () => store.datos,
    (value) => {
      if (!value) {
        Object.assign(form, createEmptyForm());
        return;
      }

      Object.assign(form, {
        numeroRuc: value.numeroRuc ?? "",
        tipoSocietario: value.tipoSocietario ?? "",
        razonSocial: value.razonSocial ?? "",
        nombreComercial: value.nombreComercial ?? "",
        direccion: value.direccion ?? "",
        distrito: value.distrito ?? "",
        provincia: value.provincia ?? "",
        departamento: value.departamento ?? "",
        fechaInscripcionRuc: value.fechaInscripcionRuc ?? "",
        actividadExterior: value.actividadExterior ?? "",
        fechaEscrituraPublica: value.fechaEscrituraPublica ?? "",
        fechaRegistrosPublicos: value.fechaRegistrosPublicos ?? "",
        partidaRegistral: value.partidaRegistral ?? "",
        oficinaRegistral: value.oficinaRegistral ?? "",
      });
    },
    { immediate: true }

  );

  async function load(source: "internal" | "external" = "internal") {
    await store.load(societyId.value, source);
  }

  type SubmitResult = "created" | "updated" | "skipped";

  async function submit(): Promise<SubmitResult> {
    if (isReadonly.value) {
      return "skipped";
    }

    const payload: DatosSociedadDTO = { ...form };

    if (!hasData.value) {
      await store.create(societyId.value, payload);
      return "created";
    }

    await store.update(societyId.value, payload);
    return "updated";
  }

  function reset() {
    if (store.datos) {
      Object.assign(form, {
        numeroRuc: store.datos.numeroRuc ?? "",
        tipoSocietario: store.datos.tipoSocietario ?? "",
        razonSocial: store.datos.razonSocial ?? "",
        nombreComercial: store.datos.nombreComercial ?? "",
        direccion: store.datos.direccion ?? "",
        distrito: store.datos.distrito ?? "",
        provincia: store.datos.provincia ?? "",
        departamento: store.datos.departamento ?? "",
        fechaInscripcionRuc: store.datos.fechaInscripcionRuc ?? "",
        actividadExterior: store.datos.actividadExterior ?? "",
        fechaEscrituraPublica: store.datos.fechaEscrituraPublica ?? "",
        fechaRegistrosPublicos: store.datos.fechaRegistrosPublicos ?? "",
        partidaRegistral: store.datos.partidaRegistral ?? "",
        oficinaRegistral: store.datos.oficinaRegistral ?? "",
      });
    } else {
      Object.assign(form, createEmptyForm());
    }
  }

  return {
    ...toRefs(form),
    form,
    load,
    submit,
    reset,
    isLoading,
    isSaving,
    isReadonly,
    hasData,
    errorMessage,
    mode,
    datos,
    isComplete,
    missingRequiredFields,
  };
}

