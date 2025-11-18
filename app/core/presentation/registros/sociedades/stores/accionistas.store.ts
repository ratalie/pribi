import { defineStore } from "pinia";
import {
  ListAccionistasUseCase,
  CreateAccionistaUseCase,
  UpdateAccionistaUseCase,
  DeleteAccionistaUseCase,
  type AccionistaDTO,
} from "~/core/hexag/registros/sociedades/pasos/accionistas/application";
import { AccionistasHttpRepository } from "~/core/hexag/registros/sociedades/pasos/accionistas/infrastructure";
import type { Accionista } from "~/core/hexag/registros/sociedades/pasos/accionistas/domain";

type Status = "idle" | "loading" | "saving" | "error";

interface EnsureOptions {
  force?: boolean;
  ttlMs?: number;
  source?: "internal" | "external";
}

const DEFAULT_TTL_MS = 60_000;

const repository = new AccionistasHttpRepository();
const listUseCase = new ListAccionistasUseCase(repository);
const createUseCase = new CreateAccionistaUseCase(repository);
const updateUseCase = new UpdateAccionistaUseCase(repository);
const deleteUseCase = new DeleteAccionistaUseCase(repository);

export const useAccionistasStore = defineStore("registros-accionistas", {
  state: () => ({
    accionistas: [] as Accionista[],
    status: "idle" as Status,
    errorMessage: null as string | null,
    origin: null as "internal" | "external" | null,
    lastFetchedAt: null as string | null,
    lastSocietyId: null as string | null,
    lastPayloadSignature: null as string | null,
  }),
  getters: {
    hasData: (state) => state.accionistas.length > 0,
  },
  actions: {
    markFetchMetadata(profileId: string, source: "internal" | "external") {
      this.lastSocietyId = profileId;
      this.lastFetchedAt = new Date().toISOString();
      this.lastPayloadSignature = JSON.stringify(this.accionistas?.map((item) => item.id));
      this.origin = source;
    },

    shouldRefresh(profileId: string, options: EnsureOptions = {}) {
      if (options.force) return true;
      if (!this.hasData) return true;
      if (!this.lastSocietyId || this.lastSocietyId !== profileId) return true;
      if (!this.lastFetchedAt) return true;

      const ttl =
        typeof options.ttlMs === "number" ? Math.max(options.ttlMs, 0) : DEFAULT_TTL_MS;
      if (ttl === 0) return false;

      const age = Date.now() - new Date(this.lastFetchedAt).getTime();
      return age > ttl;
    },

    async list(profileId: string, source: "internal" | "external" = "internal") {
      this.status = "loading";
      this.errorMessage = null;
      this.origin = source;

      try {
        console.log("[AccionistasStore] list:start", { profileId, source });
        const result = await listUseCase.execute(profileId);
        this.accionistas = result;
        this.status = "idle";
        this.markFetchMetadata(profileId, source);
      } catch (error) {
        console.error("[AccionistasStore] list error", error);
        this.status = "error";
        this.errorMessage = "No pudimos obtener la lista de accionistas.";
      }
    },

    async create(profileId: string, payload: AccionistaDTO) {
      this.status = "saving";
      this.errorMessage = null;

      try {
        console.log("[AccionistasStore] create:start", { profileId, payload });
        const result = await createUseCase.execute(profileId, payload);
        this.accionistas.push(result);
        this.status = "idle";
        this.markFetchMetadata(profileId, "internal");
        return result;
      } catch (error) {
        console.error("[AccionistasStore] create error", error);
        this.status = "error";
        this.errorMessage = "No pudimos registrar al accionista.";
        throw error;
      }
    },

    async update(profileId: string, payload: AccionistaDTO) {
      if (!payload.id) {
        throw new Error("Se requiere el id del accionista para actualizarlo.");
      }
      this.status = "saving";
      this.errorMessage = null;

      try {
        console.log("[AccionistasStore] update:start", { profileId, payload });
        const result = await updateUseCase.execute(profileId, payload);
        const index = this.accionistas.findIndex((item) => item.id === result.id);
        if (index === -1) {
          this.accionistas.push(result);
        } else {
          this.accionistas.splice(index, 1, result);
        }
        this.status = "idle";
        this.markFetchMetadata(profileId, "internal");
        return result;
      } catch (error) {
        console.error("[AccionistasStore] update error", error);
        this.status = "error";
        this.errorMessage = "No pudimos actualizar al accionista.";
        throw error;
      }
    },

    async remove(profileId: string, accionistaId: string) {
      this.status = "saving";
      this.errorMessage = null;

      try {
        console.log("[AccionistasStore] delete:start", { profileId, accionistaId });
        await deleteUseCase.execute(profileId, accionistaId);
        this.accionistas = this.accionistas.filter((item) => item.id !== accionistaId);
        this.status = "idle";
        this.markFetchMetadata(profileId, "internal");
      } catch (error) {
        console.error("[AccionistasStore] delete error", error);
        this.status = "error";
        this.errorMessage = "No pudimos eliminar al accionista.";
        throw error;
      }
    },

    async ensureLoaded(profileId: string, options: EnsureOptions = {}) {
      if (!profileId) return { fetched: false };

      if (!this.shouldRefresh(profileId, options)) {
        console.log("[AccionistasStore] ensureLoaded:skipped", { profileId });
        return { fetched: false };
      }

      await this.list(profileId, options.source ?? "internal");
      return { fetched: true };
    },
  },
  persist: true,
});

