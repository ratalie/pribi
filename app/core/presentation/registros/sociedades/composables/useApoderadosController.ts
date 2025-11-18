import { computed, onActivated, onMounted, ref, unref, watch } from "vue";
import type { MaybeRef } from "vue";

import { useApoderadosStore } from "../pasos/apoderados/stores/apoderados.store";

interface ControllerOptions {
  societyId: MaybeRef<string | null | undefined>;
  ttlMs?: number;
  auto?: boolean;
  source?: "internal" | "external";
  forceInitial?: boolean;
}

interface EnsureParams {
  force?: boolean;
  source?: "internal" | "external";
}

export function useApoderadosController(options: ControllerOptions) {
  const store = useApoderadosStore();
  const societyId = computed(() => {
    const value = unref(options.societyId);
    return typeof value === "string" ? value : "";
  });

  const manualEnsuring = ref(false);
  const lastError = ref<string | null>(null);

  const runEnsure = async (params: EnsureParams = {}) => {
    if (!societyId.value) {
      console.warn("[ApoderadosController] ensure skipped: empty societyId", { params });
      return { fetched: false };
    }

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
      const message = error?.data?.message ?? error?.message ?? "No pudimos cargar los apoderados.";
      lastError.value = message;
      throw error;
    } finally {
      manualEnsuring.value = false;
    }
  };

  const ensureWithLog = (params: EnsureParams = {}) =>
    runEnsure(params).catch((error) => {
      console.error("[ApoderadosController] ensure error", error);
    });

  const needsBootstrap = () => {
    if (!societyId.value) return false;
    if (!store.lastSocietyId || store.lastSocietyId !== societyId.value) return true;
    return !store.lastFetchedAt;
  };

  if (options.auto !== false) {
    onMounted(() => {
      if (!societyId.value) return;
      ensureWithLog({ force: options.forceInitial ?? false });
    });

    onActivated(() => {
      if (!societyId.value) return;
      if (needsBootstrap()) {
        ensureWithLog();
      }
    });

    watch(
      () => societyId.value,
      (value, previous) => {
        if (!value) return;
        if (previous && value === previous) return;
        ensureWithLog({ force: previous !== undefined });
      }
    );
  }

  const isEnsuring = computed(
    () => manualEnsuring.value || store.clasesStatus === "loading" || store.apoderadosStatus === "loading"
  );
  const isBootstrapping = computed(() => isEnsuring.value && !store.hasClases && !store.hasApoderados);

  return {
    ensure: runEnsure,
    isEnsuring,
    isBootstrapping,
    error: computed(() => lastError.value ?? store.errorMessage),
    clases: computed(() => store.clases),
    apoderados: computed(() => store.apoderados),
  };
}


