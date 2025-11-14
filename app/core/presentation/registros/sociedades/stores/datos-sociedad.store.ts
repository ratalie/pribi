import { defineStore } from "pinia";

import {
  CreateDatosSociedadUseCase,
  GetDatosSociedadUseCase,
  UpdateDatosSociedadUseCase,
  type DatosSociedadDTO,
} from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application";
import type { SociedadDatosGenerales } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/domain";
import { DatosSociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories";

type Status = "idle" | "loading" | "saving" | "error";

interface EnsureOptions {
  force?: boolean;
  ttlMs?: number;
  source?: "internal" | "external";
}

const DEFAULT_TTL_MS = 60_000;

const repository = new DatosSociedadHttpRepository();
const getUseCase = new GetDatosSociedadUseCase(repository);
const createUseCase = new CreateDatosSociedadUseCase(repository);
const updateUseCase = new UpdateDatosSociedadUseCase(repository);

export const useDatosSociedadStore = defineStore("registros-datos-sociedad", {
  state: () => ({
    datos: null as SociedadDatosGenerales | null,
    status: "idle" as Status,
    errorMessage: null as string | null,
    origin: null as "internal" | "external" | null,
    lastFetchedAt: null as string | null,
    lastSocietyId: null as string | null,
    lastPayloadSignature: null as string | null,
  }),
  getters: {
    hasData: (state) => state.datos !== null,
  },
  actions: {
    markFetchMetadata(idSociety: string, source: "internal" | "external") {
      this.lastSocietyId = idSociety;
      this.lastFetchedAt = new Date().toISOString();
      this.lastPayloadSignature = this.datos ? JSON.stringify(this.datos) : null;
      this.origin = source;
    },

    shouldRefresh(idSociety: string, options: EnsureOptions = {}) {
      if (options.force) return true;
      if (!this.hasData) return true;
      if (!this.lastSocietyId || this.lastSocietyId !== idSociety) return true;
      if (!this.lastFetchedAt) return true;

      const ttl =
        typeof options.ttlMs === "number" ? Math.max(options.ttlMs, 0) : DEFAULT_TTL_MS;
      if (ttl === 0) return false;

      const age = Date.now() - new Date(this.lastFetchedAt).getTime();
      return age > ttl;
    },

    async load(idSociety: string, source: "internal" | "external" = "internal") {
      this.status = "loading";
      this.errorMessage = null;
      this.origin = source;

      try {
        console.debug("[DatosSociedadStore] load:start", { idSociety, source });
        const result = await getUseCase.execute(idSociety);
        console.debug("[DatosSociedadStore] load:success", { idSociety, result });
        this.datos = result;
        this.markFetchMetadata(idSociety, source);
        this.status = "idle";
      } catch (error: any) {
        const statusCode = error?.statusCode ?? error?.response?.status;
        if (statusCode === 404) {
          this.datos = null;
          this.status = "idle";
          this.errorMessage = null;
          console.warn("[DatosSociedadStore] load:not-found", { idSociety });
          this.markFetchMetadata(idSociety, source);
          return;
        }

        console.error("[DatosSociedadStore] load error", error);
        this.status = "error";
        this.errorMessage = "No pudimos cargar los datos generales de la sociedad.";
      }
    },

    async create(idSociety: string, payload: DatosSociedadDTO) {
      this.status = "saving";
      this.errorMessage = null;

      try {
        console.debug("[DatosSociedadStore] create:start", { idSociety, payload });
        const result = await createUseCase.execute(idSociety, payload);
        console.debug("[DatosSociedadStore] create:success", { idSociety, result });
        this.datos = result;
        this.markFetchMetadata(idSociety, "internal");
        this.status = "idle";
      } catch (error) {
        console.error("[DatosSociedadStore] create error", error);
        this.status = "error";
        this.errorMessage = "No pudimos registrar los datos generales.";
        throw error;
      }
    },

    async update(idSociety: string, payload: DatosSociedadDTO) {
      this.status = "saving";
      this.errorMessage = null;

      try {
        console.debug("[DatosSociedadStore] update:start", { idSociety, payload });
        const result = await updateUseCase.execute(idSociety, payload);
        console.debug("[DatosSociedadStore] update:success", { idSociety, result });
        this.datos = result;
        this.markFetchMetadata(idSociety, "internal");
        this.status = "idle";
      } catch (error) {
        console.error("[DatosSociedadStore] update error", error);
        this.status = "error";
        this.errorMessage = "No pudimos actualizar los datos generales.";
        throw error;
      }
    },

    async ensureLoaded(idSociety: string, options: EnsureOptions = {}) {
      if (!idSociety) return { fetched: false };

      if (!this.shouldRefresh(idSociety, options)) {
        return { fetched: false };
      }

      await this.load(idSociety, options.source ?? "internal");
      return { fetched: true };
    },
  },
  persist: true,
});

export type { EnsureOptions as DatosSociedadEnsureOptions };

