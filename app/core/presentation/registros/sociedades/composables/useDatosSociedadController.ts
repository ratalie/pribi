import { computed, ref, unref, watch } from "vue";
import type { MaybeRef } from "vue";

import { useDatosSociedadStore } from "../stores/datos-sociedad.store";

interface ControllerOptions {
  societyId: MaybeRef<string | null | undefined>;
  auto?: boolean;
  ttlMs?: number;
  source?: "internal" | "external";
  forceInitial?: boolean;
}

interface EnsureParams {
  force?: boolean;
  source?: "internal" | "external";
}

export function useDatosSociedadController(options: ControllerOptions) {
  const store = useDatosSociedadStore();
  const societyId = computed(() => {
    const value = unref(options.societyId);
    return typeof value === "string" ? value : "";
  });

  const manualEnsuring = ref(false);
  const lastError = ref<string | null>(null);

  const runEnsure = async (params: EnsureParams = {}) => {
    if (!societyId.value) return { fetched: false };
    manualEnsuring.value = true;
    try {
      const result = await store.ensureLoaded(societyId.value, {
        ttlMs: options.ttlMs,
        source: params.source ?? options.source ?? "internal",
        force: params.force ?? false,
      });
      lastError.value = null;
      return result;
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? "No pudimos cargar los datos principales.";
      lastError.value = message;
      throw error;
    } finally {
      manualEnsuring.value = false;
    }
  };

  if (options.auto !== false) {
    watch(
      () => societyId.value,
      (value) => {
        if (!value) return;
        runEnsure({ force: options.forceInitial ?? false }).catch((error) => {
          console.error("[useDatosSociedadController] ensure error", error);
        });
      },
      { immediate: true }
    );
  }

  const isEnsuring = computed(
    () => manualEnsuring.value || store.status === "loading"
  );

  const isBootstrapping = computed(
    () => isEnsuring.value && !store.hasData
  );

  return {
    ensure: runEnsure,
    isEnsuring,
    isBootstrapping,
    error: computed(() => lastError.value ?? store.errorMessage),
    datos: computed(() => store.datos),
    status: computed(() => store.status),
    hasData: computed(() => store.hasData),
  };
}

