import { defineStore } from "pinia";
import type { VoteSession } from "~/core/hexag/juntas/domain/entities/vote-session.entity";
import type { VoteItem } from "~/core/hexag/juntas/domain/entities/vote-item.entity";
import type { VoteEntry } from "~/core/hexag/juntas/domain/entities/vote-entry.entity";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { GetVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/get-vote-session.use-case";
import { CreateVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/create-vote-session.use-case";
import { UpdateVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/update-vote-session.use-case";
import { VoteHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/vote.http.repository";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { TipoAcuerdo, getTipoAcuerdo } from "~/core/hexag/juntas/domain/constants/agenda-classification.constants";

/**
 * Store para gestionar Votaciones de Aplicación de Resultados
 * 
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useVotacionAplicacionResultadosStore = defineStore("votacionAplicacionResultados", {
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
     * Obtiene el item de votación (solo hay 1 para aplicación de resultados)
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
    getVotoByAccionista: (state) => (accionistaId: string): VoteEntry | null => {
      if (!state.sesionVotacion || state.sesionVotacion.items.length === 0) {
        return null;
      }
      const item = state.sesionVotacion.items[0];
      if (!item) return null;
      return item.votos.find((v) => v.accionistaId === accionistaId) || null;
    },

    /**
     * Indica si es unanimidad (APROBADO_POR_TODOS)
     * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
     */
    esUnanimidad(): boolean {
      return this.itemVotacion?.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS;
    },

    /**
     * Indica si es sometida a votación (SOMETIDO_A_VOTACION)
     * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
     */
    esSometidaAVotacion(): boolean {
      return this.itemVotacion?.tipoAprobacion === VoteAgreementType.SOMETIDO_A_VOTACION;
    },

    /**
     * Calcula el resultado de la votación
     * 
     * @param puntoId - ID del punto de agenda (ej: "aplicacion-resultados")
     * @returns Resultado completo de la votación con aprobación, porcentajes, etc.
     */
    getResult: (state) => (puntoId: string) => {
      // 1. Obtener snapshot store
      const snapshotStore = useSnapshotStore();
      
      // 2. Obtener accionistas con derecho a voto
      const accionistasConDerechoVoto = snapshotStore.accionistasConDerechoVoto;
      
      // 3. Obtener votos del store
      const votos = state.sesionVotacion?.items?.[0]?.votos || [];
      
      // 4. Determinar tipo de acuerdo (SIMPLE o CALIFICADO)
      const tipoAcuerdo = getTipoAcuerdo(puntoId);
      
      // 5. Obtener quorum mínimo requerido (mayorías para acuerdos)
      const quorums = snapshotStore.quorums;
      const quorumMinimoRequerido = tipoAcuerdo === TipoAcuerdo.CALIFICADO
        ? (quorums?.mayoriasAcuerdosCalificado || 60)
        : (quorums?.mayoriasAcuerdosSimple || 50);
      
      // 6. Calcular acciones por tipo de voto
      let accionesAFavor = 0;
      let accionesEnContra = 0;
      let accionesAbstencion = 0;
      let accionesSinVoto = 0;
      
      // Mapa para acceder rápido a acciones por accionista
      const accionesPorAccionista = new Map<string, number>();
      accionistasConDerechoVoto.forEach((acc) => {
        accionesPorAccionista.set(acc.shareholder.id, acc.totalAcciones);
      });
      
      // Calcular acciones por tipo de voto
      votos.forEach((voto) => {
        const acciones = accionesPorAccionista.get(voto.accionistaId) || 0;
        
        if (voto.valor === VoteValue.A_FAVOR) {
          accionesAFavor += acciones;
        } else if (voto.valor === VoteValue.EN_CONTRA) {
          accionesEnContra += acciones;
        } else if (voto.valor === VoteValue.ABSTENCION) {
          accionesAbstencion += acciones;
        }
      });
      
      // Calcular acciones sin voto (accionistas que no votaron)
      accionistasConDerechoVoto.forEach((acc) => {
        const tieneVoto = votos.some((v) => v.accionistaId === acc.shareholder.id);
        if (!tieneVoto) {
          accionesSinVoto += acc.totalAcciones;
        }
      });
      
      // 7. Calcular total de acciones con derecho a voto
      const totalAccionesConDerechoVoto = accionistasConDerechoVoto.reduce(
        (sum, acc) => sum + acc.totalAcciones,
        0
      );
      
      // 8. Calcular porcentajes
      const porcentajeAFavor = totalAccionesConDerechoVoto > 0
        ? (accionesAFavor / totalAccionesConDerechoVoto) * 100
        : 0;
      
      const porcentajeEnContra = totalAccionesConDerechoVoto > 0
        ? (accionesEnContra / totalAccionesConDerechoVoto) * 100
        : 0;
      
      const porcentajeAbstencion = totalAccionesConDerechoVoto > 0
        ? (accionesAbstencion / totalAccionesConDerechoVoto) * 100
        : 0;
      
      const porcentajeSinVoto = totalAccionesConDerechoVoto > 0
        ? (accionesSinVoto / totalAccionesConDerechoVoto) * 100
        : 0;
      
      // 9. Determinar si está aprobado
      const aprobado = porcentajeAFavor >= quorumMinimoRequerido;
      
      // 10. Calcular total de acciones que votaron
      const accionesVotantes = accionesAFavor + accionesEnContra + accionesAbstencion;
      const porcentajeVotantes = totalAccionesConDerechoVoto > 0
        ? (accionesVotantes / totalAccionesConDerechoVoto) * 100
        : 0;
      
      return {
        // Tipo de acuerdo
        tipoAcuerdo,
        quorumMinimoRequerido,
        
        // Totales
        totalAccionesConDerechoVoto,
        accionesVotantes,
        porcentajeVotantes,
        
        // Resultados por tipo de voto
        accionesAFavor,
        accionesEnContra,
        accionesAbstencion,
        accionesSinVoto,
        
        // Porcentajes
        porcentajeAFavor,
        porcentajeEnContra,
        porcentajeAbstencion,
        porcentajeSinVoto,
        
        // Aprobación
        aprobado,
        
        // Detalles adicionales
        totalVotantes: votos.length,
        totalAccionistas: accionistasConDerechoVoto.length,
      };
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
          VoteContext.DIVIDENDOS
        );

        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar votación";
        console.error("[Store][VotacionAplicacionResultados] Error al cargar:", error);
        throw error;
      }
    },

    /**
     * Crear nueva sesión de votación
     * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
     */
    async createVotacion(
      societyId: number,
      flowId: number,
      itemId: string,
      label: string,
      descripcion?: string,
      tipoAprobacion: VoteAgreementType = VoteAgreementType.APROBADO_POR_TODOS // ✅ Por defecto: UNANIMIDAD
    ) {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new VoteHttpRepository();
        const useCase = new CreateVoteSessionUseCase(repository);

        // ✅ Usar la sesión que ya está en memoria (con votos si los hay)
        if (!this.sesionVotacion) {
          // Si no hay sesión en memoria, crear una nueva
          const sessionId = this.generateUuid();
          const item: VoteItem = {
            id: itemId,
            orden: 0,
            label,
            descripción: descripcion,
            tipoAprobacion,
            votos: [], // Se llenará antes de crear
          };

          this.sesionVotacion = {
            id: sessionId,
            contexto: VoteContext.DIVIDENDOS,
            modo: VoteMode.SIMPLE,
            items: [item],
          };
        } else {
          // Asegurar que el item tenga los datos correctos
          const item = this.sesionVotacion.items[0];
          if (item) {
            item.id = itemId;
            item.label = label;
            item.descripción = descripcion;
            item.tipoAprobacion = tipoAprobacion;
          }
        }

        console.log("[Store][VotacionAplicacionResultados] Creando sesión con datos:", {
          sessionId: this.sesionVotacion.id,
          itemId: this.sesionVotacion.items[0]?.id,
          tipoAprobacion: this.sesionVotacion.items[0]?.tipoAprobacion,
          votosCount: this.sesionVotacion.items[0]?.votos.length || 0,
        });

        await useCase.execute(societyId, flowId, this.sesionVotacion);
        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al crear votación";
        console.error("[Store][VotacionAplicacionResultados] Error al crear:", error);
        throw error;
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

        await useCase.execute(societyId, flowId, VoteContext.DIVIDENDOS, [
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
          valor: valor as string | number,
        });
      } catch (error: any) {
        console.error("[Store][VotacionAplicacionResultados] Error al agregar voto:", error);
        throw error;
      }
    },

    /**
     * Actualizar un voto existente
     */
    async updateVote(
      societyId: number,
      flowId: number,
      voteId: string,
      valor: VoteValue | number
    ) {
      if (!this.sesionVotacion || this.sesionVotacion.items.length === 0) {
        throw new Error("No hay sesión de votación activa");
      }

      const item = this.sesionVotacion.items[0];
      if (!item) {
        throw new Error("No hay item de votación activo");
      }

      try {
        const repository = new VoteHttpRepository();
        const useCase = new UpdateVoteSessionUseCase(repository);

        await useCase.execute(societyId, flowId, VoteContext.DIVIDENDOS, [
          {
            accion: "updateVote",
            itemId: item.id,
            votos: [
              {
                accion: "updateVote",
                id: voteId,
                value: valor as string | number,
              },
            ],
          },
        ]);

        // Actualizar estado local
        const vote = item.votos.find((v) => v.id === voteId);
        if (vote) {
          vote.valor = valor as string | number;
        }
      } catch (error: any) {
        console.error("[Store][VotacionAplicacionResultados] Error al actualizar voto:", error);
        throw error;
      }
    },

    /**
     * Actualizar item existente con votos en un solo request (PUT con accion: "add")
     * ⚠️ IMPORTANTE: Usa "add" porque reemplaza todo el item (según diagnóstico del backend)
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

        console.log("[Store][VotacionAplicacionResultados] Actualizando item con votos:", JSON.stringify(itemPayload, null, 2));

        await useCase.execute(
          societyId,
          flowId,
          VoteContext.DIVIDENDOS,
          [itemPayload]
        );

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
        console.error("[Store][VotacionAplicacionResultados] Error al actualizar item con votos:", error);
        throw error;
      }
    },

    /**
     * Generar UUID
     */
    generateUuid(): string {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
      return Math.random().toString(36).slice(2) + Date.now().toString(36);
    },

    /**
     * Resetear estado
     */
    reset() {
      this.sesionVotacion = null;
      this.status = "idle";
      this.errorMessage = null;
    },
  },
});

