import type { MaybeRef } from "vue";
import { computed, reactive, ref, toRefs, unref, watch } from "vue";

import type { DirectorioDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application";
import type { DirectorioConfig } from "~/core/hexag/registros/sociedades/pasos/directorio/domain";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
import { useDirectorioStore } from "../../../../stores/directorio.store";

const normalizeNumber = (value: unknown, fallback = 0): number => {
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(num) && !Number.isNaN(num)) {
    return num;
  }
  return fallback;
};

const normalizeString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const normalizeBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1) return true;
  if (value === "false" || value === 0) return false;
  return fallback;
};

const createEmptyForm = (): DirectorioDTO => ({
  cantidadDirectores: 3,
  conteoPersonalizado: false,
  minimoDirectores: null,
  maximoDirectores: null,
  inicioMandato: "",
  finMandato: "",
  quorumMinimo: 0,
  mayoria: 0,
  presidenteDesignado: true, // true = directorio, false = asamblea_accionistas
  secretarioAsignado: true, // true = gerente_general, false = junta_accionistas
  reeleccionPermitida: false,
  presidentePreside: false,
  presidenteDesempata: false,
  periodo: "",
  presidenteId: null,
});

interface UseDirectorioFormOptions {
  societyId: MaybeRef<string>;
  mode?: MaybeRef<EntityModeEnum>;
}

type SubmitResult = "updated" | "skipped";

export function useDirectorioForm(options: UseDirectorioFormOptions) {
  const store = useDirectorioStore();
  const form = reactive<DirectorioDTO>(createEmptyForm());
  const isInitializing = ref(true);

  const mode = computed(() => unref(options.mode) ?? EntityModeEnum.CREAR);
  const societyId = computed(() => unref(options.societyId));

  const isLoading = computed(() => store.status === "loading");
  const isSaving = computed(() => store.status === "saving");
  const isReadonly = computed(() => mode.value === EntityModeEnum.PREVISUALIZAR);
  const errorMessage = computed(() => store.errorMessage);

  const assignFromConfig = (value: DirectorioConfig | null | undefined) => {
    console.debug("[useDirectorioForm] assignFromConfig", { value });
    if (!value) {
      Object.assign(form, createEmptyForm());
      return;
    }

    form.cantidadDirectores = normalizeNumber(value.cantidadDirectores, 3);
    form.conteoPersonalizado = normalizeBoolean(value.conteoPersonalizado);
    form.minimoDirectores = value.minimoDirectores;
    form.maximoDirectores = value.maximoDirectores;
    form.inicioMandato = normalizeString(value.inicioMandato);
    form.finMandato = normalizeString(value.finMandato);
    form.quorumMinimo = normalizeNumber(value.quorumMinimo);
    form.mayoria = normalizeNumber(value.mayoria);
    form.presidenteDesignado = normalizeBoolean(value.presidenteDesignado);
    form.secretarioAsignado = normalizeBoolean(value.secretarioAsignado);
    form.reeleccionPermitida = normalizeBoolean(value.reeleccionPermitida);
    form.presidentePreside = normalizeBoolean(value.presidentePreside);
    form.presidenteDesempata = normalizeBoolean(value.presidenteDesempata);
    form.periodo = normalizeString(value.periodo);
    form.presidenteId = value.presidenteId;
    form.id = value.id;
    console.debug("[useDirectorioForm] assignFromConfig:done", { form: { ...form } });
  };

  watch(
    () => store.config,
    (config, oldConfig) => {
      const shouldAssign =
        isInitializing.value || oldConfig === null || oldConfig === undefined;

      if (shouldAssign) {
        assignFromConfig(config);
      }
    },
    { immediate: true }
  );

  async function load(source: "internal" | "external" = "internal") {
    if (!societyId.value) return;
    console.debug("[useDirectorioForm] load:start", { source, societyId: societyId.value });
    isInitializing.value = true;
    await store.load(societyId.value);
    // Forzar asignación después de cargar
    if (store.config) {
      assignFromConfig(store.config);
    }
    isInitializing.value = false;
    console.debug("[useDirectorioForm] load:done", {
      source,
      societyId: societyId.value,
      config: store.config,
      form: { ...form },
    });
  }

  async function submit(): Promise<SubmitResult> {
    if (isReadonly.value) {
      console.debug("[useDirectorioForm] submit:skipped-readonly");
      return "skipped";
    }

    if (!societyId.value) {
      throw new Error("No encontramos el identificador del registro.");
    }

    // Asegurarse de que el presidenteId esté incluido en el payload
    // También asegurar que minimoDirectores y maximoDirectores tengan valores cuando conteoPersonalizado es true
    const payload: DirectorioDTO = {
      ...form,
      id: store.config?.id,
      // Asegurar que presidenteId esté explícitamente incluido
      presidenteId: form.presidenteId || null,
      // Asegurar que minimoDirectores y maximoDirectores tengan valores válidos cuando conteoPersonalizado es true
      minimoDirectores: form.conteoPersonalizado
        ? typeof form.minimoDirectores === "number" && form.minimoDirectores > 0
          ? form.minimoDirectores
          : 3
        : form.minimoDirectores,
      maximoDirectores: form.conteoPersonalizado
        ? typeof form.maximoDirectores === "number" && form.maximoDirectores > 0
          ? form.maximoDirectores
          : 3
        : form.maximoDirectores,
    };

    console.debug("[useDirectorioForm] submit:payload", {
      payload,
      form: { ...form },
      conteoPersonalizado: form.conteoPersonalizado,
      periodo: form.periodo,
      quorumMinimo: form.quorumMinimo,
      mayoria: form.mayoria,
      presidenteId: form.presidenteId,
      payloadPresidenteId: payload.presidenteId,
    });

    // El directorio siempre existe desde que se crea la sociedad (cascarón del backend)
    // Por lo tanto, SIEMPRE usamos UPDATE (PUT), nunca CREATE (POST)
    isInitializing.value = true; // Permitir que el watch actualice después del save
    await store.update(societyId.value, payload);
    isInitializing.value = false; // Permitir edición nuevamente
    return "updated";
  }

  function reset() {
    if (store.config) {
      assignFromConfig(store.config);
    } else {
      // Si no hay config, asignar valores por defecto directamente al form
      Object.assign(form, createEmptyForm());
    }
    console.debug("[useDirectorioForm] reset", { form: { ...form } });
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
    errorMessage,
  };
}
