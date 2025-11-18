import { computed, onActivated, onMounted, ref, unref, watch } from "vue";
import type { MaybeRef } from "vue";

import { useAccionistasStore } from "../stores/accionistas.store";

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

export function useAccionistasController(options: ControllerOptions) {
  const store = useAccionistasStore();
  const societyId = computed(() => {
    const value = unref(options.societyId);
    return typeof value === "string" ? value : "";
  });

  const manualEnsuring = ref(false);
  const lastError = ref<string | null>(null);

  const runEnsure = async (params: EnsureParams = {}) => {
    if (!societyId.value) {
      console.warn("[AccionistasController] ensure skipped: empty societyId", { params });
      return { fetched: false };
    }
    console.log("[AccionistasController] ensure:start", {
      societyId: societyId.value,
      params,
      ttlMs: options.ttlMs,
    });
    manualEnsuring.value = true;
    try {
      const result = await store.ensureLoaded(societyId.value, {
        ttlMs: options.ttlMs,
        source: params.source ?? options.source ?? "internal",
        force: params.force ?? false,
      });
      lastError.value = null;
      console.log("[AccionistasController] ensure:done", {
        societyId: societyId.value,
        fetched: result.fetched,
        storeStatus: store.status,
      });
      return result;
    } catch (error: any) {
      const message = error?.data?.message ?? error?.message ?? "No pudimos cargar los accionistas.";
      lastError.value = message;
      throw error;
    } finally {
      manualEnsuring.value = false;
    }
  };

  const ensureWithLog = (params: EnsureParams = {}) =>
    runEnsure(params).catch((error) => {
      console.error("[AccionistasController] ensure error", error);
    });

  const needsBootstrap = () => {
    if (!societyId.value) return false;
    if (!store.lastSocietyId || store.lastSocietyId !== societyId.value) return true;
    return !store.lastFetchedAt;
  };

  if (options.auto !== false) {
    onMounted(() => {
      if (!societyId.value) {
        console.warn("[AccionistasController] onMounted skipped: no societyId");
        return;
      }
      console.log("[AccionistasController] onMounted -> ensure", {
        societyId: societyId.value,
        needsBootstrap: needsBootstrap(),
        forceInitial: options.forceInitial,
        storeHasData: store.hasData,
      });
      ensureWithLog({ force: options.forceInitial ?? false });
    });

    onActivated(() => {
      if (!societyId.value) {
        console.warn("[AccionistasController] onActivated skipped: no societyId");
        return;
      }
      const needs = needsBootstrap();
      console.log("[AccionistasController] onActivated -> ensure", {
        societyId: societyId.value,
        needsBootstrap: needs,
        storeHasData: store.hasData,
      });
      if (needs) {
        ensureWithLog();
      }
    });

    watch(
      () => societyId.value,
      (value, previous) => {
        if (!value) return;
        if (previous && value === previous) return;
        console.log("[AccionistasController] societyId changed", { value, previous });
        ensureWithLog({ force: previous !== undefined });
      }
    );

    watch(
      () => store.accionistas,
      (value) => {
        if (value.length > 0) return;
        if (!societyId.value) return;
        if (store.lastFetchedAt && store.lastSocietyId === societyId.value) return;
        console.warn("[AccionistasController] detected empty state, forcing reload", {
          societyProfileId: societyId.value,
        });
        ensureWithLog({ force: true });
      }
    );
  }

  const isEnsuring = computed(() => manualEnsuring.value || store.status === "loading");
  const isBootstrapping = computed(() => isEnsuring.value && !store.hasData);

  return {
    ensure: runEnsure,
    isEnsuring,
    isBootstrapping,
    error: computed(() => lastError.value ?? store.errorMessage),
    accionistas: computed(() => store.accionistas),
    status: computed(() => store.status),
    hasData: computed(() => store.hasData),
  };
}

