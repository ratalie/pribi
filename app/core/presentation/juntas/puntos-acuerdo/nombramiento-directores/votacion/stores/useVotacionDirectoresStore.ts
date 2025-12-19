import { defineStore } from "pinia";
import { CreateVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/create-vote-session.use-case";
import { GetVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/get-vote-session.use-case";
import { UpdateVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/update-vote-session.use-case";
import type { VoteEntry } from "~/core/hexag/juntas/domain/entities/vote-entry.entity";
import type { VoteItem } from "~/core/hexag/juntas/domain/entities/vote-item.entity";
import type { VoteSession } from "~/core/hexag/juntas/domain/entities/vote-session.entity";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/vote.http.repository";

/**
 * Store para gestionar Votación Acumulativa de Directores
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 * ⚠️ Contexto: DESIGNACION_DIRECTORES
 * ⚠️ Modo: CUMULATIVO (votos numéricos)
 */
export const useVotacionDirectoresStore = defineStore("votacionDirectores", {
  state: () => ({
    sesionVotacion: null as VoteSession | null,
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Indica si hay una sesión de votación cargada
     */
    hasVotacion(): boolean {
      return this.sesionVotacion !== null;
    },

    /**
     * Obtiene todos los items de votación (uno por cada candidato)
     */
    itemsVotacion(): VoteItem[] {
      return this.sesionVotacion?.items || [];
    },

    /**
     * Obtiene un item por su ID
     */
    getItemById:
      (state) =>
      (itemId: string): VoteItem | null => {
        if (!state.sesionVotacion) return null;
        return state.sesionVotacion.items.find((item) => item.id === itemId) || null;
      },

    /**
     * Obtiene un item por personaId (del candidato)
     */
    getItemByPersonaId:
      (state) =>
      (personaId: string): VoteItem | null => {
        if (!state.sesionVotacion) return null;
        return state.sesionVotacion.items.find((item) => item.personaId === personaId) || null;
      },

    /**
     * Obtiene todos los votos de un item específico
     */
    getVotosByItemId:
      (state) =>
      (itemId: string): VoteEntry[] => {
        const item = state.sesionVotacion?.items.find((i) => i.id === itemId);
        return item?.votos || [];
      },

    /**
     * Obtiene el voto de un accionista específico en un item específico
     */
    getVotoByAccionistaItem:
      (state) =>
      (itemId: string, accionistaId: string): VoteEntry | null => {
        const item = state.sesionVotacion?.items.find((i) => i.id === itemId);
        if (!item) return null;
        return item.votos.find((v) => v.accionistaId === accionistaId) || null;
      },
  },

  actions: {
    /**
     * Generar UUID
     */
    generateUuid(): string {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },

    /**
     * Cargar sesión de votación desde el backend
     */
    async loadVotacion(societyId: number, flowId: number) {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new VoteHttpRepository();
        const useCase = new GetVoteSessionUseCase(repository);
        this.sesionVotacion = await useCase.execute(
          societyId,
          flowId,
          VoteContext.DESIGNACION_DIRECTORES
        );

        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        const statusCode = error?.statusCode ?? error?.response?.status ?? null;
        if (statusCode === 404) {
          // No hay votación existente, es normal
          this.sesionVotacion = null;
          this.status = "idle";
        } else {
          this.errorMessage = error.message || "Error al cargar votación";
          console.error("[Store][VotacionDirectores] Error al cargar:", error);
          throw error;
        }
      }
    },

    /**
     * Crear nueva sesión de votación con items (uno por cada candidato)
     */
    async createVotacion(societyId: number, flowId: number, items: VoteItem[]): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new VoteHttpRepository();
        const useCase = new CreateVoteSessionUseCase(repository);

        // Crear nueva sesión
        const sessionId = this.generateUuid();
        this.sesionVotacion = {
          id: sessionId,
          contexto: VoteContext.DESIGNACION_DIRECTORES,
          modo: VoteMode.CUMULATIVO,
          items: items,
        };

        // Guardar en backend
        await useCase.execute(societyId, flowId, this.sesionVotacion);

        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al crear votación";
        console.error("[Store][VotacionDirectores] Error al crear:", error);
        throw error;
      }
    },

    /**
     * Actualizar votación existente (agregar/actualizar/eliminar items)
     * Usa el patrón de items con "accion" (add, update, remove)
     */
    async updateVotacion(societyId: number, flowId: number, items: VoteItem[]): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        if (!this.sesionVotacion) {
          throw new Error("No hay sesión de votación para actualizar");
        }

        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        // Construir payload con items usando "accion: update" (reemplaza todos los items)
        const itemsPayload = items.map((item) => ({
          accion: "add" as const, // "add" reemplaza todo el item según el patrón
          id: item.id,
          orden: item.orden,
          label: item.label,
          descripción: item.descripción,
          personaId: item.personaId,
          tipoAprobacion: item.tipoAprobacion,
          votos: item.votos.map((voto) => ({
            id: voto.id,
            accionistaId: voto.accionistaId,
            valor: voto.valor,
          })),
        }));

        // Guardar en backend
        await useCase.execute(
          societyId,
          flowId,
          VoteContext.DESIGNACION_DIRECTORES,
          itemsPayload
        );

        // Actualizar estado local
        this.sesionVotacion.items = items;
        this.sesionVotacion.modo = VoteMode.CUMULATIVO; // Asegurar que sea CUMULATIVO

        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al actualizar votación";
        console.error("[Store][VotacionDirectores] Error al actualizar:", error);
        throw error;
      }
    },

    /**
     * Actualizar votos de un item específico (candidato)
     */
    async updateItemVotos(
      societyId: number,
      flowId: number,
      itemId: string,
      votos: VoteEntry[]
    ): Promise<void> {
      if (!this.sesionVotacion) {
        throw new Error("No hay sesión de votación para actualizar");
      }

      const item = this.sesionVotacion.items.find((i) => i.id === itemId);
      if (!item) {
        throw new Error(`Item con ID ${itemId} no encontrado`);
      }

      // Actualizar votos del item
      item.votos = votos;

      // Guardar en backend
      await this.updateVotacion(societyId, flowId, this.sesionVotacion.items);
    },

    /**
     * Agregar un item (candidato) a la votación
     */
    async addItem(societyId: number, flowId: number, item: VoteItem): Promise<void> {
      if (!this.sesionVotacion) {
        // Si no hay sesión, crear una nueva
        await this.createVotacion(societyId, flowId, [item]);
        return;
      }

      // Verificar que no exista ya un item con el mismo personaId
      if (item.personaId) {
        const existingItem = this.sesionVotacion.items.find(
          (i) => i.personaId === item.personaId
        );
        if (existingItem) {
          throw new Error(
            `Ya existe un item para el candidato con personaId ${item.personaId}`
          );
        }
      }

      const repository = new VoteHttpRepository();
      const useCase = new UpdateVoteSessionUseCase(repository);

      // Construir payload con "accion: add"
      const itemPayload = {
        accion: "add" as const,
        id: item.id,
        orden: item.orden,
        label: item.label,
        descripción: item.descripción,
        personaId: item.personaId,
        tipoAprobacion: item.tipoAprobacion,
        votos: item.votos.map((voto) => ({
          id: voto.id,
          accionistaId: voto.accionistaId,
          valor: voto.valor,
        })),
      };

      // Guardar en backend
      await useCase.execute(societyId, flowId, VoteContext.DESIGNACION_DIRECTORES, [
        itemPayload,
      ]);

      // Agregar item al estado local
      this.sesionVotacion.items.push(item);
    },

    /**
     * Eliminar un item (candidato) de la votación
     */
    async removeItem(societyId: number, flowId: number, itemId: string): Promise<void> {
      if (!this.sesionVotacion) {
        throw new Error("No hay sesión de votación para eliminar items");
      }

      const repository = new VoteHttpRepository();
      const useCase = new UpdateVoteSessionUseCase(repository);

      // Construir payload con "accion: remove"
      const itemPayload = {
        accion: "remove" as const,
        id: itemId,
      };

      // Guardar en backend
      await useCase.execute(societyId, flowId, VoteContext.DESIGNACION_DIRECTORES, [
        itemPayload,
      ]);

      // Filtrar item del estado local
      this.sesionVotacion.items = this.sesionVotacion.items.filter((i) => i.id !== itemId);
    },

    /**
     * Guardar votación completa (create o update según corresponda)
     */
    async guardarVotacion(
      societyId: number,
      flowId: number,
      items: VoteItem[]
    ): Promise<void> {
      if (!this.sesionVotacion) {
        // Si no hay sesión, crear nueva
        await this.createVotacion(societyId, flowId, items);
      } else {
        // Si ya existe, actualizar
        await this.updateVotacion(societyId, flowId, items);
      }
    },

    /**
     * Limpiar estado del store
     */
    reset() {
      this.sesionVotacion = null;
      this.status = "idle";
      this.errorMessage = null;
    },
  },
});

