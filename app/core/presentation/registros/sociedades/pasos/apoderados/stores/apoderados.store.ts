import { defineStore } from "pinia";

import {
  CreateApoderadoUseCase,
  CreateClaseApoderadoUseCase,
  DeleteApoderadoUseCase,
  DeleteClaseApoderadoUseCase,
  ListApoderadosUseCase,
  ListClasesApoderadoUseCase,
  UpdateApoderadoUseCase,
  UpdateClaseApoderadoUseCase,
  type ApoderadoDTO,
  type ClaseApoderadoDTO,
} from "~/core/hexag/registros/sociedades/pasos/apoderados/application";
import type {
  Apoderado,
  ClaseApoderado,
} from "~/core/hexag/registros/sociedades/pasos/apoderados/domain";
import { ApoderadosHttpRepository } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure";

type Status = "idle" | "loading" | "saving" | "error";

interface EnsureOptions {
  force?: boolean;
  ttlMs?: number;
  source?: "internal" | "external";
}

const DEFAULT_TTL_MS = 60_000;

const repository = new ApoderadosHttpRepository();

const listClasesUseCase = new ListClasesApoderadoUseCase(repository);
const createClaseUseCase = new CreateClaseApoderadoUseCase(repository);
const updateClaseUseCase = new UpdateClaseApoderadoUseCase(repository);
const deleteClaseUseCase = new DeleteClaseApoderadoUseCase(repository);

const listApoderadosUseCase = new ListApoderadosUseCase(repository);
const createApoderadoUseCase = new CreateApoderadoUseCase(repository);
const updateApoderadoUseCase = new UpdateApoderadoUseCase(repository);
const deleteApoderadoUseCase = new DeleteApoderadoUseCase(repository);

export const useApoderadosStore = defineStore("registros-apoderados", {
  state: () => ({
    clases: [] as ClaseApoderado[],
    apoderados: [] as Apoderado[],
    clasesStatus: "idle" as Status,
    apoderadosStatus: "idle" as Status,
    errorMessage: null as string | null,
    lastSocietyId: null as string | null,
    lastFetchedAt: null as string | null,
    origin: null as "internal" | "external" | null,
  }),
  getters: {
    hasClases: (state) => state.clases.length > 0,
    hasApoderados: (state) => state.apoderados.length > 0,
    isLoading: (state) =>
      state.clasesStatus === "loading" || state.apoderadosStatus === "loading",
  },
  actions: {
    markFetchMetadata(profileId: string, source: "internal" | "external") {
      this.lastSocietyId = profileId;
      this.lastFetchedAt = new Date().toISOString();
      this.origin = source;
    },

    shouldRefresh(profileId: string, options: EnsureOptions = {}) {
      if (options.force) return true;
      if (!this.lastSocietyId || this.lastSocietyId !== profileId) return true;
      if (!this.lastFetchedAt) return true;
      const ttl =
        typeof options.ttlMs === "number" ? Math.max(options.ttlMs, 0) : DEFAULT_TTL_MS;
      if (ttl === 0) return false;
      const age = Date.now() - new Date(this.lastFetchedAt).getTime();
      return age > ttl;
    },

    async listClases(profileId: string, source: "internal" | "external" = "internal") {
      this.clasesStatus = "loading";
      this.errorMessage = null;
      this.origin = source;
      try {
        const result = await listClasesUseCase.execute(profileId);
        this.clases = result;
        this.clasesStatus = "idle";
      } catch (error) {
        console.error("[ApoderadosStore] listClases error", error);
        this.clasesStatus = "error";
        this.errorMessage = "No pudimos obtener las clases de apoderado.";
      }
    },

    async listApoderados(profileId: string, source: "internal" | "external" = "internal") {
      this.apoderadosStatus = "loading";
      this.errorMessage = null;
      this.origin = source;
      try {
        const result = await listApoderadosUseCase.execute(profileId);
        this.apoderados = result;
        this.apoderadosStatus = "idle";
        this.markFetchMetadata(profileId, source);
      } catch (error) {
        console.error("[ApoderadosStore] listApoderados error", error);
        this.apoderadosStatus = "error";
        this.errorMessage = "No pudimos obtener el registro de apoderados.";
      }
    },

    async ensureLoaded(profileId: string, options: EnsureOptions = {}) {
      if (!profileId) return { fetched: false };
      if (!this.shouldRefresh(profileId, options)) {
        return { fetched: false };
      }

      await this.listClases(profileId, options.source ?? "internal");
      await this.listApoderados(profileId, options.source ?? "internal");
      return { fetched: true };
    },

    async createClase(profileId: string, payload: ClaseApoderadoDTO) {
      this.clasesStatus = "saving";
      this.errorMessage = null;
      try {
        await createClaseUseCase.execute(profileId, payload);
        // Refrescar lista para obtener la clase creada con su ID del backend
        await this.listClases(profileId, "internal");
        this.clasesStatus = "idle";
      } catch (error) {
        console.error("[ApoderadosStore] createClase error", error);
        this.clasesStatus = "error";
        this.errorMessage = "No pudimos registrar la clase de apoderado.";
        throw error;
      }
    },

    async updateClase(profileId: string, payload: ClaseApoderadoDTO) {
      if (!payload.id) throw new Error("Se requiere el id de la clase para actualizarla.");
      this.clasesStatus = "saving";
      this.errorMessage = null;
      try {
        await updateClaseUseCase.execute(profileId, payload);
        // Refrescar lista para obtener la clase actualizada
        await this.listClases(profileId, "internal");
        this.clasesStatus = "idle";
      } catch (error) {
        console.error("[ApoderadosStore] updateClase error", error);
        this.clasesStatus = "error";
        this.errorMessage = "No pudimos actualizar la clase de apoderado.";
        throw error;
      }
    },

    async deleteClase(profileId: string, claseId: string) {
      this.clasesStatus = "saving";
      this.errorMessage = null;
      try {
        await deleteClaseUseCase.execute(profileId, claseId);
        this.clases = this.clases.filter((item) => item.id !== claseId);
        this.apoderados = this.apoderados.filter((item) => item.claseApoderadoId !== claseId);
        this.clasesStatus = "idle";
      } catch (error) {
        console.error("[ApoderadosStore] deleteClase error", error);
        this.clasesStatus = "error";
        this.errorMessage = "No pudimos eliminar la clase de apoderado.";
        throw error;
      }
    },

    async createApoderado(profileId: string, payload: ApoderadoDTO) {
      this.apoderadosStatus = "saving";
      this.errorMessage = null;
      try {
        await createApoderadoUseCase.execute(profileId, payload);
        // Refrescar lista para obtener el apoderado creado con su ID del backend
        await this.listApoderados(profileId, "internal");
        this.apoderadosStatus = "idle";
      } catch (error) {
        console.error("[ApoderadosStore] createApoderado error", error);
        this.apoderadosStatus = "error";
        this.errorMessage = "No pudimos registrar al apoderado.";
        throw error;
      }
    },

    async updateApoderado(profileId: string, payload: ApoderadoDTO) {
      if (!payload.id) throw new Error("Se requiere el id del apoderado para actualizarlo.");
      this.apoderadosStatus = "saving";
      this.errorMessage = null;
      try {
        await updateApoderadoUseCase.execute(profileId, payload);
        // Refrescar lista para obtener el apoderado actualizado
        await this.listApoderados(profileId, "internal");
        this.apoderadosStatus = "idle";
      } catch (error) {
        console.error("[ApoderadosStore] updateApoderado error", error);
        this.apoderadosStatus = "error";
        this.errorMessage = "No pudimos actualizar al apoderado.";
        throw error;
      }
    },

    async deleteApoderado(profileId: string, claseId: string, apoderadoId: string) {
      this.apoderadosStatus = "saving";
      this.errorMessage = null;
      try {
        await deleteApoderadoUseCase.execute(profileId, apoderadoId);
        this.apoderados = this.apoderados.filter((item) => item.id !== apoderadoId);
        this.apoderadosStatus = "idle";
      } catch (error) {
        console.error("[ApoderadosStore] deleteApoderado error", error);
        this.apoderadosStatus = "error";
        this.errorMessage = "No pudimos eliminar al apoderado.";
        throw error;
      }
    },
  },
  persist: true,
});
