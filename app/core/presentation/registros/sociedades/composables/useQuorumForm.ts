import { computed, reactive, toRefs, unref, watch } from "vue";
import type { MaybeRef } from "vue";

import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
import type { QuorumDTO } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/application";
import { useQuorumStore } from "../stores/quorum.store";

const clampPercent = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Number(value)));
};

const normalizePercent = (input: unknown) =>
  clampPercent(typeof input === "number" ? input : Number(input ?? 0));

const createEmptyForm = (): QuorumDTO => ({
  primeraConvocatoriaSimple: 51,
  primeraConvocatoriaCalificada: 67,
  segundaConvocatoriaSimple: 40,
  segundaConvocatoriaCalificada: 60,
  quorumMinimoSimple: 10,
  quorumMinimoCalificado: 20,
});

interface UseQuorumFormOptions {
  societyId: MaybeRef<string>;
  mode?: MaybeRef<EntityModeEnum>;
}

type SubmitResult = "created" | "updated" | "skipped";
type QuorumNumericField = Exclude<keyof QuorumDTO, "id">;
const NUMERIC_FIELDS: QuorumNumericField[] = [
  "primeraConvocatoriaSimple",
  "primeraConvocatoriaCalificada",
  "segundaConvocatoriaSimple",
  "segundaConvocatoriaCalificada",
  "quorumMinimoSimple",
  "quorumMinimoCalificado",
] as const;

export function useQuorumForm(options: UseQuorumFormOptions) {
  const store = useQuorumStore();
  const form = reactive<QuorumDTO>(createEmptyForm());

  const mode = computed(() => unref(options.mode) ?? EntityModeEnum.CREAR);
  const societyId = computed(() => unref(options.societyId));

  const isLoading = computed(() => store.status === "loading");
  const isSaving = computed(() => store.status === "saving");
  const isReadonly = computed(() => mode.value === EntityModeEnum.PREVISUALIZAR);
  const hasData = computed(() => store.config !== null);
  const errorMessage = computed(() => store.errorMessage);

  const setValue = (field: QuorumNumericField, value: number) => {
    form[field] = normalizePercent(value);
  };

  const assignFromConfig = (value: QuorumDTO | null | undefined) => {
    if (!value) {
      Object.assign(form, createEmptyForm());
      return;
    }

    NUMERIC_FIELDS.forEach((key) => {
      const nextValue = value[key];
      form[key] = normalizePercent(nextValue);
    });
    form.id = value.id;
  };

  watch(
    () => store.config,
    (config) => {
      assignFromConfig(config);
    },
    { immediate: true }
  );

  const rangeErrors = computed(() => {
    const isOutOfRange = (value: number) => value < 0 || value > 100 || Number.isNaN(value);
    return {
      primeraConvocatoriaSimple: isOutOfRange(form.primeraConvocatoriaSimple),
      primeraConvocatoriaCalificada: isOutOfRange(form.primeraConvocatoriaCalificada),
      segundaConvocatoriaSimple: isOutOfRange(form.segundaConvocatoriaSimple),
      segundaConvocatoriaCalificada: isOutOfRange(form.segundaConvocatoriaCalificada),
      quorumMinimoSimple: isOutOfRange(form.quorumMinimoSimple),
      quorumMinimoCalificado: isOutOfRange(form.quorumMinimoCalificado),
    };
  });

  const relationshipErrors = computed(() => ({
    primeraConvocatoriaSimple: form.primeraConvocatoriaSimple < form.quorumMinimoSimple,
    segundaConvocatoriaSimple: form.segundaConvocatoriaSimple < form.quorumMinimoSimple,
    primeraConvocatoriaCalificada:
      form.primeraConvocatoriaCalificada < form.quorumMinimoCalificado,
    segundaConvocatoriaCalificada:
      form.segundaConvocatoriaCalificada < form.quorumMinimoCalificado,
  }));

  const hasValidationErrors = computed(
    () =>
      Object.values(rangeErrors.value).some(Boolean) ||
      Object.values(relationshipErrors.value).some(Boolean)
  );

  async function load(source: "internal" | "external" = "internal") {
    if (!societyId.value) return;
    console.debug("[useQuorumForm] load:start", { source, societyId: societyId.value });
    await store.load(societyId.value);
    console.debug("[useQuorumForm] load:done", {
      source,
      societyId: societyId.value,
      config: store.config,
    });
  }

  async function submit(): Promise<SubmitResult> {
    if (isReadonly.value) {
      console.debug("[useQuorumForm] submit:skipped-readonly");
      return "skipped";
    }

    if (hasValidationErrors.value) {
      throw new Error("Corrige los porcentajes antes de continuar.");
    }

    if (!societyId.value) {
      throw new Error("No encontramos el identificador del registro.");
    }

    const payload: QuorumDTO = {
      ...form,
      id: store.config?.id,
    };

    if (!hasData.value) {
      await store.create(societyId.value, payload);
      return "created";
    }

    await store.update(societyId.value, payload);
    return "updated";
  }

  function reset() {
    if (store.config) {
      assignFromConfig(store.config);
    } else {
      assignFromConfig(createEmptyForm());
    }
    console.debug("[useQuorumForm] reset", { form: { ...form } });
  }

  return {
    ...toRefs(form),
    form,
    load,
    submit,
    reset,
    setValue,
    isLoading,
    isSaving,
    isReadonly,
    errorMessage,
    relationshipErrors,
    rangeErrors,
    hasValidationErrors,
  };
}

export type { QuorumNumericField };

