import { defineStore } from "pinia";
import { CreateVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/create-vote-session.use-case";
import { GetVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/get-vote-session.use-case";
import { UpdateVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/update-vote-session.use-case";
import type { VoteEntry } from "~/core/hexag/juntas/domain/entities/vote-entry.entity";
import type { VoteItem } from "~/core/hexag/juntas/domain/entities/vote-item.entity";
import type { VoteSession } from "~/core/hexag/juntas/domain/entities/vote-session.entity";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { VoteHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/vote.http.repository";

/**
 * Store para gestionar Votación de Configuración de Directorio (Cantidad)
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useVotacionCantidadStore = defineStore("votacionCantidad", {
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
     * Obtiene el item de votación (solo hay 1 para configuración de directorio)
     */
    itemVotacion(): VoteItem | null {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        return null;
      }
      const item = this.sesionVotacion.items[0];
      return item ?? null;
    },

    /**
     * Obtiene todos los votos del item
     */
    votos(): VoteEntry[] {
      return this.itemVotacion?.votos || [];
    },

    /**
     * Obtiene el voto de un accionista específico
     */
    getVotoByAccionista:
      (state) =>
      (accionistaId: string): VoteEntry | null => {
        if (!state.sesionVotacion || state.sesionVotacion.items.length === 0) {
          return null;
        }
        const item = state.sesionVotacion.items[0];
        if (!item) return null;
        return item.votos.find((v) => v.accionistaId === accionistaId) || null;
      },

    /**
     * Indica si es unanimidad (APROBADO_POR_TODOS)
     */
    esUnanimidad(): boolean {
      return this.itemVotacion?.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS;
    },

    /**
     * Indica si es sometida a votación (SOMETIDO_A_VOTACION)
     */
    esSometidaAVotacion(): boolean {
      return this.itemVotacion?.tipoAprobacion === VoteAgreementType.SOMETIDO_A_VOTACION;
    },
  },

  actions: {
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
          VoteContext.CONFIGURACION_DIRECTORIO
        );

        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar votación";
        console.error("[Store][VotacionCantidad] Error al cargar:", error);
        throw error;
      }
    },

    /**
     * Crear nueva sesión de votación
     */
    async createVotacion(
      societyId: number,
      flowId: number,
      itemId: string,
      label: string,
      descripcion?: string,
      tipoAprobacion: VoteAgreementType = VoteAgreementType.APROBADO_POR_TODOS
    ) {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new VoteHttpRepository();
        const useCase = new CreateVoteSessionUseCase(repository);

        if (!this.sesionVotacion) {
          const sessionId = this.generateUuid();
          const item: VoteItem = {
            id: itemId,
            orden: 0,
            label,
            descripción: descripcion,
            tipoAprobacion,
            // Si ya hay votos en el item existente (por unanimidad), incluirlos
            votos: this.itemVotacion?.votos || [],
          };

          this.sesionVotacion = {
            id: sessionId,
            contexto: VoteContext.CONFIGURACION_DIRECTORIO,
            modo: VoteMode.SIMPLE,
            items: [item],
          };
        } else {
          const item = this.sesionVotacion.items[0];
          if (item) {
            item.id = itemId;
            item.label = label;
            item.descripción = descripcion;
            item.tipoAprobacion = tipoAprobacion;
          }
        }

        await useCase.execute(societyId, flowId, this.sesionVotacion);
        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al crear votación";
        console.error("[Store][VotacionCantidad] Error al crear:", error);
        throw error;
      }
    },

    /**
     * Actualizar item existente con votos en un solo request (PUT con accion: "add")
     * ⚠️ IMPORTANTE: Usa "add" porque reemplaza todo el item (según patrón de aplicacion-resultados)
     */
    async updateItemConVotos(
      societyId: number,
      flowId: number,
      itemId: string,
      label: string,
      descripcion: string | undefined,
      tipoAprobacion: VoteAgreementType,
      votos: Array<{ id: string; accionistaId: string; valor: string | number }>
    ) {
      if (!this.sesionVotacion || !this.itemVotacion) {
        throw new Error("No hay sesión de votación activa o no hay item");
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        // ✅ Construir payload con item + votos en un solo request
        const itemPayload: any = {
          accion: "add",
          id: itemId,
          orden: 0,
          label,
          descripción: descripcion,
          tipoAprobacion,
        };

        // ✅ Incluir votos si los hay
        if (votos.length > 0) {
          itemPayload.votos = votos.map((voto) => ({
            id: voto.id,
            accionistaId: voto.accionistaId,
            valor: voto.valor,
          }));
        }

        await useCase.execute(societyId, flowId, VoteContext.CONFIGURACION_DIRECTORIO, [
          itemPayload,
        ]);

        // Actualizar estado local
        const item = this.itemVotacion;
        item.label = label;
        item.descripción = descripcion;
        item.tipoAprobacion = tipoAprobacion;
        item.votos = votos.map((v) => ({
          id: v.id,
          accionistaId: v.accionistaId,
          valor: v.valor,
        }));
      } catch (error: any) {
        console.error("[Store][VotacionCantidad] Error al actualizar item con votos:", error);
        throw error;
      }
    },

    /**
     * Agregar/actualizar voto de un accionista
     */
    setVoto(accionistaId: string, valor: VoteValue) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        return;
      }

      const item = this.sesionVotacion.items[0];
      if (!item) return;

      // Buscar si ya existe un voto de este accionista
      const votoExistente = item.votos.find((v) => v.accionistaId === accionistaId);

      if (votoExistente) {
        // Actualizar voto existente
        votoExistente.valor = valor;
      } else {
        // Agregar nuevo voto
        const voteId = this.generateUuid();
        item.votos.push({
          id: voteId,
          accionistaId,
          valor,
        });
      }
    },

    /**
     * Agregar un nuevo voto
     */
    async addVote(
      societyId: number,
      flowId: number,
      accionistaId: string,
      valor: VoteValue | number
    ) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        throw new Error("No hay sesión de votación activa");
      }

      const item = this.sesionVotacion.items[0];
      if (!item) {
        throw new Error("No hay item de votación activo");
      }
      const voteId = this.generateUuid();

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        await useCase.execute(societyId, flowId, VoteContext.CONFIGURACION_DIRECTORIO, [
          {
            accion: "updateVote",
            itemId: item.id,
            votos: [
              {
                accion: "addVote",
                itemId: item.id,
                id: voteId,
                accionistaId: accionistaId,
                value: valor as string | number,
              },
            ],
          },
        ]);

        // Actualizar estado local
        item.votos.push({
          id: voteId,
          accionistaId,
          valor: valor as VoteValue | number,
        });
      } catch (error: any) {
        console.error("[Store][VotacionCantidad] Error al agregar voto:", error);
        throw error;
      }
    },

    /**
     * Cambiar tipo de aprobación (unanimidad/mayoría)
     */
    setTipoAprobacion(tipoAprobacion: VoteAgreementType) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        return;
      }

      const item = this.sesionVotacion.items[0];
      if (item) {
        item.tipoAprobacion = tipoAprobacion;

        // Si cambia a unanimidad, limpiar votos (se aprobará por todos)
        if (tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS) {
          item.votos = [];
        }
      }
    },

    /**
     * Genera un UUID único
     */
    generateUuid(): string {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
      return Math.random().toString(36).slice(2) + Date.now().toString(36);
    },

    /**
     * Resetear store
     */
    reset(): void {
      this.sesionVotacion = null;
      this.status = "idle";
      this.errorMessage = null;
    },
  },
});

